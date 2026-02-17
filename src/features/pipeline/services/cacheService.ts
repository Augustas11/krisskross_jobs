/**
 * Cache Service
 * Product analysis cache using localStorage.
 * Prevents redundant vision API calls for the same product image.
 */

import type { CachedAnalysis } from "../types/pipeline.types";
import type { ProductAnalysis } from "../types/agent.types";
import { isSimilarImage } from "../utils/imageHash";

const CACHE_KEY = "kk_product_cache";
const CACHE_MAX_AGE_DAYS = 30;

// ─── Helpers ────────────────────────────────────────────────────────────────

function readCache(): CachedAnalysis[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeCache(entries: CachedAnalysis[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
}

function isExpired(createdAt: string): boolean {
    const age = Date.now() - new Date(createdAt).getTime();
    return age > CACHE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Check if a similar image hash exists in the cache */
export function checkCache(imageHash: string): CachedAnalysis | null {
    const entries = readCache();
    for (const entry of entries) {
        if (isExpired(entry.createdAt)) continue;
        if (entry.hash === imageHash || isSimilarImage(entry.hash, imageHash)) {
            return entry;
        }
    }
    return null;
}

/** Store a product analysis result in the cache */
export function setCache(
    imageHash: string,
    analysis: ProductAnalysis,
    historyId: string
): void {
    const entries = readCache().filter((e) => !isExpired(e.createdAt));

    // Check if hash already exists (exact match)
    const existing = entries.find((e) => e.hash === imageHash);
    if (existing) {
        if (!existing.historyIds.includes(historyId)) {
            existing.historyIds.push(historyId);
        }
        writeCache(entries);
        return;
    }

    entries.unshift({
        hash: imageHash,
        analysis,
        createdAt: new Date().toISOString(),
        historyIds: [historyId],
    });

    writeCache(entries);
}

/** Link a history entry to an existing cache entry */
export function linkCacheToHistory(imageHash: string, historyId: string): void {
    const entries = readCache();
    const entry = entries.find((e) => e.hash === imageHash);
    if (entry && !entry.historyIds.includes(historyId)) {
        entry.historyIds.push(historyId);
        writeCache(entries);
    }
}

/** Get cache stats */
export function getCacheStats(): { totalEntries: number; activeEntries: number } {
    const entries = readCache();
    return {
        totalEntries: entries.length,
        activeEntries: entries.filter((e) => !isExpired(e.createdAt)).length,
    };
}

/** Clear expired cache entries */
export function pruneCache(): void {
    writeCache(readCache().filter((e) => !isExpired(e.createdAt)));
}
