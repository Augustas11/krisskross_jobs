import { Section } from "@/components/ui/Section";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
    const faqs = [
        {
            q: "Do I need AI experience to join?",
            a: "No. If you can edit video, you can use KrissKross. The Studio handles AI generation — you bring the creative direction, editing skills, and storytelling. We provide free credits to learn and build your portfolio."
        },
        {
            q: "How do I get paid?",
            a: "Project payments are processed within 48 hours of delivery. Template royalties are paid monthly. We support international transfers for creators in Vietnam, US, and Southeast Asia."
        },
        {
            q: "What tools do I need?",
            a: "KrissKross Studio (free with your creator account) for AI image and video generation. Your own video editing software (CapCut, Premiere, DaVinci — whatever you prefer) for final production. That's it."
        },
        {
            q: "How much can I realistically earn?",
            a: "Our first creator produces 2–3 videos per week at $50–$150 each, plus template income. Your earnings depend on volume, quality, and rates you set. There's no cap."
        },
        {
            q: "What kind of videos do brands need?",
            a: "Mostly product showcase videos for TikTok Shop and Instagram Reels — fashion, accessories, beauty products. Before/after transformations, lifestyle shots, and lead magnet content are the most requested formats."
        },
        {
            q: "What is an Anchor Creator?",
            a: "Anchor Creators lead specific template categories (e.g., Vietnamese fashion, accessories, lifestyle). They get priority access to new features, direct brand partnerships, higher platform visibility, and additional compensation. It's an application-based role with limited spots."
        },
        {
            q: "I'm in Vietnam / Southeast Asia — can I join?",
            a: "Absolutely. Our largest creator community is in Vietnam, and we actively support creators across Southeast Asia, the US, and Europe. The platform is built for international creators."
        }
    ];

    return (
        <Section id="faq" background="white">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-dark mb-12 text-center">Questions Creators Ask</h2>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <details key={idx} className="group bg-[#FAFAF9] rounded-xl overflow-hidden border border-gray-100 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-gray-900 font-bold hover:bg-gray-50 transition-colors">
                                <h3 className="text-lg">{faq.q}</h3>
                                <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" />
                            </summary>
                            <div className="px-6 pb-6 leading-relaxed text-gray-600">
                                <p>
                                    {faq.a}
                                </p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        </Section>
    );
}
