/**
 * Variation Engine — SSE Streaming API
 * Phase 1: Agent 01 (once) → Phase 2: 12 variations in parallel
 */

import { NextRequest } from "next/server";
import { VARIATION_SEEDS } from "@/lib/variations/variationSeeds";
import { runVariationPipeline } from "@/lib/variations/variationService";

export const maxDuration = 300; // 5 min for 12 parallel LLM + image calls

export async function POST(req: NextRequest) {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
        return Response.json({ error: "imageBase64 is required" }, { status: 400 });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            function send(data: any) {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            }

            try {
                for await (const event of runVariationPipeline(
                    imageBase64,
                    VARIATION_SEEDS
                )) {
                    send(event);
                }
            } catch (err: any) {
                send({ type: "fatal_error", error: err.message });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
}
