import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripe';

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

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: templateId } = await params;

    try {
        const supabase = getSupaClient(req);

        // 1. Authenticate User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch Template details (ensure active)
        const { data: template, error: templateError } = await supabase
            .from('templates')
            .select('*, creator:creator_id(stripe_account_id)')
            .eq('id', templateId)
            .eq('status', 'active')
            .single();

        if (templateError || !template) {
            return NextResponse.json({ error: 'Template not found or unavailable' }, { status: 404 });
        }

        if (template.creator_id === user.id) {
            return NextResponse.json({ error: 'Cannot purchase your own template' }, { status: 400 });
        }

        // 3. Check for existing purchase
        const { data: existingPurchase } = await supabase
            .from('template_purchases')
            .select('id')
            .eq('template_id', templateId)
            .eq('buyer_id', user.id)
            .eq('payment_status', 'completed')
            .single();

        if (existingPurchase) {
            return NextResponse.json({ error: 'You already own this template' }, { status: 400 });
        }

        // 4. Calculate amounts
        const amount = Math.round(template.price_usd * 100); // cents
        const platformFeePercent = 0.30;
        const applicationFeeAmount = Math.round(amount * platformFeePercent);
        // Stripe transfer amount is what the destination account gets (Total - App Fee)
        // Actually, creating a PaymentIntent with `transfer_data` automatically splits it.
        // Flow: 
        // - Charge User Full Amount.
        // - Use `application_fee_amount` to take our cut.
        // - Remainder goes to Connected Account.

        // OPTION A: Direct Charge with Application Fee (Recommended for Express)
        // Requires creator to have stripe_account_id

        if (!template.creator?.stripe_account_id) {
            // Fallback if creator doesn't have stripe connected yet?
            // In a real marketplace, we might prevent listing if not connected.
            // For now, we can hold funds in Platform account and transfer later manually?
            // Or just error out.
            // Let's create payment intent on Platform account for now, and handle transfer logic in webhook or separate flow if ID missing.
            // Better: Error if Stripe not connected to encourage onboarding.
            console.warn(`Creator ${template.creator_id} has no stripe_account_id. Funds will be held in platform.`);
        }

        const paymentIntentParams: any = {
            amount: amount,
            currency: 'usd',
            metadata: {
                templateId: templateId,
                buyerId: user.id,
                creatorId: template.creator_id,
                type: 'template_purchase'
            },
            automatic_payment_methods: {
                enabled: true,
            },
        };

        // If Creator is connected, use destination charge or separate charges and transfers
        // Using "Destination Charge" (on behalf of creator) or "Direct Charge" is complex.
        // Easiest for Platforms: Charge on Platform, Transfer to Connected Account later (Separate Charges and Transfers).
        // Or `transfer_data` (Destination Charge).
        // Let's use `transfer_data` if available for automated split.

        if (template.creator?.stripe_account_id) {
            paymentIntentParams.application_fee_amount = applicationFeeAmount;
            paymentIntentParams.transfer_data = {
                destination: template.creator.stripe_account_id,
            };
        } else {
            // Funds stay in platform, we track it in DB and payout manually or later
        }

        const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            id: paymentIntent.id
        });

    } catch (err: any) {
        console.error('Purchase Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
