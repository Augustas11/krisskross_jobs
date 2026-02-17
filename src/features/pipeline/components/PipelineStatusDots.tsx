/**
 * PipelineStatusDots
 * Reusable 4-dot status indicator for pipeline agents.
 */

"use client";

import React from "react";
import type { AgentStatus } from "../types/pipeline.types";

const STATUS_COLORS: Record<AgentStatus, string> = {
    complete: "#10b981",
    running: "#f97316",
    error: "#ef4444",
    pending: "#1e293b",
    skipped: "#06b6d4",
};

const AGENT_ACCENTS = ["#f97316", "#a855f7", "#06b6d4", "#10b981"];

interface PipelineStatusDotsProps {
    statuses: Record<number, AgentStatus> | AgentStatus[];
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
}

export function PipelineStatusDots({
    statuses,
    size = "sm",
    showLabel = true,
}: PipelineStatusDotsProps) {
    const dim = size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2 h-2" : "w-2.5 h-2.5";
    const gap = size === "sm" ? "gap-1" : "gap-1.5";

    // Normalize to array
    const statusArr: AgentStatus[] = Array.isArray(statuses)
        ? statuses
        : [statuses[0], statuses[1], statuses[2], statuses[3]];

    const allComplete = statusArr.every((s) => s === "complete" || s === "skipped");
    const anyRunning = statusArr.some((s) => s === "running");
    const anyError = statusArr.some((s) => s === "error");

    const labelText = allComplete ? "COMPLETE" : anyRunning ? "RUNNING" : anyError ? "ERROR" : "READY";
    const labelColor = allComplete ? "#10b981" : anyRunning ? "#f97316" : anyError ? "#ef4444" : "#64748b";

    return (
        <div className={`flex ${gap} items-center`}>
            {statusArr.map((status, i) => (
                <div
                    key={i}
                    className={`${dim} rounded-full transition-all duration-300`}
                    style={{
                        background:
                            status === "running"
                                ? AGENT_ACCENTS[i]
                                : STATUS_COLORS[status] || STATUS_COLORS.pending,
                        boxShadow:
                            status === "running" ? `0 0 6px ${AGENT_ACCENTS[i]}` : "none",
                        animation: status === "running" ? "pulse-dot 1.5s ease-in-out infinite" : "none",
                    }}
                />
            ))}
            {showLabel && (
                <span
                    className="text-[10px] font-mono font-bold tracking-wider ml-1"
                    style={{ color: labelColor }}
                >
                    {labelText}
                </span>
            )}
        </div>
    );
}
