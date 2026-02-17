"use client";

import { useState, useEffect, useRef } from "react";
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

function VideoItem({ src }: { src: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePlay = (e: React.MouseEvent) => {
        // Prevent event bubbling if needed, though here strictly strictly controlling the video
        e.preventDefault();

        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setIsPlaying(true);
                    }).catch((error: unknown) => {
                        console.log("Play prevented:", error);
                    });
                }
            }
        }
    };

    const handleMouseEnter = () => {
        if (videoRef.current && !isPlaying) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    // Ignore autoplay errors on hover
                });
            }
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    // Ensure we have a valid video source with a timestamp for thumbnail generation if possible
    // Note: appending #t=0.001 forces browser to seek and render first frame
    const videoSrc = src.includes('#') ? src : `${src}#t=0.001`;

    return (
        <div
            className="relative h-full w-full cursor-pointer"
            onClick={togglePlay}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={videoSrc}
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
            />
            {/* Play Button Overlay - Visible when not playing */}
            <div className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-all duration-500 pointer-events-none ${isPlaying ? 'opacity-0' : 'opacity-100 bg-black/20'}`}>
                <div className={`h-20 w-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-all duration-500 ${isPlaying ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
                    <Play className="h-10 w-10 text-white fill-white" />
                </div>
            </div>
        </div>
    );
}

export default function CommunityFeed() {
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 12;

    useEffect(() => {
        fetchGenerations(1);
    }, []);

    const fetchGenerations = async (pageNum: number) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const res = await fetch(`/api/generations?page=${pageNum}&limit=${limit}`);
            const data = await res.json();
            if (res.ok) {
                if (pageNum === 1) {
                    setGenerations(data.generations || []);
                } else {
                    setGenerations(prev => [...prev, ...(data.generations || [])]);
                }
                setTotalPages(data.totalPages || 0);
                setTotalCount(data.total || 0);
                setPage(pageNum);
            }
        } catch (error) {
            console.error("Failed to fetch generations:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const handleLoadMore = () => {
        if (page < totalPages) {
            fetchGenerations(page + 1);
        }
    };

    return (
        <section id="community-feed" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-20">
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary mb-6">
                    <Users className="h-4 w-4" /> Live Community Feed
                </div>
                <h2 className="text-4xl font-black text-brand-dark md:text-6xl mb-6 tracking-tight">Community Feed</h2>
                <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto">See what other creators are building with KrissKross Creators</p>

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
                                key={`${gen.id}-${idx}`}
                                className="group relative aspect-[9/16] rounded-[2.5rem] overflow-hidden bg-brand-dark shadow-xl transition-all hover:-translate-y-4 hover:shadow-2xl hover:shadow-primary/20 border border-slate-200"
                            >
                                {/* Media Content */}
                                <div className="absolute inset-0 w-full h-full bg-slate-100">
                                    {gen.type === "video" ? (
                                        <div className="relative h-full w-full">
                                            <VideoItem src={gen.internal_url || gen.external_url || ""} />
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 pointer-events-none">
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
                                        &quot;{gen.prompt}&quot;
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

                    {/* Load More Button */}
                    {page < totalPages && (
                        <div className="mt-20 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="group relative overflow-hidden rounded-full bg-white border-2 border-slate-100 px-10 py-5 text-sm font-black text-slate-600 shadow-xl shadow-slate-200/50 transition-all hover:-translate-y-1 hover:border-primary hover:text-primary active:scale-95 disabled:opacity-50"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {loadingMore ? "Loading..." : "Load More Assets"}
                                    {!loadingMore && <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
