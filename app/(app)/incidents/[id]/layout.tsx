"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useMe } from "@/lib/auth/auth-context";
import { useIncidentStore } from "@/lib/state/incidentStore";
import { IncidentContextProvider } from "./incident-context";
import IncidentHeader from "@/app/components/page/incidents/IncidentHeader";
import IncidentSubNav from "@/app/components/page/incidents/IncidentSubNav";
import StatusUpdateModal from "@/app/components/page/incidents/StatusUpdateModal";

export default function IncidentLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const { user } = useMe();
    const { state, actions } = useIncidentStore(id, user);
    const [showStatusModal, setShowStatusModal] = useState(false);

    useEffect(() => {
        actions.load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions.load]);

    // Loading skeleton
    if (state.async.loading) {
        return (
            <div className="max-w-[1600px] space-y-4">
                <div className="h-28 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]" />
                <div className="h-10 w-72 animate-pulse rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)]" />
                <div className="grid gap-4 lg:grid-cols-12">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="h-48 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]" />
                        <div className="h-48 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]" />
                    </div>
                    <div className="lg:col-span-4 space-y-4">
                        <div className="h-32 animate-pulse rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)]" />
                    </div>
                </div>
            </div>
        );
    }

    // Not found
    if (!state.data) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-bg-active)] text-2xl">
                    🔍
                </div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Incident not found</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Try{" "}
                    <Link href="/incidents/inc_001" className="text-[var(--color-accent)] underline">
                        inc_001
                    </Link>{" "}
                    or{" "}
                    <Link href="/incidents/inc_002" className="text-[var(--color-accent)] underline">
                        inc_002
                    </Link>
                </p>
            </div>
        );
    }

    const { incident, tasks, approvals, timeline } = state.data;
    const activeTasks = tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "TODO").length;
    const pendingApprovals = approvals.filter((a) => a.status === "PENDING").length;

    return (
        <IncidentContextProvider state={state} actions={actions}>
            <div className="max-w-[1600px]">
                {/* Error banner */}
                {state.async.error && (
                    <div className="mb-3 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                        <span>{state.async.error.message}</span>
                        <button onClick={actions.clearError} className="text-xs underline hover:text-red-300">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Compact header */}
                <IncidentHeader
                    incident={incident}
                    userMap={state.data.userMap}
                    onGenerateStatusUpdate={() => setShowStatusModal(true)}
                />

                {/* Sub-navigation */}
                <div className="mt-4 flex items-center justify-between">
                    <IncidentSubNav
                        incidentId={id}
                        counts={{
                            activeTasks,
                            pendingApprovals,
                            timelineEvents: timeline.length,
                        }}
                    />
                    <Link
                        href={`/incidents/${id}/report`}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)]"
                    >
                        View Report
                    </Link>
                </div>

                {/* Page content (Overview / Execute / Updates) */}
                <div className="mt-5">{children}</div>

                {/* Status Update Modal */}
                {state.data && (
                    <StatusUpdateModal
                        isOpen={showStatusModal}
                        onClose={() => setShowStatusModal(false)}
                        aggregate={state.data}
                        onPostUpdate={actions.addTimelineNote}
                        integrations={state.data.integrations}
                    />
                )}
            </div>
        </IncidentContextProvider>
    );
}
