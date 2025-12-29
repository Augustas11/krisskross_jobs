/**
 * Client-side usage tracking for free generations
 * Tracks video and image generations in localStorage
 */

export const STORAGE_KEY = 'krisskross_generations';
export const FREE_LIMIT = 2; // 2 free generations per type

export interface GenerationRecord {
    type: 'video' | 'image';
    timestamp: number;
    id: string;
}

/**
 * Get the count of generations by type
 */
export const getGenerationCount = (): { video: number; image: number } => {
    if (typeof window === 'undefined') return { video: 0, image: 0 };

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { video: 0, image: 0 };

    try {
        const records: GenerationRecord[] = JSON.parse(stored);
        return {
            video: records.filter(r => r.type === 'video').length,
            image: records.filter(r => r.type === 'image').length
        };
    } catch (error) {
        console.error('Error parsing generation records:', error);
        return { video: 0, image: 0 };
    }
};

/**
 * Add a new generation record
 */
export const addGeneration = (type: 'video' | 'image'): void => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const records: GenerationRecord[] = stored ? JSON.parse(stored) : [];

    records.push({
        type,
        timestamp: Date.now(),
        id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

/**
 * Check if user can generate more content of a specific type
 */
export const canGenerate = (type: 'video' | 'image'): boolean => {
    const counts = getGenerationCount();
    return counts[type] < FREE_LIMIT;
};

/**
 * Get remaining generations for a specific type
 */
export const getRemainingGenerations = (type: 'video' | 'image'): number => {
    const counts = getGenerationCount();
    return Math.max(0, FREE_LIMIT - counts[type]);
};

/**
 * Reset all generation records (for testing or after signup)
 */
export const resetGenerations = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
};

/**
 * Get all generation records
 */
export const getAllGenerations = (): GenerationRecord[] => {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Error parsing generation records:', error);
        return [];
    }
};
