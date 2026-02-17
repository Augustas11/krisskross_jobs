/**
 * Pipeline Context
 * React context + provider wrapping the pipeline state machine.
 */

"use client";

import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import { pipelineReducer, createInitialState } from "./pipelineStateMachine";
import type { PipelineRunState, PipelineAction } from "../types/pipeline.types";

// ─── Context Shape ──────────────────────────────────────────────────────────

interface PipelineContextValue {
    state: PipelineRunState;
    dispatch: React.Dispatch<PipelineAction>;
    isRunning: boolean;
    isComplete: boolean;
    isError: boolean;
    resetPipeline: () => void;
}

const PipelineContext = createContext<PipelineContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function PipelineProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(pipelineReducer, undefined, createInitialState);

    const isRunning = ["ANALYZING", "SCRIPTING", "DIRECTING", "CAPTIONING", "UPLOADING"].includes(
        state.pipelineState
    );
    const isComplete = state.pipelineState === "COMPLETE";
    const isError = state.pipelineState === "ERROR";

    const resetPipeline = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    return (
        <PipelineContext.Provider
            value={{ state, dispatch, isRunning, isComplete, isError, resetPipeline }}
        >
            {children}
        </PipelineContext.Provider>
    );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function usePipelineContext(): PipelineContextValue {
    const ctx = useContext(PipelineContext);
    if (!ctx) {
        throw new Error("usePipelineContext must be used within a PipelineProvider");
    }
    return ctx;
}
