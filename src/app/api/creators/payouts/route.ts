import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe, transferToCreator } from '@/lib/stripe';

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
    return createClient(supabaseUrl, supabaseKey);
};

export async function GET(req: NextRequest) {
    try {
        const supabase = getSupaClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('creator_earnings')
            .select('*')
            .eq('creator_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // 116 is no rows
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Default object if no earnings record yet
        const earnings = data || {
            total_earned: 0,
            available_balance: 0,
            pending_balance: 0,
            total_withdrawn: 0,
            stripe_account_status: 'none'
        };

        return NextResponse.json(earnings);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = getSupaClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { amount } = body;

        if (!amount || amount < 10) {
            return NextResponse.json({ error: 'Minimum payout is $10.00' }, { status: 400 });
        }

        // 1. Check Balance
        const { data: earnings, error: earnError } = await supabase
            .from('creator_earnings')
            .select('*')
            .eq('creator_id', user.id)
            .single();

        if (earnError || !earnings) {
            return NextResponse.json({ error: 'Earnings record not found' }, { status: 404 });
        }

        if (earnings.available_balance < amount) {
            return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
        }

        if (!earnings.stripe_account_id) {
            return NextResponse.json({ error: 'Stripe account not connected' }, { status: 400 });
        }

        // 2. Create Payout Request Record
        const { data: request, error: reqError } = await supabase
            .from('payout_requests')
            .insert({
                creator_id: user.id,
                amount: amount,
                status: 'processing'
            })
            .select()
            .single();

        if (reqError) {
            return NextResponse.json({ error: reqError.message }, { status: 500 });
        }

        // 3. Effectuate Transfer
        // NOTE: In production, this might be async/batched. Here we do it instantly.
        try {
            const transfer = await transferToCreator(
                earnings.stripe_account_id,
                Math.round(amount * 100),
                `payout_${request.id}`
            );

            // 4. Update Status and Balances (Use Supabase Admin or RPC ideally to ensure transaction)
            // We'll update via client for now, but really SHOULD be server-side trusted. 
            // We reused `supabase` which is user-authed, but user can't update status arbitrarily due to RLS?
            // Wait, RLS prevents user from updating `payout_requests` status? 
            // I didn't set "UPDATE" policy for users on payout_requests. 
            // So we need `supabaseAdmin` here essentially.

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

            await supabaseAdmin
                .from('payout_requests')
                .update({
                    status: 'paid',
                    stripe_payout_id: transfer.id,
                    processed_at: new Date().toISOString()
                })
                .eq('id', request.id);

            await supabaseAdmin
                .from('creator_earnings')
                .update({
                    available_balance: earnings.available_balance - amount,
                    total_withdrawn: (earnings.total_withdrawn || 0) + amount
                })
                .eq('creator_id', user.id);

            return NextResponse.json({ success: true, transferId: transfer.id });

        } catch (stripeError: any) {
            // Mark as failed
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

            await supabaseAdmin
                .from('payout_requests')
                .update({
                    status: 'failed',
                    failure_reason: stripeError.message
                })
                .eq('id', request.id);

            return NextResponse.json({ error: 'Payout failed: ' + stripeError.message }, { status: 500 });
        }

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
