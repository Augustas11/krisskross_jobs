import { VariationClient } from "@/components/variations/VariationClient";

export const metadata = {
    title: "Variation Engine | KrissKross",
    description:
        "Upload one product image → see 12 video proposals with real preview images → pick one → generate the remaining shots as actual video clips.",
};

export default function VariationsPage() {
    return <VariationClient />;
}
