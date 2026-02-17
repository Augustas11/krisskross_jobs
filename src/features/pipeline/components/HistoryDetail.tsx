/**
 * HistoryDetail
 * Full detail view for a single pipeline history entry with tabbed agent outputs.
 */

"use client";

import React, { useState, useCallback } from "react";
import { usePipelineDetail } from "../hooks/usePipelineHistory";
import { AgentOutputPanel } from "./AgentOutputPanel";
import { PipelineStatusDots } from "./PipelineStatusDots";
import { AGENT_KEYS, AGENT_DISPLAY_NAMES, type AgentKey } from "../types/agent.types";
import { formatDate, formatDuration, formatCost, estimateCost } from "../utils/formatters";
import { exportAsJSON, copyToClipboard } from "../utils/exportUtils";

interface HistoryDetailProps {
    id: string;
    onBack: () => void;
}

export function HistoryDetail({ id, onBack }: HistoryDetailProps) {
    const { entry, loading, updateTags, updateNotes } = usePipelineDetail(id);
    const [activeTab, setActiveTab] = useState<AgentKey>("productAnalysis");
    const [tagInput, setTagInput] = useState("");
    const [showNotes, setShowNotes] = useState(false);
    const [copiedAll, setCopiedAll] = useState(false);

    const handleAddTag = useCallback(() => {
        if (!entry || !tagInput.trim()) return;
        const newTags = [...entry.metadata.tags, tagInput.trim().toLowerCase().replace(/\s+/g, "-")];
        updateTags(newTags);
        setTagInput("");
    }, [entry, tagInput, updateTags]);

    const handleRemoveTag = useCallback(
        (tag: string) => {
            if (!entry) return;
            updateTags(entry.metadata.tags.filter((t) => t !== tag));
        },
        [entry, updateTags]
    );

    const handleCopyAll = useCallback(async () => {
        if (!entry) return;
        const allResults = {
            productAnalysis: entry.agents.productAnalysis.result,
            scriptWriter: entry.agents.scriptWriter.result,
            videoDirector: entry.agents.videoDirector.result,
            captionGenerator: entry.agents.captionGenerator.result,
        };
        await copyToClipboard(JSON.stringify(allResults, null, 2));
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    }, [entry]);

    const handleExportAll = useCallback(() => {
        if (!entry) return;
        exportAsJSON([entry], `pipeline-${entry.id.slice(0, 8)}.json`);
    }, [entry]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#060a12" }}>
                <div className="text-slate-600 text-sm font-mono">Loading...</div>
            </div>
        );
    }

    if (!entry) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#060a12" }}>
                <div className="text-center">
                    <div className="text-3xl mb-3">🔍</div>
                    <div className="text-slate-400 text-sm font-bold">History entry not found</div>
                    <button
                        onClick={onBack}
                        className="mt-4 text-xs font-mono font-bold text-orange-400 hover:text-orange-300"
                    >
                        ← Back to History
                    </button>
                </div>
            </div>
        );
    }

    const statusMap = {
        0: entry.agents.productAnalysis.status,
        1: entry.agents.scriptWriter.status,
        2: entry.agents.videoDirector.status,
        3: entry.agents.captionGenerator.status,
    };

    const analysis = entry.agents.productAnalysis.result;
    const productName = analysis?.sub_category || analysis?.category || "Product";

    const completedCount = Object.values(statusMap).filter(
        (s) => s === "complete" || s === "skipped"
    ).length;
    const cost = entry.metadata.apiCostEstimate ?? estimateCost(completedCount, statusMap[0] !== "skipped");

    return (
        <div className="min-h-screen" style={{ background: "#060a12" }}>
            {/* Header */}
            <div
                className="sticky top-0 z-10 border-b px-8 py-5 flex items-center justify-between"
                style={{ background: "#060a12", borderColor: "#1e293b50" }}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="text-xs font-mono font-bold text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="w-px h-5" style={{ background: "#1e293b" }} />
                    <div>
                        <div className="text-sm font-bold tracking-tight text-slate-100 capitalize">
                            {productName}
                        </div>
                        <div className="text-[10px] text-slate-500 tracking-[0.1em] font-mono">
                            {formatDate(entry.createdAt)}
                        </div>
                    </div>
                </div>
                <PipelineStatusDots statuses={statusMap} size="md" />
            </div>

            <div className="max-w-[1100px] mx-auto px-6 py-8">
                {/* Product Image + Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 mb-8">
                    {/* Image */}
                    <div>
                        <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-2">
                            PRODUCT IMAGE
                        </div>
                        <div
                            className="rounded-xl overflow-hidden"
                            style={{ background: "#0a0f1a", border: "1px solid #1e293b", aspectRatio: "4/5" }}
                        >
                            {entry.product.imageUrl ? (
                                <img
                                    src={entry.product.imageUrl}
                                    alt={productName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-3xl">📦</div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-2">
                                RUN SUMMARY
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Status", value: entry.status.toUpperCase(), color: entry.status === "complete" ? "#10b981" : entry.status === "failed" ? "#ef4444" : "#f97316" },
                                    { label: "Duration", value: formatDuration(entry.metadata.totalDurationMs), color: "#94a3b8" },
                                    { label: "Cost", value: formatCost(cost), color: "#94a3b8" },
                                    { label: "Retries", value: String(entry.metadata.retryCount), color: "#94a3b8" },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="rounded-lg p-3"
                                        style={{ background: "#0a0f1a", border: "1px solid #0f172a" }}
                                    >
                                        <div className="text-[9px] text-slate-600 font-mono tracking-wider mb-1">
                                            {item.label}
                                        </div>
                                        <div className="text-sm font-bold font-mono" style={{ color: item.color }}>
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Tags */}
                            <div className="mt-4">
                                <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-2">
                                    TAGS
                                </div>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                    {entry.metadata.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="group text-[10px] font-mono font-bold px-2 py-1 rounded-md cursor-pointer transition-all"
                                            style={{ background: "#1e293b", color: "#94a3b8" }}
                                            onClick={() => handleRemoveTag(tag)}
                                            title="Click to remove"
                                        >
                                            {tag} <span className="opacity-0 group-hover:opacity-100 text-red-400 ml-0.5">×</span>
                                        </span>
                                    ))}
                                    <div className="flex gap-1">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                                            placeholder="+ Add tag"
                                            className="text-[10px] font-mono px-2 py-1 rounded-md outline-none w-20"
                                            style={{ background: "#0f172a", color: "#94a3b8", border: "1px solid #1e293b" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Global Actions */}
                        <div className="flex flex-wrap gap-2 mt-5">
                            <button
                                onClick={handleCopyAll}
                                className="text-[11px] font-mono font-bold px-4 py-2 rounded-lg transition-all"
                                style={{ background: "#0f172a", color: copiedAll ? "#10b981" : "#94a3b8", border: "1px solid #1e293b" }}
                            >
                                {copiedAll ? "✓ Copied All" : "📋 Copy All Outputs"}
                            </button>
                            <button
                                onClick={handleExportAll}
                                className="text-[11px] font-mono font-bold px-4 py-2 rounded-lg transition-all"
                                style={{ background: "#0f172a", color: "#94a3b8", border: "1px solid #1e293b" }}
                            >
                                📥 Export JSON
                            </button>
                            <button
                                onClick={() => setShowNotes(!showNotes)}
                                className="text-[11px] font-mono font-bold px-4 py-2 rounded-lg transition-all"
                                style={{ background: "#0f172a", color: "#94a3b8", border: "1px solid #1e293b" }}
                            >
                                📝 Notes
                            </button>
                        </div>

                        {/* Notes */}
                        {showNotes && (
                            <div className="mt-3">
                                <textarea
                                    value={entry.metadata.notes}
                                    onChange={(e) => updateNotes(e.target.value)}
                                    placeholder="Add notes about this run..."
                                    className="w-full text-xs font-medium px-4 py-3 rounded-lg outline-none resize-none h-20"
                                    style={{ background: "#0a0f1a", border: "1px solid #1e293b", color: "#e2e8f0" }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Agent Output Tabs */}
                <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-3">
                    AGENT OUTPUTS
                </div>

                {/* Tab bar */}
                <div
                    className="flex gap-1 p-1 rounded-xl mb-4"
                    style={{ background: "#0a0f1a", border: "1px solid #1e293b" }}
                >
                    {AGENT_KEYS.map((key, i) => {
                        const isActive = activeTab === key;
                        const accent = ["#f97316", "#a855f7", "#06b6d4", "#10b981"][i];
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className="flex-1 text-[11px] font-mono font-bold px-3 py-2 rounded-lg transition-all"
                                style={{
                                    background: isActive ? `${accent}15` : "transparent",
                                    color: isActive ? accent : "#64748b",
                                    border: isActive ? `1px solid ${accent}30` : "1px solid transparent",
                                }}
                            >
                                {AGENT_DISPLAY_NAMES[key]}
                            </button>
                        );
                    })}
                </div>

                {/* Active Tab Content */}
                <AgentOutputPanel
                    agentKey={activeTab}
                    output={entry.agents[activeTab]}
                />
            </div>
        </div>
    );
}
