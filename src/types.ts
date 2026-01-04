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
