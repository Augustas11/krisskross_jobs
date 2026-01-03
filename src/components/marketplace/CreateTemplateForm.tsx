'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, Video } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const CATEGORIES = [
    'Vietnamese Fashion',
    'Korean Streetwear',
    'Beauty',
    'Accessories',
    'Cinematic',
    'Minimalist'
];

export function CreateTemplateForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: CATEGORIES[0],
        price_usd: 2.99,
        preview_video_url: '', // Phase 3: Real upload/generator
        thumbnail_url: '', // Phase 3: Real upload/generator
        config: '{}' // Phase 3: Real config object
    });

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Validate JSON
            let parsedConfig = {};
            try {
                parsedConfig = JSON.parse(formData.config);
            } catch (err) {
                throw new Error('Invalid JSON Config');
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Not authenticated');

            const res = await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    ...formData,
                    config: parsedConfig,
                    tags: [formData.category.toLowerCase()]
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create template');

            router.push('/dashboard/templates');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-8">
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Template Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2 focus:border-blue-500 outline-none transition-colors"
                            placeholder="e.g. Cinematic Product Reveal"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Category</label>
                        <select
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2 focus:border-blue-500 outline-none transition-colors"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Description</label>
                    <textarea
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2 focus:border-blue-500 outline-none transition-colors h-24 resize-none"
                        placeholder="Describe your template scene..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Price (USD)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-2 text-neutral-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            min="0.99"
                            max="49.99"
                            required
                            className="w-full bg-black border border-neutral-800 rounded-lg pl-8 pr-4 py-2 focus:border-blue-500 outline-none transition-colors"
                            value={formData.price_usd}
                            onChange={e => setFormData({ ...formData, price_usd: parseFloat(e.target.value) })}
                        />
                    </div>
                    <p className="text-xs text-neutral-500">You earn 70% of each sale.</p>
                </div>

                {/* Visual Assets Placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Preview Video URL</label>
                        <input
                            type="url"
                            required
                            placeholder="https://..."
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                            value={formData.preview_video_url}
                            onChange={e => setFormData({ ...formData, preview_video_url: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Thumbnail URL</label>
                        <input
                            type="url"
                            required
                            placeholder="https://..."
                            className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2 focus:border-blue-500 outline-none"
                            value={formData.thumbnail_url}
                            onChange={e => setFormData({ ...formData, thumbnail_url: e.target.value })}
                        />
                    </div>
                </div>

                {/* Config Editor Placeholder */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Configuration JSON</label>
                    <textarea
                        required
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-2 focus:border-blue-500 outline-none font-mono text-xs h-32"
                        value={formData.config}
                        onChange={e => setFormData({ ...formData, config: e.target.value })}
                    />
                    <p className="text-xs text-neutral-500">Paste your video generation config here.</p>
                </div>
            </div>

            <div className="flex justify-end gap-4 border-t border-neutral-800 pt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Publish Template
                </button>
            </div>
        </form>
    );
}
