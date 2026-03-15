/**
 * Domain models — pure types, no React, no API.
 * Re-exports relevant types from lib/types and adds domain-specific aggregates.
 */

export type {
    Incident,
    TaskInstance,
    Approval,
    TimelineEvent,
    Decision,
    AuditLog,
    User,
    Integration,
    Severity,
    IncidentStatus,
    TaskStatus,
    ApprovalStatus,
    TimelineEventType,
    Role,
    Permission,
} from "@/lib/types";

/**
 * The full aggregate for one incident cockpit view.
 * Single source of truth — panels read slices of this.
 */
export interface IncidentAggregate {
    incident: import("@/lib/types").Incident;
    tasks: import("@/lib/types").TaskInstance[];
    approvals: import("@/lib/types").Approval[];
    timeline: import("@/lib/types").TimelineEvent[];
    decisions: import("@/lib/types").Decision[];
    integrations: import("@/lib/types").Integration[];
    /** userId → User lookup map so UI never imports mock/users */
    userMap: Record<string, import("@/lib/types").User>;
}
