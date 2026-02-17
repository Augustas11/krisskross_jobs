/**
 * Pipeline State Machine
 * Pure reducer for pipeline state transitions.
 */

import type {
    PipelineRunState,
    PipelineAction,
    PipelineState,
    AgentStatus,
} from "../types/pipeline.types";
import { AGENT_STATE_MAP } from "../types/pipeline.types";

// ─── Initial State ──────────────────────────────────────────────────────────

export function createInitialState(): PipelineRunState {
    return {
        runId: null,
        pipelineState: "IDLE",
        currentAgentIndex: null,
        agentStatuses: { 0: "pending", 1: "pending", 2: "pending", 3: "pending" },
        agentResults: {},
        agentErrors: {},
        agentStartTimes: {},
        agentDurations: {},
        startedAt: null,
        completedAt: null,
        error: null,
        imageBase64: null,
        imageFileName: null,
        imageThumbnail: null,
        imageHash: null,
    };
}

// ─── Transition Guards ──────────────────────────────────────────────────────

const VALID_TRANSITIONS: Record<PipelineState, PipelineState[]> = {
    IDLE: ["UPLOADING", "ANALYZING"], // Can skip uploading if image already set
    UPLOADING: ["ANALYZING", "ERROR"],
    ANALYZING: ["SCRIPTING", "ERROR"],
    SCRIPTING: ["DIRECTING", "ERROR"],
    DIRECTING: ["CAPTIONING", "ERROR"],
    CAPTIONING: ["COMPLETE", "ERROR"],
    COMPLETE: ["IDLE", "ANALYZING", "SCRIPTING", "DIRECTING", "CAPTIONING"], // For re-run / retry
    ERROR: ["IDLE", "ANALYZING", "SCRIPTING", "DIRECTING", "CAPTIONING"], // For retry from any point
};

function canTransition(from: PipelineState, to: PipelineState): boolean {
    return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// ─── Reducer ────────────────────────────────────────────────────────────────

export function pipelineReducer(
    state: PipelineRunState,
    action: PipelineAction
): PipelineRunState {
    switch (action.type) {
        case "RESET":
            return createInitialState();

        case "SET_IMAGE":
            return {
                ...state,
                pipelineState: "IDLE",
                imageBase64: action.imageBase64,
                imageFileName: action.fileName,
                imageThumbnail: action.thumbnail,
                imageHash: action.hash,
                agentStatuses: { 0: "pending", 1: "pending", 2: "pending", 3: "pending" },
                agentResults: {},
                agentErrors: {},
                agentStartTimes: {},
                agentDurations: {},
                startedAt: null,
                completedAt: null,
                error: null,
            };

        case "START_PIPELINE": {
            return {
                ...state,
                runId: action.runId,
                pipelineState: "ANALYZING",
                currentAgentIndex: 0,
                agentStatuses: { 0: "pending", 1: "pending", 2: "pending", 3: "pending" },
                agentResults: {},
                agentErrors: {},
                agentStartTimes: {},
                agentDurations: {},
                startedAt: Date.now(),
                completedAt: null,
                error: null,
            };
        }

        case "AGENT_RUNNING": {
            const targetState = AGENT_STATE_MAP[action.agentIndex];
            if (targetState && !canTransition(state.pipelineState, targetState) && state.pipelineState !== targetState) {
                // Allow staying in same state (e.g. retry)
                if (state.pipelineState !== "IDLE" && state.pipelineState !== "ERROR" && state.pipelineState !== "COMPLETE") {
                    console.warn(`Invalid transition: ${state.pipelineState} → ${targetState}`);
                }
            }
            return {
                ...state,
                pipelineState: targetState || state.pipelineState,
                currentAgentIndex: action.agentIndex,
                agentStatuses: {
                    ...state.agentStatuses,
                    [action.agentIndex]: "running" as AgentStatus,
                },
                agentStartTimes: {
                    ...state.agentStartTimes,
                    [action.agentIndex]: Date.now(),
                },
            };
        }

        case "AGENT_COMPLETE": {
            const duration = state.agentStartTimes[action.agentIndex]
                ? Date.now() - state.agentStartTimes[action.agentIndex]
                : null;
            return {
                ...state,
                agentStatuses: {
                    ...state.agentStatuses,
                    [action.agentIndex]: "complete" as AgentStatus,
                },
                agentResults: {
                    ...state.agentResults,
                    [action.agentIndex]: action.result,
                },
                agentDurations: {
                    ...state.agentDurations,
                    ...(duration !== null ? { [action.agentIndex]: duration } : {}),
                },
            };
        }

        case "AGENT_ERROR":
            return {
                ...state,
                pipelineState: "ERROR",
                agentStatuses: {
                    ...state.agentStatuses,
                    [action.agentIndex]: "error" as AgentStatus,
                },
                agentErrors: {
                    ...state.agentErrors,
                    [action.agentIndex]: action.error,
                },
                error: action.error,
            };

        case "PIPELINE_COMPLETE":
            return {
                ...state,
                pipelineState: "COMPLETE",
                currentAgentIndex: null,
                completedAt: Date.now(),
            };

        case "PIPELINE_ERROR":
            return {
                ...state,
                pipelineState: "ERROR",
                error: action.error,
                completedAt: Date.now(),
            };

        case "RETRY_FROM_AGENT": {
            // Mark agents from the retry point to end as pending again
            const newStatuses = { ...state.agentStatuses };
            const newErrors = { ...state.agentErrors };
            for (let i = action.agentIndex; i < 4; i++) {
                newStatuses[i] = "pending";
                delete newErrors[i];
            }
            const targetState = AGENT_STATE_MAP[action.agentIndex];
            return {
                ...state,
                runId: action.runId,
                pipelineState: targetState || state.pipelineState,
                currentAgentIndex: action.agentIndex,
                agentStatuses: newStatuses,
                agentErrors: newErrors,
                startedAt: Date.now(),
                completedAt: null,
                error: null,
            };
        }

        case "USE_CACHED_ANALYSIS":
            return {
                ...state,
                agentStatuses: {
                    ...state.agentStatuses,
                    0: "skipped" as AgentStatus,
                },
                agentResults: {
                    ...state.agentResults,
                    0: action.result,
                },
            };

        default:
            return state;
    }
}
