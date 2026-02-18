import { User } from "@clerk/nextjs/server";
import { WelcomeCard } from "./WelcomeCard";
import { QuickActions } from "./QuickActions";
import { AIToolsHub } from "./AIToolsHub";
import { TikTokLibrary } from "./TikTokLibrary";
import { JobRecommendations } from "./JobRecommendations";

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
    onboarded?: boolean;
    onboarding_steps?: any;
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

import { OnboardingChecklist } from "./OnboardingChecklist";

export default function CreatorDashboard({
    user,
    profile,
    videos,
    isLoading = false
}: {
    user: User,
    profile: CreatorProfile | null,
    videos: CreatorVideo[],
    isLoading?: boolean
}) {
    if (isLoading || !profile) {
        return <DashboardLoadingState />;
    }

    const showChecklist = !profile.onboarded;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            {/* 1. Welcome & Identity */}
            <WelcomeCard profile={profile} />

            {/* 2. Primary CTA: Start Earning */}
            <QuickActions />

            {/* 3. Onboarding Checklist (Priority if new) */}
            {showChecklist && (
                <OnboardingChecklist
                    steps={profile.onboarding_steps || {
                        tiktok_connected: profile.tiktok_connected,
                        first_video_created: false,
                        portfolio_samples_added: false,
                        rates_set: false,
                        bio_completed: false
                    }}
                />
            )}

            {/* 4. AI Tools Hub */}
            <AIToolsHub />

            {/* 5. Content Library (if connected) */}
            <TikTokLibrary videos={videos} />

            {/* 6. Career Opportunities */}
            <JobRecommendations />
        </div>
    );
}

function DashboardLoadingState() {
    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-pulse pb-24">
            {/* Welcome Skeleton */}
            <div className="h-[200px] bg-white rounded-3xl border border-slate-100 p-8">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl"></div>
                    <div className="space-y-3">
                        <div className="h-6 w-48 bg-slate-100 rounded-lg"></div>
                        <div className="h-4 w-32 bg-slate-100 rounded-lg"></div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-slate-50">
                    <div className="h-2 w-full bg-slate-50 rounded-full"></div>
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[240px] bg-slate-100 rounded-[32px]"></div>
                <div className="h-[240px] bg-slate-100 rounded-[32px]"></div>
            </div>

            {/* Tools Hub Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-[280px] bg-white rounded-3xl border border-slate-100"></div>
                <div className="h-[280px] bg-white rounded-3xl border border-slate-100"></div>
                <div className="h-[280px] bg-white rounded-3xl border border-slate-100"></div>
            </div>
        </div>
    );
}
