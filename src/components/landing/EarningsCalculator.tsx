"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { DollarSign, Video, Layers, Calculator } from "lucide-react";

export function EarningsCalculator() {
    const [videosPerWeek, setVideosPerWeek] = useState(3);
    const [ratePerVideo, setRatePerVideo] = useState(75);
    const [templatesCreated, setTemplatesCreated] = useState(3);

    // Constants
    const AVG_TEMPLATE_EARNINGS = 50; // $50/month per template average estimate

    const weeklyProjectIncome = videosPerWeek * ratePerVideo;
    const monthlyProjectIncome = weeklyProjectIncome * 4;
    const monthlyTemplateIncome = templatesCreated * AVG_TEMPLATE_EARNINGS;
    const totalMonthlyEarnings = monthlyProjectIncome + monthlyTemplateIncome;

    return (
        <Section id="earnings" background="warm">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-dark mb-4">What Could You Earn?</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Calculate your potential monthly income as a KrissKross creator.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="grid md:grid-cols-2">
                    {/* Inputs */}
                    <div className="p-8 md:p-12 space-y-8 bg-white">
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 flex justify-between">
                                <span>Videos per week</span>
                                <span className="text-blue-600">{videosPerWeek}</span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={videosPerWeek}
                                onChange={(e) => setVideosPerWeek(parseInt(e.target.value))}
                                className="w-full accent-blue-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>1 video</span>
                                <span>10 videos</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700 flex justify-between">
                                <span>Your rate per video</span>
                                <span className="text-blue-600">${ratePerVideo}</span>
                            </label>
                            <input
                                type="range"
                                min="50"
                                max="200"
                                step="10"
                                value={ratePerVideo}
                                onChange={(e) => setRatePerVideo(parseInt(e.target.value))}
                                className="w-full accent-blue-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>$50</span>
                                <span>$200</span>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <label className="block text-sm font-bold text-gray-700 flex justify-between">
                                <span>Templates created (Active)</span>
                                <span className="text-purple-600">{templatesCreated}</span>
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={templatesCreated}
                                onChange={(e) => setTemplatesCreated(parseInt(e.target.value))}
                                className="w-full accent-purple-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-400 font-medium">
                                <span>0 templates</span>
                                <span>20 templates</span>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="p-8 md:p-12 bg-gray-900 text-white flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-2 text-gray-300">
                            <Calculator className="w-5 h-5" /> Estimated Monthly
                        </h3>

                        <div className="space-y-6 mb-8">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 flex items-center gap-2"><Video className="w-4 h-4" /> Project Income</span>
                                <span className="font-mono font-bold">${monthlyProjectIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400 flex items-center gap-2"><Layers className="w-4 h-4" /> Template Income</span>
                                <span className="font-mono font-bold text-purple-400">${monthlyTemplateIncome.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total</span>
                                <span className="text-4xl md:text-5xl font-mono font-bold text-green-400">
                                    ${totalMonthlyEarnings.toLocaleString()}
                                </span>
                            </div>
                            <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                                *Based on current platform averages. Template income varies based on usage volume. Project rates are set by you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
}
