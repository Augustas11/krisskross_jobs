import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export const dynamic = "force-dynamic";


export default async function SeekerProfilePage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-brand-dark mb-1">My Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your resume and portfolio</p>
                </div>

                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="rounded-2xl bg-white border border-slate-200 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                <User className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-brand-dark">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <p className="text-slate-400 font-medium text-sm">
                                    {user.emailAddresses[0]?.emailAddress}
                                </p>
                            </div>
                        </div>
                        <p className="text-slate-400 font-medium text-sm">
                            Profile editing and resume upload coming soon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
