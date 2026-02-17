/**
 * Pipeline Types
 * Core interfaces for pipeline state management and history tracking.
 */

import type {
    ProductAnalysis,
    ScriptOutput,
    VideoComposerOutput,
    TikTokMetadata,
} from "@/types";

// ─── Enums ──────────────────────────────────────────────────────────────────

export type AgentStatus = "pending" | "running" | "complete" | "error" | "skipped";
export type PipelineStatus = "in_progress" | "complete" | "failed" | "cancelled";

export type PipelineState =
    | "IDLE"
    | "UPLOADING"
    | "ANALYZING"
    | "SCRIPTING"
    | "DIRECTING"
    | "CAPTIONING"
    | "COMPLETE"
    | "ERROR";

// Map agent index → pipeline state
export const AGENT_STATE_MAP: Record<number, PipelineState> = {
    0: "ANALYZING",
    1: "SCRIPTING",
    2: "DIRECTING",
    3: "CAPTIONING",
};

// ─── Agent Output Entry ─────────────────────────────────────────────────────

export interface AgentOutputEntry<T = any> {
    result: T | null;
    status: AgentStatus;
    startedAt: string | null;
    completedAt: string | null;
    durationMs: number | null;
    error: string | null;
}

// ─── Pipeline History ───────────────────────────────────────────────────────

export interface PipelineHistoryProduct {
    imageUrl: string;           // Base64 data URL or remote URL
    imageThumbnailUrl: string;  // Compressed thumbnail for list views
    fileName: string;
    uploadedAt: string;
}

export interface PipelineHistoryAgents {
    productAnalysis: AgentOutputEntry<ProductAnalysis>;
    scriptWriter: AgentOutputEntry<ScriptOutput>;
    videoDirector: AgentOutputEntry<VideoComposerOutput>;
    captionGenerator: AgentOutputEntry<TikTokMetadata>;
}

export interface PipelineHistoryMetadata {
    totalDurationMs: number | null;
    apiCostEstimate: number | null;
    retryCount: number;
    parentRunId: string | null;
    tags: string[];
    notes: string;
}

export interface PipelineHistory {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    status: PipelineStatus;
    product: PipelineHistoryProduct;
    agents: PipelineHistoryAgents;
    metadata: PipelineHistoryMetadata;
}

// ─── Pipeline Run State (live in-memory state) ──────────────────────────────

export interface PipelineRunState {
    runId: string | null;
    pipelineState: PipelineState;
    currentAgentIndex: number | null;
    agentStatuses: Record<number, AgentStatus>;
    agentResults: Record<number, any>;
    agentErrors: Record<number, string>;
    agentStartTimes: Record<number, number>;
    agentDurations: Record<number, number>;
    startedAt: number | null;
    completedAt: number | null;
    error: string | null;
    imageBase64: string | null;
    imageFileName: string | null;
    imageThumbnail: string | null;
    imageHash: string | null;
}

// ─── State Machine Actions ──────────────────────────────────────────────────

export type PipelineAction =
    | { type: "RESET" }
    | { type: "SET_IMAGE"; imageBase64: string; fileName: string; thumbnail: string; hash: string }
    | { type: "START_PIPELINE"; runId: string }
    | { type: "AGENT_RUNNING"; agentIndex: number }
    | { type: "AGENT_COMPLETE"; agentIndex: number; result: any }
    | { type: "AGENT_ERROR"; agentIndex: number; error: string }
    | { type: "PIPELINE_COMPLETE" }
    | { type: "PIPELINE_ERROR"; error: string }
    | { type: "RETRY_FROM_AGENT"; agentIndex: number; runId: string }
    | { type: "USE_CACHED_ANALYSIS"; result: ProductAnalysis };

// ─── Filter / Search ────────────────────────────────────────────────────────

export interface HistoryFilters {
    status?: PipelineStatus | "all";
    search?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
    page: number;
    pageSize: number;
}

// ─── Product Analysis Cache ─────────────────────────────────────────────────

export interface CachedAnalysis {
    hash: string;
    analysis: ProductAnalysis;
    createdAt: string;
    historyIds: string[]; // Which history entries share this cache
}
