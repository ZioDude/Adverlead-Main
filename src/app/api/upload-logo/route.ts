import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return NextResponse.json({ error: 'Failed to get session', details: sessionError.message }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique file name to prevent overwrites and ensure security
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${userId}/logos/${fileName}`; // Store logos in a user-specific 'logos' folder

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ad-images') // Assuming 'ad-images' is your general bucket for these types of assets
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false, // Do not upsert, always create new to avoid accidental overwrites if somehow uuid collides
      });

    if (uploadError) {
      console.error('Error uploading logo to Supabase Storage:', uploadError);
      return NextResponse.json({ error: 'Failed to upload logo', details: uploadError.message }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('ad-images')
      .getPublicUrl(filePath);

    if (!publicUrl) {
      console.error('Failed to get public URL for uploaded logo, Supabase path:', filePath);
      return NextResponse.json({ error: 'Failed to get public URL for logo' }, { status: 500 });
    }

    console.log('[API /upload-logo] Successfully uploaded logo:', publicUrl);
    return NextResponse.json({ imageUrl: publicUrl, path: uploadData?.path });

  } catch (error: unknown) {
    console.error('[API /upload-logo] Unexpected error in POST handler:', error);
    let message = 'An unexpected error occurred during logo upload.';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
