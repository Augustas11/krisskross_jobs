import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Briefcase, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EmployerListingsPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-8">
            <div className="mx-auto max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-brand-dark mb-1">My Job Listings</h1>
                        <p className="text-slate-500 font-medium">Manage your posted jobs</p>
                    </div>
                    <Link
                        href="/employer/post-job"
                        className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus className="h-4 w-4" /> Post a Job
                    </Link>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 mb-4">
                        <Briefcase className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">No listings yet</h3>
                    <p className="text-slate-400 font-medium text-sm mb-6">Post your first job to start receiving applications from AI creators.</p>
                    <Link
                        href="/employer/post-job"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand-dark px-5 py-2.5 text-sm font-bold text-white hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus className="h-4 w-4" /> Create Your First Listing
                    </Link>
                </div>
            </div>
        </div>
    );
}
