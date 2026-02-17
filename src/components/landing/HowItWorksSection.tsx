import { Section } from "@/components/ui/Section";
import { UserPlus, Wand2, Handshake, CreditCard } from "lucide-react";

export function HowItWorksSection() {
    const steps = [
        {
            number: "01",
            title: "Sign Up & Get Free Credits",
            description: "Create your creator account. You get free generation credits immediately — no credit card, no commitment. Start using KrissKross Studio to build your portfolio.",
            icon: UserPlus
        },
        {
            number: "02",
            title: "Create Your First Video",
            description: "Upload a product photo. Choose a template or create from scratch. Use AI models, camera controls, and style references to generate professional video content.",
            icon: Wand2
        },
        {
            number: "03",
            title: "Get Matched With Brands",
            description: "We connect you with e-commerce brands who need product videos. You choose which projects to accept based on budget, timeline, and your style.",
            icon: Handshake
        },
        {
            number: "04",
            title: "Deliver & Get Paid",
            description: "Complete the project, deliver the video. Payment processed within 48 hours. Build your reputation, get more projects, increase your rate.",
            icon: CreditCard
        }
    ];

    return (
        <Section id="how-it-works" background="warm">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-dark mb-4">How It Works</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    From signup to first payment in 4 steps.
                </p>
            </div>

            <div className="relative">
                {/* Connecting Line (Desktop) */}
                <div className="absolute top-12 left-0 w-full h-0.5 bg-gray-200 hidden md:block -z-0"></div>

                <div className="grid md:grid-cols-4 gap-8">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex flex-col items-center md:items-start text-center md:text-left z-10">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-[#FAFAF9] flex items-center justify-center shadow-lg mb-6 group hover:scale-110 transition-transform duration-300">
                                <step.icon className="w-10 h-10 text-blue-600" />
                            </div>

                            <span className="text-6xl font-black text-gray-100 absolute -top-8 right-0 md:left-20 -z-10 select-none">
                                {step.number}
                            </span>

                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
