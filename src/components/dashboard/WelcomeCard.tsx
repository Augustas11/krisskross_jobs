"use client";

import { CheckCircle2, TrendingUp, Users, Video, DollarSign, ArrowRight } from "lucide-react";

interface CreatorProfile {
    full_name: string;
    tiktok_connected: boolean;
    tiktok_username?: string;
    tiktok_followers?: number;
    tiktok_avatar_url?: string;
    creator_score?: number;
    avg_engagement_rate?: number;
    avg_views_per_video?: number;
    total_videos_analyzed?: number;
    onboarding_steps?: any;
    onboarded?: boolean;
}

export function WelcomeCard({ profile }: { profile: CreatorProfile }) {
    // Calculate onboarding progress
    const steps = profile.onboarding_steps || {
        tiktok_connected: profile.tiktok_connected,
        first_video_created: false,
        portfolio_samples_added: false,
        rates_set: false,
        bio_completed: false
    };

    const completedCount = Object.values(steps).filter(Boolean).length;
    const totalSteps = Object.keys(steps).length;
    const progressPercent = Math.round((completedCount / totalSteps) * 100);

    return (
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    {/* Left: Identity */}
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50">
                                {profile.tiktok_avatar_url ? (
                                    <img
                                        src={profile.tiktok_avatar_url}
                                        alt={profile.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-2xl">
                                        {profile.full_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            {profile.tiktok_connected && (
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-50" />
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-brand-dark">
                                👋 Welcome, {profile.tiktok_username || profile.full_name.split(' ')[0]}!
                            </h2>
                            <div className="flex items-center gap-3 mt-1">
                                {profile.tiktok_username && (
                                    <span className="text-slate-500 font-medium text-sm">@{profile.tiktok_username}</span>
                                )}
                                {profile.tiktok_followers !== undefined && (
                                    <>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <span className="text-slate-500 font-medium text-sm">
                                            {new Intl.NumberFormat('en-US', { notation: "compact" }).format(profile.tiktok_followers)} followers
                                        </span>
                                    </>
                                )}
                                {profile.tiktok_connected && (
                                    <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Stats */}
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 min-w-[120px]">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Earned</p>
                            <div className="flex items-center gap-1 text-brand-dark font-black text-xl">
                                <DollarSign size={18} className="text-green-500" />
                                <span>0.00</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 min-w-[120px]">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Jobs Done</p>
                            <div className="flex items-center gap-2 text-brand-dark font-black text-xl">
                                <Briefcase size={18} className="text-blue-500" />
                                <span>0</span>
                            </div>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 min-w-[120px]">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Videos</p>
                            <div className="flex items-center gap-2 text-brand-dark font-black text-xl">
                                <Video size={18} className="text-primary" />
                                <span>{profile.total_videos_analyzed || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Progress Bar */}
                {!profile.onboarded && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-slate-600">
                                Complete your profile to start receiving job offers
                            </p>
                            <span className="text-xs font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">
                                {progressPercent}% Done
                            </span>
                        </div>
                        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                        <button className="mt-4 flex items-center gap-2 text-primary text-sm font-bold hover:gap-3 transition-all">
                            Continue Setup <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

const Briefcase = ({ size, className }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);
