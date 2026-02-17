'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Play, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Template } from '@/types';

interface TemplateSelectorProps {
    onSelect: (template: Template) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await fetch('/api/templates?status=active&limit=10');
                const data = await res.json();
                if (res.ok && data.templates) {
                    setTemplates(data.templates);
                }
            } catch (error) {
                console.error('Failed to load templates', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    if (loading) return (
        <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading templates...
        </div>
    );

    if (templates.length === 0) return null;

    return (
        <div className="mb-8 overflow-hidden">
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-brand-dark/5 rounded-lg">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-black text-brand-dark uppercase tracking-widest">Start with a Template</span>
                </div>
                <Link href="/marketplace" className="text-xs font-bold text-primary hover:text-brand-dark transition-colors flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template)}
                        className="group relative flex-shrink-0 w-48 aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50 snap-start text-left focus:outline-none focus:ring-4 focus:ring-primary/20"
                    >
                        <img
                            src={template.thumbnail_url}
                            alt={template.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                            <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                                {template.name}
                            </h3>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
                                    ${template.price_usd}
                                </span>
                                <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <Play className="w-3 h-3 text-white fill-current" />
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
