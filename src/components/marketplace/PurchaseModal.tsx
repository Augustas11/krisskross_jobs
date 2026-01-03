'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, X } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PurchaseModalProps {
    templateId: string;
    templateName: string;
    price: number;
    clientSecret: string;
    onClose: () => void;
}

function CheckoutForm({ price, onClose }: { price: number; onClose: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return to dashboard/library on success
                return_url: `${window.location.origin}/dashboard/library`,
            },
        });

        if (error.type === 'card_error' || error.type === 'validation_error') {
            setMessage(error.message || 'An unexpected error occurred.');
        } else {
            setMessage('An unexpected error occurred.');
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />

            {message && (
                <div className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                    {message}
                </div>
            )}

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay $${price}`}
            </button>

            <button
                type="button"
                onClick={onClose}
                className="w-full text-neutral-400 hover:text-white text-sm"
            >
                Cancel
            </button>
        </form>
    );
}

export function PurchaseModal({ templateId, templateName, price, clientSecret, onClose }: PurchaseModalProps) {
    const appearance = {
        theme: 'night' as const,
        variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#171717',
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
        },
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 border-b border-neutral-800">
                    <h2 className="text-xl font-bold mb-1">Purchase Template</h2>
                    <p className="text-neutral-400 text-sm">
                        {templateName}
                    </p>
                </div>

                <div className="p-6">
                    <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm price={price} onClose={onClose} />
                    </Elements>
                </div>
            </div>
        </div>
    );
}
