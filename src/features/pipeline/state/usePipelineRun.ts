/**
 * usePipelineRun Hook
 * Orchestrates a pipeline run: calls SSE endpoint, dispatches state transitions,
 * creates/updates history entries.
 */

"use client";

import { useCallback } from "react";
import { usePipelineContext } from "./PipelineContext";
import {
    createHistoryEntry,
    updateAgentStatus,
    updateHistoryStatus,
} from "../services/historyService";
import { createThumbnail, fileToBase64, extractBase64 } from "../services/imageService";
import { computeImageHash } from "../utils/imageHash";
import { checkCache, setCache, linkCacheToHistory } from "../services/cacheService";
import { estimateCost } from "../utils/formatters";
import type { CachedAnalysis } from "../types/pipeline.types";

interface UsePipelineRunReturn {
    /** Process a file upload: compute hash, create thumbnail, check cache */
    handleImageUpload: (file: File) => Promise<{ cacheHit: CachedAnalysis | null }>;
    /** Start the full pipeline run */
    startPipeline: (opts?: { skipAgent0?: boolean; cachedAnalysis?: any }) => Promise<void>;
    /** Retry pipeline from a specific agent */
    retryFromAgent: (agentIndex: number) => Promise<void>;
    /** Whether the pipeline is currently running */
    isRunning: boolean;
}

export function usePipelineRun(): UsePipelineRunReturn {
    const { state, dispatch, isRunning } = usePipelineContext();

    const handleImageUpload = useCallback(
        async (file: File): Promise<{ cacheHit: CachedAnalysis | null }> => {
            const dataUrl = await fileToBase64(file);
            const base64 = extractBase64(dataUrl);
            const thumbnail = await createThumbnail(dataUrl);
            const hash = await computeImageHash(dataUrl);

            dispatch({
                type: "SET_IMAGE",
                imageBase64: base64,
                fileName: file.name,
                thumbnail,
                hash,
            });

            // Check cache
            const cacheHit = checkCache(hash);
            return { cacheHit };
        },
        [dispatch]
    );

    const runSSEPipeline = useCallback(
        async (
            imageBase64: string,
            historyId: string,
            startFromAgent: number = 0,
            priorResults: Record<number, any> = {}
        ) => {
            try {
                const response = await fetch("/api/pipeline/run", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageBase64, startFromAgent, priorResults }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Pipeline request failed");
                }

                const reader = response.body?.getReader();
                const decoder = new TextDecoder();
                if (!reader) throw new Error("No response body");

                let buffer = "";

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (!line.startsWith("data: ")) continue;

                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === "complete") {
                                dispatch({ type: "PIPELINE_COMPLETE" });

                                // Calculate total duration and cost
                                const totalDuration = state.startedAt
                                    ? Date.now() - state.startedAt
                                    : null;
                                const completedAgents = Object.values(state.agentStatuses).filter(
                                    (s) => s === "complete"
                                ).length + 1; // +1 for the one completing now
                                const cost = estimateCost(completedAgents, startFromAgent === 0);

                                updateHistoryStatus(historyId, "complete", {
                                    totalDurationMs: totalDuration,
                                    apiCostEstimate: cost,
                                });
                                break;
                            }

                            if (data.type === "fatal_error") {
                                dispatch({ type: "PIPELINE_ERROR", error: data.error });
                                updateHistoryStatus(historyId, "failed");
                                break;
                            }

                            if (data.agentIndex !== undefined) {
                                if (data.status === "running") {
                                    dispatch({ type: "AGENT_RUNNING", agentIndex: data.agentIndex });
                                    updateAgentStatus(historyId, data.agentIndex, {
                                        status: "running",
                                        startedAt: new Date().toISOString(),
                                    });
                                } else if (data.status === "done") {
                                    dispatch({
                                        type: "AGENT_COMPLETE",
                                        agentIndex: data.agentIndex,
                                        result: data.result,
                                    });
                                    updateAgentStatus(historyId, data.agentIndex, {
                                        status: "complete",
                                        result: data.result,
                                        completedAt: new Date().toISOString(),
                                        durationMs: state.agentStartTimes[data.agentIndex]
                                            ? Date.now() - state.agentStartTimes[data.agentIndex]
                                            : null,
                                    });

                                    // Cache Agent 01 results
                                    if (data.agentIndex === 0 && state.imageHash) {
                                        setCache(state.imageHash, data.result, historyId);
                                    }
                                } else if (data.status === "error") {
                                    dispatch({
                                        type: "AGENT_ERROR",
                                        agentIndex: data.agentIndex,
                                        error: data.error,
                                    });
                                    updateAgentStatus(historyId, data.agentIndex, {
                                        status: "error",
                                        error: data.error,
                                        completedAt: new Date().toISOString(),
                                    });
                                    updateHistoryStatus(historyId, "failed");
                                }
                            }
                        } catch {
                            // Skip malformed JSON
                        }
                    }
                }
            } catch (err: any) {
                dispatch({ type: "PIPELINE_ERROR", error: err.message });
                updateHistoryStatus(historyId, "failed");
            }
        },
        [dispatch, state.startedAt, state.agentStartTimes, state.agentStatuses, state.imageHash]
    );

    const startPipeline = useCallback(
        async (opts?: { skipAgent0?: boolean; cachedAnalysis?: any }) => {
            if (!state.imageBase64) return;

            // Create history entry
            const entry = createHistoryEntry({
                imageUrl: `data:image/jpeg;base64,${state.imageBase64}`,
                thumbnailUrl: state.imageThumbnail || "",
                fileName: state.imageFileName || "product.jpg",
            });

            const runId = entry.id;
            dispatch({ type: "START_PIPELINE", runId });

            if (opts?.skipAgent0 && opts.cachedAnalysis) {
                // Use cached analysis — skip Agent 01
                dispatch({ type: "USE_CACHED_ANALYSIS", result: opts.cachedAnalysis });
                updateAgentStatus(runId, 0, {
                    status: "skipped",
                    result: opts.cachedAnalysis,
                    completedAt: new Date().toISOString(),
                });

                // Link cache to this history entry
                if (state.imageHash) {
                    linkCacheToHistory(state.imageHash, runId);
                }

                // Start from Agent 02
                await runSSEPipeline(state.imageBase64, runId, 1, { 0: opts.cachedAnalysis });
            } else {
                await runSSEPipeline(state.imageBase64, runId, 0, {});
            }
        },
        [state.imageBase64, state.imageThumbnail, state.imageFileName, state.imageHash, dispatch, runSSEPipeline]
    );

    const retryFromAgent = useCallback(
        async (agentIndex: number) => {
            if (!state.imageBase64 || !state.runId) return;

            const retryRunId = crypto.randomUUID?.() ?? `${Date.now()}`;
            dispatch({ type: "RETRY_FROM_AGENT", agentIndex, runId: retryRunId });

            // Create new history entry for retry
            const entry = createHistoryEntry({
                imageUrl: `data:image/jpeg;base64,${state.imageBase64}`,
                thumbnailUrl: state.imageThumbnail || "",
                fileName: state.imageFileName || "product.jpg",
            });

            updateHistoryStatus(entry.id, "in_progress", {
                retryCount: (state as any).retryCount ?? 1,
                parentRunId: state.runId,
            });

            await runSSEPipeline(state.imageBase64, entry.id, agentIndex, state.agentResults);
        },
        [state, dispatch, runSSEPipeline]
    );

    return {
        handleImageUpload,
        startPipeline,
        retryFromAgent,
        isRunning,
    };
}
