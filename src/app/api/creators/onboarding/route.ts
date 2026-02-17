import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createConnectAccount, createAccountLink } from '@/lib/stripe';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const getSupaClient = (req: NextRequest) => {
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
        return createClient(supabaseUrl, supabaseKey, {
            global: { headers: { Authorization: authHeader } }
        });
    }
    return createClient(supabaseUrl, supabaseKey);
};

export async function POST(req: NextRequest) {
    try {
        const supabase = getSupaClient(req);
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || !user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Check if user already has a stripe_account_id in `creator_earnings` OR `users` metadata?
        // We store it in `creator_earnings`.

        // We need 'upsert' capability or check existing.
        // Let's assume `creator_earnings` is the source of truth for stripe_account_id.

        const { data: earnings } = await supabase
            .from('creator_earnings')
            .select('*')
            .eq('creator_id', user.id)
            .single();

        let accountId = earnings?.stripe_account_id;

        if (!accountId) {
            // Create new Connect Account
            const account = await createConnectAccount(user.email);
            accountId = account.id;

            // Save to DB
            // Use Admin to ensure write if policies are tight (though creator should be able to init their own chart)
            // Let's rely on standard client first.
            const { error: upsertError } = await supabase
                .from('creator_earnings')
                .upsert({
                    creator_id: user.id,
                    stripe_account_id: accountId,
                    // Default zeros if new
                    total_earned: 0,
                    available_balance: 0,
                    total_withdrawn: 0
                }, { onConflict: 'creator_id' });

            if (upsertError) throw upsertError;
        }

        // 2. Create Account Link
        const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/templates`;
        const refreshUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/templates`; // Simplified for MVP

        const accountLink = await createAccountLink(accountId, refreshUrl, returnUrl);

        return NextResponse.json({ url: accountLink.url });

    } catch (err: any) {
        console.error('Onboarding Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
