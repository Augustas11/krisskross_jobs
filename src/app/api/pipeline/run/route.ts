/**
 * Pipeline Run API Route
 * Streams pipeline progress via Server-Sent Events (SSE).
 * Admin-only: gated to authorized users.
 */

import { NextRequest } from "next/server";
import { runPipeline } from "@/lib/pipeline/pipelineService";

export const maxDuration = 120; // 2 min max for full 4-agent pipeline

export async function POST(req: NextRequest) {
    try {
        const { imageBase64 } = await req.json();

        if (!imageBase64) {
            return new Response(
                JSON.stringify({ error: "imageBase64 is required" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return new Response(
                JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        // Create SSE stream
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const progress of runPipeline(imageBase64)) {
                        const data = JSON.stringify(progress);
                        controller.enqueue(
                            encoder.encode(`data: ${data}\n\n`)
                        );
                    }
                    // Signal completion
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({ type: "complete" })}\n\n`)
                    );
                    controller.close();
                } catch (err: any) {
                    const errorData = JSON.stringify({
                        type: "fatal_error",
                        error: err.message,
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
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
    } catch (error: any) {
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
