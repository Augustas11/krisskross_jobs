/**
 * Variation Seeds
 * 12 unique combinations of hook × music × CTA × angle
 * Each seed parameterizes agents 02, 03, 04 to produce a distinct creative direction.
 */

export interface VariationSeed {
    id: string;
    hook: string;
    music: string;
    cta: string;
    angle: string;
    label: string;
}

export const VARIATION_SEEDS: VariationSeed[] = [
    { id: "v01", hook: "FOMO", music: "trending_viral", cta: "link_in_bio", angle: "outfit-reveal", label: "FOMO · Viral · Link" },
    { id: "v02", hook: "social_proof", music: "upbeat_pop", cta: "comment", angle: "transformation", label: "Social Proof · Pop · Comment" },
    { id: "v03", hook: "curiosity", music: "lo_fi_chill", cta: "duet", angle: "styling-hack", label: "Curiosity · Lo-fi · Duet" },
    { id: "v04", hook: "urgency", music: "hype_trap", cta: "stitch", angle: "POV", label: "Urgency · Hype · Stitch" },
    { id: "v05", hook: "relatability", music: "soft_acoustic", cta: "link_in_bio", angle: "GRWM", label: "Relatable · Acoustic · Link" },
    { id: "v06", hook: "FOMO", music: "hype_trap", cta: "comment", angle: "POV", label: "FOMO · Hype · Comment" },
    { id: "v07", hook: "curiosity", music: "trending_viral", cta: "link_in_bio", angle: "transformation", label: "Curiosity · Viral · Link" },
    { id: "v08", hook: "social_proof", music: "lo_fi_chill", cta: "stitch", angle: "outfit-reveal", label: "Social Proof · Lo-fi · Stitch" },
    { id: "v09", hook: "urgency", music: "soft_acoustic", cta: "comment", angle: "styling-hack", label: "Urgency · Acoustic · Comment" },
    { id: "v10", hook: "relatability", music: "hype_trap", cta: "duet", angle: "GRWM", label: "Relatable · Hype · Duet" },
    { id: "v11", hook: "FOMO", music: "upbeat_pop", cta: "stitch", angle: "styling-hack", label: "FOMO · Pop · Stitch" },
    { id: "v12", hook: "social_proof", music: "trending_viral", cta: "duet", angle: "POV", label: "Social Proof · Viral · Duet" },
];
