/**
 * Pipeline History Detail Page
 * Full detail view of a single pipeline run.
 */

"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { HistoryDetail } from "@/features/pipeline/components/HistoryDetail";

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    return (
        <HistoryDetail
            id={id}
            onBack={() => router.push("/history")}
        />
    );
}
