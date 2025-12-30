import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/storage-sync';

export async function POST(req: NextRequest) {
    try {
        const { name, email, portfolio, samples_link } = await req.json();

        if (!email || !name) {
            return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
        }

        // Save to applications table
        const { data, error } = await supabaseAdmin
            .from('applications')
            .upsert({
                full_name: name,
                email: email,
                portfolio_url: portfolio,
                samples_url: samples_link,
                status: 'pending'
            }, { onConflict: 'email' })
            .select();

        if (error) {
            console.error('Application Save Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, application: data[0] });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
