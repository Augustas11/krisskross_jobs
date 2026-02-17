/**
 * Agent Types
 * Re-exports per-agent result types from @/types for clean imports.
 */

export type {
    ProductAnalysis,
    ScriptOutput,
    ScriptScene,
    VideoComposerOutput,
    ShotComposition,
    TikTokMetadata,
} from "@/types";

/** Agent index to key mapping */
export const AGENT_KEYS = ["productAnalysis", "scriptWriter", "videoDirector", "captionGenerator"] as const;
export type AgentKey = (typeof AGENT_KEYS)[number];

/** Map agent index to agent key */
export function agentIndexToKey(index: number): AgentKey {
    return AGENT_KEYS[index];
}

/** Map agent key to display name */
export const AGENT_DISPLAY_NAMES: Record<AgentKey, string> = {
    productAnalysis: "Product Analysis",
    scriptWriter: "Script Writer",
    videoDirector: "Video Director",
    captionGenerator: "Caption Generator",
};
