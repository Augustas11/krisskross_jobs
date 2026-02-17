"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { PIPELINE_AGENTS } from "@/lib/pipeline/agents";
import { buildAllShotPrompts } from "@/lib/pipeline/shotPromptBuilder";
import { AgentCard } from "./AgentCard";
import { ShotPreview } from "./ShotPreview";
import {
    createHistoryEntry,
    updateAgentStatus,
    updateHistoryStatus,
} from "@/features/pipeline/services/historyService";
import { createThumbnail } from "@/features/pipeline/services/imageService";
import type {
    AgentStatusType,
    VideoComposerOutput,
    ProductAnalysis,
} from "@/types";

export function PipelineClient() {
    // Image state
    const [image, setImage] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Pipeline state
    const [agentStates, setAgentStates] = useState<Record<number, AgentStatusType>>({
        0: "idle",
        1: "idle",
        2: "idle",
        3: "idle",
    });
    const [agentResults, setAgentResults] = useState<Record<number, any>>({});
    const [agentErrors, setAgentErrors] = useState<Record<number, string>>({});
    const [running, setRunning] = useState(false);

    // History tracking
    const historyIdRef = useRef<string | null>(null);
    const pipelineStartRef = useRef<number | null>(null);

    // Phase 5: Seedance state
    const [shotStates, setShotStates] = useState<Record<number, string>>({});
    const [shotPrompts, setShotPrompts] = useState<Record<number, string>>({});
    const [shotVideos, setShotVideos] = useState<Record<number, string>>({});
    const [shotErrors, setShotErrors] = useState<Record<number, string>>({});
    const [seedanceRunning, setSeedanceRunning] = useState(false);

    // Image upload
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

            // Reset pipeline state
            setAgentStates({ 0: "idle", 1: "idle", 2: "idle", 3: "idle" });
            setAgentResults({});
            setAgentErrors({});
        },
        []
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) {
                const fakeEvent = {
                    target: { files: [file] },
                } as any;
                handleImageUpload(fakeEvent);
            }
        },
        [handleImageUpload]
    );

    // Run pipeline via SSE
    const runPipeline = async () => {
        if (!imageBase64) return;
        setRunning(true);
        setAgentStates({ 0: "idle", 1: "idle", 2: "idle", 3: "idle" });
        setAgentResults({});
        setAgentErrors({});
        pipelineStartRef.current = Date.now();

        // Create history entry
        try {
            const thumb = image ? await createThumbnail(image) : "";
            const entry = createHistoryEntry({
                imageUrl: image || `data:image/jpeg;base64,${imageBase64}`,
                thumbnailUrl: thumb,
                fileName: "product.jpg",
            });
            historyIdRef.current = entry.id;
        } catch (e) {
            console.warn("Failed to create history entry:", e);
        }

        try {
            const response = await fetch("/api/pipeline/run", {
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

                // Parse SSE events
                const lines = buffer.split("\n");
                buffer = lines.pop() || ""; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;

                    try {
                        const data = JSON.parse(line.slice(6));

                        if (data.type === "complete") {
                            // Persist completion to history
                            if (historyIdRef.current) {
                                const totalMs = pipelineStartRef.current
                                    ? Date.now() - pipelineStartRef.current
                                    : null;
                                updateHistoryStatus(historyIdRef.current, "complete", {
                                    totalDurationMs: totalMs,
                                    apiCostEstimate: 0.075, // ~$0.03 vision + 3×$0.015
                                });
                            }
                            break;
                        }

                        if (data.type === "fatal_error") {
                            throw new Error(data.error);
                        }

                        if (data.agentIndex !== undefined) {
                            if (data.status === "running") {
                                setAgentStates((s) => ({
                                    ...s,
                                    [data.agentIndex]: "running",
                                }));
                                if (historyIdRef.current) {
                                    updateAgentStatus(historyIdRef.current, data.agentIndex, {
                                        status: "running",
                                        startedAt: new Date().toISOString(),
                                    });
                                }
                            } else if (data.status === "done") {
                                setAgentStates((s) => ({
                                    ...s,
                                    [data.agentIndex]: "done",
                                }));
                                setAgentResults((r) => ({
                                    ...r,
                                    [data.agentIndex]: data.result,
                                }));
                                if (historyIdRef.current) {
                                    updateAgentStatus(historyIdRef.current, data.agentIndex, {
                                        status: "complete",
                                        result: data.result,
                                        completedAt: new Date().toISOString(),
                                    });
                                }
                            } else if (data.status === "error") {
                                setAgentStates((s) => ({
                                    ...s,
                                    [data.agentIndex]: "error",
                                }));
                                setAgentErrors((e) => ({
                                    ...e,
                                    [data.agentIndex]: data.error,
                                }));
                                if (historyIdRef.current) {
                                    updateAgentStatus(historyIdRef.current, data.agentIndex, {
                                        status: "error",
                                        error: data.error,
                                        completedAt: new Date().toISOString(),
                                    });
                                    updateHistoryStatus(historyIdRef.current, "failed");
                                }
                            }
                        }
                    } catch {
                        // Skip malformed JSON lines
                    }
                }
            }
        } catch (err: any) {
            console.error("Pipeline error:", err);
        } finally {
            setRunning(false);
        }
    };

    // Phase 5: Generate shots via API
    const generateShots = async () => {
        const composerResult = agentResults[2] as VideoComposerOutput;
        const productAnalysis = (agentResults[0] as ProductAnalysis) || null;
        if (!composerResult?.shots?.length) return;

        setSeedanceRunning(true);
        setShotVideos({});
        setShotErrors({});

        // Build prompts client-side (deterministic, instant)
        const promptMap = buildAllShotPrompts(composerResult, productAnalysis);
        const prompts: Record<number, string> = {};
        promptMap.forEach((val, key) => {
            prompts[key] = val.prompt;
        });
        setShotPrompts(prompts);

        // Initialize states
        const initStates: Record<number, string> = {};
        promptMap.forEach((_, key) => {
            initStates[key] = "submitting";
        });
        setShotStates(initStates);

        try {
            const response = await fetch("/api/pipeline/shots", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ composerResult, productAnalysis, productImageBase64: imageBase64 }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Shot generation failed");
            }

            // Update states from response
            const newStates: Record<number, string> = {};
            const newVideos: Record<number, string> = {};
            const newErrors: Record<number, string> = {};

            Object.entries(data.shots).forEach(([idx, shot]: [string, any]) => {
                const i = parseInt(idx);
                newStates[i] = shot.status;
                if (shot.videoUrl) newVideos[i] = shot.videoUrl;
                if (shot.error) newErrors[i] = shot.error;
            });

            setShotStates(newStates);
            setShotVideos(newVideos);
            setShotErrors(newErrors);
        } catch (err: any) {
            console.error("Shot generation error:", err);
        } finally {
            setSeedanceRunning(false);
        }
    };

    const allDone = Object.values(agentStates).every((s) => s === "done");
    const anyRunning = Object.values(agentStates).some((s) => s === "running");

    return (
        <div className="min-h-screen" style={{ background: "#020617" }}>
            {/* Header */}
            <div
                className="sticky top-0 z-10 border-b border-slate-800/50 px-8 py-5 flex items-center justify-between"
                style={{ background: "#020617", backdropFilter: "blur(8px)" }}
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
                            PRODUCT → VIDEO PIPELINE
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* History link */}
                    <Link
                        href="/history"
                        className="text-[11px] font-mono font-bold px-3 py-1.5 rounded-lg transition-all"
                        style={{
                            color: "#94a3b8",
                            background: "#0f172a",
                            border: "1px solid #1e293b",
                        }}
                    >
                        📋 History
                    </Link>

                    {/* Status dots */}
                    <div className="flex gap-1.5 items-center bg-slate-800/50 border border-slate-700/50 rounded-md px-2.5 py-1.5">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    background:
                                        agentStates[i] === "done"
                                            ? "#10b981"
                                            : agentStates[i] === "running"
                                                ? PIPELINE_AGENTS[i].accent
                                                : agentStates[i] === "error"
                                                    ? "#ef4444"
                                                    : "#1e293b",
                                    boxShadow:
                                        agentStates[i] === "running"
                                            ? `0 0 6px ${PIPELINE_AGENTS[i].accent}`
                                            : "none",
                                    animation:
                                        agentStates[i] === "running"
                                            ? "pulse-dot 1.5s ease-in-out infinite"
                                            : "none",
                                }}
                            />
                        ))}
                        <span className="text-[10px] text-slate-600 font-mono ml-1">
                            {allDone ? "COMPLETE" : anyRunning ? "RUNNING" : "READY"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1100px] mx-auto px-6 py-8">
                {/* Upload + Trigger */}
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-8">
                    {/* Upload area */}
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
                                aspectRatio: "4/5",
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
                                4-Agent
                                <br />
                                <span className="text-orange-500">Modular</span> Pipeline
                            </div>
                            <div className="text-sm text-slate-500 leading-relaxed mb-5">
                                Each agent is specialized for a single task. Output from one
                                becomes input to the next — easier to debug, test, and
                                iterate per component independently.
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {PIPELINE_AGENTS.map((agent) => (
                                    <div
                                        key={agent.id}
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
                                            {agent.label} · {agent.role}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-200">
                                            {agent.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={runPipeline}
                            disabled={!imageBase64 || running}
                            className="mt-5 w-full rounded-[10px] py-3.5 px-6 text-sm font-bold tracking-tight transition-all disabled:cursor-not-allowed"
                            style={{
                                background:
                                    !imageBase64 || running
                                        ? "#0f172a"
                                        : "linear-gradient(135deg, #f97316, #a855f7)",
                                color: !imageBase64 || running ? "#334155" : "white",
                            }}
                        >
                            {running
                                ? "⟳  Pipeline Running..."
                                : allDone
                                    ? "↺  Run Again"
                                    : "▶  Run Pipeline"}
                        </button>
                    </div>
                </div>

                {/* Agent Cards */}
                <div className="text-[10px] text-slate-500 tracking-[0.12em] font-mono mb-3">
                    AGENT OUTPUTS
                </div>

                <div className="flex flex-col gap-0.5">
                    {PIPELINE_AGENTS.map((agent, i) => (
                        <AgentCard
                            key={agent.id}
                            index={i}
                            label={agent.label}
                            name={agent.name}
                            role={agent.role}
                            description={agent.description}
                            accent={agent.accent}
                            icon={agent.icon}
                            status={agentStates[i]}
                            result={agentResults[i] || null}
                            error={agentErrors[i] || null}
                            previousDone={i > 0 && agentStates[i - 1] === "done"}
                        />
                    ))}
                </div>

                {/* Pipeline Complete Summary */}
                {allDone && (
                    <div
                        className="mt-6 rounded-2xl p-6 px-7"
                        style={{
                            background: "linear-gradient(135deg, #0a0f1a, #0f172a)",
                            border: "1px solid #10b98130",
                            boxShadow: "0 0 40px #10b98110",
                        }}
                    >
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-sm">
                                ✅
                            </div>
                            <div>
                                <div className="text-[9px] text-emerald-500 font-mono tracking-[0.12em] font-bold">
                                    PIPELINE COMPLETE
                                </div>
                                <div className="text-sm font-bold text-slate-100">
                                    Ready to generate your TikTok video
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2.5">
                            {PIPELINE_AGENTS.map((agent, i) => (
                                <div
                                    key={i}
                                    className="text-center rounded-lg p-2.5"
                                    style={{
                                        background: "#020617",
                                        border: `1px solid ${agent.accent}30`,
                                    }}
                                >
                                    <div className="text-base mb-1">{agent.icon}</div>
                                    <div
                                        className="text-[10px] font-mono font-bold"
                                        style={{ color: agent.accent }}
                                    >
                                        {agent.label}
                                    </div>
                                    <div className="text-[11px] text-slate-400 mt-0.5">
                                        {agent.name}
                                    </div>
                                    <div className="text-[10px] text-emerald-500 font-mono mt-1">
                                        ✓ DONE
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div
                            className="mt-4 p-3 px-4 rounded-lg text-xs text-slate-500 font-mono leading-relaxed"
                            style={{
                                background: "#020617",
                                border: "1px solid #1e293b",
                            }}
                        >
                            <span className="text-emerald-500">→</span> All 4 agents
                            completed successfully.{" "}
                            <span className="text-slate-400">
                                Product insights, video script, shot composition, and TikTok
                                metadata are ready. Each agent&apos;s output is independently
                                debuggable and can be re-run in isolation.
                            </span>
                        </div>
                    </div>
                )}

                {/* Phase 5: Seedance Shot Generation */}
                {agentResults[2]?.shots?.length > 0 && (
                    <ShotPreview
                        shots={agentResults[2].shots}
                        hasOpeningShot={!!agentResults[2]?.opening_shot}
                        shotStates={shotStates}
                        shotPrompts={shotPrompts}
                        shotVideos={shotVideos}
                        shotErrors={shotErrors}
                        seedanceRunning={seedanceRunning}
                        seedanceConfigured={true} // Server handles the key
                        onGenerate={generateShots}
                        productImage={image}
                    />
                )}
            </div>

            {/* Pulse animation */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
        </div>
    );
}
