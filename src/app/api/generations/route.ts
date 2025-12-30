import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/storage-sync';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'video' or 'image'
        const limit = parseInt(searchParams.get('limit') || '12');
        const page = parseInt(searchParams.get('page') || '1');
        const offset = (page - 1) * limit;

        let query = supabaseAdmin
            .from('generations')
            .select('id, type, prompt, internal_url, external_url, created_at, status', { count: 'exact' })
            .eq('status', 'completed')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (type && type !== 'all') {
            query = query.eq('type', type);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Generations API Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            generations: data,
            total: count,
            limit,
            page,
            totalPages: count ? Math.ceil(count / limit) : 0
        });
    } catch (error: any) {
        console.error('Generations API Catch Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
