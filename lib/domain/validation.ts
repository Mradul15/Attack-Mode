/**
 * Invariant assertions — throw typed errors when violated.
 * No React, no API.
 */

import type { TaskStatus, IncidentStatus } from "@/lib/types";
import type { TaskInstance, Approval, Incident } from "./models";
import { canTransitionTask, canDecideApproval, canChangeIncidentStatus } from "./transitions";

export class DomainError extends Error {
    constructor(
        public readonly code: "invalid_transition" | "validation_error",
        message: string
    ) {
        super(message);
        this.name = "DomainError";
    }
}

export function assertTaskCanTransition(task: TaskInstance, newStatus: TaskStatus): void {
    if (!canTransitionTask(task.status, newStatus)) {
        throw new DomainError(
            "invalid_transition",
            `Task "${task.title}" cannot transition from ${task.status} to ${newStatus}`
        );
    }
}

export function assertApprovalIsPending(approval: Approval): void {
    if (!canDecideApproval(approval)) {
        throw new DomainError(
            "invalid_transition",
            `Approval "${approval.title}" is ${approval.status}, not PENDING`
        );
    }
}

export function assertIncidentCanTransition(incident: Incident, nextStatus: IncidentStatus): void {
    if (!canChangeIncidentStatus(incident, nextStatus)) {
        throw new DomainError(
            "invalid_transition",
            `Incident cannot transition from ${incident.status} to ${nextStatus}`
        );
    }
}
