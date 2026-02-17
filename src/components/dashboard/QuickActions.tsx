"use client";

import Link from "next/link";
import { Briefcase, Zap, ArrowUpRight } from "lucide-react";

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Action 1: Browse Jobs */}
            <Link
                href="/dashboard/jobs"
                className="group relative bg-[#1E293B] rounded-[32px] p-8 overflow-hidden hover:scale-[1.01] transition-all duration-300"
            >
                {/* Background Decor */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-500/30 transition-colors">
                        <Briefcase size={24} />
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-white mb-2">Available Jobs</h3>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-[200px]">
                                Apply to fashion and beauty projects matching your niche.
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-brand-dark group-hover:border-white transition-all">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <span className="bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-blue-500/20">
                            3 MATCHING JOBS
                        </span>
                        <span className="bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700">
                            EARN $80-120/VIDEO
                        </span>
                    </div>
                </div>
            </Link>

            {/* Action 2: Quick Create */}
            <Link
                href="/pipeline"
                className="group relative bg-white rounded-[32px] p-8 border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300"
            >
                {/* Background Decor */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/15 transition-colors"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors">
                        <Zap size={24} fill="currentColor" />
                    </div>

                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-black text-brand-dark mb-2">Quick Create</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-[200px]">
                                Use our AI tools to build your portfolio and attract brands now.
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                        <span className="bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-primary/10">
                            FREE AI TOOL
                        </span>
                        <span className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-200">
                            NO ASSETS NEEDED
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
