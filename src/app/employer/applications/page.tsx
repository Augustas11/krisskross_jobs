import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";


export default async function EmployerApplicationsPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-brand-dark mb-1">Applications Received</h1>
                    <p className="text-slate-500 font-medium">Review and manage candidate applications</p>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 mb-4">
                        <Users className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark mb-2">No applications yet</h3>
                    <p className="text-slate-400 font-medium text-sm">Applications from creators will appear here once they apply to your listings.</p>
                </div>
            </div>
        </div>
    );
}
