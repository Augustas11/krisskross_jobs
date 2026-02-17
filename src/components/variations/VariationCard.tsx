"use client";

import React from "react";
import type { VariationStates, VariationResult } from "@/types";
import type { VariationSeed } from "@/lib/variations/variationSeeds";

interface VariationCardProps {
    seed: VariationSeed;
    states: VariationStates;
    result: VariationResult;
    isSelected: boolean;
    onClick: () => void;
}

export function VariationCard({
    seed,
    states,
    result,
    isSelected,
    onClick,
}: VariationCardProps) {
    const imageReady = states.image === "done" && result.imageUrl;
    const isGenerating =
        states.script === "running" ||
        states.compose === "running" ||
        states.image === "loading";
    const canSelect = states.image === "done";
    const viralityScore = result.optimize?.virality_score;

    // Stage bar progress
    const stages = [
        { label: "SC", status: states.script, color: "#a855f7" },
        { label: "CM", status: states.compose, color: "#06b6d4" },
        { label: "IM", status: states.image, color: "#f97316" },
    ];

    // Virality badge color
    const viralityColor =
        viralityScore != null
            ? viralityScore >= 8
                ? "#10b981"
                : viralityScore >= 6
                    ? "#f97316"
                    : "#64748b"
            : "#64748b";

    return (
        <div
            onClick={canSelect ? onClick : undefined}
            className="relative rounded-lg overflow-hidden transition-all duration-300"
            style={{
                aspectRatio: "9/16",
                background: "#080d14",
                border: isSelected
                    ? "2px solid #f97316"
                    : "1px solid #0f172a",
                cursor: canSelect ? "pointer" : "default",
                boxShadow: isSelected
                    ? "0 0 20px #f9731640"
                    : "none",
            }}
        >
            {/* Full-bleed preview image */}
            {imageReady ? (
                <img
                    src={result.imageUrl!}
                    alt={seed.label}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    style={{
                        opacity: 1,
                        filter: canSelect ? "none" : "brightness(0.7)",
                    }}
                />
            ) : (
                // Shimmer animation when generating
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg, #080d14 25%, #0f172a 50%, #080d14 75%)",
                            backgroundSize: "200% 100%",
                            animation: isGenerating
                                ? "shimmer 2s infinite ease-in-out"
                                : "none",
                        }}
                    />
                </div>
            )}

            {/* Hover brightness overlay for loaded cards */}
            {canSelect && !isSelected && (
                <div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                />
            )}

            {/* Selected badge */}
            {isSelected && (
                <div
                    className="absolute top-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider z-10"
                    style={{
                        background: "#f97316",
                        color: "white",
                    }}
                >
                    SELECTED
                </div>
            )}

            {/* Virality score badge (top-right) */}
            {viralityScore != null && (
                <div
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10"
                    style={{
                        background: `${viralityColor}20`,
                        color: viralityColor,
                        border: `1px solid ${viralityColor}40`,
                        backdropFilter: "blur(8px)",
                    }}
                >
                    {viralityScore}
                </div>
            )}

            {/* Stage bars (visible during generation, hidden when image is showing) */}
            {!imageReady && (
                <div className="absolute bottom-10 left-3 right-3 flex flex-col gap-1 z-10">
                    {stages.map((stage) => (
                        <div key={stage.label} className="flex items-center gap-1.5">
                            <span
                                className="text-[8px] font-mono font-bold w-4"
                                style={{ color: stage.color }}
                            >
                                {stage.label}
                            </span>
                            <div
                                className="flex-1 h-1 rounded-full overflow-hidden"
                                style={{ background: "#0f172a" }}
                            >
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width:
                                            stage.status === "done"
                                                ? "100%"
                                                : stage.status === "running" || stage.status === "loading"
                                                    ? "60%"
                                                    : "0%",
                                        background: stage.color,
                                        opacity:
                                            stage.status === "running" || stage.status === "loading"
                                                ? 0.7
                                                : 1,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Variation ID (top-left, only during generation) */}
            {!imageReady && (
                <div
                    className="absolute top-3 left-3 text-[11px] font-bold tracking-wide z-10"
                    style={{ color: "#e2e8f0" }}
                >
                    VAR {seed.id.replace("v", "")}
                </div>
            )}

            {/* Seed label (bottom bar) */}
            <div
                className="absolute bottom-0 left-0 right-0 py-1.5 px-3 z-10"
                style={{
                    background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                }}
            >
                <div
                    className="text-[10px] font-medium tracking-wide"
                    style={{ color: "#e2e8f0" }}
                >
                    {seed.label}
                </div>
            </div>
        </div>
    );
}
