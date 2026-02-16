/**
 * Shot Prompt Builder
 * Deterministic — no LLM needed.
 * Assembles Seedance text prompts from Agent 03 (Video Composer) output fields.
 */

import type { ShotComposition, ProductAnalysis, VideoComposerOutput } from "@/types";

export interface ShotInput {
    type?: string;
    focus?: string;
    angle?: string;
    movement?: string;
    model_pose?: string;
    secs?: number;
    _isOpening?: boolean;
}

const TYPE_MAP: Record<string, string> = {
    "close-up": "Extreme close-up shot",
    medium: "Medium shot",
    wide: "Wide establishing shot",
};

const MOVEMENT_MAP: Record<string, string> = {
    pan: "with slow horizontal pan",
    zoom: "with smooth zoom in",
    static: "static camera",
    tilt: "with gentle tilt up",
};

export function buildShotPrompt(
    shot: ShotInput,
    composerResult: VideoComposerOutput,
    productAnalysis: ProductAnalysis | null
): string {
    const parts: string[] = [];

    // Shot type + focus
    parts.push(TYPE_MAP[shot.type || ""] || `${shot.type || "medium"} shot`);
    if (shot.focus) parts.push(`focusing on ${shot.focus}`);

    // Camera movement
    parts.push(
        MOVEMENT_MAP[shot.movement || ""] || `${shot.movement || "static"} camera`
    );

    // Model + environment from composer
    if (composerResult.model_direction)
        parts.push(`fashion model: ${composerResult.model_direction}`);
    if (composerResult.background)
        parts.push(`setting: ${composerResult.background}`);
    if (composerResult.color_grade)
        parts.push(`color grade: ${composerResult.color_grade}`);

    // Product context from analyzer
    if (productAnalysis?.style_aesthetic)
        parts.push(`${productAnalysis.style_aesthetic} aesthetic`);
    if (productAnalysis?.primary_colors?.length)
        parts.push(
            `colors: ${productAnalysis.primary_colors.slice(0, 2).join(", ")}`
        );

    // TikTok vertical framing
    parts.push(
        "vertical 9:16 framing, TikTok fashion video, cinematic quality"
    );

    return parts.join(", ");
}

/**
 * Build all shot prompts from the composer output
 */
export function buildAllShotPrompts(
    composerResult: VideoComposerOutput,
    productAnalysis: ProductAnalysis | null
): Map<number, { prompt: string; durationSecs: number }> {
    const prompts = new Map<number, { prompt: string; durationSecs: number }>();

    // Opening shot (index -1)
    if (composerResult.opening_shot) {
        const openingPrompt = buildShotPrompt(
            {
                type: "wide",
                focus: composerResult.opening_shot.angle,
                movement: "static",
                secs: 3,
                model_pose: composerResult.opening_shot.model_pose,
                _isOpening: true,
            },
            composerResult,
            productAnalysis
        );
        prompts.set(-1, { prompt: openingPrompt, durationSecs: 3 });
    }

    // All regular shots
    if (composerResult.shots) {
        composerResult.shots.forEach((shot, idx) => {
            const prompt = buildShotPrompt(
                {
                    type: shot.type,
                    focus: shot.focus,
                    movement: shot.movement,
                    secs: shot.secs,
                },
                composerResult,
                productAnalysis
            );
            prompts.set(idx, { prompt, durationSecs: shot.secs || 4 });
        });
    }

    return prompts;
}
