/**
 * Stub HTTP implementation of IncidentRepository.
 * Proves the DI seam is real: swap mockIncidentRepository for this in container.ts
 * and only container.ts needs to change.
 *
 * NOT wired by default. To activate:
 *   1. Implement each method with real HTTP calls
 *   2. In lib/container.ts, import this instead of mockIncidentRepository
 *
 * Every method throws "not implemented" so the build proves it satisfies the interface.
 */

import type { IncidentAggregate } from "@/lib/domain/models";
import type { TaskInstance, Approval, TimelineEvent, Decision, AuditLog } from "@/lib/types";
import type {
    IncidentRepository,
    TaskPatch,
    NewTimelineEvent,
    NewAuditEvent,
    NewIncidentInput,
} from "./types";

export const httpIncidentRepository: IncidentRepository = {
    async getIncidentAggregate(_incidentId: string): Promise<IncidentAggregate | null> {
        // TODO: GET /api/incidents/:id/aggregate
        throw new Error("httpIncidentRepository.getIncidentAggregate not implemented");
    },

    async updateTask(_incidentId: string, _taskId: string, _patch: TaskPatch): Promise<TaskInstance | null> {
        // TODO: PATCH /api/incidents/:incidentId/tasks/:taskId
        throw new Error("httpIncidentRepository.updateTask not implemented");
    },

    async decideApproval(
        _incidentId: string,
        _approvalId: string,
        _decision: "APPROVED" | "DENIED" | "PENDING",
        _actorId: string,
        _reason?: string,
    ): Promise<Approval | null> {
        // TODO: POST /api/incidents/:incidentId/approvals/:approvalId/decide
        throw new Error("httpIncidentRepository.decideApproval not implemented");
    },

    async respondToDecision(
        _incidentId: string,
        _decisionId: string,
        _response: string,
        _actorId: string,
    ): Promise<Decision | null> {
        // TODO: POST /api/incidents/:incidentId/decisions/:decisionId/respond
        throw new Error("httpIncidentRepository.respondToDecision not implemented");
    },

    async appendTimelineEvent(_incidentId: string, _event: NewTimelineEvent): Promise<TimelineEvent> {
        // TODO: POST /api/incidents/:incidentId/timeline
        throw new Error("httpIncidentRepository.appendTimelineEvent not implemented");
    },

    async appendAuditEvent(_event: NewAuditEvent): Promise<AuditLog> {
        // TODO: POST /api/audit-logs
        throw new Error("httpIncidentRepository.appendAuditEvent not implemented");
    },

    async createIncident(_input: NewIncidentInput): Promise<IncidentAggregate> {
        // TODO: POST /api/incidents
        throw new Error("httpIncidentRepository.createIncident not implemented");
    },
};
