"use client";

import React, { useState } from "react";
import type { AgentStatusType } from "@/types";

interface AgentCardProps {
    index: number;
    label: string;
    name: string;
    role: string;
    description: string;
    accent: string;
    icon: string;
    status: AgentStatusType;
    result: any | null;
    error: string | null;
    previousDone: boolean;
}

function RenderValue({
    val,
    accent,
    depth = 0,
}: {
    val: any;
    accent: string;
    depth?: number;
}) {
    if (Array.isArray(val)) {
        return (
            <div className={depth > 0 ? "pl-3" : ""}>
                {val.map((item, i) => (
                    <div key={i} className="flex gap-1.5 mb-0.5">
                        <span style={{ color: accent }} className="opacity-50">
                            ▸
                        </span>
                        <span className="text-slate-300">
                            {typeof item === "object" ? (
                                <RenderValue val={item} accent={accent} depth={depth + 1} />
                            ) : (
                                String(item)
                            )}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    if (typeof val === "object" && val !== null) {
        return (
            <div className="pl-3 border-l border-slate-800">
                {Object.entries(val).map(([k, v]) => (
                    <div key={k} className="mb-1">
                        <span className="text-slate-500 text-[10px] uppercase tracking-wider font-mono">
                            {k.replace(/_/g, " ")}
                        </span>
                        <div className="mt-0.5">
                            <RenderValue val={v} accent={accent} depth={depth + 1} />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return <span className="text-slate-200">{String(val)}</span>;
}

export function AgentCard({
    index,
    label,
    name,
    role,
    description,
    accent,
    icon,
    status,
    result,
    error,
    previousDone,
}: AgentCardProps) {
    const [expanded, setExpanded] = useState(false);

    const statusConfig: Record<
        string,
        { bg: string; text: string; label: string }
    > = {
        idle: { bg: "bg-slate-800", text: "text-slate-500", label: "IDLE" },
        running: { bg: "bg-opacity-20", text: "", label: "RUNNING" },
        done: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-500",
            label: "DONE",
        },
        error: { bg: "bg-red-500/10", text: "text-red-500", label: "ERROR" },
    };

    const cfg = statusConfig[status] || statusConfig.idle;

    return (
        <div>
            {/* Connector line between agents */}
            {index > 0 && (
                <div className="flex items-center px-5 gap-1.5">
                    <div
                        className="w-px h-6 ml-[19px] transition-all duration-500"
                        style={{
                            background: previousDone
                                ? `linear-gradient(to bottom, ${accent}60, ${accent}30)`
                                : "#0f172a",
                        }}
                    />
                    {previousDone && (
                        <span className="text-[10px] text-slate-700 font-mono ml-1">
                            context passed →
                        </span>
                    )}
                </div>
            )}

            <div
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                    background: "#0a0f1a",
                    border: `1px solid ${expanded ? accent + "40" : "#0f172a"}`,
                    boxShadow: status === "running" ? `0 0 20px ${accent}20` : "none",
                }}
            >
                {/* Card Header */}
                <div
                    onClick={() => result && setExpanded(!expanded)}
                    className="px-5 py-4 flex items-center gap-3.5"
                    style={{ cursor: result ? "pointer" : "default" }}
                >
                    {/* Agent Icon */}
                    <div
                        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-lg shrink-0"
                        style={{
                            background: `${accent}20`,
                            border: `1px solid ${accent}50`,
                        }}
                    >
                        {icon}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span
                                className="text-[9px] font-mono font-bold tracking-[0.12em]"
                                style={{ color: accent }}
                            >
                                {label} · {role}
                            </span>
                            {/* Status Pill */}
                            <span
                                className="rounded px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] font-mono"
                                style={{
                                    background:
                                        status === "running" ? `${accent}20` : undefined,
                                    color:
                                        status === "running"
                                            ? accent
                                            : status === "done"
                                                ? "#10b981"
                                                : status === "error"
                                                    ? "#ef4444"
                                                    : "#64748b",
                                    border: `1px solid ${status === "running" ? accent + "50" : status === "done" ? "#10b98150" : status === "error" ? "#ef444450" : "#1e293b50"}`,
                                }}
                            >
                                {status === "running" && (
                                    <span className="mr-1">◉</span>
                                )}
                                {cfg.label}
                            </span>
                        </div>
                        <div className="text-[15px] font-bold tracking-tight">
                            {name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{description}</div>
                    </div>

                    {/* Expand arrow */}
                    {result && (
                        <div
                            className="text-[10px] text-slate-600 font-mono transition-transform duration-200"
                            style={{
                                transform: expanded ? "rotate(180deg)" : "none",
                            }}
                        >
                            ▼
                        </div>
                    )}

                    {/* Running animation */}
                    {status === "running" && (
                        <div className="flex gap-1">
                            {[0, 1, 2].map((j) => (
                                <div
                                    key={j}
                                    className="w-1 h-1 rounded-full animate-pulse"
                                    style={{
                                        background: accent,
                                        animationDelay: `${j * 200}ms`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-5 mb-4 px-3.5 py-2.5 rounded-lg bg-red-500/5 border border-red-500/20 text-xs text-red-400">
                        ⚠️ {error}
                    </div>
                )}

                {/* Expanded Results */}
                {expanded && result && (
                    <div className="border-t border-slate-800/50 px-5 py-4 pb-5">
                        <div className="flex flex-col gap-2">
                            {Object.entries(result).map(([key, val]) => (
                                <div
                                    key={key}
                                    className="rounded-lg p-2.5 px-3.5"
                                    style={{
                                        background: "#0f172a",
                                        border: "1px solid #1e293b",
                                    }}
                                >
                                    <div
                                        className="text-[10px] font-bold tracking-[0.1em] uppercase font-mono mb-1.5"
                                        style={{ color: accent }}
                                    >
                                        {key.replace(/_/g, " ")}
                                    </div>
                                    <div className="text-[13px] leading-relaxed">
                                        <RenderValue val={val} accent={accent} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
