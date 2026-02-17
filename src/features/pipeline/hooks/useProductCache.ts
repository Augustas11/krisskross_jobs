/**
 * useProductCache Hook
 * Wraps cache service for UI components.
 */

"use client";

import { useState, useCallback } from "react";
import type { CachedAnalysis } from "../types/pipeline.types";

interface UseProductCacheReturn {
    cacheHit: CachedAnalysis | null;
    showDialog: boolean;
    onUseCache: () => void;
    onReanalyze: () => void;
    setCacheHit: (hit: CachedAnalysis | null) => void;
}

export function useProductCache(
    onUseCached: (analysis: any) => void,
    onReanalyze: () => void
): UseProductCacheReturn {
    const [cacheHit, setCacheHit] = useState<CachedAnalysis | null>(null);
    const [showDialog, setShowDialog] = useState(false);

    const handleSetCacheHit = useCallback((hit: CachedAnalysis | null) => {
        setCacheHit(hit);
        if (hit) {
            setShowDialog(true);
        }
    }, []);

    const handleUseCache = useCallback(() => {
        if (cacheHit) {
            onUseCached(cacheHit.analysis);
        }
        setShowDialog(false);
    }, [cacheHit, onUseCached]);

    const handleReanalyze = useCallback(() => {
        setShowDialog(false);
        onReanalyze();
    }, [onReanalyze]);

    return {
        cacheHit,
        showDialog,
        onUseCache: handleUseCache,
        onReanalyze: handleReanalyze,
        setCacheHit: handleSetCacheHit,
    };
}
