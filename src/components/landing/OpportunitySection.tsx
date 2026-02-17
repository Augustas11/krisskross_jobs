import { Section } from "@/components/ui/Section";
import { Briefcase, Layers, Crown, DollarSign, Users, Award } from "lucide-react";

export function OpportunitySection() {
    const cards = [
        {
            icon: Briefcase,
            title: "Get Hired for Video Projects",
            description: "Brands need product videos for TikTok Shop and Instagram. You create them using KrissKross Studio. Average project takes 3–4 hours. You set your rate.",
            earnings: "$50 – $150 per project",
            detail: "Deliver 2–3 projects per week = $400–$1,800/month",
            color: "blue"
        },
        {
            icon: Layers,
            title: "Create Templates, Earn Passively",
            description: "Build reusable video templates — scenes, model presets, camera styles. When other users generate videos using your template, you earn a cut. Build once, earn repeatedly.",
            earnings: "70/30 revenue split",
            detail: "Top templates used by hundreds of sellers monthly",
            color: "purple"
        },
        {
            icon: Crown,
            title: "Become an Anchor Creator",
            description: "Lead a category. Set the standard for fashion, beauty, or accessories templates. Get priority access to new features, direct brand partnerships, and higher visibility.",
            earnings: "Priority projects + Royalties",
            detail: "Limited spots — application required",
            color: "orange"
        }
    ];

    return (
        <Section id="opportunity" background="white">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-dark mb-4">Three Ways to Earn</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Whether you want project-based work, passive template income, or both — there's a path for you.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-[#FAFAF9] rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon className={`w-7 h-7 text-${card.color}-600`} />
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
                        <p className="text-gray-600 mb-8 leading-relaxed text-sm">
                            {card.description}
                        </p>

                        <div className="pt-6 border-t border-gray-200/60">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-green-600" />
                                <span className="font-bold text-gray-900 text-sm">{card.earnings}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-500 font-medium">{card.detail}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
