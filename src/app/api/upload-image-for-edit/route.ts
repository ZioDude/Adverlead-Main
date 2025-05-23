import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic'; // Explicitly mark as dynamic

async function uploadFileToSupabase(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  userId: string,
  supabase: SupabaseClient
): Promise<string | null> {
  const timestamp = Date.now();
  // Sanitize filename and ensure it has an extension, default to .png if not obvious
  const safeFileName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const extension = safeFileName.includes('.') ? safeFileName.substring(safeFileName.lastIndexOf('.')) : '.png';
  const baseName = safeFileName.includes('.') ? safeFileName.substring(0, safeFileName.lastIndexOf('.')) : safeFileName;
  
  const uniqueFileName = `temp-edit-${userId}-${baseName}-${timestamp}${extension}`;
  const filePath = `${userId}/${uniqueFileName}`; // Store in user-specific folder

  console.log(`[API /upload-image-for-edit] Uploading ${filePath} to Supabase.`);
  const { error } = await supabase.storage
    .from('ad-images') // Use the same bucket 'ad-images'
    .upload(filePath, fileBuffer, {
      contentType: contentType || 'application/octet-stream', // Use provided content type or default
      upsert: false, // Always create new for temp uploads
    });

  if (error) {
    console.error(`[API /upload-image-for-edit] Error uploading ${uniqueFileName} to Supabase:`, error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage.from('ad-images').getPublicUrl(filePath);
  console.log(`[API /upload-image-for-edit] Successfully uploaded ${uniqueFileName}, URL: ${publicUrl}`);
  return publicUrl;
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();

    // Introduce an explicit await before Supabase client creation and session retrieval.
    // This yields to the event loop and might help Next.js set up its dynamic context.
    await new Promise(resolve => setTimeout(resolve, 0));

    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const formData = await request.formData();
    // Ensure the key matches what the client sends (e.g., 'file')
    const file = formData.get('file') as File | null; 

    if (!file) {
      return NextResponse.json({ error: 'No image file provided.' }, { status: 400 });
    }

    // Check file size (e.g., limit to 10MB for uploads, OpenAI edit input is < 4MB)
    if (file.size > 10 * 1024 * 1024) { // 10 MB limit for this temp upload
        return NextResponse.json({ error: 'File is too large (max 10MB).' }, { status: 413 });
    }
    
    // Check file type (optional, but good practice)
    // For OpenAI edits, PNG is required. JPEGs are also common.
    // This upload endpoint can be more lenient, as /api/edit-image will handle PNG conversion.
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` }, { status: 415 });
    }


    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const publicUrl = await uploadFileToSupabase(
      fileBuffer,
      file.name,
      file.type,
      userId,
      supabase
    );

    if (!publicUrl) {
      return NextResponse.json({ error: 'Failed to upload image to storage.' }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: publicUrl }, { status: 200 });

  } catch (error) {
    console.error('[API /upload-image-for-edit] Unexpected error:', error);
    let message = 'An unexpected error occurred during file upload.';
     if (error instanceof Error && (error.message.includes('body') || error.message.includes('form'))) {
        message = 'Invalid request format. Expected multipart/form-data with an "image" field.';
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
