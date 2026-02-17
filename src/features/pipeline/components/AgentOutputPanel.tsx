/**
 * AgentOutputPanel
 * Renders a single agent's output with status, timing, and actions.
 */

"use client";

import React, { useState } from "react";
import type { AgentOutputEntry } from "../types/pipeline.types";
import { AGENT_DISPLAY_NAMES, type AgentKey } from "../types/agent.types";
import { formatDuration, formatDate } from "../utils/formatters";
import { copyToClipboard, exportAgentResult } from "../utils/exportUtils";

const AGENT_ACCENTS: Record<AgentKey, string> = {
    productAnalysis: "#f97316",
    scriptWriter: "#a855f7",
    videoDirector: "#06b6d4",
    captionGenerator: "#10b981",
};

const AGENT_ICONS: Record<AgentKey, string> = {
    productAnalysis: "🔍",
    scriptWriter: "✍️",
    videoDirector: "🎬",
    captionGenerator: "📈",
};

interface AgentOutputPanelProps {
    agentKey: AgentKey;
    output: AgentOutputEntry;
}

function RenderValue({ val, accent, depth = 0 }: { val: any; accent: string; depth?: number }) {
    if (Array.isArray(val)) {
        return (
            <div className={depth > 0 ? "pl-3" : ""}>
                {val.map((item, i) => (
                    <div key={i} className="flex gap-1.5 mb-0.5">
                        <span style={{ color: accent }} className="opacity-50">▸</span>
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

export function AgentOutputPanel({ agentKey, output }: AgentOutputPanelProps) {
    const [copied, setCopied] = useState(false);
    const accent = AGENT_ACCENTS[agentKey];
    const icon = AGENT_ICONS[agentKey];
    const name = AGENT_DISPLAY_NAMES[agentKey];

    const statusColors: Record<string, { bg: string; text: string; label: string }> = {
        pending: { bg: "#1e293b", text: "#64748b", label: "PENDING" },
        running: { bg: `${accent}20`, text: accent, label: "RUNNING" },
        complete: { bg: "#10b98120", text: "#10b981", label: "DONE" },
        error: { bg: "#ef444420", text: "#ef4444", label: "ERROR" },
        skipped: { bg: "#06b6d420", text: "#06b6d4", label: "CACHED" },
    };

    const sc = statusColors[output.status] || statusColors.pending;

    const handleCopy = async () => {
        if (!output.result) return;
        await copyToClipboard(JSON.stringify(output.result, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className="rounded-xl overflow-hidden"
            style={{ background: "#0a0f1a", border: "1px solid #0f172a" }}
        >
            {/* Header */}
            <div className="px-5 py-4 flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: `${accent}20`, border: `1px solid ${accent}50` }}
                >
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{name}</span>
                        <span
                            className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded"
                            style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.text}40` }}
                        >
                            {sc.label}
                        </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-500 font-mono">
                        {output.durationMs && <span>{formatDuration(output.durationMs)}</span>}
                        {output.completedAt && <span>· {formatDate(output.completedAt)}</span>}
                    </div>
                </div>

                {/* Action buttons */}
                {output.result && (
                    <div className="flex gap-1.5 shrink-0">
                        <button
                            onClick={handleCopy}
                            className="text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-md transition-all"
                            style={{ background: "#0f172a", color: copied ? "#10b981" : "#94a3b8", border: "1px solid #1e293b" }}
                        >
                            {copied ? "✓ Copied" : "Copy"}
                        </button>
                        <button
                            onClick={() => exportAgentResult(name, output.result)}
                            className="text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-md transition-all"
                            style={{ background: "#0f172a", color: "#94a3b8", border: "1px solid #1e293b" }}
                        >
                            Export
                        </button>
                    </div>
                )}
            </div>

            {/* Error */}
            {output.error && (
                <div className="mx-5 mb-4 px-3.5 py-2.5 rounded-lg text-xs text-red-400" style={{ background: "#ef444410", border: "1px solid #ef444430" }}>
                    ⚠️ {output.error}
                </div>
            )}

            {/* Result */}
            {output.result && (
                <div className="border-t px-5 py-4" style={{ borderColor: "#0f172a" }}>
                    <div className="flex flex-col gap-2">
                        {Object.entries(output.result).map(([key, val]) => (
                            <div
                                key={key}
                                className="rounded-lg p-2.5 px-3.5"
                                style={{ background: "#0f172a", border: "1px solid #1e293b" }}
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
    );
}
