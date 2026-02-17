"use client";

import {
    CheckCircle, Sparkles, BookOpen, Target, Zap, Clock, ArrowLeft, Menu, X
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CreatorGuide() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
            {/* Navigation */}
            <nav className="sticky top-0 z-[100] border-b border-slate-200 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-black text-base shadow-lg shadow-primary/20">KJ</div>
                        <span className="text-xl font-bold tracking-tight text-brand-dark">KrissKross <span className="text-primary font-black">Jobs</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-bold text-slate-600 hover:text-primary flex items-center gap-2 transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Jobs
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
                    <div className="inline-flex rounded-full bg-primary/5 px-4 py-1.5 text-[10px] font-black uppercase text-primary tracking-widest mb-6 border border-primary/10">Official Guide</div>
                    <h1 className="text-4xl font-black text-brand-dark md:text-6xl leading-tight mb-8">
                        How to Scale Your <span className="text-primary">AI Creator</span> Business
                    </h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed">
                        Everything you need to know about landing high-paying brands, delivering professional AI content, and getting paid on time.
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <main className="mx-auto max-w-4xl px-6 py-24 space-y-32">

                {/* Step 1 */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20">1</div>
                        <h2 className="text-3xl font-black text-brand-dark">The &quot;Perfect&quot; AI Portfolio</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200">
                            <h3 className="font-bold text-lg mb-4 text-brand-dark">Show, Don&apos;t Tell</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Brands care about realism and commercial viability. Ensure your 3-5 uploaded samples feature a variety of products (apparel, beauty, tech).</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl border border-slate-200">
                            <h3 className="font-bold text-lg mb-4 text-brand-dark">Consistency is Key</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">Use consistent lighting and character stability across your samples to prove you can handle multi-shot projects.</p>
                        </div>
                    </div>
                </section>

                {/* Step 2 */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20">2</div>
                        <h2 className="text-3xl font-black text-brand-dark">Applying to Projects</h2>
                    </div>
                    <div className="bg-primary/5 rounded-3xl p-10 border border-primary/10">
                        <div className="flex flex-col md:flex-row gap-10">
                            <div className="space-y-4 flex-1">
                                <h3 className="text-xl font-bold text-brand-dark">Winning over brands</h3>
                                <p className="text-slate-600 font-medium">When you apply, KrissKross shares your profile directly with vetted brands. We handle the initial pitch so you can focus on the work.</p>
                                <div className="space-y-3">
                                    {[
                                        "Keep your portfolio updated weekly",
                                        "Only apply to categories you excel in",
                                        "Response time matters—check your email!"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                            <CheckCircle className="h-5 w-5 text-primary" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step 3 */}
                <section className="space-y-10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-black text-xl shadow-lg shadow-primary/20">3</div>
                        <h2 className="text-3xl font-black text-brand-dark">Delivery & Payment</h2>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-6">
                        <div className="p-8 bg-white border border-slate-200 rounded-3xl">
                            <Clock className="w-8 h-8 text-primary mb-4" />
                            <h4 className="font-black text-brand-dark mb-2 uppercase text-[10px] tracking-widest">Speed</h4>
                            <p className="text-sm text-slate-500 font-medium">Maintain a 48-72 hour turnaround for top ratings.</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-200 rounded-3xl">
                            <Zap className="w-8 h-8 text-accent-green mb-4" />
                            <h4 className="font-black text-brand-dark mb-2 uppercase text-[10px] tracking-widest">Quality</h4>
                            <p className="text-sm text-slate-500 font-medium">Always deliver in 9:16 vertical format (1080p+).</p>
                        </div>
                        <div className="p-8 bg-white border border-slate-200 rounded-3xl">
                            <CheckCircle className="w-8 h-8 text-primary mb-4" />
                            <h4 className="font-black text-brand-dark mb-2 uppercase text-[10px] tracking-widest">Payouts</h4>
                            <p className="text-sm text-slate-500 font-medium">Money is released 7 days after client approval via Stripe.</p>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="bg-brand-dark py-20 px-6 text-center text-slate-500 border-t border-slate-800">
                <p className="text-sm font-bold">© 2025 KrissKross Jobs. Your AI Journey Starts Here.</p>
            </footer>
        </div>
    );
}
