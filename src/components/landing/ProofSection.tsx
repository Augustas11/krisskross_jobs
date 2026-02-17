import { Section } from "@/components/ui/Section";
import { Play, TrendingDown, Wand2, MonitorPlay } from "lucide-react";

export function ProofSection() {
    return (
        <Section background="warm" id="proof">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-dark mb-4">Real Videos. Real Earnings.</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    These were made by our first creator using KrissKross Studio. Not mockups — actual delivered work.
                </p>
            </div>

            <div className="space-y-24">
                {/* Project 1 */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mx-auto w-full max-w-sm group">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all cursor-pointer">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                        </div>
                        {/* Placeholder for Video 1 */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="text-white text-sm font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-2">Before / After</div>
                            <p className="text-white/80 text-xs">Click to watch full transformation</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-block px-3 py-1 rounded-md bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-[#9a9590]">
                            Project #1
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Product-to-Video Transformation — Fashion Lead Magnet
                        </h3>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-green-50 rounded-lg"><TrendingDown className="w-5 h-5 text-green-600" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900">3–4 hours production time</p>
                                        <p className="text-sm text-gray-500">Down from 7–9 hours manually</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-blue-50 rounded-lg"><Wand2 className="w-5 h-5 text-blue-600" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900">Generated with KrissKross Studio</p>
                                        <p className="text-sm text-gray-500">Images + Video generation</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-purple-50 rounded-lg"><MonitorPlay className="w-5 h-5 text-purple-600" /></div>
                                    <div>
                                        <p className="font-bold text-gray-900">TikTok / Reels Format</p>
                                        <p className="text-sm text-gray-500">Includes voiceover & captions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <blockquote className="border-l-4 border-blue-600 pl-6 py-2 italic text-gray-600 text-lg">
                            "The workflow is already quite modular. Starting with a simpler MVP that automates the most time-consuming parts feels very realistic. That alone could save several hours per video."
                            <footer className="mt-4 flex items-center gap-3 not-italic">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div> {/* Avatar Placeholder */}
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">Tom Arthur</div>
                                    <div className="text-xs text-gray-500">AI Video Creator, Vietnam</div>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>

                {/* Project 2 */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <div className="inline-block px-3 py-1 rounded-md bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-[#9a9590]">
                            Project #2
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                            2x Improvement — Premium Fashion Showcase
                        </h3>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <ul className="space-y-4">
                                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                                    <span className="text-gray-600">Production Time</span>
                                    <span className="font-bold text-green-600">3–4 hours (50% faster)</span>
                                </li>
                                <li className="flex justify-between items-center border-b border-gray-50 pb-3">
                                    <span className="text-gray-600">Visual Quality</span>
                                    <span className="font-bold text-blue-600">2x Improvement</span>
                                </li>
                                <li className="flex justify-between items-center pb-1">
                                    <span className="text-gray-600">New Tools</span>
                                    <span className="font-bold text-gray-900">Camera Control, Style Presets</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-green-50 border border-green-100 p-6 rounded-xl">
                            <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                                <TrendingDown className="w-4 h-4" /> Efficiency Jump
                            </h4>
                            <div className="space-y-2 text-sm text-green-800">
                                <p>• Production time cut in half (Video 1 → Video 2)</p>
                                <p>• "The camera is really good. Overall it's smooth."</p>
                            </div>
                        </div>
                    </div>

                    <div className="order-1 md:order-2 relative aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl mx-auto w-full max-w-sm group">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/30 transition-all cursor-pointer">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-1 group-hover:scale-110 transition-transform">
                                <Play className="w-8 h-8 text-white fill-white" />
                            </div>
                        </div>
                        {/* Placeholder for Video 2 */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="text-white text-sm font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full inline-block mb-2">Premium Showcase</div>
                            <p className="text-white/80 text-xs">Higher quality, faster production</p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
