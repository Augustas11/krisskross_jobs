import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Template } from '@/types';
import { TemplateActionPanel } from '@/components/marketplace/TemplateActionPanel';

export const dynamic = 'force-dynamic';

async function getTemplate(id: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/templates/${id}`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch template');
        }
        return res.json();
    } catch (error) {
        console.error('Error fetching template:', error);
        return null;
    }
}

export default async function TemplateDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const template: Template | null = await getTemplate(id);

    if (!template) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Back Nav */}
                <Link href="/marketplace" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left: Video Preview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-[16/9] w-full bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
                            <video
                                src={template.preview_video_url}
                                poster={template.thumbnail_url}
                                className="w-full h-full object-contain bg-black"
                                controls
                                playsInline
                                loop
                            />
                        </div>

                        {/* Description & Config */}
                        <div className="space-y-6">
                            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
                                <h2 className="text-xl font-semibold mb-4">Description</h2>
                                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                                    {template.description || 'No description provided.'}
                                </p>
                            </div>

                            <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
                                <h2 className="text-xl font-semibold mb-4">Configuration Preview</h2>
                                <div className="bg-black/50 p-4 rounded-lg overflow-x-auto">
                                    <pre className="text-xs text-green-400 font-mono">
                                        {JSON.stringify(template.config, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Metadata & Action */}
                    <div className="lg:col-span-1 space-y-6">
                        <TemplateActionPanel template={template} />
                    </div>
                </div>
            </div>
        </div>
    );
}
