'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, DollarSign, BarChart, Edit, Settings, Eye } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export function CreatorDashboardClient() {
    const [stats, setStats] = useState<any>(null);
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            if (token) {
                try {
                    const earnRes = await fetch('/api/creators/payouts', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (earnRes.ok) {
                        setStats(await earnRes.json());
                    }
                } catch (e) { console.error(e); }
            }

            const { data: myTemplates } = await supabase
                .from('templates')
                .select('*')
                .eq('creator_id', user.id)
                .order('created_at', { ascending: false });

            if (myTemplates) setTemplates(myTemplates);

            setLoading(false);
        };

        loadData();
    }, []);

    const handleOnboarding = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const res = await fetch('/api/creators/onboarding', {
                method: 'POST',
                headers: { Authorization: `Bearer ${session.access_token}` }
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Failed to get onboarding link');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to start onboarding');
        }
    };

    if (loading) return <div className="p-8 text-center text-neutral-500">Loading dashboard...</div>;

    const isStripeConnected = !!stats?.stripe_account_id;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Stats Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" /> Earnings
                    </h2>
                    <div className="text-3xl font-bold text-white mb-1">
                        ${stats?.total_earned?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-sm text-neutral-500 mb-4">Total Revenue</div>

                    <div className="p-4 bg-black/20 rounded-lg mb-4">
                        <div className="text-xs text-neutral-400 mb-1">Available to Payout</div>
                        <div className="text-xl font-mono text-emerald-400">
                            ${stats?.available_balance?.toFixed(2) || '0.00'}
                        </div>
                    </div>

                    {!isStripeConnected ? (
                        <button
                            onClick={handleOnboarding}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition-colors mb-2"
                        >
                            Connect Payouts
                        </button>
                    ) : (
                        <button className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/50 py-2 rounded-lg text-sm font-medium transition-colors">
                            Request Payout
                        </button>
                    )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BarChart className="w-5 h-5 text-blue-400" /> Analytics
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm text-neutral-400">Templates Active</div>
                            <div className="text-xl font-bold">{templates.filter(t => t.status === 'active').length}</div>
                        </div>
                        <div>
                            <div className="text-sm text-neutral-400">Total Sales</div>
                            <div className="text-xl font-bold">
                                {templates.reduce((acc, t) => acc + (t.purchase_count || 0), 0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Templates List */}
            <div className="lg:col-span-3">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
                        <h2 className="text-lg font-semibold">My Templates</h2>
                    </div>

                    {templates.length === 0 ? (
                        <div className="p-12 text-center text-neutral-500">
                            <h3 className="text-lg font-medium text-neutral-300 mb-2">No templates yet</h3>
                            <p className="max-w-md mx-auto mb-6">
                                Start earning by creating reusable video templates.
                            </p>
                            <Link
                                href="/dashboard/templates/create"
                                className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                            >
                                Create First Template
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-neutral-800">
                            {templates.map((template) => (
                                <div key={template.id} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors">
                                    <div className="w-16 h-24 bg-neutral-800 rounded-md overflow-hidden flex-shrink-0">
                                        <img src={template.thumbnail_url} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-white">{template.name}</h3>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${template.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {template.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-neutral-400 mb-1">
                                            ${template.price_usd} • {template.category}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-neutral-500">
                                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {template.purchase_count} Sales</span>
                                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> -- Views</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-colors">
                                            <Settings className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
