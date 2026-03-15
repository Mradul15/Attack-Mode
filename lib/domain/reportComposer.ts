/**
 * Report Composer — deterministic template-based report section generation.
 * Pure functions, no React, no side effects.
 * Composes structured report sections from incident aggregate data.
 */

import type { IncidentAggregate } from "@/lib/domain/models";
import type {
    TaskInstance,
    TimelineEvent,
    Approval,
    Decision,
    User,
} from "@/lib/types";

// ── Helpers ──────────────────────────────────────────────

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

function formatDateTime(iso: string): string {
    try {
        return new Date(iso).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return iso;
    }
}

function formatDuration(createdAt: string, resolvedAt?: string): string {
    const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
    const ms = end - new Date(createdAt).getTime();
    const mins = Math.floor(ms / 60_000);
    if (mins < 60) return `${mins} minutes`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours < 24) return remMins > 0 ? `${hours}h ${remMins}m` : `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
}

function severityLabel(sev: string): string {
    const map: Record<string, string> = {
        S0: "Critical (S0)",
        S1: "High (S1)",
        S2: "Medium (S2)",
        S3: "Low (S3)",
        S4: "Informational (S4)",
    };
    return map[sev] ?? sev;
}

// ── Exported report section types ────────────────────────

export interface TaskSummary {
    total: number;
    completed: number;
    inProgress: number;
    blocked: number;
    notStarted: number;
    completionPct: number;
    completedTasks: TaskInstance[];
    blockedTasks: TaskInstance[];
    inProgressTasks: TaskInstance[];
}

export interface FollowUpItem {
    icon: string;
    label: string;
    severity: "info" | "warning" | "critical";
}

export interface TimelineHighlight {
    time: string;
    actor: string;
    message: string;
    type: string;
}

export interface ReportData {
    /** Incident metadata */
    incidentId: string;
    title: string;
    severity: string;
    severityLabel: string;
    status: string;
    createdAt: string;
    resolvedAt: string | null;
    duration: string;
    commander: string;
    commanderId: string;
    services: string[];
    tags: string[];
    description: string;

    /** Executive summary (generated text) */
    executiveSummary: string;

    /** Timeline highlights */
    timelineHighlights: TimelineHighlight[];
    totalTimelineEvents: number;

    /** Work summary */
    taskSummary: TaskSummary;

    /** Decisions */
    decisions: {
        total: number;
        resolved: number;
        pending: number;
        items: Array<{
            prompt: string;
            response: string | null;
            respondedBy: string | null;
            respondedAt: string | null;
        }>;
    };

    /** Approvals */
    approvals: {
        total: number;
        approved: number;
        denied: number;
        pending: number;
        items: Array<{
            title: string;
            status: string;
            approvedBy: string | null;
            resolvedAt: string | null;
        }>;
    };

    /** Communications */
    communications: {
        internalUpdates: number;
        executiveUpdates: number;
        customerUpdates: number;
        lastCommunication: TimelineHighlight | null;
    };

    /** Follow-up items */
    followUps: FollowUpItem[];

    /** When the report was generated */
    generatedAt: string;
}

// ── Composers ────────────────────────────────────────────

function composeExecutiveSummary(agg: IncidentAggregate): string {
    const { incident, tasks } = agg;
    const ts = classifyTasks(tasks);
    const duration = formatDuration(incident.created_at, incident.resolved_at);

    const lines: string[] = [];

    // What happened
    if (incident.description) {
        lines.push(incident.description);
    } else {
        lines.push(
            `A ${severityLabel(incident.severity).toLowerCase()} incident was opened affecting ${incident.impacted_services.length
                ? incident.impacted_services.join(", ")
                : "multiple services"
            }.`,
        );
    }

    // Current/final state
    if (incident.status === "RESOLVED" || incident.status === "CLOSED") {
        lines.push(
            `The incident has been ${incident.status.toLowerCase()} after ${duration} of active response.`,
        );
    } else {
        lines.push(
            `The incident remains ${incident.status.toLowerCase()} with an active response time of ${duration}.`,
        );
    }

    // Impact
    if (incident.impacted_services.length > 0) {
        lines.push(
            `Impacted services: ${incident.impacted_services.join(", ")}.`,
        );
    }

    // Response progress
    if (ts.total > 0) {
        lines.push(
            `Response operations: ${ts.completed} of ${ts.total} tasks completed (${ts.completionPct}%). ${ts.blocked > 0
                ? `${ts.blocked} task${ts.blocked > 1 ? "s" : ""} blocked.`
                : ts.inProgress > 0
                    ? `${ts.inProgress} task${ts.inProgress > 1 ? "s" : ""} still in progress.`
                    : ts.notStarted > 0
                        ? `${ts.notStarted} task${ts.notStarted > 1 ? "s" : ""} not yet started.`
                        : "All tasks complete."
            }`,
        );
    }

    return lines.join(" ");
}

function classifyTasks(tasks: TaskInstance[]): TaskSummary {
    const completed = tasks.filter((t) => t.status === "DONE");
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
    const blocked = tasks.filter((t) => t.status === "SKIPPED");
    const notStarted = tasks.filter((t) => t.status === "TODO");
    const total = tasks.length;
    const completionPct = total > 0 ? Math.round((completed.length / total) * 100) : 0;

    return {
        total,
        completed: completed.length,
        inProgress: inProgress.length,
        blocked: blocked.length,
        notStarted: notStarted.length,
        completionPct,
        completedTasks: completed,
        blockedTasks: blocked,
        inProgressTasks: inProgress,
    };
}

function composeTimelineHighlights(
    timeline: TimelineEvent[],
    userMap: Record<string, User>,
): TimelineHighlight[] {
    const sorted = [...timeline].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    // Include all significant events: status changes, actions, escalations, resolutions
    // For large timelines, keep first, last, and most significant
    const significant = sorted.filter(
        (e) =>
            e.type === "status_change" ||
            e.type === "action" ||
            e.type === "escalation" ||
            e.type === "resolution" ||
            e.message.toLowerCase().includes("update posted") ||
            e.message.toLowerCase().includes("approval") ||
            e.message.toLowerCase().includes("created"),
    );

    const highlights = (significant.length > 0 ? significant : sorted).slice(0, 12);

    return highlights.map((e) => ({
        time: formatDateTime(e.created_at),
        actor: getUserName(userMap, e.actor_id),
        message: e.message,
        type: e.type,
    }));
}

function composeCommunications(timeline: TimelineEvent[]): ReportData["communications"] {
    const commsEvents = timeline.filter(
        (e) =>
            e.message.toLowerCase().includes("update posted") ||
            e.message.toLowerCase().includes("status update"),
    );

    const internal = commsEvents.filter((e) =>
        e.message.toLowerCase().includes("internal"),
    ).length;
    const executive = commsEvents.filter((e) =>
        e.message.toLowerCase().includes("executive") || e.message.toLowerCase().includes("exec"),
    ).length;
    const customer = commsEvents.filter((e) =>
        e.message.toLowerCase().includes("customer"),
    ).length;

    const sorted = [...commsEvents].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return {
        internalUpdates: internal,
        executiveUpdates: executive,
        customerUpdates: customer,
        lastCommunication: sorted[0]
            ? {
                time: formatDateTime(sorted[0].created_at),
                actor: sorted[0].actor_name,
                message: sorted[0].message.split("\n")[0], // first line only
                type: sorted[0].type,
            }
            : null,
    };
}

function composeFollowUps(agg: IncidentAggregate): FollowUpItem[] {
    const { incident, tasks, approvals, decisions, timeline } = agg;
    const items: FollowUpItem[] = [];

    // Blocked tasks
    const blocked = tasks.filter((t) => t.status === "SKIPPED");
    if (blocked.length > 0) {
        items.push({
            icon: "⚠",
            label: `${blocked.length} blocked task${blocked.length > 1 ? "s" : ""} still unresolved`,
            severity: "critical",
        });
    }

    // Pending approvals
    const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
    if (pendingApprovals.length > 0) {
        items.push({
            icon: "🔓",
            label: `${pendingApprovals.length} approval${pendingApprovals.length > 1 ? "s" : ""} still pending sign-off`,
            severity: "warning",
        });
    }

    // Unresolved decisions
    const unresolvedDecisions = decisions.filter((d) => !d.response);
    if (unresolvedDecisions.length > 0) {
        items.push({
            icon: "❓",
            label: `${unresolvedDecisions.length} decision${unresolvedDecisions.length > 1 ? "s" : ""} still unanswered`,
            severity: "warning",
        });
    }

    // No customer communication for customer-impacting incidents
    const hasCustomerFacing = timeline.some(
        (e) =>
            e.message.toLowerCase().includes("customer") &&
            e.message.toLowerCase().includes("update"),
    );
    if (incident.impacted_services.length > 0 && !hasCustomerFacing) {
        items.push({
            icon: "📢",
            label: "No customer-facing update was posted for this service-impacting incident",
            severity: "info",
        });
    }

    // In-progress tasks still open
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
    if (inProgress.length > 0 && (incident.status === "RESOLVED" || incident.status === "CLOSED")) {
        items.push({
            icon: "🔄",
            label: `${inProgress.length} task${inProgress.length > 1 ? "s" : ""} still marked in-progress after resolution`,
            severity: "warning",
        });
    }

    // No resolution marker
    if (incident.status !== "RESOLVED" && incident.status !== "CLOSED") {
        items.push({
            icon: "🏁",
            label: "Incident has not been formally resolved or closed",
            severity: "info",
        });
    }

    // Not-started tasks
    const notStarted = tasks.filter((t) => t.status === "TODO");
    if (notStarted.length > 0 && (incident.status === "RESOLVED" || incident.status === "CLOSED")) {
        items.push({
            icon: "📋",
            label: `${notStarted.length} task${notStarted.length > 1 ? "s" : ""} were never started`,
            severity: "info",
        });
    }

    return items;
}

// ── Public API ───────────────────────────────────────────

export function composeReport(aggregate: IncidentAggregate): ReportData {
    const { incident, tasks, approvals, decisions, timeline, userMap } = aggregate;

    return {
        incidentId: incident.incident_id,
        title: incident.title,
        severity: incident.severity,
        severityLabel: severityLabel(incident.severity),
        status: incident.status,
        createdAt: formatDateTime(incident.created_at),
        resolvedAt: incident.resolved_at ? formatDateTime(incident.resolved_at) : null,
        duration: formatDuration(incident.created_at, incident.resolved_at),
        commander: getUserName(userMap, incident.ic_user_id),
        commanderId: incident.ic_user_id,
        services: incident.impacted_services,
        tags: incident.tags,
        description: incident.description ?? "",

        executiveSummary: composeExecutiveSummary(aggregate),

        timelineHighlights: composeTimelineHighlights(timeline, userMap),
        totalTimelineEvents: timeline.length,

        taskSummary: classifyTasks(tasks),

        decisions: {
            total: decisions.length,
            resolved: decisions.filter((d) => d.response).length,
            pending: decisions.filter((d) => !d.response).length,
            items: decisions.map((d: Decision) => ({
                prompt: d.prompt,
                response: d.response ?? null,
                respondedBy: d.responded_by ? getUserName(userMap, d.responded_by) : null,
                respondedAt: d.responded_at ? formatDateTime(d.responded_at) : null,
            })),
        },

        approvals: {
            total: approvals.length,
            approved: approvals.filter((a) => a.status === "APPROVED").length,
            denied: approvals.filter((a) => a.status === "DENIED").length,
            pending: approvals.filter((a) => a.status === "PENDING").length,
            items: approvals.map((a: Approval) => ({
                title: a.title,
                status: a.status,
                approvedBy: a.approved_by ? getUserName(userMap, a.approved_by) : null,
                resolvedAt: a.resolved_at ? formatDateTime(a.resolved_at) : null,
            })),
        },

        communications: composeCommunications(timeline),

        followUps: composeFollowUps(aggregate),

        generatedAt: new Date().toISOString(),
    };
}
