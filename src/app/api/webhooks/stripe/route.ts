import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin for DB writes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing signature or config' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
                break;
            // Add other events if needed (e.g. payout.paid)
            default:
            // console.log(`Unhandled event type ${event.type}`);
        }
    } catch (err: any) {
        console.error('Webhook handler error:', err);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }

    return NextResponse.json({ received: true });
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const { metadata, amount, id: stripePaymentId, transfer_data } = paymentIntent;

    if (metadata?.type !== 'template_purchase') return;

    const { templateId, buyerId, creatorId } = metadata;
    const amountUsd = amount / 100;

    // Determine split
    const platformFeeRate = 0.30;
    const platformFee = Number((amountUsd * platformFeeRate).toFixed(2));
    const creatorEarnings = Number((amountUsd - platformFee).toFixed(2));

    // 1. Record Purchase
    const { error: purchaseError } = await supabaseAdmin
        .from('template_purchases')
        .insert({
            template_id: templateId,
            buyer_id: buyerId,
            purchase_price: amountUsd,
            platform_fee: platformFee,
            creator_earnings: creatorEarnings,
            stripe_payment_intent_id: stripePaymentId,
            payment_status: 'completed',
            payout_status: transfer_data ? 'paid' : 'pending' // If transfer_data existed, it's already split/moved (mostly)
        });

    if (purchaseError) {
        // If dup key (idempotency), we might ignore, but log error
        console.error('Error recording purchase:', purchaseError);
        // Don't throw if just duplicate to prevent webhook retry loops?
        if (purchaseError.code !== '23505') throw purchaseError;
    }

    // 2. Increment Template Stats
    await supabaseAdmin.rpc('increment_template_purchases', {
        template_id_arg: templateId,
        revenue_amount: amountUsd
    });

    // 3. Update Creator Earnings
    // Even if auto-transferred via Stripe, we track it in our DB for history/stats.
    // If auto-transfer happened (transfer_data), available_balance might technically be 0 in our internal wallet 
    // if we treat 'available_balance' as 'funds held by us'.
    // However, for the dashboard, we want to show 'Total Earned'.
    // If we used `transfer_data` (Destination Charge), the funds are in the Creator's Stripe balance immediately (minus holding period).
    // So 'available_balance' in OUR system is 0 because we don't hold it. 
    // Let's verify our `add_creator_earnings` function logic.
    /*
      CREATE OR REPLACE FUNCTION add_creator_earnings(creator_id_arg uuid, amount decimal) ...
      available_balance = available_balance + amount
    */
    // If payment was auto-routed, we shouldn't increase available_balance because we can't pay them out (Stripe already did/will).
    // We should probably just track 'total_earned'.

    if (transfer_data?.destination) {
        // Auto-routed
        await supabaseAdmin.rpc('add_creator_earnings_only_stats', {
            creator_id_arg: creatorId,
            amount: creatorEarnings
        });
    } else {
        // Held in platform
        // We use the original function that adds to available_balance
        await supabaseAdmin.rpc('add_creator_earnings', {
            creator_id_arg: creatorId,
            amount: creatorEarnings
        });
    }

    console.log(`Processed purchase for template ${templateId}`);
}
