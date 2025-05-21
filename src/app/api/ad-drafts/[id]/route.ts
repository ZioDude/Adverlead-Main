import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(
  _request: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First, verify that the draft belongs to the current user
    const { data: draft, error: fetchError } = await supabase
      .from('ad_drafts')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (fetchError) {
      console.error('[API /ad-drafts/[id]] Error fetching draft:', fetchError);
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    if (draft.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the draft
    const { error: deleteError } = await supabase
      .from('ad_drafts')
      .delete()
      .eq('id', params.id)
      .eq('user_id', session.user.id); // Extra safety check

    if (deleteError) {
      console.error('[API /ad-drafts/[id]] Error deleting draft:', deleteError);
      return NextResponse.json({ error: 'Failed to delete draft' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('[API /ad-drafts/[id]] Error in DELETE handler:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 