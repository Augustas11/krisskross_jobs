"use client";

import { Briefcase, MapPin, Clock, DollarSign, ArrowRight, Star } from "lucide-react";

export function JobRecommendations() {
    const jobs = [
        {
            id: 1,
            brand: "StyleCo Vietnam",
            title: "Fashion Product Videos",
            description: "Need 10 TikTok videos for Tet collection. Highlight fabric and fit.",
            pay: "$80-120 per video",
            deadline: "Feb 28",
            spots: 3,
            tags: ["Fashion", "Tet 2024"]
        },
        {
            id: 2,
            brand: "GlowUp Brand",
            title: "Beauty Tutorial Series",
            description: "AI-generated product demos for skincare line focusing on texture.",
            pay: "$50-95 per video",
            deadline: "Mar 15",
            spots: 5,
            tags: ["Beauty", "Skincare"]
        }
    ];

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-brand-dark flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Jobs For You
                </h3>
                <button className="text-sm font-bold text-primary hover:underline">View All →</button>
            </div>

            <div className="space-y-4">
                {jobs.map((job) => (
                    <div key={job.id} className="group bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{job.brand}</span>
                                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                    <div className="flex items-center gap-1 text-amber-500">
                                        <Star size={10} fill="currentColor" />
                                        <span className="text-[10px] font-black">Top Client</span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-black text-brand-dark mb-2 group-hover:text-primary transition-colors">{job.title}</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-4 max-w-2xl">
                                    &quot;{job.description}&quot;
                                </p>
                                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <DollarSign size={14} className="text-primary" />
                                        <span className="text-slate-700">{job.pay}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <Clock size={14} />
                                        <span>Due: {job.deadline}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                        <Briefcase size={14} />
                                        <span>{job.spots} spots left</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                                <button className="flex-1 md:flex-none bg-primary text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all">
                                    Apply Now
                                </button>
                                <button className="p-3 border border-slate-200 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-brand-dark transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center p-8 bg-[#F1F5F9] rounded-[32px] border border-slate-200">
                <p className="text-slate-500 font-bold mb-4">No matching jobs?</p>
                <button className="bg-white text-brand-dark px-8 py-3 rounded-2xl font-black border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 mx-auto">
                    Post your availability <ArrowRight size={18} />
                </button>
            </div>
        </section>
    );
}
