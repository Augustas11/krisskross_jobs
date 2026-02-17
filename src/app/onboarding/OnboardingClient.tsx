"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { setUserRole } from "@/app/actions/setUserRole";
import { Palette, ArrowRight, Sparkles } from "lucide-react";

export default function OnboardingClient() {
    const router = useRouter();
    const { user } = useUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await setUserRole("creator");
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
            <div className="w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-2 text-primary font-bold text-sm mb-4">
                        <Sparkles className="h-4 w-4" /> Welcome to KrissKross Creators
                    </div>
                    <h1 className="text-4xl font-black text-brand-dark mb-3">
                        Ready to create?
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-md mx-auto">
                        Set up your creator account to start building your portfolio and earning from AI content projects.
                    </p>
                </div>

                {/* Creator Card */}
                <div className="rounded-3xl border-2 border-primary bg-primary/5 shadow-xl shadow-primary/10 p-8 text-left mb-8">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-5 bg-primary text-white">
                        <Palette className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-black text-brand-dark mb-2">
                        Creator Account
                    </h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-4">
                        Create AI-powered product videos and images for brands. Build your portfolio and get paid for your work.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                            Access AI generation tools
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                            Build &amp; showcase your portfolio
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                            Get paid for completed projects
                        </li>
                    </ul>
                    <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-black text-white shadow-xl transition-all cursor-pointer bg-brand-dark shadow-brand-dark/20 hover:scale-[1.02] active:scale-95"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Setting up your account...
                            </>
                        ) : (
                            <>
                                Get Started <ArrowRight className="h-5 w-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
