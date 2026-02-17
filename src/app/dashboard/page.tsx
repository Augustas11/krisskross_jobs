import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CreatorDashboard from "@/components/dashboard/CreatorDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const firstName = user.firstName || "there";

    // Creator View (Fetch Data)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch Profile
    const { data: profile } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("clerk_user_id", user.id)
        .single();

    // Fetch Videos if profile exists
    let videos: any[] = [];
    if (profile) {
        const { data } = await supabase
            .from("creator_videos")
            .select("*")
            .eq("creator_id", profile.id)
            .order("posted_at", { ascending: false })
            .limit(20);
        videos = data || [];
    }

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark mb-1">
                        Creator Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Welcome back, {firstName}. Here are your latest insights.
                    </p>
                </div>
                {!profile?.tiktok_connected && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                        <span>⚠️ TikTok not connected</span>
                    </div>
                )}
            </div>

            <CreatorDashboard
                user={user}
                profile={profile}
                videos={videos}
            />
        </div>
    );
}
