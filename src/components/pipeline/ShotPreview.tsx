"use client";

import React from "react";

interface ShotData {
    _isOpening?: boolean;
    type?: string;
    focus?: string;
    angle?: string;
    movement?: string;
    model_pose?: string;
    transition?: string;
    secs?: number;
}

interface ShotPreviewProps {
    shots: ShotData[];
    hasOpeningShot: boolean;
    shotStates: Record<number, string>;
    shotPrompts: Record<number, string>;
    shotVideos: Record<number, string>;
    shotErrors: Record<number, string>;
    seedanceRunning: boolean;
    seedanceConfigured: boolean;
    onGenerate: () => void;
}

export function ShotPreview({
    shots,
    hasOpeningShot,
    shotStates,
    shotPrompts,
    shotVideos,
    shotErrors,
    seedanceRunning,
    seedanceConfigured,
    onGenerate,
}: ShotPreviewProps) {
    const allShots: ShotData[] = hasOpeningShot
        ? [
            { _isOpening: true, type: "wide", secs: 3, ...shots[0] },
            ...shots.slice(hasOpeningShot ? 0 : 0),
        ]
        : shots;

    return (
        <div
            className="mt-6 rounded-2xl overflow-hidden"
            style={{
                background: "#080d14",
                border: "1px solid #06b6d430",
            }}
        >
            {/* Header */}
            <div className="px-6 py-[18px] border-b border-slate-800/50 flex items-center justify-between">
                <div>
                    <div className="text-[9px] text-cyan-500 font-mono tracking-[0.14em] font-bold mb-1">
                        05 · BYTEPLUS · SHOT GENERATION
                    </div>
                    <div className="text-[15px] font-bold tracking-tight text-slate-100">
                        Generate Video Shots
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                        Each shot from Agent 03 → BytePlus prompt → 9:16 video clip
                    </div>
                </div>
                <div className="text-2xl">🎥</div>
            </div>

            {/* Shots */}
            <div className="p-6">
                <div className="flex flex-col gap-2.5 mb-4">
                    {allShots.map((shot, displayIdx) => {
                        const shotIdx = shot._isOpening
                            ? -1
                            : displayIdx - (hasOpeningShot ? 1 : 0);
                        const state = shotStates[shotIdx];
                        const videoUrl = shotVideos[shotIdx];
                        const error = shotErrors[shotIdx];
                        const prompt = shotPrompts[shotIdx] || "";

                        const isDone = state === "done";
                        const isRunning =
                            state &&
                            !isDone &&
                            state !== "error" &&
                            state !== "idle";
                        const pollStatus = state?.startsWith("polling:")
                            ? state.split(":")[1]
                            : null;

                        return (
                            <div
                                key={shotIdx}
                                className="rounded-[10px] overflow-hidden transition-all duration-300"
                                style={{
                                    background: "#020617",
                                    border: `1px solid ${isDone ? "#06b6d440" : isRunning ? "#06b6d420" : "#0f172a"}`,
                                    boxShadow: isRunning ? "0 0 16px #06b6d415" : "none",
                                }}
                            >
                                <div className="flex">
                                    {/* Left: shot metadata */}
                                    <div className="flex-1 p-3 px-3.5">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <span className="text-[9px] text-cyan-500 font-mono font-bold tracking-[0.1em]">
                                                {shot._isOpening
                                                    ? "OPEN"
                                                    : `SHOT ${shotIdx + 1}`}
                                            </span>
                                            <span className="text-[9px] text-slate-600 font-mono bg-slate-800/50 rounded px-1.5 py-0.5">
                                                {shot._isOpening ? "wide" : shot.type} ·{" "}
                                                {shot._isOpening ? "3" : shot.secs}s
                                            </span>
                                            {state && (
                                                <span
                                                    className="text-[9px] font-mono font-bold rounded px-1.5 py-0.5"
                                                    style={{
                                                        color: isDone
                                                            ? "#10b981"
                                                            : error
                                                                ? "#ef4444"
                                                                : "#06b6d4",
                                                        background: isDone
                                                            ? "#10b98115"
                                                            : error
                                                                ? "#ef444415"
                                                                : "#06b6d415",
                                                        border: `1px solid ${isDone ? "#10b98130" : error ? "#ef444430" : "#06b6d430"}`,
                                                    }}
                                                >
                                                    {isDone
                                                        ? "✓ DONE"
                                                        : error
                                                            ? "✗ ERR"
                                                            : pollStatus || state?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        {/* Prompt */}
                                        {prompt && (
                                            <div className="text-[11px] text-slate-400 leading-relaxed border-l-2 border-cyan-500/30 pl-2.5 mb-1.5">
                                                {prompt}
                                            </div>
                                        )}

                                        {error && (
                                            <div className="text-[11px] text-red-400 mt-1">
                                                ⚠️ {error}
                                            </div>
                                        )}

                                        {/* Tags */}
                                        <div className="flex gap-1.5 flex-wrap">
                                            {[
                                                shot._isOpening ? shot.angle : shot.focus,
                                                shot._isOpening
                                                    ? shot.model_pose
                                                    : shot.movement,
                                                !shot._isOpening && shot.transition,
                                            ]
                                                .filter(Boolean)
                                                .map((tag, ti) => (
                                                    <span
                                                        key={ti}
                                                        className="text-[9px] text-slate-600 font-mono bg-slate-800/50 rounded px-1.5 py-0.5 border border-slate-700/50"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                        </div>
                                    </div>

                                    {/* Right: video player */}
                                    <div
                                        className="w-[90px] shrink-0 border-l border-slate-800/50 flex items-center justify-center relative overflow-hidden"
                                        style={{ background: "#0a0f1a" }}
                                    >
                                        {videoUrl ? (
                                            <video
                                                src={videoUrl}
                                                controls
                                                autoPlay
                                                loop
                                                muted
                                                className="w-full h-full object-cover"
                                            />
                                        ) : isRunning ? (
                                            <div className="text-center p-2">
                                                <div className="flex flex-col gap-1 items-center">
                                                    {[0, 1, 2].map((j) => (
                                                        <div
                                                            key={j}
                                                            className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"
                                                            style={{
                                                                animationDelay: `${j * 200}ms`,
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-2xl opacity-20">▶</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Generate button */}
                <button
                    onClick={onGenerate}
                    disabled={!seedanceConfigured || seedanceRunning}
                    className="w-full rounded-lg py-3 text-xs font-bold tracking-[0.06em] font-mono transition-all disabled:cursor-not-allowed"
                    style={{
                        background:
                            !seedanceConfigured || seedanceRunning
                                ? "#0f172a"
                                : "linear-gradient(135deg, #06b6d4, #0891b2)",
                        color:
                            !seedanceConfigured || seedanceRunning
                                ? "#334155"
                                : "white",
                    }}
                >
                    {seedanceRunning
                        ? `⟳  Generating ${shots.length} shots via BytePlus...`
                        : Object.keys(shotVideos).length > 0
                            ? "↺  Regenerate All Shots"
                            : `▶  Generate ${shots.length + (hasOpeningShot ? 1 : 0)} Shots via BytePlus`}
                </button>

                {!seedanceConfigured && (
                    <div className="mt-2.5 text-[11px] text-slate-600 text-center font-mono">
                        BYTEPLUS_API_KEY not configured in environment
                    </div>
                )}
            </div>
        </div>
    );
}
