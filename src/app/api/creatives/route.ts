import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Define the expected structure for a new creative
interface NewCreativePayload {
  service_type: string;
  style_label: string;
  edited_image_url: string; // This will be the Supabase URL of the branded image
  original_image_urls: string[];
  logo_image_url?: string | null;
  website_text?: string | null;
  title_text_used: string;
  subtitle_text_used: string;
  overlay_opacity_used: number;
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json() as NewCreativePayload;

    // Basic validation
    if (!body.service_type || !body.style_label || !body.edited_image_url || !body.original_image_urls || body.original_image_urls.length === 0 || !body.title_text_used || !body.subtitle_text_used || typeof body.overlay_opacity_used === 'undefined') {
      return NextResponse.json({ error: 'Missing required creative data' }, { status: 400 });
    }

    const creativeData = {
      user_id: userId,
      service_type: body.service_type,
      style_label: body.style_label,
      edited_image_url: body.edited_image_url,
      original_image_urls: body.original_image_urls,
      logo_image_url: body.logo_image_url || null,
      website_text: body.website_text || null,
      title_text_used: body.title_text_used,
      subtitle_text_used: body.subtitle_text_used,
      overlay_opacity_used: body.overlay_opacity_used,
    };

    const { data, error } = await supabase
      .from('generated_creatives') // Ensure this table exists in your Supabase schema
      .insert([creativeData])
      .select()
      .single(); // Assuming you want the created record back

    if (error) {
      console.error('Error saving creative to Supabase:', error);
      return NextResponse.json({ error: 'Failed to save creative', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error: unknown) {
    console.error('[API /creatives POST] Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { data, error } = await supabase
      .from('generated_creatives')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching creatives from Supabase:', error);
      return NextResponse.json({ error: 'Failed to fetch creatives', details: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error: unknown) {
    console.error('[API /creatives GET] Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const { searchParams } = new URL(request.url);
    const creativeId = searchParams.get('id');

    if (!creativeId) {
      return NextResponse.json({ error: 'Creative ID is required' }, { status: 400 });
    }

    // Optional: Before deleting from DB, you might want to delete associated images from Supabase Storage.
    // This requires fetching the creative record first to get image URLs.
    // For simplicity, this example directly deletes the DB record.
    // Consider implementing storage cleanup for a production app.

    const { error: deleteError } = await supabase
      .from('generated_creatives')
      .delete()
      .eq('id', creativeId)
      .eq('user_id', userId); // Ensure user can only delete their own creatives

    if (deleteError) {
      console.error('Error deleting creative from Supabase:', deleteError);
      return NextResponse.json({ error: 'Failed to delete creative', details: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Creative deleted successfully' }, { status: 200 });

  } catch (error: unknown) {
    console.error('[API /creatives DELETE] Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred while deleting' }, { status: 500 });
  }
}
