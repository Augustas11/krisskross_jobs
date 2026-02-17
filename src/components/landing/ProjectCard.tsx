"use client";

import { Play, Clock, Wand2, MonitorPlay, TrendingDown, Eye, Sliders } from "lucide-react";
import { useState } from "react";

// Map string icon names to Lucide components
const iconMap = {
    clock: Clock,
    wand: Wand2,
    play: MonitorPlay,
    trending: TrendingDown,
    eye: Eye,
    sliders: Sliders,
};

export interface ProjectStats {
    icon: keyof typeof iconMap;
    label: string;
    value: string;
    detail: string;
}

export interface ProjectTestimonial {
    quote: string;
    name: string;
    role: string;
}

export interface ProjectData {
    number: number;
    title: string;
    tiktokVideoId: string;
    tiktokUrl: string;
    stats: ProjectStats[];
    testimonial: ProjectTestimonial | null;
}

export function ProjectCard({ project }: { project: ProjectData }) {
    const [isVideoLoaded, setIsVideoLoaded] = useState(true); // Default to true, handle error if needed

    const IconComponent = (name: keyof typeof iconMap) => {
        const Icon = iconMap[name];
        return Icon ? <Icon className="w-5 h-5 text-primary" /> : null;
    };

    return (
        <div className="flex flex-col items-center max-w-[900px] mx-auto w-full space-y-10">
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl">
                <div className="inline-block px-3 py-1 rounded-md bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Project #{project.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    {project.title}
                </h3>
            </div>

            {/* Video Embed */}
            <div className="w-full flex justify-center">
                <div
                    className="relative w-full max-w-[340px] aspect-[9/16] bg-black rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.01] duration-300 transform-gpu"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                >
                    {/* Fallback / Overlay while loading could go here, but iframe handles itself mostly */}
                    <iframe
                        src={`https://www.tiktok.com/embed/v2/${project.tiktokVideoId}`}
                        className="w-full h-full border-0"
                        allow="encrypted-media;"
                        title={`TikTok Video ${project.number}`}
                        onError={() => setIsVideoLoaded(false)}
                    ></iframe>

                    {/* Fallback if iframe fails or is blocked */}
                    {!isVideoLoaded && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                            <Play className="w-12 h-12 mb-4 opacity-80" />
                            <p className="font-bold mb-2">Video unavailable</p>
                            <a
                                href={project.tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-400 hover:underline"
                            >
                                Watch on TikTok
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="grid gap-6">
                    {project.stats.map((stat, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                            <div className="p-2.5 bg-blue-50 rounded-xl shrink-0">
                                {IconComponent(stat.icon)}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{stat.value}</p>
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                                    <span className="text-sm font-semibold text-gray-600">{stat.label}</span>
                                    {stat.detail && (
                                        <span className="text-xs text-gray-400 hidden sm:inline">• {stat.detail}</span>
                                    )}
                                </div>
                                {stat.detail && (
                                    <p className="text-xs text-gray-400 sm:hidden mt-0.5">{stat.detail}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonial */}
            {project.testimonial && (
                <div className="w-full max-w-2xl">
                    <blockquote className="border-l-4 border-primary pl-6 py-2">
                        <p className="italic text-gray-600 text-lg md:text-xl leading-relaxed mb-4">
                            "{project.testimonial.quote}"
                        </p>
                        <footer className="flex items-center gap-3 not-italic">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-400">
                                {project.testimonial.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900 text-sm">{project.testimonial.name}</div>
                                <div className="text-xs text-gray-500">{project.testimonial.role}</div>
                            </div>
                        </footer>
                    </blockquote>
                </div>
            )}
        </div>
    );
}
