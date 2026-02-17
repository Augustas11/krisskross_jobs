import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('STRIPE_SECRET_KEY is missing. Using placeholder for build.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
    apiVersion: '2025-12-15.clover', // Use latest stable API version or pin to a specific one
    appInfo: {
        name: 'KrissKross Creators Template Marketplace',
        version: '0.1.0'
    },
    typescript: true,
});

/**
 * Creates a Stripe Connect Express account for a creator
 */
export async function createConnectAccount(email: string) {
    try {
        const account = await stripe.accounts.create({
            type: 'express',
            email,
            capabilities: {
                transfers: { requested: true },
            },
            business_type: 'individual',
        });
        return account;
    } catch (error) {
        console.error('Error creating Stripe Connect account:', error);
        throw error;
    }
}

/**
 * Creates an Account Link for onboarding a creator
 */
export async function createAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
    try {
        const accountLink = await stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding',
        });
        return accountLink;
    } catch (error) {
        console.error('Error creating Stripe Account Link:', error);
        throw error;
    }
}

/**
 * Transfer funds to a creator's connected account
 */
export async function transferToCreator(
    connectedAccountId: string,
    amountCk: number, // amount in cents
    transferGroup: string
) {
    try {
        const transfer = await stripe.transfers.create({
            amount: amountCk,
            currency: 'usd',
            destination: connectedAccountId,
            transfer_group: transferGroup,
        });
        return transfer;
    } catch (error) {
        console.error('Error creating transfer:', error);
        throw error;
    }
}
