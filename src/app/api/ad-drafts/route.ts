import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Log environment variables for debugging
console.log("[API /ad-drafts] Attempting to load Supabase ENV VARS:");
console.log("[API /ad-drafts] NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Loaded" : "NOT LOADED OR EMPTY");
console.log("[API /ad-drafts] SUPABASE_SERVICE_KEY:", process.env.SUPABASE_SERVICE_KEY ? "Loaded (first 5 chars: " + process.env.SUPABASE_SERVICE_KEY.substring(0,5) + "...)" : "NOT LOADED OR EMPTY");

interface AdDraft {
  id?: string;
  user_id?: string;
  industry: string | null;
  house_style: string | null;
  generated_images: { view: string; src: string; alt: string }[];
  created_at?: string;
}

// POST handler to save a new ad draft
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const draftData = await request.json() as AdDraft;

    // Basic validation
    if (!draftData.industry || !draftData.generated_images || draftData.generated_images.length === 0) {
      return NextResponse.json({ error: 'Missing required draft data.' }, { status: 400 });
    }

    console.log('[API /ad-drafts] Received POST request to save draft:', draftData);

    // Add the user_id to the draft data
    const { data, error } = await supabase
      .from('ad_drafts')
      .insert([
        {
          ...draftData,
          user_id: session.user.id,
        }
      ])
      .select();

    if (error) {
      console.error('[API /ad-drafts] Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save draft to database.', details: error.message }, { status: 500 });
    }

    console.log('[API /ad-drafts] Draft saved successfully:', data);
    return NextResponse.json({ message: 'Draft saved successfully', draft: data ? data[0] : null }, { status: 201 });

  } catch (error) {
    console.error('[API /ad-drafts] Error in POST handler:', error);
    let errorMessage = 'Failed to process ad draft.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET handler to fetch existing ad drafts
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[API /ad-drafts] Received GET request to fetch drafts for user:', session.user.id);

    // Fetch only the drafts belonging to the current user
    const { data, error } = await supabase
      .from('ad_drafts')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API /ad-drafts] Supabase select error:', error);
      return NextResponse.json({ error: 'Failed to fetch drafts from database.', details: error.message }, { status: 500 });
    }

    console.log('[API /ad-drafts] Drafts fetched successfully:', data);
    return NextResponse.json({ drafts: data || [] }, { status: 200 });

  } catch (error) {
    console.error('[API /ad-drafts] Error in GET handler:', error);
    let errorMessage = 'Failed to fetch ad drafts.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}