'use client';

import React, { useEffect, useState } from 'react';
import { Template } from '@/types';
import { TemplateService } from '@/lib/services/templateService';
import { Sparkles, ChevronRight, Loader2, Play } from 'lucide-react';

interface TemplatesSectionProps {
    onTemplateSelect: (template: Template) => void;
    limit?: number;
    showFilters?: boolean;
}

export function TemplatesSection({
    onTemplateSelect,
    limit = 6,
    showFilters = false
}: TemplatesSectionProps) {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        fetchTemplates();
    }, [activeCategory, limit]);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const data = await TemplateService.getFeaturedTemplates(limit);
            setTemplates(data);
        } catch (error) {
            console.error('Failed to load templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateClick = (template: Template) => {
        // Track analytics
        TemplateService.trackTemplateUse(template.id);
        // Call parent handler
        onTemplateSelect(template);
    };

    if (loading) {
        return (
            <section className="mx-auto max-w-7xl px-6 py-16 bg-slate-50">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (templates.length === 0) {
        return null;
    }

    return (
        <section id="popular-templates" className="mx-auto max-w-7xl px-6 py-20 bg-slate-50 scroll-mt-20">
            {/* Section Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary mb-6">
                    <Sparkles className="h-4 w-4" />
                    Popular Templates
                </div>
                <h2 className="text-4xl font-black text-brand-dark md:text-5xl mb-4">
                    Start with Settings That Work
                </h2>
                <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                    Used by 1,000+ creators to make professional videos in minutes
                </p>
            </div>

            {/* Category Filters (if enabled) */}
            {showFilters && (
                <div className="flex items-center justify-center gap-3 mb-12">
                    {['all', 'Fashion', 'Lifestyle', 'Kids'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category.toLowerCase())}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeCategory === category.toLowerCase()
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white text-slate-600 border-2 border-slate-200 hover:border-primary/50'
                                }`}
                        >
                            {category === 'all' ? 'All Templates' : category}
                        </button>
                    ))}
                </div>
            )}

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((template) => (
                    <TemplateCardPreview
                        key={template.id}
                        template={template}
                        onClick={() => handleTemplateClick(template)}
                    />
                ))}
            </div>

            {/* View All CTA */}
            <div className="text-center mt-12">
                <a
                    href="/marketplace"
                    className="inline-flex items-center gap-2 text-lg font-bold text-primary hover:text-brand-dark transition-colors"
                >
                    Browse All Templates
                    <ChevronRight className="h-5 w-5" />
                </a>
            </div>
        </section>
    );
}

// Template Card Component
interface TemplateCardPreviewProps {
    template: Template;
    onClick: () => void;
}

function TemplateCardPreview({ template, onClick }: TemplateCardPreviewProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 text-left"
        >
            {/* Video/Thumbnail Preview */}
            <div className="relative aspect-[9/16] bg-slate-900 overflow-hidden">
                {isHovered && template.preview_video_url ? (
                    <video
                        src={template.preview_video_url}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <img
                        src={template.thumbnail_url}
                        alt={template.name}
                        className="absolute inset-0 w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                    />
                )}


                {/* Featured Badge */}
                {(template as any).is_featured && (
                    <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Popular
                    </div>
                )}

                {/* Purchase Count Badge */}
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
                    {template.purchase_count} uses
                </div>

                {/* Play Icon Overlay */}
                {!isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <Play className="w-6 h-6 text-white fill-current" />
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                        {template.name}
                    </h3>
                    <div className="text-lg font-black text-emerald-500 ml-3">
                        ${template.price_usd}
                    </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags?.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-500">{template.category}</span>
                        <span className="text-sm font-black text-primary group-hover:translate-x-1 transition-transform">
                            Use Template →
                        </span>
                    </div>
                </div>
            </div>
        </button>
    );
}
