import { Section } from "@/components/ui/Section";
import { ProjectCard, ProjectData } from "./ProjectCard";

const projects: ProjectData[] = [
    {
        number: 1,
        title: "Product-to-Video Transformation — Fashion Lead Magnet",
        tiktokVideoId: "7595436414200810770",
        tiktokUrl: "https://www.tiktok.com/@krisskross_aivideo/video/7595436414200810770",
        stats: [
            { icon: "clock", label: "Production Time", value: "3–4 hours", detail: "Down from 7–9 hours manually" },
            { icon: "wand", label: "Generated with", value: "KrissKross Studio", detail: "Images + Video generation" },
            { icon: "play", label: "Format", value: "TikTok / Reels", detail: "Includes voiceover & captions" },
        ],
        testimonial: {
            quote: "The workflow is already quite modular. Starting with a simpler MVP that automates the most time-consuming parts feels very realistic. That alone could save several hours per video.",
            name: "Tom Arthur",
            role: "AI Video Creator, Vietnam",
        },
    },
    {
        number: 2,
        title: "2x Improvement — Premium Fashion Showcase",
        tiktokVideoId: "7593682024448199954",
        tiktokUrl: "https://www.tiktok.com/@krisskross_aivideo/video/7593682024448199954",
        stats: [
            { icon: "clock", label: "Production Time", value: "3–4 hours", detail: "50% faster" },
            { icon: "eye", label: "Visual Quality", value: "2x Improvement", detail: "" },
            { icon: "sliders", label: "New Tools", value: "Camera Control, Style Presets", detail: "" },
        ],
        testimonial: null,
    },
];

export function ProofSection() {
    return (
        <Section background="warm" id="browse-projects">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-serif text-brand-dark mb-4">Real Videos. Real Earnings.</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    These were made by our first creator using KrissKross Studio. Not mockups — actual delivered work.
                </p>
            </div>

            <div className="space-y-32">
                {projects.map((project) => (
                    <ProjectCard key={project.number} project={project} />
                ))}
            </div>
        </Section>
    );
}
