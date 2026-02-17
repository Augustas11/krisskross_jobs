import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";


export default async function PostJobPage() {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-slate-50/50 p-8">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-brand-dark mb-1">Post a Job</h1>
                    <p className="text-slate-500 font-medium">Create a new AI content creation listing</p>
                </div>

                <div className="rounded-2xl bg-white border border-slate-200 p-8">
                    <p className="text-slate-400 font-medium text-sm text-center py-12">
                        Job posting form coming soon. This is where employers will create new job listings.
                    </p>
                </div>
            </div>
        </div>
    );
}
