import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createRouteHandlerClient, SupabaseClient } from '@supabase/auth-helpers-nextjs'; // Assuming SupabaseClient can be imported from here, or use '@supabase/supabase-js'
import { cookies } from 'next/headers';

// Debug: Log the API token status
console.log("[API Route] REPLICATE_API_TOKEN:", process.env.REPLICATE_API_TOKEN ? "Token Present (first few chars: " + process.env.REPLICATE_API_TOKEN.substring(0,5) + ")" : "Token NOT SET or empty");

const imageViews = ["Front View", "Kitchen", "Living Room", "Bathroom", "Bedroom"];

interface RequestBody {
  houseStyleLabel: string;
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || ''
});

// Specific SDXL model version from Replicate
const SDXL_MODEL_VERSION = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

// Helper function to generate a placeholder image
function generatePlaceholderImage(prompt: string, view: string): string {
  // Use picsum.photos with a seed based on the prompt for stable results
  const seed = Math.abs(prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  return `https://picsum.photos/seed/${seed}${view.replace(/\s+/g, '')}/1024/1024`;
}

async function uploadToSupabase(imageUrl: string, fileName: string, userId: string, supabase: SupabaseClient) {
  try {
    console.log(`[API Route] Attempting to upload image to Supabase Storage for user ${userId}`);
    
    // Fetch the image from Replicate
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch image from Replicate');
    }
    const imageBlob = await response.blob();

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('ad-images')
      .upload(`${userId}/${fileName}`, imageBlob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.error('Error uploading to Supabase Storage:', error);
      return null;
    }

    console.log('[API Route] Successfully uploaded image to Supabase Storage');

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ad-images')
      .getPublicUrl(`${userId}/${fileName}`);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadToSupabase:', error);
    return null;
  }
}

async function generateImageWithReplicate(prompt: string, view: string, userId: string, supabase: SupabaseClient): Promise<string | null> {
  console.log(`[API Route] Calling Replicate for prompt: ${prompt}`);
  try {
    // For faster testing/debugging - uncomment this to use placeholder images
    // instead of calling the API
    // return generatePlaceholderImage(prompt, prompt.split(' ').pop() || 'image');

    const prediction = await replicate.predictions.create({
      version: SDXL_MODEL_VERSION.split(":")[1],
      input: {
        prompt: prompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 25,
        guidance_scale: 7.5, 
      }
    });
    
    console.log("[API Route] Prediction created:", prediction.id);
    
    // Wait for the prediction to complete
    let result = await replicate.predictions.get(prediction.id);
    
    // Poll until the prediction is complete
    while (result.status !== "succeeded" && result.status !== "failed") {
      console.log(`[API Route] Waiting for prediction ${prediction.id}, status: ${result.status}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }
    
    if (result.status === "succeeded" && result.output) {
      const output = result.output;
      console.log("[API Route] Prediction succeeded:", output);
      
      if (Array.isArray(output) && output.length > 0 && typeof output[0] === 'string') {
        const replicateUrl = output[0];
        console.log(`[API Route] Image generated: ${replicateUrl}`);
        
        // Generate a unique filename
        const timestamp = Date.now();
        const fileName = `${view.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.jpg`;
        
        // Upload to Supabase Storage
        const supabaseUrl = await uploadToSupabase(replicateUrl, fileName, userId, supabase);
        
        if (supabaseUrl) {
          return supabaseUrl;
        }

        // Fallback to Replicate URL if Supabase upload fails
        console.warn('[API Route] Failed to upload to Supabase, falling back to Replicate URL');
        return replicateUrl;
      } else {
        console.error('[API Route] Replicate output format unexpected:', output);
      }
    } else {
      console.error(`[API Route] Prediction failed or unexpected format:`, result);
    }

    return null;
  } catch (error) {
    console.error('[API Route] Error calling Replicate API:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    // Initialize Supabase client with awaited cookies
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json() as RequestBody;
    const { houseStyleLabel } = body;

    if (!houseStyleLabel) {
      return NextResponse.json({ error: 'houseStyleLabel is required' }, { status: 400 });
    }

    // Check if we should use placeholder images (if API token is missing or for development)
    const usePlaceholders = !process.env.REPLICATE_API_TOKEN || 
                           process.env.REPLICATE_API_TOKEN.length < 10 ||
                           process.env.USE_PLACEHOLDER_IMAGES === 'true';
    
    if (usePlaceholders) {
      console.log('[API Route] Using placeholder images instead of Replicate API');
      const placeholderImages = imageViews.map(view => ({
        view,
        src: generatePlaceholderImage(houseStyleLabel + view, view),
        alt: `${houseStyleLabel} - ${view}`,
      }));
      
      return NextResponse.json(
        { images: placeholderImages },
        { 
          headers: {
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          } 
        }
      );
    }

    const generatedImages = [];
    for (const view of imageViews) {
      // Construct a more detailed prompt
      const prompt = `photo of a ${houseStyleLabel} ${view}, high quality, detailed, interior design, realistic lighting`;
      const imageUrl = await generateImageWithReplicate(prompt, view, session.user.id, supabase);
      if (imageUrl) {
        generatedImages.push({
          view,
          src: imageUrl,
          alt: `${houseStyleLabel} - ${view}`,
        });
      } else {
        // Fall back to a placeholder if real generation fails
        console.warn(`[API Route] Failed to generate image for view: ${view} of ${houseStyleLabel}, using placeholder`);
        generatedImages.push({
          view,
          src: generatePlaceholderImage(houseStyleLabel + view, view),
          alt: `${houseStyleLabel} - ${view} (placeholder)`,
        });
      }
    }

    if (generatedImages.length === 0 && imageViews.length > 0) {
        console.error('[API Route] No images were generated after attempting all views.');
        return NextResponse.json({ error: 'Failed to generate any images after attempting all views.' }, { status: 500 });
    }

    return NextResponse.json(
      { images: generatedImages },
      { 
        headers: {
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        } 
      }
    );

  } catch (error) {
    console.error('[API Route] Error in generate-images POST handler:', error);
    let errorMessage = 'Failed to generate images due to an internal server error.';
    if (error instanceof Error) {
      errorMessage = error.message.includes("auth") || error.message.includes("token") 
                     ? "Image generation service authentication failed. Please check server configuration."
                     : "Image generation process failed. Please try again later.";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
