import { Section } from "@/components/ui/Section";
import { Quote } from "lucide-react";

export function CreatorStory() {
    const timelineEvents = [
        { date: "Jan 9", event: "First video project begins" },
        { date: "Jan 14", event: "Second video delivered (2x better)" },
        { date: "Jan 15", event: "Custom prompt contributed" },
        { date: "Jan 21", event: "Invited to Templates feature beta" },
        { date: "Jan 26", event: "Accepted Anchor Creator role" },
    ];

    return (
        <Section id="creator-stories" background="white" className="border-y border-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[10px] font-bold uppercase tracking-widest mb-4">
                        Creator Spotlight
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif text-brand-dark mb-8">
                        From First Video to <br /> Anchor Creator in 6 Weeks
                    </h2>
                </div>

                <div className="grid md:grid-cols-[1.5fr_1fr] gap-12 items-start">
                    <div className="prose prose-lg text-gray-600">
                        <p>
                            Tom Arthur is a video creator based in Vietnam. In January 2026, he joined KrissKross as our very first creator.
                        </p>
                        <p>
                            His first project: a lead magnet video transforming a single product photo into a premium fashion showcase. Total production time — 7 to 9 hours, including image generation, video creation, editing, voiceover, and captions.
                        </p>
                        <p>
                            For his second video, using the same KrissKross Studio tools with new camera controls and style references, he cut that time in half. 3 to 4 hours. Same quality bar — actually higher.
                        </p>
                        <blockquote className="border-l-4 border-orange-200 pl-4 py-1 my-6 not-italic font-medium text-gray-800 bg-orange-50/50 p-4 rounded-r-xl">
                            "The workflow is already quite modular. Starting with a simpler MVP that automates the most time-consuming parts feels very realistic."
                        </blockquote>
                        <p>
                            Within weeks, Tom was contributing custom prompts that became part of our template system. He was invited to become an Anchor Creator: leading template categories, testing new features before anyone else, and setting the creative standard for the platform.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            The Timeline
                        </h3>
                        <div className="space-y-6 relative border-l-2 border-gray-200 ml-2 pl-6 py-2">
                            {timelineEvents.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-gray-300"></div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{item.date}</div>
                                    <div className="text-sm font-medium text-gray-900">{item.event}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
