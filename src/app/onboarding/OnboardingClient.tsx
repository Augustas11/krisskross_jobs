"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { setUserRole, type UserRole } from "@/app/actions/setUserRole";
import { Briefcase, User, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingClient() {
    const router = useRouter();
    const { user } = useUser();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedRole) return;

        setIsSubmitting(true);
        try {
            await setUserRole(selectedRole);
            // Reload session to pick up new metadata
            await user?.reload();
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to set role:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50/50 p-6">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-primary font-bold text-sm mb-4">
                        <Sparkles className="h-4 w-4" /> Welcome to KrissKross Jobs
                    </div>
                    <h1 className="text-4xl font-black text-brand-dark mb-3">
                        How will you use KrissKross?
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">
                        Choose your role to get a personalized experience. You can always change this later.
                    </p>
                </div>

                {/* Role Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Job Seeker Card */}
                    <button
                        onClick={() => setSelectedRole("job_seeker")}
                        className={`group relative rounded-3xl border-2 p-8 text-left transition-all duration-200 cursor-pointer ${selectedRole === "job_seeker"
                                ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg"
                            }`}
                    >
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-5 transition-colors ${selectedRole === "job_seeker"
                                    ? "bg-primary text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                }`}
                        >
                            <User className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-black text-brand-dark mb-2">
                            Job Seeker
                        </h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                            Browse AI content creation jobs, apply to projects, and build your portfolio.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                                Browse &amp; apply to jobs
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                                Manage applications
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                                Upload resume &amp; portfolio
                            </li>
                        </ul>
                        {selectedRole === "job_seeker" && (
                            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                        )}
                    </button>

                    {/* Employer Card */}
                    <button
                        onClick={() => setSelectedRole("employer")}
                        className={`group relative rounded-3xl border-2 p-8 text-left transition-all duration-200 cursor-pointer ${selectedRole === "employer"
                                ? "border-primary bg-primary/5 shadow-xl shadow-primary/10 scale-[1.02]"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg"
                            }`}
                    >
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-5 transition-colors ${selectedRole === "employer"
                                    ? "bg-primary text-white"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                                }`}
                        >
                            <Briefcase className="h-7 w-7" />
                        </div>
                        <h3 className="text-xl font-black text-brand-dark mb-2">
                            Employer
                        </h3>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                            Post AI content jobs, review applicants, and manage your brand&apos;s content pipeline.
                        </p>
                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                                Post job listings
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                                Review applications
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                                Manage company profile
                            </li>
                        </ul>
                        {selectedRole === "employer" && (
                            <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                        )}
                    </button>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedRole || isSubmitting}
                        className={`inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-black text-white shadow-xl transition-all cursor-pointer ${selectedRole
                                ? "bg-brand-dark shadow-brand-dark/20 hover:scale-[1.02] active:scale-95"
                                : "bg-slate-300 shadow-none cursor-not-allowed"
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Setting up your account...
                            </>
                        ) : (
                            <>
                                Continue <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
