import { NextResponse } from 'next/server';
import { createRouteHandlerClient, SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import sharp from 'sharp';
// import OpenAI from 'openai'; // Removed unused import

// Define the structure of an Ad Draft, matching the backend
// interface AdDraft { // Removed unused interface
//   id: string;
//   user_id: string;
//   industry: string | null;
//   house_style: string | null;
//   generated_images: { view: string; src: string; alt: string }[];
//   created_at?: string;
//   // Consider adding a field like image_format: 'jpeg' | 'png' in the future
// }

interface GeneratedImageEntry {
  view: string;
  src: string;
  alt: string;
}

interface RequestBody {
  draftId: string;
}

async function uploadPngBufferToSupabase(
  buffer: Buffer,
  originalFileName: string,
  userId: string,
  supabase: SupabaseClient
): Promise<string | null> {
  const baseName = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
  const newFileName = `converted-${baseName}-${Date.now()}.png`;
  const filePath = `${userId}/${newFileName}`;

  console.log(`[API /convert-draft-to-png] Uploading PNG ${filePath} to Supabase.`);
  const { error } = await supabase.storage
    .from('ad-images') // Ensure this is your correct bucket
    .upload(filePath, buffer, {
      contentType: 'image/png',
      upsert: false, // Create as new, don't overwrite existing by chance
    });

  if (error) {
    console.error(`[API /convert-draft-to-png] Error uploading ${newFileName} to Supabase:`, error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage.from('ad-images').getPublicUrl(filePath);
  console.log(`[API /convert-draft-to-png] Successfully uploaded ${newFileName}, URL: ${publicUrl}`);
  return publicUrl;
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json() as RequestBody;
    const { draftId } = body;

    if (!draftId) {
      return NextResponse.json({ error: 'draftId is required' }, { status: 400 });
    }

    console.log(`[API /convert-draft-to-png] Processing draftId: ${draftId} for user: ${userId}`);

    // 1. Fetch the original draft
    const { data: originalDraft, error: fetchError } = await supabase
      .from('ad_drafts')
      .select('*')
      .eq('id', draftId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !originalDraft) {
      console.error(`[API /convert-draft-to-png] Error fetching draft ${draftId}:`, fetchError);
      return NextResponse.json({ error: 'Original draft not found or access denied.' }, { status: 404 });
    }

    if (!originalDraft.generated_images || originalDraft.generated_images.length === 0) {
      return NextResponse.json({ error: 'Original draft has no images to convert.' }, { status: 400 });
    }

    const convertedImages: GeneratedImageEntry[] = [];
    for (const image of originalDraft.generated_images as GeneratedImageEntry[]) {
      if (!image.src || typeof image.src !== 'string') {
        console.warn(`[API /convert-draft-to-png] Skipping image with invalid src in draft ${draftId}:`, image);
        // Optionally copy it as is, or skip. Skipping for now.
        continue;
      }

      try {
        console.log(`[API /convert-draft-to-png] Fetching original image: ${image.src}`);
        const imageResponse = await fetch(image.src);
        if (!imageResponse.ok || !imageResponse.body) {
          throw new Error(`Failed to fetch image ${image.src}: ${imageResponse.statusText}`);
        }
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

        console.log(`[API /convert-draft-to-png] Converting image ${image.src} to PNG.`);
        const pngBuffer = await sharp(imageBuffer).png().toBuffer();
        
        const originalFileName = image.src.substring(image.src.lastIndexOf('/') + 1);
        const newPngUrl = await uploadPngBufferToSupabase(pngBuffer, originalFileName, userId, supabase);

        if (newPngUrl) {
          convertedImages.push({
            view: image.view,
            src: newPngUrl,
            alt: image.alt + " (PNG)",
          });
        } else {
          // Failed to upload this specific converted image, skip or handle error
          console.error(`[API /convert-draft-to-png] Failed to upload converted PNG for ${image.src}. Skipping this image.`);
          // Optionally, re-add the original image if partial conversion is okay
          // convertedImages.push(image); 
        }
      } catch (conversionProcessError) {
        console.error(`[API /convert-draft-to-png] Error processing image ${image.src}:`, conversionProcessError);
        // Optionally, re-add the original image if partial conversion is okay
        // convertedImages.push(image);
      }
    }

    if (convertedImages.length === 0) {
      return NextResponse.json({ error: 'Failed to convert any images in the draft.' }, { status: 500 });
    }

    // 2. Update the original draft with converted images
    const updateData = {
      generated_images: convertedImages,
      // Optionally, update other fields to indicate conversion, e.g.,
      // industry: originalDraft.industry ? `${originalDraft.industry} (Converted to PNG)` : "Converted to PNG",
      // Or add a status field like image_status: 'converted_png'
    };

    const { data: updatedDraft, error: updateError } = await supabase
      .from('ad_drafts')
      .update(updateData)
      .eq('id', draftId)
      .eq('user_id', userId) // Ensure user owns the draft they are updating
      .select()
      .single();

    if (updateError) {
      console.error(`[API /convert-draft-to-png] Supabase update error for draft ${draftId}:`, updateError);
      return NextResponse.json({ error: 'Failed to update draft with PNG images.', details: updateError.message }, { status: 500 });
    }

    console.log(`[API /convert-draft-to-png] Draft ${draftId} updated successfully with PNG images:`, updatedDraft);
    return NextResponse.json({ message: 'Draft images converted to PNG and draft updated.', updatedDraft: updatedDraft }, { status: 200 });

  } catch (error) {
    console.error('[API /convert-draft-to-png] Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during PNG conversion.' }, { status: 500 });
  }
}
