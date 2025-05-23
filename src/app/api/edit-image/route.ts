import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';
import sharp from 'sharp'; // Import sharp

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API key is missing. Please set OPENAI_API_KEY in your .env.local file.");
}
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const PREDEFINED_EDIT_PROMPT = "Take the provided image of a modern house. Apply a subtle, dark, semi-transparent overlay filter to the entire image. The house and its surroundings should remain clearly visible and unchanged in structure, with the filter enhancing it as a background for text.";

interface RequestBody {
  imageUrl: string; // URL of the original image from Supabase
  prompt: string;   // User-provided prompt for editing
}

// Helper function to upload a buffer to Supabase Storage
async function uploadImageBufferToSupabase(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  userId: string,
  supabase: SupabaseClient
) {
  const filePath = `${userId}/${fileName}`;
  console.log(`[API /edit-image] Uploading edited image to Supabase: ${filePath}`);
  const { error, data } = await supabase.storage
    .from('ad-images')
    .upload(filePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error('Error uploading edited image to Supabase Storage:', error);
    return null;
  }
  console.log('[API /edit-image] Successfully uploaded to Supabase storage:', data);

  const { data: { publicUrl } } = supabase.storage
    .from('ad-images')
    .getPublicUrl(filePath);
  
  console.log(`[API /edit-image] Public URL from Supabase: ${publicUrl}`);
  return publicUrl;
}


export async function POST(request: Request) {
  try {
    // Pass the cookies function directly to the Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json() as RequestBody;
    const { imageUrl, prompt } = body; // Destructure prompt from body

    if (!imageUrl || !prompt) { // Add prompt check
      return NextResponse.json({ error: 'imageUrl and prompt are required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured on server.' }, { status: 500 });
    }

    console.log(`[API /edit-image] Fetching original image from: ${imageUrl}`);
    let originalImageResponse;
    try {
      originalImageResponse = await fetch(imageUrl);
      if (!originalImageResponse.ok || !originalImageResponse.body) {
        throw new Error(`Failed to fetch original image: ${originalImageResponse.statusText} (status: ${originalImageResponse.status})`);
      }
    } catch (fetchError) {
      console.error("[API /edit-image] Error fetching original image:", fetchError);
      return NextResponse.json({ error: 'Failed to fetch the original image for editing.', details: (fetchError as Error).message }, { status: 500 });
    }
    
    const imageBlob = await originalImageResponse.blob();
    const originalImageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    
    const urlParts = imageUrl.split('/');
    let originalFileNameFromUrl = urlParts[urlParts.length - 1] || 'image.jpg'; // Default to jpg or png
     // Ensure filename has an extension for sharp and OpenAI.toFile
    if (!originalFileNameFromUrl.includes('.')) {
        originalFileNameFromUrl += '.jpg'; // Assume jpg if no extension, sharp can handle it
    }

    // Convert image to PNG using sharp
    let pngBuffer;
    try {
      console.log(`[API /edit-image] Converting image to PNG format using sharp.`);
      // Retain original aspect ratio for now, ensure it's PNG.
      // OpenAI's edit API requires square PNGs. Let's resize and ensure RGB.
      pngBuffer = await sharp(originalImageBuffer)
        .resize(1024, 1024, { // Ensure square 1024x1024
          fit: sharp.fit.cover, 
          position: sharp.strategy.entropy 
        })
        .removeAlpha() // Remove alpha for RGB
        .png()
        .toBuffer();
      console.log(`[API /edit-image] Image processed to 1024x1024 RGB PNG. Size: ${pngBuffer.length} bytes.`);
    } catch (conversionError) {
      console.error("[API /edit-image] Error converting image to PNG with sharp:", conversionError);
      return NextResponse.json({ error: 'Failed to convert image to required PNG format.', details: (conversionError as Error).message }, { status: 500 });
    }

    // Use OpenAI.toFile for the main image
    const pngFileName = originalFileNameFromUrl.substring(0, originalFileNameFromUrl.lastIndexOf('.')) + ".png";
    const imageFileForOpenAI = await OpenAI.toFile(pngBuffer, pngFileName, { type: 'image/png' });

    // Create a fully white, opaque mask
    let whiteMaskBuffer: Buffer;
    try {
      console.log(`[API /edit-image] Creating a fully white, opaque 1024x1024 PNG mask.`);
      whiteMaskBuffer = await sharp({
        create: {
          width: 1024,
          height: 1024,
          channels: 4, // RGBA
          background: { r: 255, g: 255, b: 255, alpha: 255 } // Pure white, fully opaque
        }
      })
      .png()
      .toBuffer();
      console.log(`[API /edit-image] White opaque mask created. Size: ${whiteMaskBuffer.length} bytes.`);
    } catch (maskCreationError) {
      console.error("[API /edit-image] Error creating white opaque mask with sharp:", maskCreationError);
      return NextResponse.json({ error: 'Failed to create mask for OpenAI.', details: (maskCreationError as Error).message }, { status: 500 });
    }
    
    const maskFileName = "white_opaque_mask.png";
    const maskFileForOpenAI = await OpenAI.toFile(whiteMaskBuffer, maskFileName, { type: 'image/png' });

    console.log(`[API /edit-image] Calling OpenAI images.edit with RGB PNG image, a white opaque PNG mask, and prompt: "${prompt}"`);
    let editResponse;
    try {
      editResponse = await openai.images.edit({
        image: imageFileForOpenAI, // Pass the File-like object for the image
        mask: maskFileForOpenAI,   // Pass the File-like object for the mask
        prompt: prompt, // Use dynamic prompt from request body
        n: 1,
        size: '1024x1024',
        response_format: 'url', 
      });
    } catch (openaiError) {
      // Enhanced error logging
      console.error("[API /edit-image] Error calling OpenAI image edit API. Full error object:", JSON.stringify(openaiError, Object.getOwnPropertyNames(openaiError), 2));
      
      let displayErrorMessage = 'Failed to edit image using OpenAI.';
      let errorDetails = openaiError instanceof Error ? openaiError.message : String(openaiError);

      if (openaiError instanceof OpenAI.APIError) {
        console.error("OpenAI APIError Status:", openaiError.status);
        console.error("OpenAI APIError Type:", openaiError.type);
        console.error("OpenAI APIError Code:", openaiError.code);
        console.error("OpenAI APIError Param:", openaiError.param);
        
        // Customize display message based on common errors
        if (openaiError.message) {
            displayErrorMessage = `OpenAI API Error: ${openaiError.message}`;
        }
        if (openaiError.code === 'invalid_image_format' || (openaiError.message && (openaiError.message.toLowerCase().includes('png') || openaiError.message.toLowerCase().includes('image format')))) {
            displayErrorMessage = "OpenAI API Error: Image must be a valid PNG file, square, and less than 4MB.";
        } else if (openaiError.status === 401) {
            displayErrorMessage = "OpenAI API Error: Authentication failed. Please check your API key.";
        }
        errorDetails = `Type: ${openaiError.type}, Code: ${openaiError.code}, Message: ${openaiError.message}`;
      }
      
      return NextResponse.json({ error: displayErrorMessage, details: errorDetails }, { status: 500 });
    }

    const editedImageObject = editResponse.data && editResponse.data.length > 0 ? editResponse.data[0] : null;
    const editedImageUrlFromOpenAI = editedImageObject?.url;

    if (!editedImageUrlFromOpenAI) {
      console.error("[API /edit-image] OpenAI did not return an edited image URL. Response:", editResponse);
      return NextResponse.json({ error: 'OpenAI did not return an edited image URL.' }, { status: 500 });
    }
    console.log(`[API /edit-image] Received edited image URL from OpenAI: ${editedImageUrlFromOpenAI}`);

    try {
      console.log(`[API /edit-image] Fetching edited image from OpenAI URL: ${editedImageUrlFromOpenAI}`);
      const finalImageResponse = await fetch(editedImageUrlFromOpenAI);
      if (!finalImageResponse.ok || !finalImageResponse.body) {
        throw new Error(`Failed to fetch edited image from OpenAI URL: ${finalImageResponse.statusText}`);
      }
      const finalImageBlob = await finalImageResponse.blob();
      const finalImageBuffer = Buffer.from(await finalImageBlob.arrayBuffer());

      const baseFileName = originalFileNameFromUrl.substring(0, originalFileNameFromUrl.lastIndexOf('.')) || 'image';
      const editedFileName = `edited-${baseFileName}-${Date.now()}.png`;

      const publicSupabaseUrl = await uploadImageBufferToSupabase(
        finalImageBuffer,
        editedFileName,
        'image/png', 
        userId,
        supabase
      );

      if (!publicSupabaseUrl) {
        console.warn("[API /edit-image] Failed to upload edited image to Supabase. Returning OpenAI URL as fallback.");
        return NextResponse.json({ editedImageUrl: editedImageUrlFromOpenAI, source: 'openai_temporary', message: "Successfully edited image, but failed to store it persistently. URL is temporary." });
      }
      
      console.log(`[API /edit-image] Successfully processed and stored edited image at: ${publicSupabaseUrl}`);
      return NextResponse.json({ editedImageUrl: publicSupabaseUrl, source: 'supabase_persistent' });

    } catch (storageError) {
      console.error("[API /edit-image] Error processing/storing edited image from OpenAI:", storageError);
      return NextResponse.json({ 
        editedImageUrl: editedImageUrlFromOpenAI, 
        source: 'openai_temporary',
        warning: 'Failed to store edited image persistently after generation. URL is temporary.',
        details: (storageError as Error).message
      });
    }

  } catch (error) {
    console.error('[API /edit-image] Unexpected error in POST handler:', error);
    let message = 'An unexpected error occurred during image editing.';
    if (error instanceof Error && error.message.includes('fetch')) {
        message = 'Network error or issue reaching a service.';
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
