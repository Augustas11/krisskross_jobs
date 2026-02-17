/**
 * HistoryCard
 * Individual pipeline history card for the list view.
 */

"use client";

import React, { useState } from "react";
import type { PipelineHistory } from "../types/pipeline.types";
import { PipelineStatusDots } from "./PipelineStatusDots";
import { formatDate, formatDuration, formatCost } from "../utils/formatters";

interface HistoryCardProps {
    entry: PipelineHistory;
    selected: boolean;
    onSelect: (id: string) => void;
    onView: (id: string) => void;
    onDelete: (id: string) => void;
}

export function HistoryCard({ entry, selected, onSelect, onView, onDelete }: HistoryCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const analysis = entry.agents.productAnalysis.result;
    const productName = analysis
        ? `${analysis.sub_category || analysis.category || "Product"}`
        : entry.product.fileName.replace(/\.[^.]+$/, "");
    const productStyle = analysis?.style_aesthetic || "";

    const statusMap = {
        0: entry.agents.productAnalysis.status,
        1: entry.agents.scriptWriter.status,
        2: entry.agents.videoDirector.status,
        3: entry.agents.captionGenerator.status,
    };

    return (
        <div
            className="group rounded-xl transition-all duration-200"
            style={{
                background: "#0a0f1a",
                border: `1px solid ${selected ? "#f9731650" : "#0f172a"}`,
                boxShadow: selected ? "0 0 20px #f9731610" : "none",
            }}
        >
            <div className="flex items-center gap-4 p-4">
                {/* Checkbox */}
                <div
                    onClick={() => onSelect(entry.id)}
                    className="w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer transition-all"
                    style={{
                        borderColor: selected ? "#f97316" : "#334155",
                        background: selected ? "#f97316" : "transparent",
                    }}
                >
                    {selected && (
                        <span className="text-[10px] text-white font-bold">✓</span>
                    )}
                </div>

                {/* Thumbnail */}
                <div
                    className="w-12 h-12 rounded-lg overflow-hidden shrink-0"
                    style={{ background: "#0f172a", border: "1px solid #1e293b" }}
                >
                    {entry.product.imageThumbnailUrl ? (
                        <img
                            src={entry.product.imageThumbnailUrl}
                            alt={productName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">📦</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-bold text-slate-100 truncate capitalize">
                            {productName}
                        </span>
                        {productStyle && (
                            <span className="text-[10px] text-slate-500 font-mono truncate">
                                {productStyle}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                        <span>{formatDate(entry.createdAt)}</span>
                        <span>·</span>
                        <span>{formatDuration(entry.metadata.totalDurationMs)}</span>
                        <span>·</span>
                        <span>{formatCost(entry.metadata.apiCostEstimate)}</span>
                    </div>
                    {entry.metadata.tags.length > 0 && (
                        <div className="flex gap-1 mt-1.5">
                            {entry.metadata.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                                    style={{ background: "#1e293b", color: "#94a3b8" }}
                                >
                                    {tag}
                                </span>
                            ))}
                            {entry.metadata.tags.length > 3 && (
                                <span className="text-[9px] text-slate-600">+{entry.metadata.tags.length - 3}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Status dots */}
                <div className="shrink-0">
                    <PipelineStatusDots statuses={statusMap} size="md" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <button
                        onClick={() => onView(entry.id)}
                        className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-lg transition-all"
                        style={{
                            color: "#f97316",
                            background: "#f9731610",
                            border: "1px solid #f9731630",
                        }}
                    >
                        View
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-slate-600 hover:text-slate-400 transition-colors px-1.5 py-1.5 rounded-lg"
                            style={{ background: menuOpen ? "#0f172a" : "transparent" }}
                        >
                            ⋮
                        </button>
                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                                <div
                                    className="absolute right-0 top-full mt-1 z-20 rounded-lg overflow-hidden min-w-[140px]"
                                    style={{
                                        background: "#0f172a",
                                        border: "1px solid #1e293b",
                                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                                    }}
                                >
                                    <button
                                        onClick={() => { onView(entry.id); setMenuOpen(false); }}
                                        className="w-full text-left text-xs font-medium text-slate-300 px-3 py-2 hover:bg-slate-800 transition-colors"
                                    >
                                        📋 View Details
                                    </button>
                                    <button
                                        onClick={() => { onDelete(entry.id); setMenuOpen(false); }}
                                        className="w-full text-left text-xs font-medium text-red-400 px-3 py-2 hover:bg-red-500/10 transition-colors"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
