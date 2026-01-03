import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Authentication helper
const getSupaClient = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
        return createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: authHeader } }
        });
    }
    return createClient(supabaseUrl, supabaseKey);
};

export const dynamic = 'force-dynamic';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data, error } = await supabase
            .from('templates')
            .select('*, creator:creator_id(email, id)')
            .eq('id', id)
            .single();

        if (error) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const supabase = getSupaClient(req);
        // Auth check
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // RLS handles "creator update own" check, but we should handle the error nicely
        // Or we rely on the query to fail if not owner. 
        // Supabase returns 404 or empty update if policy fails sometimes? 
        // Usually it returns error if using .update().

        const { data, error } = await supabase
            .from('templates')
            .update(body)
            .eq('id', id)
            .eq('creator_id', user.id) // Double check ownership explicitly for safety
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            // Could mean not found OR not authorized (not owner)
            return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const supabase = getSupaClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Soft delete to 'removed' instead of hard delete
        const { data, error } = await supabase
            .from('templates')
            .update({ status: 'removed' })
            .eq('id', id)
            .eq('creator_id', user.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        if (!data) {
            return NextResponse.json({ error: 'Template not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Template removed successfully' });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
