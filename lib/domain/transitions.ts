/**
 * Pure transition rules — no React, no API, no side effects.
 */

import type { TaskStatus, IncidentStatus } from "@/lib/types";
import type { TaskInstance, Approval, Incident } from "./models";

// ── Task transitions ─────────────────────────────────────

const TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
    TODO: ["IN_PROGRESS", "SKIPPED"],
    IN_PROGRESS: ["DONE", "TODO"],       // allow reverting to TODO
    DONE: [],                             // terminal
    SKIPPED: [],                          // terminal
};

export function allowedTaskTransitions(current: TaskStatus): TaskStatus[] {
    return TASK_TRANSITIONS[current] ?? [];
}

export function canTransitionTask(current: TaskStatus, next: TaskStatus): boolean {
    return allowedTaskTransitions(current).includes(next);
}

export function canStartTask(task: TaskInstance): boolean {
    return canTransitionTask(task.status, "IN_PROGRESS");
}

export function canCompleteTask(task: TaskInstance): boolean {
    return canTransitionTask(task.status, "DONE");
}

// ── Approval transitions ─────────────────────────────────

export function canDecideApproval(approval: Approval): boolean {
    return approval.status === "PENDING";
}

// ── Incident status transitions ──────────────────────────

const INCIDENT_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
    ACTIVE: ["INVESTIGATING", "MONITORING", "RESOLVED"],
    INVESTIGATING: ["ACTIVE", "MONITORING", "RESOLVED"],
    MONITORING: ["ACTIVE", "INVESTIGATING", "RESOLVED"],
    RESOLVED: ["CLOSED", "ACTIVE"],           // reopen or close
    CLOSED: [],                                // terminal
};

export function allowedIncidentTransitions(current: IncidentStatus): IncidentStatus[] {
    return INCIDENT_TRANSITIONS[current] ?? [];
}

export function canChangeIncidentStatus(incident: Incident, next: IncidentStatus): boolean {
    return allowedIncidentTransitions(incident.status).includes(next);
}
