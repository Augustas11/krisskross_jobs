import { User } from "@clerk/nextjs/server";
import { Link, Video, TrendingUp, Users, Eye, ThumbsUp, MessageSquare, Share2 } from "lucide-react";

interface CreatorProfile {
    // Basic
    full_name: string;
    // TikTok
    tiktok_connected: boolean;
    tiktok_username?: string;
    tiktok_followers?: number;
    tiktok_verified?: boolean;
    // Score
    creator_score?: number;
    avg_engagement_rate?: number;
    avg_views_per_video?: number;
    total_videos_analyzed?: number;
}

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

export default function CreatorDashboard({
    user,
    profile,
    videos
}: {
    user: User,
    profile: CreatorProfile | null,
    videos: CreatorVideo[]
}) {
    if (!profile) {
        return (
            <div className="p-8 text-center border border-slate-200 rounded-2xl bg-white">
                <h2 className="text-xl font-bold text-brand-dark mb-2">Setting up your profile...</h2>
                <p className="text-slate-500">We are syncing your data. Please refresh in a moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Creator Score Card */}
                <div className="bg-gradient-to-br from-brand-dark to-blue-900 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <TrendingUp size={100} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-blue-200 font-medium text-sm mb-1">Creator Score</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-4xl font-black">{profile.creator_score || 0}</h2>
                            <span className="text-blue-200 text-sm">/ 100</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-blue-100">
                            <span>Based on {profile.total_videos_analyzed || 0} videos</span>
                        </div>
                    </div>
                </div>

                {/* Engagement Rate */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <ThumbsUp size={18} />
                        <span className="font-medium text-sm">Avg. Engagement</span>
                    </div>
                    <h2 className="text-3xl font-black text-brand-dark">
                        {profile.avg_engagement_rate ? `${Number(profile.avg_engagement_rate).toFixed(1)}%` : "0%"}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2">vs. Global Avg (4.2%)</p>
                </div>

                {/* Followers */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <Users size={18} />
                        <span className="font-medium text-sm">Audience</span>
                    </div>
                    <h2 className="text-3xl font-black text-brand-dark">
                        {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(profile.tiktok_followers || 0)}
                    </h2>
                    {profile.tiktok_username && (
                        <p className="text-xs text-slate-400 mt-2">@{profile.tiktok_username}</p>
                    )}
                </div>

                {/* Avg Views */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-2 text-slate-500">
                        <Eye size={18} />
                        <span className="font-medium text-sm">Avg. Views</span>
                    </div>
                    <h2 className="text-3xl font-black text-brand-dark">
                        {new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(profile.avg_views_per_video || 0)}
                    </h2>
                    <p className="text-xs text-slate-400 mt-2">Per video (last 20)</p>
                </div>
            </div>

            {/* Video Portfolio */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-brand-dark flex items-center gap-2">
                        <Video size={24} className="text-primary" />
                        Synced Content
                    </h3>
                    <button className="text-sm font-bold text-slate-500 hover:text-brand-dark transition-colors">
                        Refresh
                    </button>
                </div>

                {videos.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 font-medium">No videos synced yet.</p>
                        {profile.tiktok_connected && (
                            <p className="text-sm text-slate-400 mt-2">Wait for the background sync to complete.</p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {videos.map((video) => (
                            <div key={video.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:border-primary/20">
                                <div className="aspect-[9/16] bg-slate-100 relative overflow-hidden">
                                    {video.thumbnail_url ? (
                                        <img src={video.thumbnail_url} alt="Video thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-lg">
                                        {video.engagement_rate.toFixed(1)}% ER
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                        <p className="text-white text-sm font-medium line-clamp-2">
                                            {video.caption || "No caption"}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-4 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                                    <div className="flex flex-col items-center gap-1">
                                        <Eye size={14} />
                                        <span>{new Intl.NumberFormat('en-US', { notation: "compact" }).format(video.views)}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <ThumbsUp size={14} />
                                        <span>{new Intl.NumberFormat('en-US', { notation: "compact" }).format(video.likes)}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="font-bold text-primary">{video.hook_effectiveness_score || "-"}</div>
                                        <span>Hook Score</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
