"use client";

/**
 * Execute page — the main cockpit / work surface.
 * 3-column layout: Tasks (left), Decisions + Approvals (center), Context rail (right, collapsible).
 */

import { useState } from "react";
import { useIncidentContext } from "../incident-context";
import NextStepsPanel from "@/app/components/page/incidents/NextStepsPanel";
import TaskBoard from "@/app/components/page/incidents/TaskBoard";
import DecisionsPanel from "@/app/components/page/incidents/DecisionsPanel";
import ApprovalsQueue from "@/app/components/page/incidents/ApprovalsQueue";
import ContextPanel from "@/app/components/page/incidents/ContextPanel";
import StatusUpdateModal from "@/app/components/page/incidents/StatusUpdateModal";

export default function ExecutePage() {
    const { aggregate, actions } = useIncidentContext();
    const [contextOpen, setContextOpen] = useState(true);
    const [showStatusModal, setShowStatusModal] = useState(false);

    if (!aggregate) return null;

    const { incident, tasks, approvals, decisions, integrations, userMap } = aggregate;

    return (
        <div className="flex gap-5">
            {/* ── Left: Tasks (primary work surface) ── */}
            <div className="min-w-0 flex-1 space-y-5">
                <NextStepsPanel
                    tasks={tasks}
                    userMap={userMap}
                    onStartTask={actions.startTask}
                    onCompleteTask={actions.completeTask}
                />
                <TaskBoard
                    tasks={tasks}
                    incidentId={incident.incident_id}
                    userMap={userMap}
                    onUpdateTaskStatus={actions.updateTaskStatus}
                />
            </div>

            {/* ── Center: Decisions + Approvals + Generate ── */}
            <div className="w-80 shrink-0 space-y-5">
                {/* Status update quick action */}
                <button
                    onClick={() => setShowStatusModal(true)}
                    className="flex w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-3 text-left transition-all hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-bg-hover)]"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-base">📋</span>
                    <div>
                        <p className="text-sm font-semibold text-[var(--color-text-primary)]">Generate Status Update</p>
                        <p className="text-xs text-[var(--color-text-muted)]">Compose updates for team, execs, or customers</p>
                    </div>
                </button>

                <DecisionsPanel
                    decisions={decisions}
                    userMap={userMap}
                    onRespondToDecision={actions.respondToDecision}
                />
                <ApprovalsQueue
                    approvals={approvals}
                    userMap={userMap}
                    onApprove={actions.approveApproval}
                    onDeny={actions.denyApproval}
                />
            </div>

            {/* ── Right: Context rail (collapsible) ── */}
            <div className={`shrink-0 transition-all duration-200 ${contextOpen ? "w-72" : "w-8"}`}>
                <button
                    onClick={() => setContextOpen(!contextOpen)}
                    className="mb-2 flex h-7 w-7 items-center justify-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] focus:ring-2 focus:ring-[var(--color-accent)]/40 outline-none"
                    title={contextOpen ? "Collapse context" : "Expand context"}
                    aria-label={contextOpen ? "Collapse context panel" : "Expand context panel"}
                    aria-expanded={contextOpen}
                >
                    {contextOpen ? "◁" : "▷"}
                </button>
                {contextOpen && (
                    <ContextPanel
                        incident={incident}
                        userMap={userMap}
                        integrations={integrations}
                    />
                )}
            </div>

            {/* Status Update Modal — Execute page entry point */}
            <StatusUpdateModal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                aggregate={aggregate}
                onPostUpdate={actions.addTimelineNote}
                integrations={integrations}
            />
        </div>
    );
}
