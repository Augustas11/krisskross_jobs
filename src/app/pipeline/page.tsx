import { PipelineClient } from "@/components/pipeline/PipelineClient";

export const metadata = {
    title: "Content Pipeline | KrissKross Admin",
    description:
        "AI-powered product analysis → TikTok content pipeline. Upload a product image and generate scripts, compositions, and optimized metadata.",
};

export default function PipelinePage() {
    return <PipelineClient />;
}
