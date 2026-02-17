/**
 * HistoryList
 * Dashboard list view with filters, search, pagination, and batch actions.
 */

"use client";

import React, { useState, useCallback } from "react";
import { usePipelineHistory } from "../hooks/usePipelineHistory";
import { HistoryCard } from "./HistoryCard";
import { exportAsJSON } from "../utils/exportUtils";
import type { PipelineStatus } from "../types/pipeline.types";

interface HistoryListProps {
    onViewDetail: (id: string) => void;
}

const STATUS_OPTIONS: { label: string; value: PipelineStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Complete", value: "complete" },
    { label: "Failed", value: "failed" },
    { label: "In Progress", value: "in_progress" },
];

export function HistoryList({ onViewDetail }: HistoryListProps) {
    const { entries, total, loading, filters, setFilters, refresh, deleteEntries, allTags } =
        usePipelineHistory();
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const toggleSelect = useCallback((id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

    const selectAll = useCallback(() => {
        if (selected.size === entries.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(entries.map((e) => e.id)));
        }
    }, [entries, selected.size]);

    const handleBatchDelete = useCallback(() => {
        if (selected.size === 0) return;
        deleteEntries(Array.from(selected));
        setSelected(new Set());
    }, [selected, deleteEntries]);

    const handleBatchExport = useCallback(() => {
        if (selected.size === 0) return;
        const toExport = entries.filter((e) => selected.has(e.id));
        exportAsJSON(toExport);
    }, [selected, entries]);

    const totalPages = Math.ceil(total / filters.pageSize);

    return (
        <div className="min-h-screen" style={{ background: "#060a12" }}>
            {/* Header */}
            <div
                className="sticky top-0 z-10 border-b px-8 py-5 flex items-center justify-between"
                style={{ background: "#060a12", borderColor: "#1e293b50" }}
            >
                <div className="flex items-center gap-3">
                    <a href="/pipeline" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white bg-gradient-to-br from-orange-500 to-purple-500">
                            K
                        </div>
                    </a>
                    <div>
                        <div className="text-sm font-bold tracking-tight text-slate-100">
                            Pipeline History
                        </div>
                        <div className="text-[10px] text-slate-500 tracking-[0.1em] font-mono">
                            {total} RUNS · ALL TIME
                        </div>
                    </div>
                </div>
                <a
                    href="/pipeline"
                    className="text-xs font-bold font-mono px-4 py-2 rounded-lg transition-all"
                    style={{ color: "#f97316", background: "#f9731610", border: "1px solid #f9731630" }}
                >
                    ← Pipeline
                </a>
            </div>

            <div className="max-w-[1100px] mx-auto px-6 py-8">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* Status filter */}
                    <div className="flex gap-1 p-1 rounded-lg" style={{ background: "#0a0f1a", border: "1px solid #1e293b" }}>
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilters({ status: opt.value })}
                                className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-md transition-all"
                                style={{
                                    background: filters.status === opt.value ? "#f9731620" : "transparent",
                                    color: filters.status === opt.value ? "#f97316" : "#64748b",
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Search by product, script, tags..."
                            value={filters.search || ""}
                            onChange={(e) => setFilters({ search: e.target.value })}
                            className="w-full text-xs font-medium px-4 py-2.5 rounded-lg outline-none transition-all"
                            style={{
                                background: "#0a0f1a",
                                border: "1px solid #1e293b",
                                color: "#e2e8f0",
                            }}
                        />
                    </div>

                    {/* Tags dropdown */}
                    {allTags.length > 0 && (
                        <select
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val) setFilters({ tags: [val] });
                                else setFilters({ tags: [] });
                            }}
                            className="text-[11px] font-mono font-bold px-3 py-2.5 rounded-lg outline-none"
                            style={{
                                background: "#0a0f1a",
                                border: "1px solid #1e293b",
                                color: "#94a3b8",
                            }}
                        >
                            <option value="">All Tags</option>
                            {allTags.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Batch Actions */}
                {selected.size > 0 && (
                    <div
                        className="flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
                        style={{ background: "#0a0f1a", border: "1px solid #f9731630" }}
                    >
                        <button
                            onClick={selectAll}
                            className="text-[11px] font-mono font-bold text-slate-400 hover:text-slate-200 transition-colors"
                        >
                            {selected.size === entries.length ? "Deselect All" : "Select All"}
                        </button>
                        <span className="text-[11px] text-slate-600">·</span>
                        <span className="text-[11px] text-orange-400 font-mono font-bold">
                            {selected.size} selected
                        </span>
                        <div className="flex-1" />
                        <button
                            onClick={handleBatchExport}
                            className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-lg transition-all"
                            style={{ color: "#06b6d4", background: "#06b6d410", border: "1px solid #06b6d430" }}
                        >
                            Export JSON
                        </button>
                        <button
                            onClick={handleBatchDelete}
                            className="text-[11px] font-bold font-mono px-3 py-1.5 rounded-lg transition-all"
                            style={{ color: "#ef4444", background: "#ef444410", border: "1px solid #ef444430" }}
                        >
                            Delete
                        </button>
                    </div>
                )}

                {/* List */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="text-slate-600 text-sm font-mono">Loading...</div>
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-3xl mb-3">📋</div>
                        <div className="text-slate-400 text-sm font-bold mb-1">No pipeline runs yet</div>
                        <div className="text-slate-600 text-xs">
                            Upload a product image in the{" "}
                            <a href="/pipeline" className="text-orange-400 hover:text-orange-300">
                                Pipeline
                            </a>{" "}
                            to get started.
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        {entries.map((entry) => (
                            <HistoryCard
                                key={entry.id}
                                entry={entry}
                                selected={selected.has(entry.id)}
                                onSelect={toggleSelect}
                                onView={onViewDetail}
                                onDelete={(id) => { deleteEntries([id]); }}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => setFilters({ page: Math.max(0, filters.page - 1) })}
                            disabled={filters.page === 0}
                            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
                            style={{ background: "#0a0f1a", color: "#94a3b8", border: "1px solid #1e293b" }}
                        >
                            ← Prev
                        </button>
                        <span className="text-[11px] text-slate-500 font-mono">
                            {filters.page + 1} / {totalPages}
                        </span>
                        <button
                            onClick={() => setFilters({ page: Math.min(totalPages - 1, filters.page + 1) })}
                            disabled={filters.page >= totalPages - 1}
                            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
                            style={{ background: "#0a0f1a", color: "#94a3b8", border: "1px solid #1e293b" }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
