/**
 * History Service
 * CRUD for pipeline history using localStorage (MVP).
 * Data model matches Supabase schema for future migration.
 */

import type {
    PipelineHistory,
    PipelineStatus,
    AgentOutputEntry,
    HistoryFilters,
} from "../types/pipeline.types";
import { agentIndexToKey, type AgentKey } from "../types/agent.types";

const STORAGE_KEY = "kk_pipeline_history";

// ─── Helpers ────────────────────────────────────────────────────────────────

function readAll(): PipelineHistory[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeAll(entries: PipelineHistory[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function generateId(): string {
    return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Create ─────────────────────────────────────────────────────────────────

function createEmptyAgentEntry(): AgentOutputEntry {
    return {
        result: null,
        status: "pending",
        startedAt: null,
        completedAt: null,
        durationMs: null,
        error: null,
    };
}

export function createHistoryEntry(opts: {
    imageUrl: string;
    thumbnailUrl: string;
    fileName: string;
    userId?: string;
}): PipelineHistory {
    const now = new Date().toISOString();
    const entry: PipelineHistory = {
        id: generateId(),
        userId: opts.userId || "local",
        createdAt: now,
        updatedAt: now,
        status: "in_progress",
        product: {
            imageUrl: opts.imageUrl,
            imageThumbnailUrl: opts.thumbnailUrl,
            fileName: opts.fileName,
            uploadedAt: now,
        },
        agents: {
            productAnalysis: createEmptyAgentEntry(),
            scriptWriter: createEmptyAgentEntry(),
            videoDirector: createEmptyAgentEntry(),
            captionGenerator: createEmptyAgentEntry(),
        },
        metadata: {
            totalDurationMs: null,
            apiCostEstimate: null,
            retryCount: 0,
            parentRunId: null,
            tags: [],
            notes: "",
        },
    };

    const all = readAll();
    all.unshift(entry); // Most recent first
    writeAll(all);
    return entry;
}

// ─── Update ─────────────────────────────────────────────────────────────────

export function updateAgentStatus(
    historyId: string,
    agentIndex: number,
    update: Partial<AgentOutputEntry>
): void {
    const all = readAll();
    const idx = all.findIndex((e) => e.id === historyId);
    if (idx < 0) return;

    const key = agentIndexToKey(agentIndex) as AgentKey;
    const entry = all[idx];
    entry.agents[key] = { ...entry.agents[key], ...update };
    entry.updatedAt = new Date().toISOString();
    writeAll(all);
}

export function updateHistoryStatus(
    historyId: string,
    status: PipelineStatus,
    metadata?: Partial<PipelineHistory["metadata"]>
): void {
    const all = readAll();
    const idx = all.findIndex((e) => e.id === historyId);
    if (idx < 0) return;

    all[idx].status = status;
    all[idx].updatedAt = new Date().toISOString();
    if (metadata) {
        all[idx].metadata = { ...all[idx].metadata, ...metadata };
    }
    writeAll(all);
}

export function updateHistoryTags(historyId: string, tags: string[]): void {
    const all = readAll();
    const idx = all.findIndex((e) => e.id === historyId);
    if (idx < 0) return;
    all[idx].metadata.tags = tags;
    all[idx].updatedAt = new Date().toISOString();
    writeAll(all);
}

export function updateHistoryNotes(historyId: string, notes: string): void {
    const all = readAll();
    const idx = all.findIndex((e) => e.id === historyId);
    if (idx < 0) return;
    all[idx].metadata.notes = notes;
    all[idx].updatedAt = new Date().toISOString();
    writeAll(all);
}

// ─── Read ───────────────────────────────────────────────────────────────────

export function getHistory(filters?: HistoryFilters): {
    entries: PipelineHistory[];
    total: number;
} {
    let entries = readAll();

    // Filter by status
    if (filters?.status && filters.status !== "all") {
        entries = entries.filter((e) => e.status === filters.status);
    }

    // Filter by search
    if (filters?.search) {
        const q = filters.search.toLowerCase();
        entries = entries.filter((e) => {
            const analysis = e.agents.productAnalysis.result;
            const productText = analysis
                ? `${analysis.category} ${analysis.sub_category} ${analysis.style_aesthetic}`.toLowerCase()
                : "";
            const scriptText = e.agents.scriptWriter.result?.hook?.text?.toLowerCase() || "";
            const tags = e.metadata.tags.join(" ").toLowerCase();
            return productText.includes(q) || scriptText.includes(q) || tags.includes(q);
        });
    }

    // Filter by tags
    if (filters?.tags?.length) {
        entries = entries.filter((e) =>
            filters.tags!.some((t) => e.metadata.tags.includes(t))
        );
    }

    // Filter by date range
    if (filters?.dateFrom) {
        const from = new Date(filters.dateFrom).getTime();
        entries = entries.filter((e) => new Date(e.createdAt).getTime() >= from);
    }
    if (filters?.dateTo) {
        const to = new Date(filters.dateTo).getTime();
        entries = entries.filter((e) => new Date(e.createdAt).getTime() <= to);
    }

    const total = entries.length;

    // Paginate
    const page = filters?.page ?? 0;
    const pageSize = filters?.pageSize ?? 20;
    entries = entries.slice(page * pageSize, (page + 1) * pageSize);

    return { entries, total };
}

export function getHistoryById(id: string): PipelineHistory | null {
    return readAll().find((e) => e.id === id) ?? null;
}

// ─── Delete ─────────────────────────────────────────────────────────────────

export function deleteHistoryEntries(ids: string[]): void {
    const idSet = new Set(ids);
    writeAll(readAll().filter((e) => !idSet.has(e.id)));
}

// ─── Tags Aggregation ───────────────────────────────────────────────────────

export function getAllTags(): string[] {
    const tagSet = new Set<string>();
    for (const entry of readAll()) {
        for (const t of entry.metadata.tags) {
            tagSet.add(t);
        }
    }
    return Array.from(tagSet).sort();
}
