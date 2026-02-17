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

    // Connect to Supabase with Admin rights for profile check
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch Profile with new fields
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

    // Determine loading/syncing state
    // If profile is missing or recently created but tiktok sync hasn't Finished
    const isSyncing = profile?.tiktok_connected && !profile.tiktok_username;

    return (
        <CreatorDashboard
            user={user}
            profile={profile}
            videos={videos}
            isLoading={isSyncing}
        />
    );
}
