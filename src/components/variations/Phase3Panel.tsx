"use client";

import React from "react";
import type {
    VariationResult,
    VariationComposeOutput,
    ProductAnalysis,
} from "@/types";
import type { VariationSeed } from "@/lib/variations/variationSeeds";

interface Phase3PanelProps {
    seed: VariationSeed;
    result: VariationResult;
    product: ProductAnalysis | null;
    shotVideoStates: Record<number, string>;
    shotVideoUrls: Record<number, string>;
    shotVideoErrors: Record<number, string>;
    phase3Running: boolean;
    onGenerate: () => void;
}

export function Phase3Panel({
    seed,
    result,
    product,
    shotVideoStates,
    shotVideoUrls,
    shotVideoErrors,
    phase3Running,
    onGenerate,
}: Phase3PanelProps) {
    const compose = result.compose;
    const optimize = result.optimize;
    const script = result.script;
    const shots = compose?.shots || [];
    const remainingShots = shots.filter((s) => s.n > 1);

    return (
        <div
            className="mt-6 rounded-2xl overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #080d14, #0a0f1a)",
                border: "1px solid #f9731630",
                animation: "fadeIn 0.4s ease-out",
            }}
        >
            {/* Header */}
            <div
                className="px-6 py-4 border-b"
                style={{ borderColor: "#0f172a" }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
                            style={{
                                background: "#f97316",
                                color: "white",
                            }}
                        >
                            ✓
                        </div>
                        <div>
                            <div className="text-[9px] text-orange-500 font-mono tracking-[0.12em] font-bold">
                                SELECTED VARIATION
                            </div>
                            <div className="text-sm font-bold text-slate-100">
                                {seed.label}
                            </div>
                        </div>
                    </div>
                    {optimize?.virality_score != null && (
                        <div
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                                background:
                                    optimize.virality_score >= 8
                                        ? "#10b98120"
                                        : optimize.virality_score >= 6
                                            ? "#f9731620"
                                            : "#64748b20",
                                color:
                                    optimize.virality_score >= 8
                                        ? "#10b981"
                                        : optimize.virality_score >= 6
                                            ? "#f97316"
                                            : "#64748b",
                            }}
                        >
                            Virality: {optimize.virality_score}/10
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left column — details */}
                <div
                    className="p-6 border-r"
                    style={{ borderColor: "#0f172a" }}
                >
                    {/* Shot 1 Preview */}
                    {result.imageUrl && (
                        <div className="mb-5">
                            <div className="text-[9px] text-slate-500 font-mono tracking-[0.12em] mb-2">
                                SHOT 1 · PREVIEW
                            </div>
                            <img
                                src={result.imageUrl}
                                alt="Shot 1 preview"
                                className="w-full rounded-lg"
                                style={{
                                    aspectRatio: "9/16",
                                    objectFit: "cover",
                                    maxHeight: 320,
                                }}
                            />
                        </div>
                    )}

                    {/* Hook */}
                    {script?.hook?.text && (
                        <div className="mb-4">
                            <div className="text-[9px] text-purple-400 font-mono tracking-[0.12em] mb-1">
                                HOOK
                            </div>
                            <div
                                className="text-sm font-semibold italic rounded-lg p-3"
                                style={{
                                    color: "#e2e8f0",
                                    background: "#0f172a",
                                    borderLeft: "3px solid #a855f7",
                                }}
                            >
                                &ldquo;{script.hook.text}&rdquo;
                            </div>
                        </div>
                    )}

                    {/* Caption */}
                    {optimize?.caption?.full_caption && (
                        <div className="mb-4">
                            <div className="text-[9px] text-emerald-400 font-mono tracking-[0.12em] mb-1">
                                CAPTION
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed">
                                {optimize.caption.full_caption}
                            </div>
                        </div>
                    )}

                    {/* Hashtags */}
                    {optimize?.hashtags && (
                        <div>
                            <div className="text-[9px] text-emerald-400 font-mono tracking-[0.12em] mb-2">
                                HASHTAGS
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    ...(optimize.hashtags.niche || []),
                                    ...(optimize.hashtags.mid || []),
                                    ...(optimize.hashtags.trending || []),
                                ].map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] px-2 py-0.5 rounded-full"
                                        style={{
                                            background: "#0f172a",
                                            color: "#94a3b8",
                                            border: "1px solid #1e293b",
                                        }}
                                    >
                                        {tag.startsWith("#") ? tag : `#${tag}`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right column — shot generation */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="text-[9px] text-cyan-400 font-mono tracking-[0.12em] font-bold">
                            05 · BYTEPLUS SEEDANCE 1.5 · VIDEO SHOTS
                        </div>
                    </div>

                    {/* Shot list */}
                    <div className="flex flex-col gap-2 mb-5">
                        {/* Opening Shot / Shot 1 — shows Seedream preview */}
                        <div
                            className="rounded-lg p-3"
                            style={{
                                background: "#020617",
                                border: "1px solid #1e293b",
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono font-bold text-orange-400">
                                        OPEN
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                        {compose?.opening_shot?.angle || "wide"} · 3s
                                    </span>
                                </div>
                                <span className="text-[9px] font-mono text-emerald-400">
                                    ✓ PREVIEW
                                </span>
                            </div>
                            {result.imageUrl && (
                                <img
                                    src={result.imageUrl}
                                    alt="Opening shot"
                                    className="w-full rounded object-cover"
                                    style={{ maxHeight: 120 }}
                                />
                            )}
                        </div>

                        {/* Remaining shots */}
                        {remainingShots.map((shot) => {
                            const st = shotVideoStates[shot.n] || "idle";
                            const videoUrl = shotVideoUrls[shot.n];
                            const error = shotVideoErrors[shot.n];

                            return (
                                <div
                                    key={shot.n}
                                    className="rounded-lg p-3"
                                    style={{
                                        background: "#020617",
                                        border: `1px solid ${st === "done" ? "#10b98130" : "#1e293b"}`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-mono font-bold text-cyan-400">
                                                SH {String(shot.n).padStart(2, "0")}
                                            </span>
                                            <span className="text-[10px] text-slate-500">
                                                {shot.type} · {shot.secs}s
                                            </span>
                                        </div>
                                        <span
                                            className="text-[9px] font-mono"
                                            style={{
                                                color:
                                                    st === "done"
                                                        ? "#10b981"
                                                        : st === "polling"
                                                            ? "#06b6d4"
                                                            : st === "submitting"
                                                                ? "#f97316"
                                                                : st === "error"
                                                                    ? "#ef4444"
                                                                    : "#64748b",
                                            }}
                                        >
                                            {st === "done"
                                                ? "✓ DONE"
                                                : st === "polling"
                                                    ? "⟳ POLLING..."
                                                    : st === "submitting"
                                                        ? "↑ SUBMITTING"
                                                        : st === "error"
                                                            ? "✗ ERROR"
                                                            : "IDLE"}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-600 truncate mb-2">
                                        {shot.focus || "—"}
                                    </div>
                                    {videoUrl && (
                                        <video
                                            src={videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            controls
                                            className="w-full rounded"
                                            style={{ maxHeight: 180 }}
                                        />
                                    )}
                                    {error && (
                                        <div className="text-[10px] text-red-400 mt-1">
                                            {error}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Generate button */}
                    <button
                        onClick={onGenerate}
                        disabled={phase3Running || remainingShots.length === 0}
                        className="w-full rounded-[10px] py-3 px-5 text-sm font-bold tracking-tight transition-all disabled:cursor-not-allowed"
                        style={{
                            background:
                                phase3Running || remainingShots.length === 0
                                    ? "#0f172a"
                                    : "linear-gradient(135deg, #06b6d4, #a855f7)",
                            color:
                                phase3Running || remainingShots.length === 0
                                    ? "#334155"
                                    : "white",
                        }}
                    >
                        {phase3Running
                            ? "⟳  Generating..."
                            : `▶  Generate ${remainingShots.length} Video Shot${remainingShots.length !== 1 ? "s" : ""} via BytePlus Seedance 1.5`}
                    </button>
                </div>
            </div>
        </div>
    );
}
