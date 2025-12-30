import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/storage-sync';

export async function GET(req: NextRequest) {
    try {
        const { data: apps, error } = await supabaseAdmin
            .from('applications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Fetch Applications Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ applications: apps });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
