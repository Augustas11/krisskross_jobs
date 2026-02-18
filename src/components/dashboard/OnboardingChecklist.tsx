"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface OnboardingChecklistProps {
    steps: {
        tiktok_connected: boolean;
        first_video_created: boolean;
        portfolio_samples_added: boolean;
        rates_set: boolean;
        bio_completed: boolean;
    };
}

export function OnboardingChecklist({ steps }: OnboardingChecklistProps) {
    const checklistItems = [
        {
            key: "tiktok_connected",
            label: "Connect TikTok account",
            href: "/dashboard/settings", // or handle trigger
            completed: steps.tiktok_connected
        },
        {
            key: "first_video_created",
            label: "Create your first AI video (use Free Tool)",
            href: "/pipeline",
            completed: steps.first_video_created
        },
        {
            key: "portfolio_samples_added",
            label: "Add 3 portfolio samples",
            href: "/dashboard/portfolio",
            completed: steps.portfolio_samples_added
        },
        {
            key: "rates_set",
            label: "Set your rates and availability",
            href: "/dashboard/settings",
            completed: steps.rates_set
        },
        {
            key: "bio_completed",
            label: "Complete your creator bio",
            href: "/dashboard/profile",
            completed: steps.bio_completed
        }
    ];

    const completedCount = checklistItems.filter(i => i.completed).length;
    const totalCount = checklistItems.length;
    const progress = Math.round((completedCount / totalCount) * 100);

    if (completedCount === totalCount) return null;

    return (
        <section className="bg-white rounded-[32px] border border-slate-200 p-8 mt-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-brand-dark flex items-center gap-3">
                        <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                        Getting Started
                    </h3>
                    <p className="text-slate-500 font-medium text-sm mt-2">
                        Complete these steps to start receiving job offers from brands.
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <span className="text-2xl font-black text-brand-dark">{progress}%</span>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complete</p>
                </div>
            </div>

            <div className="space-y-4">
                {checklistItems.map((item, index) => (
                    <Link
                        key={item.key}
                        href={item.key === 'tiktok_connected' && item.completed ? '#' : item.href}
                        className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${item.completed
                                ? "bg-green-50 border-green-100 opacity-60"
                                : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            {item.completed ? (
                                <div className="text-green-500">
                                    <CheckCircle2 size={24} fill="currentColor" className="text-white" />
                                </div>
                            ) : (
                                <div className="text-slate-200 group-hover:text-slate-300 transition-colors">
                                    <Circle size={24} />
                                </div>
                            )}

                            <span className={`font-bold ${item.completed ? "text-green-800 line-through decoration-green-800/20" : "text-brand-dark"}`}>
                                {item.label}
                            </span>
                        </div>

                        {!item.completed && (
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                                <ArrowRight size={16} />
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mr-4 md:hidden">
                    <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <button className="whitespace-nowrap flex items-center gap-2 text-primary font-black text-sm hover:gap-3 transition-all ml-auto">
                    Continue Setup <ArrowRight size={16} />
                </button>
            </div>
        </section>
    );
}
