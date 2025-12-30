import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/storage-sync';

export async function POST(req: NextRequest) {
    try {
        const { email, action } = await req.json(); // action: 'approve' | 'reject'

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const status = action === 'approve' ? 'approved' : 'rejected';
        const approvedAt = action === 'approve' ? new Date().toISOString() : null;

        // Upsert creator status
        const { data, error } = await supabaseAdmin
            .from('creators')
            .upsert({
                email,
                status,
                approved_at: approvedAt
            }, { onConflict: 'email' })
            .select();

        if (error) {
            console.error('Approve API Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, creator: data[0] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
