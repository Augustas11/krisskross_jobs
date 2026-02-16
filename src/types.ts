// Subject configuration for AI model
export interface SubjectConfig {
    race: 'vietnamese' | 'white' | 'asian' | 'middle_eastern' | 'black';
    gender: 'woman' | 'man' | 'child';
    age: 'young_adult' | 'adult' | 'child_5_10';
    build?: 'slim' | 'curvy' | 'athletic' | 'average' | 'plus_size' | null;
}

// Scene configuration for video generation
export interface SceneConfig {
    environment: 'urban_street' | 'cafe' | 'park' | 'rooftop' | 'office' | 'indoor';
    lighting: 'natural_daylight' | 'studio_lighting' | 'golden_hour';
    style: 'fashion_photography' | 'commercial' | 'lifestyle' | 'street_style';
    actions: ('walking' | 'posing' | 'standing' | 'sitting' | 'dancing' | 'running')[];
}

// Template configuration structure
export interface TemplateConfig {
    prompt: string;
    mode?: 'video' | 'image';
    refImages?: string[]; // URLs to reference images
    subjectConfig?: SubjectConfig;
    sceneConfig?: SceneConfig;
}

export interface Template {
    id: string;
    creator_id: string;
    name: string;
    description?: string;
    category: string;
    tags?: string[];
    price_usd: number;
    config: TemplateConfig; // Structured JSONB configuration
    preview_video_url: string;
    thumbnail_url: string;
    status: 'draft' | 'active' | 'inactive' | 'removed';
    purchase_count: number;
    total_revenue: number;
    created_at: string;
    updated_at: string;
    published_at?: string;
    creator?: {
        email: string;
        id: string;
        // Add profile fields if available later
    };
}

export interface TemplatePurchase {
    id: string;
    template_id: string;
    buyer_id: string;
    purchase_price: number;
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    created_at: string;
    template?: Template;
}

// ─── Pipeline Types ─────────────────────────────────────────────────────────

export type AgentStatusType = "idle" | "running" | "done" | "error";

export interface ProductAnalysis {
    category: string;
    sub_category: string;
    style_aesthetic: string;
    primary_colors: string[];
    key_materials: string[];
    target_demographic: string;
    price_tier: string;
    key_selling_points: string[];
    occasion: string[];
    season: string;
    tiktok_trend_match: string;
    product_condition: string;
}

export interface ScriptScene {
    scene_number: number;
    duration_seconds: number;
    action: string;
    voiceover_text: string;
    text_overlay: string;
    emotional_beat: string;
}

export interface ScriptOutput {
    hook: {
        text: string;
        visual_direction: string;
    };
    scenes: ScriptScene[];
    call_to_action: {
        text: string;
        type: string;
    };
    total_duration_seconds: number;
    content_angle: string;
    viral_hooks_used: string[];
}

export interface ShotComposition {
    n: number;
    type: string;
    focus: string;
    movement: string;
    transition: string;
    secs: number;
}

export interface VideoComposerOutput {
    opening_shot?: {
        angle: string;
        model_pose: string;
    };
    shots: ShotComposition[];
    color_grade: string;
    background: string;
    model_direction: string;
    key_moments: string[];
}

export interface TikTokMetadata {
    caption: {
        hook_sentence: string;
        full_caption: string;
        character_count: number;
    };
    hashtag_strategy: {
        niche_hashtags: string[];
        mid_hashtags: string[];
        trending_hashtags: string[];
        brand_hashtag: string;
    };
    posting_schedule: {
        best_days: string[];
        best_times_utc: string[];
        timezone_note: string;
    };
    sound_strategy: {
        trending_audio_type: string;
        original_audio_tip: string;
    };
    engagement_triggers: {
        question_to_ask: string;
        comment_baiting_technique: string;
        duet_potential: string;
    };
    ab_test_suggestion: string;
    predicted_audience: string;
    virality_score: number;
}

export interface PipelineResults {
    productAnalysis?: ProductAnalysis;
    scriptOutput?: ScriptOutput;
    videoComposer?: VideoComposerOutput;
    tiktokMetadata?: TikTokMetadata;
}
