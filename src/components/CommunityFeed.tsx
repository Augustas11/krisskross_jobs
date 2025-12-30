"use client";

import { useState, useEffect } from "react";
import { Video, ImageIcon, ChevronLeft, ChevronRight, Play, Users } from "lucide-react";

interface Generation {
    id: string;
    type: "video" | "image";
    prompt: string;
    internal_url: string | null;
    external_url: string | null;
    created_at: string;
    status: string;
}

export default function CommunityFeed() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 9;

    useEffect(() => {
        fetchGenerations();
    }, [page]);

    const fetchGenerations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/generations?page=${page}&limit=${limit}`);
            const data = await res.json();
            if (res.ok) {
                setGenerations(data.generations || []);
                setTotalPages(data.totalPages || 0);
                setTotalCount(data.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch generations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <section id="community-feed" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-20">
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary mb-6">
                    <Users className="h-4 w-4" /> Live Community Feed
                </div>
                <h2 className="text-4xl font-black text-brand-dark md:text-6xl mb-6 tracking-tight">Community Feed</h2>
                <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto">See what other creators are building with KrissKross AI</p>

                <div className="mt-10">
                    <a
                        href="https://t.me/+v-iHGWmI5f5hMzM8"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-full bg-primary px-10 py-4 text-sm font-black text-white shadow-2xl shadow-primary/30 hover:scale-105 hover:bg-primary/90 transition-all active:scale-95 text-center"
                    >
                        Join KrissKross Creators community
                    </a>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="aspect-[9/16] rounded-[2.5rem] bg-slate-100 animate-pulse border border-slate-200"></div>
                    ))}
                </div>
            ) : generations.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold">No community generations yet. Be the first!</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {generations.map((gen, idx) => (
                            <div
                                key={gen.id}
                                className="group relative aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-brand-dark shadow-xl transition-all hover:-translate-y-4 hover:shadow-2xl hover:shadow-primary/20 border border-slate-200"
                            >
                                {/* Media Content */}
                                <div className="absolute inset-0 w-full h-full bg-slate-100">
                                    {gen.type === "video" ? (
                                        <div className="relative h-full w-full">
                                            <video
                                                src={gen.internal_url || gen.external_url || ""}
                                                className="h-full w-full object-cover"
                                                loop
                                                muted
                                                playsInline
                                                onMouseOver={(e) => e.currentTarget.play()}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.pause();
                                                    e.currentTarget.currentTime = 0;
                                                }}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all duration-500">
                                                <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                                                    <Play className="h-10 w-10 text-white fill-white" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <img
                                            src={gen.internal_url || gen.external_url || ""}
                                            alt={gen.prompt}
                                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    )}
                                </div>

                                {/* Info Overlay (appears on hover) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-8 w-8 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
                                            {gen.type === "video" ? (
                                                <Video className="h-4 w-4 text-primary" />
                                            ) : (
                                                <ImageIcon className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                                            {gen.type === "video" ? "Motion Render" : "Visual Render"}
                                        </span>
                                    </div>
                                    <p className="text-white text-lg font-bold line-clamp-3 leading-relaxed mb-4 italic text-slate-200">
                                        "{gen.prompt}"
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pt-4 border-t border-white/10">
                                        <span>Generated</span>
                                        <span className="h-1 w-1 rounded-full bg-slate-600"></span>
                                        <span>{new Date(gen.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Type Tag (always visible) */}
                                <div className="absolute top-8 left-8">
                                    <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg">
                                        {gen.type}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-24 flex items-center justify-center gap-4">
                            <button
                                onClick={handlePrevPage}
                                disabled={page === 1}
                                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:text-slate-600 transition-all shadow-xl shadow-slate-200/50 active:scale-90"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>

                            <div className="flex items-center gap-2 bg-white p-2 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                                {[...Array(totalPages)].map((_, i) => {
                                    const p = i + 1;
                                    if (totalPages > 5 && Math.abs(p - page) > 1 && p !== 1 && p !== totalPages) {
                                        if (Math.abs(p - page) === 2) return <span key={p} className="px-2 text-slate-300">...</span>;
                                        return null;
                                    }
                                    return (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`h-12 min-w-[3rem] px-4 rounded-2xl font-black text-sm transition-all ${page === p
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-slate-500 hover:bg-slate-50"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={handleNextPage}
                                disabled={page === totalPages}
                                className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:text-slate-600 transition-all shadow-xl shadow-slate-200/50 active:scale-90"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
