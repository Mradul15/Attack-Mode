/**
 * Repository interfaces — defines the contract for data access.
 * No implementation details, no React.
 */

import type {
    IncidentAggregate,
    TaskInstance,
    Approval,
    TimelineEvent,
    Decision,
    TaskStatus,
    ApprovalStatus,
    TimelineEventType,
    Severity,
} from "@/lib/domain/models";
import type { AuditLog } from "@/lib/types";

export interface TaskPatch {
    status?: TaskStatus;
    assignee_id?: string;
}

export interface NewTimelineEvent {
    type: TimelineEventType;
    actor_id: string;
    actor_name: string;
    message: string;
}

export interface NewAuditEvent {
    action: string;
    actor_id: string;
    actor_email: string;
    target: string;
    metadata: Record<string, string>;
}

export interface NewIncidentInput {
    title: string;
    description?: string;
    severity: Severity;
    ic_user_id: string;
    responder_ids: string[];
    impacted_services: string[];
    tags: string[];
    runbook_id?: string;
    integration_ids: string[];
    /** Actor who created the incident */
    actor_id: string;
    actor_name: string;
    actor_email: string;
}

export interface IncidentRepository {
    getIncidentAggregate(incidentId: string): Promise<IncidentAggregate | null>;

    /** Create a new incident with optional runbook-based task seeding */
    createIncident(input: NewIncidentInput): Promise<IncidentAggregate>;

    updateTask(incidentId: string, taskId: string, patch: TaskPatch): Promise<TaskInstance | null>;

    decideApproval(
        incidentId: string,
        approvalId: string,
        decision: ApprovalStatus,
        actorId: string,
        reason?: string
    ): Promise<Approval | null>;

    /** Append-only: no update/delete for timeline events */
    appendTimelineEvent(incidentId: string, event: NewTimelineEvent): Promise<TimelineEvent>;

    /** Append-only: no update/delete for audit events */
    appendAuditEvent(event: NewAuditEvent): Promise<AuditLog>;

    respondToDecision(
        incidentId: string,
        decisionId: string,
        response: string,
        actorId: string
    ): Promise<Decision | null>;
}

