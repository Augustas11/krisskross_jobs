export interface Template {
    id: string;
    creator_id: string;
    name: string;
    description?: string;
    category: string;
    tags?: string[];
    price_usd: number;
    config: Record<string, unknown>; // JSONB
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
