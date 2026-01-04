// Template service for fetching and tracking templates
import { Template } from '@/types';

export class TemplateService {
    /**
     * Get featured templates for homepage (featured + top purchased)
     */
    static async getFeaturedTemplates(limit: number = 6): Promise<Template[]> {
        try {
            const res = await fetch(`/api/templates?status=active&limit=${limit}&sort=popularity`);
            if (!res.ok) {
                console.error('Failed to fetch featured templates:', await res.text());
                return [];
            }
            const data = await res.json();
            return data.templates || [];
        } catch (error) {
            console.error('Template service error:', error);
            return [];
        }
    }

    /**
     * Get all templates with filtering
     */
    static async getTemplates(options?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        sort?: 'newest' | 'popularity' | 'price_asc' | 'price_desc';
        limit?: number;
        page?: number;
    }): Promise<{ templates: Template[]; total: number; totalPages: number }> {
        try {
            const params = new URLSearchParams();
            params.append('status', 'active');

            if (options?.category && options.category !== 'all') {
                params.append('category', encodeURIComponent(options.category));
            }
            if (options?.minPrice) params.append('minPrice', options.minPrice.toString());
            if (options?.maxPrice) params.append('maxPrice', options.maxPrice.toString());
            if (options?.sort) params.append('sort', options.sort);
            if (options?.limit) params.append('limit', options.limit.toString());
            if (options?.page) params.append('page', options.page.toString());

            const res = await fetch(`/api/templates?${params.toString()}`);
            if (!res.ok) {
                console.error('Failed to fetch templates:', await res.text());
                return { templates: [], total: 0, totalPages: 0 };
            }

            const data = await res.json();
            return {
                templates: data.templates || [],
                total: data.total || 0,
                totalPages: data.totalPages || 0
            };
        } catch (error) {
            console.error('Template service error:', error);
            return { templates: [], total: 0, totalPages: 0 };
        }
    }

    /**
     * Get single template by ID
     */
    static async getTemplate(id: string): Promise<Template | null> {
        try {
            const res = await fetch(`/api/templates/${id}`);
            if (!res.ok) return null;
            return await res.json();
        } catch (error) {
            console.error('Failed to fetch template:', error);
            return null;
        }
    }

    /**
     * Track template view (analytics)
     */
    static async trackTemplateView(templateId: string, userId?: string): Promise<void> {
        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: 'template_view',
                    template_id: templateId,
                    user_id: userId || null,
                    session_id: this.getSessionId()
                })
            });
        } catch (error) {
            // Silent fail for analytics
            console.debug('Analytics tracking failed:', error);
        }
    }

    /**
     * Track template selection (clicked to use)
     */
    static async trackTemplateUse(templateId: string, userId?: string): Promise<void> {
        try {
            await fetch('/api/analytics/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_type: 'template_use',
                    template_id: templateId,
                    user_id: userId || null,
                    session_id: this.getSessionId()
                })
            });
        } catch (error) {
            // Silent fail for analytics
            console.debug('Analytics tracking failed:', error);
        }
    }

    /**
     * Get or create session ID for tracking
     */
    private static getSessionId(): string {
        if (typeof window === 'undefined') return '';

        let sessionId = localStorage.getItem('krisskross_session_id');
        if (!sessionId) {
            sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('krisskross_session_id', sessionId);
        }
        return sessionId;
    }
}
