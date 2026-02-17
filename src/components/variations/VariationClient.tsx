"use client";

import React, { useState, useRef, useCallback } from "react";
import { VARIATION_SEEDS } from "@/lib/variations/variationSeeds";
import { VariationCard } from "./VariationCard";
import { Phase3Panel } from "./Phase3Panel";
import type {
    VariationStates,
    VariationResult,
    ProductAnalysis,
} from "@/types";

// ─── Initial state factories ─────────────────────────────────────────────────

function makeInitialStates(): Record<string, VariationStates> {
    const states: Record<string, VariationStates> = {};
    VARIATION_SEEDS.forEach((s) => {
        states[s.id] = {
            script: "idle",
            compose: "idle",
            optimize: "idle",
            image: "idle",
        };
    });
    return states;
}

function makeInitialResults(): Record<string, VariationResult> {
    const results: Record<string, VariationResult> = {};
    VARIATION_SEEDS.forEach((s) => {
        results[s.id] = {
            script: null,
            compose: null,
            optimize: null,
            imageUrl: null,
        };
    });
    return results;
}

export function VariationClient() {
    // Image state
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Phase 1
    const [phase1Status, setPhase1Status] = useState<
        "idle" | "running" | "done" | "error"
    >("idle");
    const [productAnalysis, setProductAnalysis] =
        useState<ProductAnalysis | null>(null);

    // Phase 2
    const [variationStates, setVariationStates] = useState(makeInitialStates);
    const [variationResults, setVariationResults] = useState(
        makeInitialResults
    );
    const [running, setRunning] = useState(false);

    // Phase 3
    const [selectedVariation, setSelectedVariation] = useState<string | null>(
        null
    );
    const [shotVideoStates, setShotVideoStates] = useState<
        Record<number, string>
    >({});
    const [shotVideoUrls, setShotVideoUrls] = useState<
        Record<number, string>
    >({});
    const [shotVideoErrors, setShotVideoErrors] = useState<
        Record<number, string>
    >({});
    const [phase3Running, setPhase3Running] = useState(false);

    // ─── Image upload ─────────────────────────────────────────────────────────

    const handleImageUpload = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            setImage(url);

            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = (ev.target?.result as string).split(",")[1];
                setImageBase64(base64);
            };
            reader.readAsDataURL(file);

            // Reset all state
            setPhase1Status("idle");
            setProductAnalysis(null);
            setVariationStates(makeInitialStates());
            setVariationResults(makeInitialResults());
            setSelectedVariation(null);
            setShotVideoStates({});
            setShotVideoUrls({});
            setShotVideoErrors({});
        },
        []
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) {
                const fakeEvent = { target: { files: [file] } } as any;
                handleImageUpload(fakeEvent);
            }
        },
        [handleImageUpload]
    );

    // ─── Progress counts ──────────────────────────────────────────────────────

    const doneCount = Object.values(variationStates).filter(
        (s) => s.image === "done"
    ).length;
    const generatingCount = Object.values(variationStates).filter(
        (s) =>
            s.script === "running" ||
            s.compose === "running" ||
            s.image === "loading"
    ).length;

    // ─── Phase 1 + 2: Run pipeline via SSE ────────────────────────────────────

    const runPipeline = async () => {
        if (!imageBase64) return;

        setRunning(true);
        setPhase1Status("running");
        setProductAnalysis(null);
        setVariationStates(makeInitialStates());
        setVariationResults(makeInitialResults());
        setSelectedVariation(null);

        // Mark all variations as script:running
        setVariationStates((prev) => {
            const next = { ...prev };
            VARIATION_SEEDS.forEach((s) => {
                next[s.id] = { ...next[s.id], script: "idle" };
            });
            return next;
        });

        try {
            const response = await fetch("/api/variations/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64 }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Pipeline request failed");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No response body");

            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    try {
                        const data = JSON.parse(line.slice(6));

                        if (data.type === "fatal_error") {
                            setPhase1Status("error");
                            throw new Error(data.error);
                        }

                        if (data.type === "phase1_done") {
                            setPhase1Status("done");
                            setProductAnalysis(data.data);
                            // Mark all variations as script:running
                            setVariationStates((prev) => {
                                const next = { ...prev };
                                VARIATION_SEEDS.forEach((s) => {
                                    next[s.id] = {
                                        ...next[s.id],
                                        script: "running",
                                    };
                                });
                                return next;
                            });
                        }

                        if (data.type === "variation_script_done" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    script: "done",
                                    compose: "running",
                                },
                            }));
                            setVariationResults((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    script: data.data,
                                },
                            }));
                        }

                        if (data.type === "variation_script_error" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    script: "error",
                                },
                            }));
                        }

                        if (data.type === "variation_compose_done" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    compose: "done",
                                    image: "loading",
                                },
                            }));
                            setVariationResults((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    compose: data.data,
                                },
                            }));
                        }

                        if (data.type === "variation_compose_error" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    compose: "error",
                                },
                            }));
                        }

                        if (data.type === "variation_image_done" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    image: "done",
                                    optimize: "running",
                                },
                            }));
                            setVariationResults((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    imageUrl: data.data.imageUrl,
                                },
                            }));
                        }

                        if (data.type === "variation_image_error" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    image: "error",
                                    optimize: "running",
                                },
                            }));
                        }

                        if (data.type === "variation_optimize_done" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    optimize: "done",
                                },
                            }));
                            setVariationResults((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    optimize: data.data,
                                },
                            }));
                        }

                        if (data.type === "variation_optimize_error" && data.seedId) {
                            setVariationStates((prev) => ({
                                ...prev,
                                [data.seedId]: {
                                    ...prev[data.seedId],
                                    optimize: "error",
                                },
                            }));
                        }

                        if (data.type === "complete") {
                            break;
                        }
                    } catch {
                        // Skip malformed JSON
                    }
                }
            }
        } catch (err: any) {
            console.error("Variation pipeline error:", err);
        } finally {
            setRunning(false);
        }
    };

    // ─── Phase 3: Generate video shots via SSE ────────────────────────────────

    const generateShots = async () => {
        if (!selectedVariation) return;
        const result = variationResults[selectedVariation];
        if (!result?.compose?.shots?.length) return;

        setPhase3Running(true);
        setShotVideoStates({});
        setShotVideoUrls({});
        setShotVideoErrors({});

        try {
            const response = await fetch("/api/variations/shots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    compose: result.compose,
                    product: productAnalysis,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Shot generation failed");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            if (!reader) throw new Error("No response body");

            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    try {
                        const data = JSON.parse(line.slice(6));

                        if (data.type === "shot_status") {
                            setShotVideoStates((prev) => ({
                                ...prev,
                                [data.shotIndex]: data.status,
                            }));
                        }

                        if (data.type === "shot_done") {
                            setShotVideoStates((prev) => ({
                                ...prev,
                                [data.shotIndex]: "done",
                            }));
                            setShotVideoUrls((prev) => ({
                                ...prev,
                                [data.shotIndex]: data.videoUrl,
                            }));
                        }

                        if (data.type === "shot_error") {
                            setShotVideoStates((prev) => ({
                                ...prev,
                                [data.shotIndex]: "error",
                            }));
                            setShotVideoErrors((prev) => ({
                                ...prev,
                                [data.shotIndex]: data.error,
                            }));
                        }

                        if (data.type === "complete") break;
                    } catch {
                        // Skip malformed JSON
                    }
                }
            }
        } catch (err: any) {
            console.error("Shot generation error:", err);
        } finally {
            setPhase3Running(false);
        }
    };

    // ─── UI ───────────────────────────────────────────────────────────────────

    const selectedSeed = selectedVariation
        ? VARIATION_SEEDS.find((s) => s.id === selectedVariation)
        : null;

    return (
        <div className="min-h-screen" style={{ background: "#020617" }}>
            {/* Header */}
            <div
                className="sticky top-0 z-10 border-b border-slate-800/50 px-8 py-5 flex items-center justify-between"
                style={{
                    background: "#020617",
                    backdropFilter: "blur(8px)",
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white bg-gradient-to-br from-orange-500 to-purple-500">
                        K
                    </div>
                    <div>
                        <div className="text-sm font-bold tracking-tight text-slate-100">
                            KrissKross Creators
                        </div>
                        <div className="text-[10px] text-slate-500 tracking-[0.1em] font-mono">
                            VARIATION ENGINE
                        </div>
                    </div>
                </div>

                <div className="flex gap-1.5 items-center bg-slate-800/50 border border-slate-700/50 rounded-md px-2.5 py-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">
                        01 ONCE → 02-04 ×12 PARALLEL
                    </span>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Upload + Trigger Row */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_auto] gap-6 mb-8">
                    {/* Image drop zone */}
                    <div>
                        <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-2">
                            INPUT / PRODUCT IMAGE
                        </div>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="rounded-xl overflow-hidden flex items-center justify-center relative transition-colors cursor-pointer"
                            style={{
                                border: `2px dashed ${image ? "#1e293b" : "#334155"}`,
                                aspectRatio: "3/4",
                                background: "#0a0f1a",
                            }}
                        >
                            {image ? (
                                <img
                                    src={image}
                                    alt="product"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-5">
                                    <div className="text-3xl mb-2.5">📦</div>
                                    <div className="text-sm text-slate-600">
                                        Drop product image
                                    </div>
                                    <div className="text-[11px] text-slate-700 mt-1">
                                        or click to browse
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>

                    {/* Pipeline overview */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-2">
                                PIPELINE OVERVIEW
                            </div>
                            <div className="text-2xl font-extrabold tracking-tight leading-tight text-slate-100 mb-3">
                                12-Variation
                                <br />
                                <span className="text-orange-500">
                                    Parallel
                                </span>{" "}
                                Engine
                            </div>
                            <div className="text-sm text-slate-500 leading-relaxed mb-5">
                                Upload one product image → see 12 video proposals
                                with real preview images → pick one → generate the
                                remaining shots as actual video clips.
                            </div>

                            {/* Agent overview grid */}
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    {
                                        label: "01",
                                        role: "VISION",
                                        name: "Product Analyzer",
                                        accent: "#f97316",
                                        note: "×1",
                                    },
                                    {
                                        label: "02",
                                        role: "CREATIVE",
                                        name: "Script Generator",
                                        accent: "#a855f7",
                                        note: "×12",
                                    },
                                    {
                                        label: "03",
                                        role: "DIRECTOR",
                                        name: "Video Composer",
                                        accent: "#06b6d4",
                                        note: "×12",
                                    },
                                    {
                                        label: "04",
                                        role: "GROWTH",
                                        name: "TikTok Optimizer",
                                        accent: "#10b981",
                                        note: "×12",
                                    },
                                ].map((agent) => (
                                    <div
                                        key={agent.label}
                                        className="rounded-lg p-2.5 px-3"
                                        style={{
                                            background: "#0a0f1a",
                                            border: "1px solid #0f172a",
                                            borderLeft: `3px solid ${agent.accent}40`,
                                        }}
                                    >
                                        <div
                                            className="text-[9px] font-mono font-bold tracking-[0.1em] mb-0.5"
                                            style={{ color: agent.accent }}
                                        >
                                            {agent.label} · {agent.role} ·{" "}
                                            {agent.note}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-200">
                                            {agent.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Generate button */}
                        <button
                            onClick={runPipeline}
                            disabled={!imageBase64 || running}
                            className="mt-5 w-full rounded-[10px] py-3.5 px-6 text-sm font-bold tracking-tight transition-all disabled:cursor-not-allowed"
                            style={{
                                background:
                                    !imageBase64 || running
                                        ? "#0f172a"
                                        : "linear-gradient(135deg, #f97316, #a855f7)",
                                color:
                                    !imageBase64 || running
                                        ? "#334155"
                                        : "white",
                            }}
                        >
                            {running
                                ? "⟳  Pipeline Running..."
                                : doneCount === 12
                                    ? "↺  Run Again"
                                    : "▶  Generate 12 Proposals"}
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                {(running || doneCount > 0) && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono">
                                {phase1Status === "running"
                                    ? "ANALYZING PRODUCT..."
                                    : `${doneCount}/12 PROPOSALS READY${generatingCount > 0 ? ` · ${generatingCount} GENERATING` : ""}`}
                            </div>
                            {doneCount === 12 && (
                                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                    ✓ ALL COMPLETE
                                </span>
                            )}
                        </div>
                        <div
                            className="h-1 rounded-full overflow-hidden"
                            style={{ background: "#0f172a" }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width:
                                        phase1Status === "running"
                                            ? "8%"
                                            : `${Math.max(8, (doneCount / 12) * 100)}%`,
                                    background:
                                        "linear-gradient(90deg, #f97316, #a855f7)",
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Proposal Grid — 4 columns × 3 rows */}
                {(running || doneCount > 0) && (
                    <div>
                        <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-3">
                            PROPOSALS
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {VARIATION_SEEDS.map((seed) => (
                                <VariationCard
                                    key={seed.id}
                                    seed={seed}
                                    states={variationStates[seed.id]}
                                    result={variationResults[seed.id]}
                                    isSelected={selectedVariation === seed.id}
                                    onClick={() => {
                                        setSelectedVariation(seed.id);
                                        setShotVideoStates({});
                                        setShotVideoUrls({});
                                        setShotVideoErrors({});
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Phase 3 Panel */}
                {selectedVariation && selectedSeed && (
                    <Phase3Panel
                        seed={selectedSeed}
                        result={variationResults[selectedVariation]}
                        product={productAnalysis}
                        shotVideoStates={shotVideoStates}
                        shotVideoUrls={shotVideoUrls}
                        shotVideoErrors={shotVideoErrors}
                        phase3Running={phase3Running}
                        onGenerate={generateShots}
                    />
                )}
            </div>

            {/* CSS animations */}
            <style>{`
                @keyframes shimmer {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.2; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
