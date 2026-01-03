'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, User, ShoppingBag } from 'lucide-react';
import { Template } from '@/types';

interface TemplateCardProps {
    template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <Link href={`/marketplace/${template.id}`} className="group block h-full">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-600 transition-all duration-300 h-full flex flex-col shadow-lg hover:shadow-xl">
                {/* Media Preview */}
                <div
                    className="relative aspect-[9/16] bg-black overflow-hidden"
                    onMouseEnter={() => setIsPlaying(true)}
                    onMouseLeave={() => setIsPlaying(false)}
                >
                    {isPlaying ? (
                        <video
                            src={template.preview_video_url}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : (
                        <img
                            src={template.thumbnail_url}
                            alt={template.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                    )}

                    {/* Overlay Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 text-xs text-white border border-white/10">
                        <ShoppingBag className="w-3 h-3" />
                        <span>{template.purchase_count}</span>
                    </div>

                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                                <Play className="w-5 h-5 text-white fill-white" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                            {template.name}
                        </h3>
                        <span className="text-sm font-medium text-emerald-400 flex items-center">
                            ${template.price_usd}
                        </span>
                    </div>

                    <div className="mt-auto pt-3 flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                                <User className="w-3 h-3" />
                            </div>
                            <span className="truncate max-w-[100px]">
                                {template.creator?.email ? template.creator.email.split('@')[0] : 'Creator'}
                            </span>
                        </div>
                        <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                            {template.category}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
