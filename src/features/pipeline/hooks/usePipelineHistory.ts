/**
 * usePipelineHistory Hook
 * CRUD hook for pipeline history entries.
 */

"use client";

import { useState, useCallback, useEffect } from "react";
import type { PipelineHistory, HistoryFilters } from "../types/pipeline.types";
import {
    getHistory,
    getHistoryById,
    deleteHistoryEntries,
    updateHistoryTags,
    updateHistoryNotes,
    getAllTags,
} from "../services/historyService";

interface UsePipelineHistoryReturn {
    entries: PipelineHistory[];
    total: number;
    loading: boolean;
    filters: HistoryFilters;
    setFilters: (f: Partial<HistoryFilters>) => void;
    refresh: () => void;
    deleteEntries: (ids: string[]) => void;
    allTags: string[];
}

export function usePipelineHistory(): UsePipelineHistoryReturn {
    const [entries, setEntries] = useState<PipelineHistory[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allTags, setAllTags] = useState<string[]>([]);
    const [filters, setFiltersState] = useState<HistoryFilters>({
        status: "all",
        search: "",
        tags: [],
        page: 0,
        pageSize: 20,
    });

    const refresh = useCallback(() => {
        setLoading(true);
        const result = getHistory(filters);
        setEntries(result.entries);
        setTotal(result.total);
        setAllTags(getAllTags());
        setLoading(false);
    }, [filters]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const setFilters = useCallback((partial: Partial<HistoryFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...partial, page: partial.page ?? 0 }));
    }, []);

    const handleDelete = useCallback(
        (ids: string[]) => {
            deleteHistoryEntries(ids);
            refresh();
        },
        [refresh]
    );

    return {
        entries,
        total,
        loading,
        filters,
        setFilters,
        refresh,
        deleteEntries: handleDelete,
        allTags,
    };
}

// ─── Single Entry Hook ─────────────────────────────────────────────────────

interface UsePipelineDetailReturn {
    entry: PipelineHistory | null;
    loading: boolean;
    refresh: () => void;
    updateTags: (tags: string[]) => void;
    updateNotes: (notes: string) => void;
}

export function usePipelineDetail(id: string): UsePipelineDetailReturn {
    const [entry, setEntry] = useState<PipelineHistory | null>(null);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(() => {
        setLoading(true);
        setEntry(getHistoryById(id));
        setLoading(false);
    }, [id]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleUpdateTags = useCallback(
        (tags: string[]) => {
            updateHistoryTags(id, tags);
            refresh();
        },
        [id, refresh]
    );

    const handleUpdateNotes = useCallback(
        (notes: string) => {
            updateHistoryNotes(id, notes);
            refresh();
        },
        [id, refresh]
    );

    return {
        entry,
        loading,
        refresh,
        updateTags: handleUpdateTags,
        updateNotes: handleUpdateNotes,
    };
}
