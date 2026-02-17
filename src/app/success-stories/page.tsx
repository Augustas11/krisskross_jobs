"use client";

import {
    Star, Quote, ArrowLeft, Menu, X, CheckCircle, TrendingUp
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const STORIES = [
    {
        name: "Alex Riva",
        role: "Lifestyle AI Videographer",
        earnings: "$4,200",
        time: "Last 30 days",
        quote: "KrissKross Creators bridged the gap for me. Instead of hunting for clients on Twitter, I can just focus on my Runway and Luma output. The brands here actually get what AI content is.",
        result: "12 high-fashion projects completed"
    },
    {
        name: "Sarah Chen",
        role: "Product Photo Specialist",
        earnings: "$2,850",
        time: "First 2 weeks",
        quote: "I uploaded 3 Midjourney samples and got my first Style Sorcery project within 48 hours. The managed account system makes me feel safe about getting paid.",
        result: "Hired 4 hours after signing up"
    },
    {
        name: "Marcus Thorne",
        role: "3D & AI Motion Artist",
        earnings: "$1,100",
        time: "Single project",
        quote: "The brief was clear, the brand budget was professional, and the payout was instant. This is how the AI gig economy should work.",
        result: "Verified Expert Creator status"
    }
];

export default function SuccessStories() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
            {/* Navigation */}
            <nav className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                        <span className="text-xl font-black tracking-tight text-brand-dark">KrissKross Creators</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-bold text-slate-600 hover:text-primary flex items-center gap-2 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back Home
                        </Link>
                    </div>

                    <button className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
                        <Menu className="h-6 w-6 text-brand-dark" />
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <header className="py-24 px-6 text-center bg-white border-b border-slate-100">
                <div className="mx-auto max-w-3xl">
                    <div className="inline-flex rounded-full bg-accent-green/10 px-4 py-1.5 text-[10px] font-black uppercase text-accent-green tracking-widest mb-6 border border-accent-green/20 font-bold">Verified Earnings</div>
                    <h1 className="text-4xl font-black text-brand-dark md:text-6xl leading-tight mb-8">
                        Built by Creators, <br /> For <span className="text-primary">AI Artists</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Real people, real results. See how creators are using KrissKross Creators to replace their 9-to-5 with AI.
                    </p>
                </div>
            </header>

            {/* Stories Grid */}
            <main className="mx-auto max-w-7xl px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {STORIES.map((story, i) => (
                        <div key={i} className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl">
                                    {story.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark text-lg">{story.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium">{story.role}</p>
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="mb-6 flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-slate-600 font-medium leading-relaxed italic mb-10">
                                    &quot;{story.quote}&quot;
                                </p>
                            </div>

                            <div className="pt-8 border-t border-slate-100 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Earnings</span>
                                    <span className="text-lg font-black text-primary leading-none">{story.earnings}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">Timeline</span>
                                    <span className="text-sm font-bold text-slate-600 leading-none">{story.time}</span>
                                </div>
                                <div className="mt-4 bg-accent-green/5 border border-accent-green/10 rounded-xl p-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-accent-green" />
                                    <span className="text-xs font-bold text-accent-green">{story.result}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Growth Stats */}
                <section className="mt-32 p-12 bg-brand-dark rounded-[3rem] text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <p className="text-4xl font-black text-white mb-2">$85,000+</p>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Paid to Creators</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white mb-2">24 Hours</p>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Avg. Time to Hired</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-white mb-2">100%</p>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Payment Protection</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white py-20 px-6 text-center text-slate-400 border-t border-slate-100">
                <p className="text-sm font-bold">© 2026 KrissKross Creators. Your story starts here.</p>
            </footer>
        </div>
    );
}
