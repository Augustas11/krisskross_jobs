"use client";

import { Video, ThumbsUp, RefreshCw, ArrowRight, TrendingUp } from "lucide-react";

interface CreatorVideo {
    id: string;
    tiktok_video_id: string;
    tiktok_url: string;
    thumbnail_url: string;
    caption: string;
    views: number;
    likes: number;
    engagement_rate: number;
    hook_effectiveness_score?: number;
}

import { useTikTokConnection } from "@/hooks/creator/useTikTokConnection";
import { EmptyState } from "./EmptyState";

export function TikTokLibrary({ videos, isSyncing: initialSyncing }: { videos: CreatorVideo[], isSyncing?: boolean }) {
    const { syncConnection, isSyncing } = useTikTokConnection(false);

    // Use either prop or hook state
    const syncing = initialSyncing || isSyncing;

    if (videos.length === 0) {
        return (
            <div className="mt-12">
                <EmptyState
                    icon={<Video size={32} />}
                    title="No videos synced yet"
                    description="Create your first AI video to build your portfolio and attract brands."
                    action={{
                        label: "Try Free AI Tool",
                        href: "/pipeline"
                    }}
                />
            </div>
        );
    }

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-brand-dark flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Your TikTok Content
                </h3>
                <button
                    onClick={() => syncConnection()}
                    disabled={syncing}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-dark transition-colors disabled:opacity-50"
                >
                    <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
                    {syncing ? "Syncing..." : "Sync Now"}
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {videos.map((video) => (
                    <div key={video.id} className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img
                            src={video.thumbnail_url}
                            alt={video.caption}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg">
                            {new Intl.NumberFormat('en-US', { notation: "compact" }).format(video.views)}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <p className="text-white text-[10px] font-bold line-clamp-2 mb-2">
                                {video.caption || "No caption"}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-white/80 text-[10px] font-black">
                                    <ThumbsUp size={10} />
                                    {new Intl.NumberFormat('en-US', { notation: "compact" }).format(video.likes)}
                                </div>
                                <div className="flex items-center gap-1 text-primary text-[10px] font-black">
                                    <RefreshCw size={10} />
                                    Create Variant
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* View More Card */}
                <button className="aspect-[9/16] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Full Library</span>
                </button>
            </div>

            <div className="mt-6 flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <TrendingUp size={16} />
                    </div>
                    <p className="text-sm font-bold text-slate-700">
                        Your top video got <span className="text-green-600">22.1K views</span>! Create AI variations to scale your success.
                    </p>
                </div>
                <button className="text-xs font-black text-primary hover:underline">
                    Scale Results →
                </button>
            </div>
        </section>
    );
}


