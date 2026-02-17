/**
 * CacheHitDialog
 * Modal shown when a previously-analyzed product image is detected.
 */

"use client";

import React from "react";
import type { CachedAnalysis } from "../types/pipeline.types";
import { formatDate } from "../utils/formatters";

interface CacheHitDialogProps {
    cacheHit: CachedAnalysis;
    open: boolean;
    onUseCache: () => void;
    onReanalyze: () => void;
}

export function CacheHitDialog({ cacheHit, open, onUseCache, onReanalyze }: CacheHitDialogProps) {
    if (!open) return null;

    const analysis = cacheHit.analysis;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div
                className="rounded-2xl p-8 max-w-md w-full mx-4"
                style={{
                    background: "#0a0f1a",
                    border: "1px solid #1e293b",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
                }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: "#06b6d420", border: "1px solid #06b6d450" }}
                    >
                        ⚡
                    </div>
                    <div>
                        <div className="text-[10px] text-cyan-400 font-mono tracking-[0.12em] font-bold">
                            CACHE HIT
                        </div>
                        <div className="text-sm font-bold text-slate-100">
                            Product Recognized
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div
                    className="rounded-xl p-4 mb-5"
                    style={{ background: "#0f172a", border: "1px solid #1e293b" }}
                >
                    <div className="text-xs text-slate-500 font-mono mb-2">Previous Analysis</div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between">
                            <span className="text-[11px] text-slate-500">Category</span>
                            <span className="text-[11px] text-slate-200 font-medium">{analysis.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[11px] text-slate-500">Style</span>
                            <span className="text-[11px] text-slate-200 font-medium">{analysis.style_aesthetic}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[11px] text-slate-500">Analyzed</span>
                            <span className="text-[11px] text-slate-200 font-medium">{formatDate(cacheHit.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[11px] text-slate-500">Used in</span>
                            <span className="text-[11px] text-slate-200 font-medium">{cacheHit.historyIds.length} run(s)</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    We&apos;ve analyzed this product before. Using the cached result skips Agent 01 (saves ~$0.03 and 5-10 seconds).
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onUseCache}
                        className="flex-1 rounded-xl py-3 text-sm font-bold transition-all"
                        style={{
                            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                            color: "white",
                        }}
                    >
                        ⚡ Use Cached
                    </button>
                    <button
                        onClick={onReanalyze}
                        className="flex-1 rounded-xl py-3 text-sm font-bold transition-all"
                        style={{
                            background: "#0f172a",
                            color: "#94a3b8",
                            border: "1px solid #1e293b",
                        }}
                    >
                        🔄 Re-analyze
                    </button>
                </div>
            </div>
        </div>
    );
}
