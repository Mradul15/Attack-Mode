"use client";

/**
 * Overview page — high signal, low noise.
 * Shows previews of the most important data with "View all" links
 * to the Execute and Updates pages.
 */

import Link from "next/link";
import { useIncidentContext } from "./incident-context";
import TermTooltip from "@/app/components/global/TermTooltip";
import { useMe } from "@/lib/auth/auth-context";

export default function OverviewPage() {
    const { aggregate, actions } = useIncidentContext();
    const { can } = useMe();

    if (!aggregate) return null;

    const { incident, tasks, approvals, decisions, timeline, userMap } = aggregate;

    // Derive data
    const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
    const blockedTasks = tasks.filter((t) => t.status === "SKIPPED");
    const todoTasks = tasks.filter((t) => t.status === "TODO");
    const activeTasks = [...inProgressTasks, ...blockedTasks];

    const nextSteps = [...inProgressTasks, ...todoTasks]
        .sort((a, b) => {
            if (a.status === "IN_PROGRESS" && b.status !== "IN_PROGRESS") return -1;
            if (b.status === "IN_PROGRESS" && a.status !== "IN_PROGRESS") return 1;
            return (a.due_in_minutes ?? 999) - (b.due_in_minutes ?? 999);
        })
        .slice(0, 3);

    const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
    const pendingDecisions = decisions.filter((d) => !d.response);
    const recentTimeline = [...timeline]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    const canEditAll = can("task.update");

    return (
        <div className="grid gap-5 lg:grid-cols-2">
            {/* ── What to do next ── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        <TermTooltip termKey="next_steps">What to do next</TermTooltip>
                    </h3>
                    <Link
                        href={`/incidents/${incident.incident_id}/execute`}
                        className="text-xs text-[var(--color-accent)] hover:underline"
                    >
                        View all tasks &rarr;
                    </Link>
                </div>
                {nextSteps.length === 0 ? (
                    <div className="flex h-14 items-center justify-center rounded-lg border border-dashed border-green-500/30 bg-green-500/5 text-sm text-green-400">
                        All caught up — no pending action items
                    </div>
                ) : (
                    <div className="space-y-2">
                        {nextSteps.map((task, i) => (
                            <div
                                key={task.task_id}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                                    i === 0
                                        ? "border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5"
                                        : "bg-[var(--color-bg-root)]"
                                }`}
                            >
                                <div
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                        task.status === "IN_PROGRESS"
                                            ? "bg-blue-500/15 text-blue-400"
                                            : "bg-[var(--color-bg-active)] text-[var(--color-text-muted)]"
                                    }`}
                                >
                                    {task.status === "IN_PROGRESS" ? "▶" : i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{task.title}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {userMap[task.assignee_id]?.name ?? "Unassigned"}
                                        {task.due_in_minutes != null && (
                                            <span className="ml-2 text-orange-400">{task.due_in_minutes}m</span>
                                        )}
                                    </p>
                                </div>
                                {canEditAll && task.status === "TODO" && (
                                    <button
                                        onClick={() => actions.startTask(task.task_id)}
                                        className="shrink-0 rounded-md bg-[var(--color-accent)]/15 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)]/25"
                                    >
                                        Start
                                    </button>
                                )}
                                {canEditAll && task.status === "IN_PROGRESS" && (
                                    <button
                                        onClick={() => actions.completeTask(task.task_id)}
                                        className="shrink-0 rounded-md bg-green-500/15 px-2.5 py-1 text-xs font-semibold text-green-400 hover:bg-green-500/25"
                                    >
                                        Done
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Active work preview ── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        Active work
                        {activeTasks.length > 0 && (
                            <span className="ml-2 rounded-full bg-blue-500/15 px-1.5 py-0.5 text-[10px] font-medium text-blue-400">
                                {activeTasks.length}
                            </span>
                        )}
                    </h3>
                    <Link
                        href={`/incidents/${incident.incident_id}/execute`}
                        className="text-xs text-[var(--color-accent)] hover:underline"
                    >
                        View all &rarr;
                    </Link>
                </div>
                {activeTasks.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[var(--color-text-muted)]">No active or blocked tasks</p>
                ) : (
                    <div className="space-y-2">
                        {activeTasks.slice(0, 4).map((task) => (
                            <div key={task.task_id} className="flex items-center gap-2 rounded-lg bg-[var(--color-bg-root)] px-3 py-2">
                                <span
                                    className={`h-2 w-2 shrink-0 rounded-full ${
                                        task.status === "SKIPPED" ? "bg-red-400" : "bg-blue-400"
                                    }`}
                                />
                                <span className="flex-1 truncate text-sm text-[var(--color-text-secondary)]">{task.title}</span>
                                <span className="shrink-0 text-[10px] text-[var(--color-text-muted)]">
                                    {userMap[task.assignee_id]?.name?.split(" ")[0] ?? "—"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Waiting on sign-off (Approvals) preview ── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        <TermTooltip termKey="approval">Waiting on sign-off</TermTooltip>
                        {pendingApprovals.length > 0 && (
                            <span className="ml-2 rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-medium text-orange-400">
                                {pendingApprovals.length}
                            </span>
                        )}
                    </h3>
                    <Link
                        href={`/incidents/${incident.incident_id}/execute`}
                        className="text-xs text-[var(--color-accent)] hover:underline"
                    >
                        View all &rarr;
                    </Link>
                </div>
                {pendingApprovals.length === 0 && pendingDecisions.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[var(--color-text-muted)]">Nothing waiting for sign-off</p>
                ) : (
                    <div className="space-y-2">
                        {pendingApprovals.map((a) => (
                            <div key={a.approval_id} className="flex items-center gap-2 rounded-lg border border-orange-500/20 bg-orange-500/5 px-3 py-2">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" />
                                <span className="flex-1 truncate text-sm text-[var(--color-text-secondary)]">{a.title}</span>
                                <span className="shrink-0 rounded-full bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                                    Pending
                                </span>
                            </div>
                        ))}
                        {pendingDecisions.map((d) => (
                            <div key={d.decision_id} className="flex items-center gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2">
                                <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-400" />
                                <span className="flex-1 truncate text-sm text-[var(--color-text-secondary)]">{d.prompt}</span>
                                <span className="shrink-0 rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-medium text-yellow-400">
                                    Needs input
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Recent updates (Timeline) preview ── */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 lg:col-span-2">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                        <TermTooltip termKey="timeline">Recent updates</TermTooltip>
                    </h3>
                    <Link
                        href={`/incidents/${incident.incident_id}/updates`}
                        className="text-xs text-[var(--color-accent)] hover:underline"
                    >
                        View all {timeline.length} events &rarr;
                    </Link>
                </div>
                {recentTimeline.length === 0 ? (
                    <p className="py-4 text-center text-xs text-[var(--color-text-muted)]">No updates yet</p>
                ) : (
                    <div className="space-y-1">
                        {recentTimeline.map((event) => (
                            <div key={event.event_id} className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-[var(--color-bg-root)]">
                                <span className="mt-1 text-xs">
                                    {event.type === "action"
                                        ? "⚡"
                                        : event.type === "status_change"
                                          ? "⟳"
                                          : event.type === "escalation"
                                            ? "🔺"
                                            : event.type === "resolution"
                                              ? "✓"
                                              : "💬"}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-[var(--color-text-secondary)] leading-snug">{event.message}</p>
                                    <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                                        {event.actor_name} &middot; {new Date(event.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
