/**
 * Pipeline Service
 * Server-side orchestration for the 4-agent pipeline + Seedance video generation.
 * MUST only be imported from server-side code (API routes).
 */

import { PIPELINE_AGENTS, type PipelineAgent } from "./agents";
import type {
    ProductAnalysis,
    ScriptOutput,
    VideoComposerOutput,
    TikTokMetadata,
} from "@/types";

// ─── Anthropic API ─────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929";

export async function callAgent(
    agent: PipelineAgent,
    messages: Array<{ role: string; content: any }>
): Promise<any> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: ANTHROPIC_MODEL,
            max_tokens: 2048,
            system: agent.systemPrompt,
            messages,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Agent ${agent.name} failed: ${response.status} ${response.statusText} - ${errorText}`
        );
    }

    const data = await response.json();

    if (data.stop_reason === "max_tokens") {
        throw new Error(
            `Agent ${agent.name} response was cut off — JSON truncated. Try again.`
        );
    }

    const text = data.content?.[0]?.text || "";
    const cleaned = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(cleaned);
}

/**
 * Build the messages array for each agent based on its index and prior results
 */
function buildAgentMessages(
    agentIndex: number,
    imageBase64: string | null,
    results: Record<number, any>
): Array<{ role: string; content: any }> {
    switch (agentIndex) {
        case 0:
            return [
                {
                    role: "user",
                    content: [
                        {
                            type: "image",
                            source: {
                                type: "base64",
                                media_type: "image/jpeg",
                                data: imageBase64,
                            },
                        },
                        {
                            type: "text",
                            text: "Analyze this product image and return the JSON analysis.",
                        },
                    ],
                },
            ];
        case 1:
            return [
                {
                    role: "user",
                    content: `Generate a TikTok video script for this product.\n\nProduct Analysis:\n${JSON.stringify(results[0], null, 2)}`,
                },
            ];
        case 2: {
            const scriptSummary = {
                hook: results[1]?.hook,
                content_angle: results[1]?.content_angle,
                total_duration_seconds: results[1]?.total_duration_seconds,
                scenes: results[1]?.scenes,
            };
            const productSummary = {
                category: results[0]?.category,
                style_aesthetic: results[0]?.style_aesthetic,
                primary_colors: results[0]?.primary_colors,
                key_selling_points: results[0]?.key_selling_points,
            };
            return [
                {
                    role: "user",
                    content: `Create shot composition.\n\nProduct:${JSON.stringify(productSummary)}\n\nScript:${JSON.stringify(scriptSummary)}`,
                },
            ];
        }
        case 3: {
            const metaSummary = {
                category: results[0]?.category,
                target_demographic: results[0]?.target_demographic,
                tiktok_trend_match: results[0]?.tiktok_trend_match,
                occasion: results[0]?.occasion,
                hook: results[1]?.hook?.text,
                content_angle: results[1]?.content_angle,
                call_to_action: results[1]?.call_to_action,
                color_grade: results[2]?.color_grade,
            };
            return [
                {
                    role: "user",
                    content: `Optimize TikTok metadata for maximum reach.\n\nContext:${JSON.stringify(metaSummary)}`,
                },
            ];
        }
        default:
            throw new Error(`Unknown agent index: ${agentIndex}`);
    }
}

export interface PipelineProgress {
    agentIndex: number;
    agentName: string;
    status: "running" | "done" | "error";
    result?: any;
    error?: string;
}

/**
 * Run the full 4-agent pipeline, yielding progress events.
 * This is an async generator for SSE streaming.
 */
export async function* runPipeline(
    imageBase64: string
): AsyncGenerator<PipelineProgress> {
    const results: Record<number, any> = {};

    for (let i = 0; i < PIPELINE_AGENTS.length; i++) {
        const agent = PIPELINE_AGENTS[i];

        // Emit "running" event
        yield {
            agentIndex: i,
            agentName: agent.name,
            status: "running",
        };

        try {
            const messages = buildAgentMessages(i, imageBase64, results);
            const result = await callAgent(agent, messages);
            results[i] = result;

            // Emit "done" event with result
            yield {
                agentIndex: i,
                agentName: agent.name,
                status: "done",
                result,
            };
        } catch (err: any) {
            // Emit "error" event
            yield {
                agentIndex: i,
                agentName: agent.name,
                status: "error",
                error: err.message,
            };
            // Stop pipeline on error
            return;
        }
    }
}

// ─── BytePlus Video Generation API ────────────────────────────────────────────
// Uses the same BytePlus endpoint + BYTEPLUS_API_KEY as /api/generate

const BYTEPLUS_API_KEY = process.env.BYTEPLUS_API_KEY || "";
const BYTEPLUS_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";

export async function submitVideoJob(
    prompt: string,
    _durationSecs: number
): Promise<string> {
    const res = await fetch(`${BYTEPLUS_BASE}/contents/generations/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${BYTEPLUS_API_KEY}`,
        },
        body: JSON.stringify({
            model: "seedance-1-5-pro-251215",
            content: [{ type: "text", text: prompt }],
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`BytePlus submit failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    if (!data?.id) {
        throw new Error("No task ID returned from BytePlus");
    }
    return data.id;
}

export async function pollVideoJob(
    taskId: string,
    onProgress?: (status: string, poll: number) => void
): Promise<string> {
    const MAX_POLLS = 40; // ~2 min at 3s interval

    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((r) => setTimeout(r, 3000));

        const res = await fetch(
            `${BYTEPLUS_BASE}/contents/generations/tasks/${taskId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${BYTEPLUS_API_KEY}`,
                },
            }
        );

        if (!res.ok) {
            throw new Error(`BytePlus poll failed: ${res.status}`);
        }

        const data = await res.json();
        const status = data?.status;

        onProgress?.(status || "unknown", i);

        // BytePlus returns 'SUCCEEDED' or 'succeeded'
        if (status === "SUCCEEDED" || status === "succeeded") {
            const url = data?.result?.video_url || data?.content?.video_url;
            if (!url) throw new Error("No video URL in BytePlus response");
            return url;
        }

        if (status === "FAILED" || status === "failed") {
            throw new Error(
                data?.error?.message || "BytePlus video generation failed"
            );
        }
    }

    throw new Error("BytePlus video generation timed out after 2 minutes");
}
