'use client';

import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { PurchaseModal } from './PurchaseModal';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface TemplateActionPanelProps {
    template: any;
}

export function TemplateActionPanel({ template }: TemplateActionPanelProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handlePurchaseClick = async () => {
        setIsLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Redirect to login if not authenticated
                // For MVP just alert or rely on middleware redirect if implemented
                alert('Please sign in to purchase templates.');
                setIsLoading(false);
                return;
            }

            const res = await fetch(`/api/templates/${template.id}/purchase`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            const data = await res.json();

            if (res.ok && data.clientSecret) {
                setClientSecret(data.clientSecret);
                setIsModalOpen(true);
            } else {
                alert(data.error || 'Failed to initiate purchase');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-neutral-900/80 backdrop-blur-md rounded-xl p-6 border border-neutral-800 sticky top-6">
            <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold">{template.name}</h1>
            </div>

            <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-full border border-blue-500/20">
                    {template.category}
                </span>
                <span className="px-3 py-1 bg-neutral-800 text-neutral-400 text-sm rounded-full">
                    {template.purchase_count} Sales
                </span>
            </div>

            <div className="flex justify-between items-center mb-8">
                <div className="text-3xl font-bold text-white">${template.price_usd}</div>
                <div className="flex flex-col items-end">
                    <span className="text-sm text-neutral-400">One-time purchase</span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Licensed for usage
                    </span>
                </div>
            </div>

            {/* Main CTA */}
            <button
                onClick={handlePurchaseClick}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-lg transition-all shadow-lg shadow-blue-900/20 mb-4 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                Purchase Template
            </button>

            <p className="text-xs text-center text-neutral-500 mb-6">
                Instant access to template configuration and settings.
            </p>

            <div className="pt-6 border-t border-neutral-800">
                <h3 className="text-sm font-semibold text-neutral-300 mb-3">Creator</h3>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-600 flex items-center justify-center">
                        <span className="font-bold">
                            {template.creator?.email?.[0]?.toUpperCase() || 'C'}
                        </span>
                    </div>
                    <div>
                        <div className="font-medium text-sm">
                            {template.creator?.email || 'Unknown Creator'}
                        </div>
                        <div className="text-xs text-neutral-500">Verified Seller</div>
                    </div>
                </div>
            </div>

            {isModalOpen && clientSecret && (
                <PurchaseModal
                    templateId={template.id}
                    templateName={template.name}
                    price={template.price_usd}
                    clientSecret={clientSecret}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
