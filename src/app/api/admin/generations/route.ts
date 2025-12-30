import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/storage-sync';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type'); // 'video' or 'image'
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        let query = supabaseAdmin
            .from('generations')
            .select('*, creator:creators!generations_user_email_fkey(*)', { count: 'exact' }) // This assumes a FK, but we can also use email matching
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (type && type !== 'all') {
            query = query.eq('type', type);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error('Admin API Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            generations: data,
            total: count,
            limit,
            offset
        });
    } catch (error: any) {
        console.error('Admin API Catch Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
