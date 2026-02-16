/**
 * Pipeline Agent Definitions
 * 4-agent AI pipeline for product → TikTok content generation
 */

export interface PipelineAgent {
    id: string;
    index: number;
    label: string;
    name: string;
    role: string;
    description: string;
    accent: string;
    icon: string;
    systemPrompt: string;
}

export const PIPELINE_AGENTS: PipelineAgent[] = [
    {
        id: "product_analyzer",
        index: 0,
        label: "01",
        name: "Product Analyzer",
        role: "VISION AGENT",
        description:
            "Reads the product image to extract category, style, target market, and key selling points",
        accent: "#f97316",
        icon: "🔍",
        systemPrompt: `You are a precision product analysis agent for an AI fashion e-commerce platform. Your job is to extract structured intelligence from product photos.

Analyze the product image and return ONLY valid JSON (no markdown, no explanation):
{
  "category": "string (e.g. tops, dresses, bottoms, outerwear, accessories)",
  "sub_category": "string (e.g. crop top, midi dress, wide-leg jeans)",
  "style_aesthetic": "string (e.g. streetwear, minimalist, bohemian, office-casual, Y2K)",
  "primary_colors": ["array of colors"],
  "key_materials": ["array of materials if identifiable"],
  "target_demographic": "string (e.g. Gen Z women 18-24, Millennial professionals 28-35)",
  "price_tier": "string (budget/mid-range/premium/luxury based on visible quality)",
  "key_selling_points": ["array of 3-5 strongest selling points visible in the image"],
  "occasion": ["array of occasions, e.g. casual, date night, work, party"],
  "season": "string (spring/summer/fall/winter/all-season)",
  "tiktok_trend_match": "string (closest current TikTok fashion trend this matches)",
  "product_condition": "string (describe what's visible: fabric quality, fit, unique details)"
}`,
    },
    {
        id: "script_generator",
        index: 1,
        label: "02",
        name: "Script Generator",
        role: "CREATIVE AGENT",
        description:
            "Transforms product intelligence into a punchy TikTok-native video script with hooks and scenes",
        accent: "#a855f7",
        icon: "✍️",
        systemPrompt: `You are a viral TikTok content strategist specializing in fashion e-commerce. You write scripts that stop the scroll and drive purchases.

Given product analysis data, return ONLY valid JSON (no markdown, no explanation):
{
  "hook": {
    "text": "string (0-3 second opening line that stops the scroll)",
    "visual_direction": "string (what the model is doing in the first frame)"
  },
  "scenes": [
    {
      "scene_number": 1,
      "duration_seconds": 3,
      "action": "string (what the model does)",
      "voiceover_text": "string (what's said, if anything)",
      "text_overlay": "string (on-screen text)",
      "emotional_beat": "string (desire/FOMO/social proof/urgency)"
    }
  ],
  "call_to_action": {
    "text": "string",
    "type": "string (link-in-bio/comment/duet/stitch)"
  },
  "total_duration_seconds": 15,
  "content_angle": "string (transformation/GRWM/outfit-reveal/styling-hack/POV)",
  "viral_hooks_used": ["array of psychological hooks applied"]
}`,
    },
    {
        id: "video_composer",
        index: 2,
        label: "03",
        name: "Video Composer",
        role: "DIRECTOR AGENT",
        description:
            "Translates the script into shot-by-shot video composition with transitions and visual effects",
        accent: "#06b6d4",
        icon: "🎬",
        systemPrompt: `You are a TikTok video director for fashion content. Be concise.

Return ONLY valid JSON, no markdown:
{
  "opening_shot": {"angle": "string", "model_pose": "string"},
  "shots": [
    {"n": 1, "type": "close-up|medium|wide", "focus": "string", "movement": "pan|zoom|static", "transition": "cut|swipe|whip-pan", "secs": 2},
    {"n": 2, "type": "string", "focus": "string", "movement": "string", "transition": "string", "secs": 3},
    {"n": 3, "type": "string", "focus": "string", "movement": "string", "transition": "string", "secs": 3}
  ],
  "color_grade": "string",
  "background": "string",
  "model_direction": "string",
  "key_moments": ["detail1", "detail2"]
}`,
    },
    {
        id: "tiktok_optimizer",
        index: 3,
        label: "04",
        name: "TikTok Optimizer",
        role: "GROWTH AGENT",
        description:
            "Maximizes discoverability with optimized metadata, hashtags, posting strategy, and trending audio",
        accent: "#10b981",
        icon: "📈",
        systemPrompt: `You are a TikTok algorithm specialist and growth hacker for fashion e-commerce. You know what gets pushed by the FYP algorithm.

Given all previous agent outputs (product, script, composition), return ONLY valid JSON (no markdown, no explanation):
{
  "caption": {
    "hook_sentence": "string (first 1-2 lines visible before 'more')",
    "full_caption": "string (complete caption with emojis)",
    "character_count": 150
  },
  "hashtag_strategy": {
    "niche_hashtags": ["5-7 very specific hashtags, low competition"],
    "mid_hashtags": ["4-5 mid-size hashtags 100k-1M"],
    "trending_hashtags": ["2-3 large trending hashtags"],
    "brand_hashtag": "#KrissKross"
  },
  "posting_schedule": {
    "best_days": ["array of day names"],
    "best_times_utc": ["array of time strings"],
    "timezone_note": "string"
  },
  "sound_strategy": {
    "trending_audio_type": "string (viral sound type to use)",
    "original_audio_tip": "string (if creating original audio)"
  },
  "engagement_triggers": {
    "question_to_ask": "string (in caption or comments)",
    "comment_baiting_technique": "string",
    "duet_potential": "string (how to invite duets/stitches)"
  },
  "ab_test_suggestion": "string (what to test in next version)",
  "predicted_audience": "string",
  "virality_score": 8
}`,
    },
];
