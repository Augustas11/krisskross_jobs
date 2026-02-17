/**
 * Pipeline History Page
 * List view of all pipeline runs.
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { HistoryList } from "@/features/pipeline/components/HistoryList";

export default function HistoryPage() {
    const router = useRouter();

    return (
        <HistoryList
            onViewDetail={(id) => router.push(`/history/${id}`)}
        />
    );
}
