import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Briefcase, FileText, Plus, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const user = await currentUser();

    if (!user) {
        redirect("/sign-in");
    }

    const role = (user.publicMetadata as { role?: string })?.role;
    const firstName = user.firstName || "there";

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-brand-dark mb-1">
                    Welcome back, {firstName} 👋
                </h1>
                <p className="text-slate-500 font-medium">
                    {role === "employer"
                        ? "Manage your job listings and review applications."
                        : "Find your next opportunity and track your applications."}
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {role === "employer" ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <Link
                            href="/jobs"
                            className="group flex items-center gap-4 rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark">Browse Jobs</p>
                                <p className="text-sm text-slate-400">Find opportunities</p>
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                        </Link>
                        <Link
                            href="/seeker/applications"
                            className="group flex items-center gap-4 rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark">My Applications</p>
                                <p className="text-sm text-slate-400">Track your progress</p>
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                        </Link>
                        <Link
                            href="/seeker/profile"
                            className="group flex items-center gap-4 rounded-2xl bg-white border border-slate-200 p-6 hover:shadow-lg hover:border-primary/20 transition-all"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-500">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="font-bold text-brand-dark">My Profile</p>
                                <p className="text-sm text-slate-400">Resume &amp; portfolio</p>
                            </div>
                            <ArrowRight className="h-4 w-4 ml-auto text-slate-300 group-hover:text-primary transition-colors" />
                        </Link>
                    </>
                )}
            </div>

            {/* Activity placeholder */}
            <div className="rounded-2xl bg-white border border-slate-200 p-8">
                <h2 className="text-lg font-black text-brand-dark mb-2">
                    Recent Activity
                </h2>
                <p className="text-slate-400 font-medium text-sm">
                    Your recent activity will appear here once you start using the platform.
                </p>
            </div>
        </div>
    );
}
