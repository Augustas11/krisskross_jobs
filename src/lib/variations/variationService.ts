/**
 * Variation Service
 * Server-side orchestration for the 12-variation pipeline.
 * Handles Anthropic LLM calls + BytePlus Seedream/Seedance API calls.
 * MUST only be imported from server-side code (API routes).
 */

import type { VariationSeed } from "./variationSeeds";
import {
    AGENT_01_SYSTEM_PROMPT,
    buildAgent02Prompt,
    buildAgent03Prompt,
    buildAgent04Prompt,
} from "./variationAgents";

// ─── API Keys (server-side env vars) ─────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ANTHROPIC_MODEL = "claude-sonnet-4-5-20250929";
const BYTEPLUS_API_KEY = process.env.BYTEPLUS_API_KEY || "";
const BYTEPLUS_BASE = "https://ark.ap-southeast.bytepluses.com/api/v3";

// ─── Anthropic LLM calls ─────────────────────────────────────────────────────

export async function callAgentWithImage(
    systemPrompt: string,
    imageBase64: string
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
            system: systemPrompt,
            messages: [
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
                        { type: "text", text: "Analyze this product image." },
                    ],
                },
            ],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agent 01 failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.stop_reason === "max_tokens") {
        throw new Error("Agent 01 response truncated — increase max_tokens");
    }
    return JSON.parse(
        data.content[0].text.replace(/```json\n?|```/g, "").trim()
    );
}

export async function callAgentText(
    systemPrompt: string,
    userMessage: string
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
            system: systemPrompt,
            messages: [{ role: "user", content: userMessage }],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Agent call failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (data.stop_reason === "max_tokens") {
        throw new Error("Response truncated — increase max_tokens");
    }
    return JSON.parse(
        data.content[0].text.replace(/```json\n?|```/g, "").trim()
    );
}

// ─── BytePlus Seedream API (synchronous image generation) ─────────────────────

export async function generateShotImage(prompt: string): Promise<string> {
    const res = await fetch(`${BYTEPLUS_BASE}/images/generations`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${BYTEPLUS_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "seedream-4-5-251128",
            prompt,
            size: "2K",
            response_format: "url",
            watermark: false,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Seedream image failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    return data.data[0].url;
}

// ─── BytePlus Seedance API (async video generation) ────────────────────────────

export async function submitSeedanceJob(
    prompt: string,
    durationSecs: number
): Promise<string> {
    const dur = Math.max(2, Math.min(12, durationSecs || 5));
    const res = await fetch(`${BYTEPLUS_BASE}/contents/generations/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${BYTEPLUS_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "seedance-1-5-pro-250524",
            content: [
                {
                    type: "text",
                    text: `${prompt} --resolution 720p --duration ${dur} --aspect_ratio 9:16`,
                },
            ],
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Seedance submit failed: ${res.status} - ${errorText}`);
    }

    const data = await res.json();
    const taskId = data?.id;
    if (!taskId) throw new Error("No task id returned from Seedance");
    return taskId;
}

export async function pollSeedanceJob(taskId: string): Promise<string> {
    const MAX_POLLS = 48; // 48 × 5s = 4 min max

    for (let i = 0; i < MAX_POLLS; i++) {
        await new Promise((r) => setTimeout(r, 5000));

        const res = await fetch(
            `${BYTEPLUS_BASE}/contents/generations/tasks/${taskId}`,
            {
                headers: { Authorization: `Bearer ${BYTEPLUS_API_KEY}` },
            }
        );

        if (!res.ok)
            throw new Error(`Seedance poll failed: ${res.status}`);

        const data = await res.json();
        const status = data?.status?.toLowerCase();

        if (status === "succeeded") {
            const videoUrl =
                data?.content?.[0]?.video_url ||
                data?.result?.video_url;
            if (!videoUrl)
                throw new Error("No video_url in Seedance response");
            return videoUrl;
        }
        if (status === "failed") {
            throw new Error(
                data?.error?.message || "Seedance generation failed"
            );
        }
    }

    throw new Error("Seedance timed out after 4 minutes");
}

// ─── Prompt Builders (deterministic, no LLM) ──────────────────────────────────

export function buildShot1Prompt(variation: {
    script?: any;
    compose?: any;
    product?: any;
}): string {
    // Prefer the script's image_gen_prompt for scene 1 if available
    const scriptPrompt = variation.script?.scenes?.[0]?.image_gen_prompt;
    if (scriptPrompt) return scriptPrompt;

    // Fallback: assemble from composer + product fields
    const parts: string[] = [];
    const shot = variation.compose?.shots?.[0];
    const typeMap: Record<string, string> = {
        "close-up": "Extreme close-up shot",
        medium: "Medium shot",
        wide: "Wide shot",
    };
    if (shot?.type) parts.push(typeMap[shot.type] || `${shot.type} shot`);
    if (shot?.focus) parts.push(`of ${shot.focus}`);
    if (variation.compose?.model_direction)
        parts.push(`fashion model ${variation.compose.model_direction}`);
    if (variation.compose?.background)
        parts.push(`${variation.compose.background} setting`);
    if (variation.compose?.color_grade)
        parts.push(`${variation.compose.color_grade} color grade`);
    if (variation.product?.style_aesthetic)
        parts.push(`${variation.product.style_aesthetic} aesthetic`);
    if (variation.product?.primary_colors?.length)
        parts.push(
            `${variation.product.primary_colors.slice(0, 2).join(" and ")} color palette`
        );
    parts.push(
        "9:16 vertical framing, TikTok fashion video, cinematic quality, photorealistic"
    );
    return parts.join(", ");
}

export function buildShotVideoPrompt(
    shot: any,
    compose: any,
    product: any
): string {
    const typeMap: Record<string, string> = {
        "close-up": "Extreme close-up",
        medium: "Medium shot",
        wide: "Wide establishing shot",
    };
    const movMap: Record<string, string> = {
        pan: "slow horizontal pan",
        zoom: "smooth zoom in",
        static: "static camera",
        tilt: "gentle tilt",
    };
    return [
        typeMap[shot.type] || `${shot.type} shot`,
        shot.focus && `focusing on ${shot.focus}`,
        shot.movement && (movMap[shot.movement] || `${shot.movement} camera`),
        compose?.model_direction &&
        `fashion model: ${compose.model_direction}`,
        compose?.background && `setting: ${compose.background}`,
        compose?.color_grade && `color grade: ${compose.color_grade}`,
        product?.style_aesthetic && `${product.style_aesthetic} aesthetic`,
        "cinematic quality, photorealistic, TikTok fashion video",
    ]
        .filter(Boolean)
        .join(", ");
}

// ─── Per-variation pipeline runner ────────────────────────────────────────────

export interface VariationEvent {
    type:
    | "phase1_done"
    | "variation_script_done"
    | "variation_compose_done"
    | "variation_image_done"
    | "variation_optimize_done"
    | "variation_script_error"
    | "variation_compose_error"
    | "variation_image_error"
    | "variation_optimize_error"
    | "complete"
    | "fatal_error";
    seedId?: string;
    data?: any;
    error?: string;
}

/**
 * Run the full variation pipeline as an async generator yielding SSE events.
 * Phase 1: Agent 01 (once)
 * Phase 2: 12 variations in parallel (agents 02→03→Seedream→04 each)
 */
export async function* runVariationPipeline(
    imageBase64: string,
    seeds: VariationSeed[]
): AsyncGenerator<VariationEvent> {
    // ── Phase 1: Product Analyzer ──
    let productAnalysis: any;
    try {
        productAnalysis = await callAgentWithImage(
            AGENT_01_SYSTEM_PROMPT,
            imageBase64
        );
        yield { type: "phase1_done", data: productAnalysis };
    } catch (err: any) {
        yield { type: "fatal_error", error: `Agent 01 failed: ${err.message}` };
        return;
    }

    // ── Phase 2: 12 variations in parallel ──
    // We can't yield from inside Promise.all callbacks, so we collect events
    // and yield them in order. We use a shared queue pattern.
    const eventQueue: VariationEvent[] = [];
    let resolveWait: (() => void) | null = null;

    function pushEvent(event: VariationEvent) {
        eventQueue.push(event);
        if (resolveWait) {
            resolveWait();
            resolveWait = null;
        }
    }

    async function runSingleVariation(seed: VariationSeed) {
        const productCompact = JSON.stringify(productAnalysis);

        // Agent 02 — Script Generator
        let scriptResult: any;
        try {
            scriptResult = await callAgentText(
                buildAgent02Prompt(seed),
                productCompact
            );
            pushEvent({
                type: "variation_script_done",
                seedId: seed.id,
                data: scriptResult,
            });
        } catch (err: any) {
            pushEvent({
                type: "variation_script_error",
                seedId: seed.id,
                error: err.message,
            });
            return;
        }

        // Agent 03 — Video Composer
        let composeResult: any;
        try {
            const productSummary = {
                category: productAnalysis.category,
                style_aesthetic: productAnalysis.style_aesthetic,
                primary_colors: productAnalysis.primary_colors,
                key_selling_points: productAnalysis.key_selling_points,
            };
            const scriptSummary = {
                hook: scriptResult.hook,
                scenes: scriptResult.scenes,
            };
            composeResult = await callAgentText(
                buildAgent03Prompt(seed),
                `Product:${JSON.stringify(productSummary)}\nScript:${JSON.stringify(scriptSummary)}`
            );
            pushEvent({
                type: "variation_compose_done",
                seedId: seed.id,
                data: composeResult,
            });
        } catch (err: any) {
            pushEvent({
                type: "variation_compose_error",
                seedId: seed.id,
                error: err.message,
            });
            return;
        }

        // Seedream — Shot 1 preview image (runs immediately after Agent 03)
        try {
            const shot1Prompt = buildShot1Prompt({
                script: scriptResult,
                compose: composeResult,
                product: productAnalysis,
            });
            const imageUrl = await generateShotImage(shot1Prompt);
            pushEvent({
                type: "variation_image_done",
                seedId: seed.id,
                data: { imageUrl, prompt: shot1Prompt },
            });
        } catch (err: any) {
            pushEvent({
                type: "variation_image_error",
                seedId: seed.id,
                error: err.message,
            });
            // Continue to Agent 04 even if image fails
        }

        // Agent 04 — TikTok Optimizer
        try {
            const metaSummary = {
                category: productAnalysis.category,
                demographic: productAnalysis.target_demographic,
                trend: productAnalysis.tiktok_trend_match,
                occasion: productAnalysis.occasion,
                hook_text: scriptResult.hook?.text,
                angle: scriptResult.angle,
                cta: scriptResult.cta,
                color_grade: composeResult?.color_grade,
            };
            const optimizeResult = await callAgentText(
                buildAgent04Prompt(seed),
                JSON.stringify(metaSummary)
            );
            pushEvent({
                type: "variation_optimize_done",
                seedId: seed.id,
                data: optimizeResult,
            });
        } catch (err: any) {
            pushEvent({
                type: "variation_optimize_error",
                seedId: seed.id,
                error: err.message,
            });
        }
    }

    // Fire all 12 variations in parallel
    let allDone = false;
    const variationPromise = Promise.all(
        seeds.map((seed) => runSingleVariation(seed))
    ).then(() => {
        allDone = true;
        pushEvent({ type: "complete" });
    });

    // Drain event queue as events arrive
    while (!allDone || eventQueue.length > 0) {
        if (eventQueue.length > 0) {
            yield eventQueue.shift()!;
        } else {
            // Wait for next event
            await new Promise<void>((resolve) => {
                resolveWait = resolve;
                // Safety: also resolve if all done
                variationPromise.then(() => {
                    if (resolveWait === resolve) {
                        resolve();
                    }
                });
            });
        }
    }
}
