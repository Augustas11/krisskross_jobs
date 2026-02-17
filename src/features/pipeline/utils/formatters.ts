/**
 * Formatters
 * Duration, date, and cost formatting utilities.
 */

/** Format milliseconds to human-readable duration: "23.4s" or "1m 12s" */
export function formatDuration(ms: number | null | undefined): string {
    if (ms == null || ms <= 0) return "—";
    if (ms < 1000) return `${ms}ms`;
    const secs = ms / 1000;
    if (secs < 60) return `${secs.toFixed(1)}s`;
    const mins = Math.floor(secs / 60);
    const remainSecs = Math.round(secs % 60);
    return `${mins}m ${remainSecs}s`;
}

/** Format ISO date string to display: "Feb 16, 2026 · 14:32" */
export function formatDate(isoString: string | null | undefined): string {
    if (!isoString) return "—";
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "—";
    const month = d.toLocaleString("en-US", { month: "short" });
    const day = d.getDate();
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${month} ${day}, ${year} · ${hours}:${minutes}`;
}

/** Format a compact relative time: "2m ago", "3h ago", "2d ago" */
export function formatRelativeTime(isoString: string): string {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

/**
 * Estimate API cost based on agent count completed.
 * Rough estimate: Agent 01 (vision) ~$0.03, Agents 02-04 ~$0.015 each.
 */
export function estimateCost(agentCount: number, hadVisionCall: boolean): number {
    let cost = 0;
    if (hadVisionCall) {
        cost += 0.03; // Vision model is more expensive
        agentCount -= 1;
    }
    cost += agentCount * 0.015;
    return Math.round(cost * 1000) / 1000; // Round to 3 decimal places
}

/** Format cost: "$0.08" */
export function formatCost(cost: number | null | undefined): string {
    if (cost == null) return "—";
    return `$${cost.toFixed(2)}`;
}
