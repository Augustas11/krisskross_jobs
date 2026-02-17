/**
 * useRealtimeStatus Hook
 * Live elapsed timer per active agent.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { usePipelineContext } from "../state/PipelineContext";
import type { AgentStatus } from "../types/pipeline.types";

interface UseRealtimeStatusReturn {
    agentStatuses: Record<number, AgentStatus>;
    elapsedPerAgent: Record<number, number>; // ms
    totalElapsed: number; // ms
    isActive: boolean;
}

export function useRealtimeStatus(): UseRealtimeStatusReturn {
    const { state, isRunning } = usePipelineContext();
    const [elapsedPerAgent, setElapsedPerAgent] = useState<Record<number, number>>({});
    const [totalElapsed, setTotalElapsed] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                const now = Date.now();
                const newElapsed: Record<number, number> = {};

                for (let i = 0; i < 4; i++) {
                    if (state.agentStatuses[i] === "running" && state.agentStartTimes[i]) {
                        newElapsed[i] = now - state.agentStartTimes[i];
                    } else if (state.agentDurations[i]) {
                        newElapsed[i] = state.agentDurations[i];
                    }
                }

                setElapsedPerAgent(newElapsed);
                setTotalElapsed(state.startedAt ? now - state.startedAt : 0);
            }, 100); // Update every 100ms for smooth counter
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            // Set final durations
            if (state.startedAt && state.completedAt) {
                setTotalElapsed(state.completedAt - state.startedAt);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, state.agentStatuses, state.agentStartTimes, state.agentDurations, state.startedAt, state.completedAt]);

    return {
        agentStatuses: state.agentStatuses,
        elapsedPerAgent,
        totalElapsed,
        isActive: isRunning,
    };
}
