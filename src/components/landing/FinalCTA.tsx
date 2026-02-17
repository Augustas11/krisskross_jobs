"use client";

import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
    return (
        <Section id="cta" background="dark" className="text-center py-32">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
                    Ready to Get Paid for <br /> Your AI Skills?
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
                    Join KrissKross as a creator. Get free credits, access to Studio tools, and start earning from your first project.
                </p>

                <Button
                    onClick={() => window.location.href = "/creator/signup"}
                    size="xl"
                    variant="white"
                    className="w-full sm:w-auto px-12 py-5 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform"
                >
                    Apply as Creator
                </Button>

                <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-widest">
                    <span>Free credits included</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700 self-center"></span>
                    <span>No credit card required</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700 self-center"></span>
                    <span>Creators in 4+ countries</span>
                </div>
            </div>
        </Section>
    );
}
