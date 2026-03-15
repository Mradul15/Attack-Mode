/**
 * Mock implementation of IncidentRepository.
 * Reads mock data via the centralized gateway (mockData.ts).
 * Mutates mock arrays in-place so changes persist during the session.
 */

import type { IncidentAggregate } from "@/lib/domain/models";
import type { AuditLog, TaskInstance, Approval, TimelineEvent, Decision, Incident } from "@/lib/types";
import type {
    IncidentRepository,
    TaskPatch,
    NewTimelineEvent,
    NewAuditEvent,
    NewIncidentInput,
} from "./types";
import {
    normalizeIncidentId,
    normalizeTaskId,
    normalizeApprovalId,
    normalizeDecisionId,
} from "./id";

// ── Mock data via centralized gateway ────────────────────
import {
    mockIncidents, mockTasks, mockApprovals, mockTimeline,
    mockDecisions, mockUsers, mockAuditLogs, mockIntegrations,
    mockRunbooks,
} from "./mockData";

function findIncident(normalizedId: string) {
    return mockIncidents.find(
        (i) => normalizeIncidentId(i.incident_id) === normalizedId
    );
}

function buildUserMap(): Record<string, (typeof mockUsers)[number]> {
    const map: Record<string, (typeof mockUsers)[number]> = {};
    for (const u of mockUsers) {
        map[u.user_id] = u;
    }
    return map;
}

export const mockIncidentRepository: IncidentRepository = {
    async getIncidentAggregate(incidentId: string): Promise<IncidentAggregate | null> {
        const nId = normalizeIncidentId(incidentId);
        const incident = findIncident(nId);
        if (!incident) return null;

        const tasks = mockTasks.filter(
            (t) => normalizeIncidentId(t.incident_id) === nId
        );
        const approvals = mockApprovals.filter(
            (a) => normalizeIncidentId(a.incident_id) === nId
        );
        const timeline = mockTimeline
            .filter((e) => normalizeIncidentId(e.incident_id) === nId)
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        const decisions = mockDecisions.filter(
            (d) => normalizeIncidentId(d.incident_id) === nId
        );

        return {
            incident,
            tasks,
            approvals,
            timeline,
            decisions,
            integrations: [...mockIntegrations],
            userMap: buildUserMap(),
        };
    },

    async updateTask(
        incidentId: string,
        taskId: string,
        patch: TaskPatch
    ): Promise<TaskInstance | null> {
        const nIncId = normalizeIncidentId(incidentId);
        const nTaskId = normalizeTaskId(taskId);
        const idx = mockTasks.findIndex(
            (t) =>
                normalizeIncidentId(t.incident_id) === nIncId &&
                normalizeTaskId(t.task_id) === nTaskId
        );
        if (idx === -1) return null;

        const now = new Date().toISOString();
        if (patch.status !== undefined) mockTasks[idx].status = patch.status;
        if (patch.assignee_id !== undefined) mockTasks[idx].assignee_id = patch.assignee_id;
        mockTasks[idx].updated_at = now;

        return { ...mockTasks[idx] };
    },

    async decideApproval(
        incidentId: string,
        approvalId: string,
        decision: "APPROVED" | "DENIED" | "PENDING",
        actorId: string,
        _reason?: string
    ): Promise<Approval | null> {
        const nIncId = normalizeIncidentId(incidentId);
        const nAprId = normalizeApprovalId(approvalId);
        const idx = mockApprovals.findIndex(
            (a) =>
                normalizeIncidentId(a.incident_id) === nIncId &&
                normalizeApprovalId(a.approval_id) === nAprId
        );
        if (idx === -1) return null;

        const now = new Date().toISOString();
        mockApprovals[idx].status = decision;
        mockApprovals[idx].resolved_at = now;
        mockApprovals[idx].approved_by = actorId;

        return { ...mockApprovals[idx] };
    },

    async appendTimelineEvent(
        incidentId: string,
        event: NewTimelineEvent
    ): Promise<TimelineEvent> {
        const nId = normalizeIncidentId(incidentId);
        const newEvent: TimelineEvent = {
            event_id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            incident_id: nId,
            type: event.type,
            actor_id: event.actor_id,
            actor_name: event.actor_name,
            message: event.message,
            created_at: new Date().toISOString(),
        };
        mockTimeline.unshift(newEvent);
        return { ...newEvent };
    },

    async appendAuditEvent(event: NewAuditEvent): Promise<AuditLog> {
        const newLog: AuditLog = {
            log_id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            action: event.action,
            actor_id: event.actor_id,
            actor_email: event.actor_email,
            target: event.target,
            ip_address: "127.0.0.1",
            request_id: `req_${Date.now().toString(36)}`,
            metadata: event.metadata,
            created_at: new Date().toISOString(),
        };
        mockAuditLogs.unshift(newLog);
        return { ...newLog };
    },

    async respondToDecision(
        incidentId: string,
        decisionId: string,
        response: string,
        actorId: string
    ): Promise<Decision | null> {
        const nIncId = normalizeIncidentId(incidentId);
        const nDecId = normalizeDecisionId(decisionId);
        const idx = mockDecisions.findIndex(
            (d) =>
                normalizeIncidentId(d.incident_id) === nIncId &&
                normalizeDecisionId(d.decision_id) === nDecId
        );
        if (idx === -1) return null;

        const now = new Date().toISOString();
        mockDecisions[idx].response = response;
        mockDecisions[idx].responded_by = actorId;
        mockDecisions[idx].responded_at = now;

        return { ...mockDecisions[idx] };
    },

    async createIncident(input: NewIncidentInput): Promise<IncidentAggregate> {
        const now = new Date().toISOString();
        const incidentId = `inc_${Date.now().toString(36)}`;

        // Create the incident record
        const incident: Incident = {
            incident_id: incidentId,
            title: input.title,
            description: input.description,
            severity: input.severity,
            status: "ACTIVE",
            ic_user_id: input.ic_user_id,
            responder_ids: [...input.responder_ids],
            impacted_services: [...input.impacted_services],
            tags: [...input.tags],
            created_at: now,
            updated_at: now,
        };
        mockIncidents.push(incident);

        // Instantiate tasks from selected runbook
        const tasks: TaskInstance[] = [];
        if (input.runbook_id) {
            const runbook = mockRunbooks.find((r) => r.runbook_id === input.runbook_id);
            if (runbook) {
                const assignees = [input.ic_user_id, ...input.responder_ids];
                for (const rt of runbook.tasks) {
                    const task: TaskInstance = {
                        task_id: `tsk_${Date.now().toString(36)}_${rt.order}`,
                        incident_id: incidentId,
                        title: rt.title,
                        description: rt.description,
                        status: "TODO",
                        assignee_id: assignees[rt.order % assignees.length] ?? input.ic_user_id,
                        due_in_minutes: rt.due_in_minutes,
                        created_at: now,
                        updated_at: now,
                    };
                    tasks.push(task);
                    mockTasks.push(task);
                }
            }
        }

        // Seed "Incident created" timeline event
        const createdEvent: TimelineEvent = {
            event_id: `evt_${Date.now().toString(36)}_create`,
            incident_id: incidentId,
            type: "status_change",
            actor_id: input.actor_id,
            actor_name: input.actor_name,
            message: `Incident created: ${input.title}`,
            created_at: now,
        };
        mockTimeline.push(createdEvent);

        return {
            incident,
            tasks,
            approvals: [],
            timeline: [createdEvent],
            decisions: [],
            integrations: mockIntegrations.filter(
                (i) => input.integration_ids.includes(i.integration_id)
            ),
            userMap: buildUserMap(),
        };
    },
};
