"use client";

import { Button } from "@/components/ui/Button";
import { ArrowRight, Globe, TrendingUp, Wallet } from "lucide-react";

export function Hero() {
    const scrollToSignup = () => {
        window.location.href = "/creator/signup";
    };

    const scrollToHowItWorks = () => {
        document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-b from-[#FAFAF9] to-white">
            {/* Texture Overlay (Optional, using CSS pattern if needed, but keeping simple for now) */}

            <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#1d4ed8] text-[10px] font-bold uppercase tracking-widest mb-8 animate-fade-in-up">
                    <span className="w-2 h-2 rounded-full bg-[#1d4ed8] animate-pulse"></span>
                    Creators Wanted
                </div>

                <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight text-[#0A0A0A] mb-8 leading-[1.1] max-w-4xl mx-auto">
                    Turn Your AI Skills Into <br className="hidden md:block" />
                    <span className="text-[#1d4ed8] italic">Real Income</span>
                </h1>

                <p className="text-lg md:text-xl text-[#3d3a37] max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
                    KrissKross creators make product videos for e-commerce brands—and get paid for every project.
                    Our first creator cut production time in half and now earns from templates used by hundreds of sellers.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Button onClick={scrollToSignup} size="xl" className="w-full sm:w-auto rounded-full shadow-blue-900/20 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                        Start Earning Today
                    </Button>
                    <Button onClick={scrollToHowItWorks} variant="outline" size="xl" className="w-full sm:w-auto rounded-full bg-white hover:bg-gray-50 border-gray-200">
                        See How It Works
                    </Button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs md:text-sm font-bold text-[#6B7280] border-t border-gray-100 pt-10 max-w-3xl mx-auto">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span>Creators active across 4 countries</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">$50–$150 per project</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span>Templates earning passive income</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
