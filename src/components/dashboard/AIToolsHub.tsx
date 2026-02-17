"use client";

import Link from "next/link";
import { Sparkles, Layers, Wand2, ArrowRight } from "lucide-react";

export function AIToolsHub() {
    const tools = [
        {
            title: "Free AI Tool",
            description: "Transform a product photo into a TikTok video in minutes.",
            price: "FREE",
            href: "/pipeline",
            icon: Wand2,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            title: "AI Pipeline",
            description: "Batch process multiple videos with custom AI models.",
            price: "From $0.99",
            href: "/pipeline",
            icon: Sparkles,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-100"
        },
        {
            title: "Variations",
            description: "Create multiple versions of your best performing content.",
            price: "From $0.49",
            href: "/variations",
            icon: Layers,
            color: "text-primary",
            bgColor: "bg-primary/5",
            borderColor: "border-primary/10"
        }
    ];

    return (
        <section className="mt-12">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-brand-dark flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Your AI Creation Tools
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <Link
                        key={tool.title}
                        href={tool.href}
                        className="group bg-white rounded-3xl border border-slate-200 p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative flex flex-col"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${tool.bgColor} ${tool.color} flex items-center justify-center mb-6`}>
                            <tool.icon size={28} />
                        </div>

                        <h4 className="text-xl font-black text-brand-dark mb-2">{tool.title}</h4>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 flex-1">
                            {tool.description}
                        </p>

                        <div className="flex items-center justify-between mt-auto">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${tool.borderColor} ${tool.color}`}>
                                {tool.price}
                            </span>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-dark group-hover:text-white transition-all">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                    <Sparkles size={20} fill="currentColor" />
                </div>
                <p className="text-sm font-bold text-slate-700">
                    💡 <span className="text-primary">Tip:</span> Use the Free AI Tool to create portfolio samples — brands love seeing what you can do!
                </p>
            </div>
        </section>
    );
}
