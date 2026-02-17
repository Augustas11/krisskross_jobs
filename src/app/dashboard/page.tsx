import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Briefcase, FileText, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import CreatorDashboard from "@/components/dashboard/CreatorDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const role = (user.publicMetadata as { role?: string })?.role;
    const firstName = user.firstName || "there";

    // Employer View (Unchanged)
    if (role === "employer") {
        return (
            <div>
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-brand-dark mb-1">
                        Welcome back, {firstName} 👋
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Manage your job listings and review applications.
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <Link
                        href="/employer/post-job"
                        className="group flex items-center gap-4 rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-brand-dark">Post a Job</p>
                            <p className="text-sm text-slate-400">Create a new listing</p>
                        </div>
                        <ArrowRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                        href="/employer/listings"
                        className="group flex items-center gap-4 rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                            <Briefcase className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-brand-dark">My Listings</p>
                            <p className="text-sm text-slate-400">Manage your jobs</p>
                        </div>
                        <ArrowRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                    <Link
                        href="/employer/applications"
                        className="group flex items-center gap-4 rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-500">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-brand-dark">Applications</p>
                            <p className="text-sm text-slate-400">Review candidates</p>
                        </div>
                        <ArrowRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                    </Link>
                </div>
            </div>
        );
    }

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
