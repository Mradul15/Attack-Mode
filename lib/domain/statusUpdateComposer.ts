/**
 * Status Update Composer — deterministic template-based generation.
 * Pure function, no React, no side effects.
 * Composes structured communication drafts from incident aggregate data.
 */

import type { IncidentAggregate } from "@/lib/domain/models";
import type { TaskInstance, TimelineEvent, Approval, User } from "@/lib/types";

export type UpdateAudience = "internal" | "executive" | "customer";

export interface ComposedUpdate {
    audience: UpdateAudience;
    subject: string;
    body: string;
    generatedAt: string;
}

// ── Helpers ──────────────────────────────────────────────

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

function formatDuration(createdAt: string): string {
    const ms = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(ms / 60_000);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hours < 24) return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
}

function tasksByStatus(tasks: TaskInstance[]) {
    return {
        done: tasks.filter((t) => t.status === "DONE"),
        inProgress: tasks.filter((t) => t.status === "IN_PROGRESS"),
        todo: tasks.filter((t) => t.status === "TODO"),
        blocked: tasks.filter((t) => t.status === "SKIPPED"),
    };
}

function severityLabel(sev: string): string {
    const map: Record<string, string> = {
        S0: "Critical (S0)", S1: "High (S1)", S2: "Medium (S2)",
        S3: "Low (S3)", S4: "Informational (S4)",
    };
    return map[sev] ?? sev;
}

function recentEvents(timeline: TimelineEvent[], count: number): TimelineEvent[] {
    return [...timeline]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, count);
}

function pendingApprovals(approvals: Approval[]): Approval[] {
    return approvals.filter((a) => a.status === "PENDING");
}

// ── Composers ────────────────────────────────────────────

function composeInternal(agg: IncidentAggregate): ComposedUpdate {
    const { incident, tasks, timeline, approvals, userMap } = agg;
    const ts = tasksByStatus(tasks);
    const pending = pendingApprovals(approvals);
    const recent = recentEvents(timeline, 4);
    const duration = formatDuration(incident.created_at);
    const ic = getUserName(userMap, incident.ic_user_id);

    const lines: string[] = [];
    lines.push(`# Internal Status Update — ${incident.title}`);
    lines.push("");
    lines.push(`**Severity:** ${severityLabel(incident.severity)}  ·  **Status:** ${incident.status}  ·  **Duration:** ${duration}`);
    lines.push(`**Incident Commander:** ${ic}`);
    if (incident.impacted_services.length) {
        lines.push(`**Impacted Services:** ${incident.impacted_services.join(", ")}`);
    }

    lines.push("");
    lines.push("## Current Situation");
    if (incident.description) {
        lines.push(incident.description);
    }
    if (ts.inProgress.length > 0) {
        lines.push("");
        lines.push("**In progress:**");
        for (const t of ts.inProgress) {
            lines.push(`- ${t.title} (${getUserName(userMap, t.assignee_id)})`);
        }
    }
    if (ts.blocked.length > 0) {
        lines.push("");
        lines.push("**Blocked / Skipped:**");
        for (const t of ts.blocked) {
            lines.push(`- ⚠ ${t.title} (${getUserName(userMap, t.assignee_id)})`);
        }
    }

    if (ts.done.length > 0) {
        lines.push("");
        lines.push("## Completed");
        for (const t of ts.done) {
            lines.push(`- ✓ ${t.title}`);
        }
    }

    if (ts.todo.length > 0) {
        lines.push("");
        lines.push("## Next Steps");
        for (const t of ts.todo.slice(0, 5)) {
            lines.push(`- ${t.title} → ${getUserName(userMap, t.assignee_id)}${t.due_in_minutes ? ` (${t.due_in_minutes}m)` : ""}`);
        }
        if (ts.todo.length > 5) {
            lines.push(`- …and ${ts.todo.length - 5} more`);
        }
    }

    if (pending.length > 0) {
        lines.push("");
        lines.push("## Pending Approvals");
        for (const a of pending) {
            lines.push(`- 🔓 ${a.title} (requested by ${getUserName(userMap, a.requester_id)})`);
        }
    }

    if (recent.length > 0) {
        lines.push("");
        lines.push("## Recent Activity");
        for (const e of recent) {
            const ago = formatDuration(e.created_at);
            lines.push(`- ${ago} ago — ${e.message}`);
        }
    }

    const totalTasks = tasks.length;
    const donePct = totalTasks > 0 ? Math.round((ts.done.length / totalTasks) * 100) : 0;
    lines.push("");
    lines.push(`**Progress:** ${ts.done.length}/${totalTasks} tasks complete (${donePct}%)`);

    return {
        audience: "internal",
        subject: `[Internal] ${incident.title} — ${incident.status}`,
        body: lines.join("\n"),
        generatedAt: new Date().toISOString(),
    };
}

function composeExecutive(agg: IncidentAggregate): ComposedUpdate {
    const { incident, tasks, approvals, userMap } = agg;
    const ts = tasksByStatus(tasks);
    const pending = pendingApprovals(approvals);
    const duration = formatDuration(incident.created_at);
    const ic = getUserName(userMap, incident.ic_user_id);
    const totalTasks = tasks.length;
    const donePct = totalTasks > 0 ? Math.round((ts.done.length / totalTasks) * 100) : 0;

    const lines: string[] = [];
    lines.push(`# Executive Brief — ${incident.title}`);
    lines.push("");
    lines.push(`**Severity:** ${severityLabel(incident.severity)}  ·  **Duration:** ${duration}  ·  **Status:** ${incident.status}`);
    lines.push("");

    lines.push("## Impact Summary");
    if (incident.impacted_services.length) {
        lines.push(`Affected services: ${incident.impacted_services.join(", ")}.`);
    }
    if (incident.description) {
        lines.push(incident.description);
    } else {
        lines.push(`${severityLabel(incident.severity)} incident active for ${duration}.`);
    }

    lines.push("");
    lines.push("## Mitigation Progress");
    lines.push(`${ts.done.length} of ${totalTasks} response tasks complete (${donePct}%).`);
    if (ts.inProgress.length > 0) {
        lines.push(`${ts.inProgress.length} task${ts.inProgress.length > 1 ? "s" : ""} actively in progress.`);
    }
    if (ts.blocked.length > 0) {
        lines.push(`⚠ ${ts.blocked.length} task${ts.blocked.length > 1 ? "s" : ""} currently blocked.`);
    }

    lines.push("");
    lines.push("## Key Risk");
    if (ts.blocked.length > 0) {
        lines.push(`Blocked tasks: ${ts.blocked.map((t) => t.title).join(", ")}.`);
    } else if (pending.length > 0) {
        lines.push(`${pending.length} approval${pending.length > 1 ? "s" : ""} pending sign-off.`);
    } else if (donePct < 50) {
        lines.push("Response is early-stage. Further assessment needed for full impact clarity.");
    } else {
        lines.push("No significant blockers identified at this time.");
    }

    lines.push("");
    lines.push("## Next Checkpoint");
    lines.push(`Incident commander: ${ic}.`);
    if (ts.todo.length > 0) {
        lines.push(`Next action: ${ts.todo[0].title}.`);
    }

    return {
        audience: "executive",
        subject: `[Exec Brief] ${incident.title} — ${severityLabel(incident.severity)}`,
        body: lines.join("\n"),
        generatedAt: new Date().toISOString(),
    };
}

function composeCustomer(agg: IncidentAggregate): ComposedUpdate {
    const { incident, tasks } = agg;
    const ts = tasksByStatus(tasks);
    const duration = formatDuration(incident.created_at);
    const totalTasks = tasks.length;
    const donePct = totalTasks > 0 ? Math.round((ts.done.length / totalTasks) * 100) : 0;

    const lines: string[] = [];
    lines.push(`# Service Status Update — ${incident.title}`);
    lines.push("");
    lines.push("*DRAFT — For review before external publication*");
    lines.push("");

    lines.push("## Issue Summary");
    if (incident.impacted_services.length) {
        lines.push(`We are aware of an issue affecting ${incident.impacted_services.join(", ")}.`);
    } else {
        lines.push("We are aware of an issue affecting some services.");
    }
    if (incident.description) {
        lines.push(incident.description);
    }

    lines.push("");
    lines.push("## Current Status");
    if (donePct >= 100) {
        lines.push("Our team has completed all remediation steps. We are continuing to monitor for any recurrence.");
    } else if (donePct >= 50) {
        lines.push(`Our engineering team is actively working on this issue and has made significant progress. We have been working on this for approximately ${duration}.`);
    } else {
        lines.push(`Our engineering team has been engaged and is actively investigating this issue. We have been working on this for approximately ${duration}.`);
    }

    lines.push("");
    lines.push("## What We're Doing");
    if (ts.inProgress.length > 0) {
        lines.push("We are currently executing remediation steps to restore normal service operation.");
    }
    if (ts.blocked.length > 0) {
        lines.push("Some tasks require additional coordination, which may extend our timeline slightly.");
    }
    lines.push(`Our response is ${donePct}% complete.`);

    lines.push("");
    lines.push("## Next Update");
    lines.push("We will provide another update within the next 30 minutes, or sooner if the situation changes materially.");
    lines.push("");
    lines.push("We apologize for any inconvenience and appreciate your patience.");

    return {
        audience: "customer",
        subject: `[Service Update] ${incident.title}`,
        body: lines.join("\n"),
        generatedAt: new Date().toISOString(),
    };
}

// ── Public API ───────────────────────────────────────────

export function composeStatusUpdate(
    aggregate: IncidentAggregate,
    audience: UpdateAudience,
): ComposedUpdate {
    switch (audience) {
        case "internal": return composeInternal(aggregate);
        case "executive": return composeExecutive(aggregate);
        case "customer": return composeCustomer(aggregate);
    }
}
