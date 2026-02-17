/**
 * Pipeline Shots API Route
 * Generates video shots via BytePlus from Agent 03 output.
 * Admin-only: requires BYTEPLUS_API_KEY.
 */

import { NextRequest, NextResponse } from "next/server";
import {
    submitVideoJob,
    pollVideoJob,
} from "@/lib/pipeline/pipelineService";
import { buildAllShotPrompts } from "@/lib/pipeline/shotPromptBuilder";
import type { VideoComposerOutput, ProductAnalysis } from "@/types";

export const maxDuration = 180; // 3 min for parallel shot generation

export async function POST(req: NextRequest) {
    try {
        const { composerResult, productAnalysis, productImageBase64 } = (await req.json()) as {
            composerResult: VideoComposerOutput;
            productAnalysis: ProductAnalysis | null;
            productImageBase64?: string | null;
        };

        if (!composerResult?.shots?.length) {
            return NextResponse.json(
                { error: "composerResult with shots is required" },
                { status: 400 }
            );
        }

        if (!process.env.BYTEPLUS_API_KEY) {
            return NextResponse.json(
                { error: "BYTEPLUS_API_KEY not configured" },
                { status: 500 }
            );
        }

        // Build all prompts
        const promptMap = buildAllShotPrompts(composerResult, productAnalysis);

        // Submit + poll all shots in parallel, passing product image as first_frame_image
        const results: Record<
            number,
            { status: string; videoUrl?: string; error?: string; prompt: string }
        > = {};

        await Promise.all(
            Array.from(promptMap.entries()).map(async ([idx, { prompt, durationSecs }]) => {
                try {
                    const taskId = await submitVideoJob(prompt, durationSecs, productImageBase64);
                    const videoUrl = await pollVideoJob(taskId);
                    results[idx] = { status: "done", videoUrl, prompt };
                } catch (err: any) {
                    results[idx] = { status: "error", error: err.message, prompt };
                }
            })
        );

        return NextResponse.json({ shots: results });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
