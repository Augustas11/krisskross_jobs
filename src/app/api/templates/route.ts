import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Helper to get authenticated client
const getSupaClient = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
        return createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: authHeader } }
        });
    }
    // Fallback to anon client if no header, but POST will likely fail RLS if not auth'd
    return createClient(supabaseUrl, supabaseKey);
};

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sort = searchParams.get('sort'); // 'newest', 'popularity', 'price_asc', 'price_desc'
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * limit;

        const supabase = createClient(supabaseUrl, supabaseKey);

        let query = supabase
            .from('templates')
            .select('*, creator:creator_id(email)', { count: 'exact' })
            .eq('status', 'active'); // Only active templates

        // Filters
        if (category && category !== 'all') {
            query = query.eq('category', category);
        }
        if (minPrice) {
            query = query.gte('price_usd', minPrice);
        }
        if (maxPrice) {
            query = query.lte('price_usd', maxPrice);
        }

        // Sorting
        switch (sort) {
            case 'popularity':
                query = query.order('purchase_count', { ascending: false });
                break;
            case 'price_asc':
                query = query.order('price_usd', { ascending: true });
                break;
            case 'price_desc':
                query = query.order('price_usd', { ascending: false });
                break;
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false });
                break;
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            templates: data,
            total: count,
            page,
            limit,
            totalPages: count ? Math.ceil(count / limit) : 0
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = getSupaClient(req);

        // Check auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            name, description, category, tags, price_usd,
            config, preview_video_url, thumbnail_url
        } = body;

        // Basic validation
        if (!name || !category || !price_usd || !config || !preview_video_url) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert
        const { data, error } = await supabase
            .from('templates')
            .insert({
                creator_id: user.id,
                name,
                description,
                category,
                tags,
                price_usd,
                config,
                preview_video_url,
                thumbnail_url,
                status: 'active' // Auto-active for MVP, usually 'draft'
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
