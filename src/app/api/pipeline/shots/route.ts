/**
 * Pipeline Shots API Route
 * Generates video shots via Seedance from Agent 03 output.
 * Admin-only: requires SEEDANCE_API_KEY.
 */

import { NextRequest, NextResponse } from "next/server";
import {
    submitSeedanceJob,
    pollSeedanceJob,
} from "@/lib/pipeline/pipelineService";
import { buildAllShotPrompts } from "@/lib/pipeline/shotPromptBuilder";
import type { VideoComposerOutput, ProductAnalysis } from "@/types";

export const maxDuration = 180; // 3 min for parallel shot generation

export async function POST(req: NextRequest) {
    try {
        const { composerResult, productAnalysis } = (await req.json()) as {
            composerResult: VideoComposerOutput;
            productAnalysis: ProductAnalysis | null;
        };

        if (!composerResult?.shots?.length) {
            return NextResponse.json(
                { error: "composerResult with shots is required" },
                { status: 400 }
            );
        }

        if (!process.env.SEEDANCE_API_KEY) {
            return NextResponse.json(
                { error: "SEEDANCE_API_KEY not configured" },
                { status: 500 }
            );
        }

        // Build all prompts
        const promptMap = buildAllShotPrompts(composerResult, productAnalysis);

        // Submit + poll all shots in parallel
        const results: Record<
            number,
            { status: string; videoUrl?: string; error?: string; prompt: string }
        > = {};

        await Promise.all(
            Array.from(promptMap.entries()).map(async ([idx, { prompt, durationSecs }]) => {
                try {
                    const taskId = await submitSeedanceJob(prompt, durationSecs);
                    const videoUrl = await pollSeedanceJob(taskId);
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
