/**
 * Variation Engine — Phase 3 Video Shot Generation
 * SSE endpoint: submits Seedance jobs for remaining shots and streams status updates.
 */

import { NextRequest } from "next/server";
import {
    submitSeedanceJob,
    pollSeedanceJob,
    buildShotVideoPrompt,
} from "@/lib/variations/variationService";

export const maxDuration = 300; // 5 min for video generation polling

export async function POST(req: NextRequest) {
    const { compose, product } = await req.json();

    if (!compose?.shots?.length) {
        return Response.json(
            { error: "compose.shots is required" },
            { status: 400 }
        );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            function send(data: any) {
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            }

            // Skip shot index 0 (that's the Seedream preview image from Phase 2)
            // Generate video for shots 1, 2, 3, ...
            const shotsToGenerate = compose.shots.filter(
                (s: any) => s.n > 1
            );

            if (shotsToGenerate.length === 0) {
                send({ type: "complete", message: "No remaining shots to generate" });
                controller.close();
                return;
            }

            const promises = shotsToGenerate.map(async (shot: any) => {
                const shotIndex = shot.n;
                try {
                    send({
                        type: "shot_status",
                        shotIndex,
                        status: "submitting",
                    });

                    const prompt = buildShotVideoPrompt(shot, compose, product);
                    const taskId = await submitSeedanceJob(
                        prompt,
                        shot.secs || 5
                    );

                    send({
                        type: "shot_status",
                        shotIndex,
                        status: "polling",
                        taskId,
                    });

                    const videoUrl = await pollSeedanceJob(taskId);

                    send({
                        type: "shot_done",
                        shotIndex,
                        videoUrl,
                    });
                } catch (err: any) {
                    send({
                        type: "shot_error",
                        shotIndex,
                        error: err.message,
                    });
                }
            });

            await Promise.all(promises);
            send({ type: "complete" });
            controller.close();
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
