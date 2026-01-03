'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Play, Download, Sparkles, Loader2 } from 'lucide-react';
import { Template } from '@/types';

export default function LibraryPage() {
    const [purchasedTemplates, setPurchasedTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const fetchLibrary = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return; // Middleware handles redirect

            const { data, error } = await supabase
                .from('template_purchases')
                .select(`
                    id,
                    template:templates (*)
                `)
                .eq('buyer_id', user.id)
                .eq('payment_status', 'completed');

            if (data) {
                // Flatten the response
                const templates = data.map((item: any) => item.template) as Template[];
                setPurchasedTemplates(templates);
            }
            setLoading(false);
        };
        fetchLibrary();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        My Library
                    </h1>
                    <Link href="/marketplace" className="text-sm font-bold text-neutral-400 hover:text-white transition-colors">
                        Browse Marketplace
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 text-neutral-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading library...
                    </div>
                ) : purchasedTemplates.length === 0 ? (
                    <div className="p-12 text-center border border-neutral-800 rounded-xl bg-neutral-900">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-neutral-600" />
                        <h3 className="text-lg font-medium text-neutral-300 mb-2">Your library is empty</h3>
                        <p className="text-neutral-500 mb-6">Explore the marketplace to find professionally designed templates.</p>
                        <Link href="/marketplace" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-block">
                            Go to Marketplace
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {purchasedTemplates.map((template) => (
                            <div key={template.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group">
                                <div className="aspect-video relative">
                                    <img
                                        src={template.thumbnail_url}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black">
                                            <Play className="w-5 h-5 ml-1" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white mb-1 truncate">{template.name}</h3>
                                    <div className="flex justify-between items-center mt-4">
                                        <button
                                            // Ideally this would deep-link to the home page generator with this template active
                                            // For MVP, just copy prompt?
                                            onClick={() => {
                                                // MVP: Alert logic
                                                alert('To use: Go to Home > AI Generator > Select this template from the carousel.');
                                            }}
                                            className="text-xs font-bold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            Use Template
                                        </button>
                                        <button className="text-neutral-400 hover:text-white">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
