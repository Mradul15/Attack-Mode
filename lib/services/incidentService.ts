/**
 * Incident service — use-case layer.
 * Enforces RBAC, validates transitions, appends timeline + audit on every mutation.
 * No React imports. Dependencies injected via constructor.
 */

import type { IncidentAggregate, TaskInstance, Approval, TimelineEvent, Decision } from "@/lib/domain/models";
import type { TaskStatus, TimelineEventType, Role, Permission, Severity } from "@/lib/types";
import type { IncidentRepository } from "@/lib/repositories/types";
import type { ServiceResult } from "./types";
import { assertTaskCanTransition, assertApprovalIsPending, DomainError } from "@/lib/domain/validation";

// ── Types ────────────────────────────────────────────────

export type PermissionChecker = (role: Role, permission: Permission) => boolean;

export interface ActorContext {
    actorId: string;
    actorName: string;
    actorEmail: string;
    actorRole: Role;
}

interface TaskActionParams extends ActorContext {
    incidentId: string;
    taskId: string;
}

interface ApprovalActionParams extends ActorContext {
    incidentId: string;
    approvalId: string;
    decision: "APPROVED" | "DENIED";
    reason?: string;
}

interface TimelineNoteParams extends ActorContext {
    incidentId: string;
    message: string;
    type?: TimelineEventType;
}

interface DecisionActionParams extends ActorContext {
    incidentId: string;
    decisionId: string;
    response: string;
}

export interface CreateIncidentParams extends ActorContext {
    title: string;
    description?: string;
    severity: Severity;
    ic_user_id: string;
    responder_ids: string[];
    impacted_services: string[];
    tags: string[];
    runbook_id?: string;
    integration_ids: string[];
}

// ── Service class ────────────────────────────────────────

export class IncidentService {
    constructor(
        private readonly repo: IncidentRepository,
        private readonly checkPermission: PermissionChecker,
    ) { }

    // ── Helpers ──────────────────────────────────────────

    private forbidden(message: string): ServiceResult<never> {
        return { ok: false, error: { code: "FORBIDDEN", message } };
    }

    private notFound(entity: string): ServiceResult<never> {
        return { ok: false, error: { code: "NOT_FOUND", message: `${entity} not found` } };
    }

    private invalidTransition(message: string): ServiceResult<never> {
        return { ok: false, error: { code: "INVALID_TRANSITION", message } };
    }

    // ── Load ─────────────────────────────────────────────

    async loadIncident(incidentId: string): Promise<ServiceResult<IncidentAggregate>> {
        try {
            const agg = await this.repo.getIncidentAggregate(incidentId);
            if (!agg) return this.notFound("Incident");
            return { ok: true, data: agg };
        } catch {
            return { ok: false, error: { code: "INTERNAL", message: "Failed to load incident" } };
        }
    }

    // ── Create ───────────────────────────────────────────

    async createIncident(params: CreateIncidentParams): Promise<ServiceResult<IncidentAggregate>> {
        // RBAC check
        if (!this.checkPermission(params.actorRole, "incident.create")) {
            return this.forbidden("You do not have permission to create incidents");
        }

        // Validation
        if (!params.title.trim()) {
            return { ok: false, error: { code: "INVALID_INPUT", message: "Title is required" } };
        }
        if (!params.severity) {
            return { ok: false, error: { code: "INVALID_INPUT", message: "Severity is required" } };
        }
        if (!params.ic_user_id) {
            return { ok: false, error: { code: "INVALID_INPUT", message: "Incident commander is required" } };
        }
        if (!params.responder_ids.length) {
            return { ok: false, error: { code: "INVALID_INPUT", message: "At least one responder is required" } };
        }

        try {
            const aggregate = await this.repo.createIncident({
                title: params.title.trim(),
                description: params.description?.trim(),
                severity: params.severity,
                ic_user_id: params.ic_user_id,
                responder_ids: params.responder_ids,
                impacted_services: params.impacted_services,
                tags: params.tags,
                runbook_id: params.runbook_id,
                integration_ids: params.integration_ids,
                actor_id: params.actorId,
                actor_name: params.actorName,
                actor_email: params.actorEmail,
            });

            // Audit event
            await this.repo.appendAuditEvent({
                action: "incident.create",
                actor_id: params.actorId,
                actor_email: params.actorEmail,
                target: aggregate.incident.incident_id,
                metadata: { title: params.title, severity: params.severity },
            });

            return { ok: true, data: aggregate };
        } catch {
            return { ok: false, error: { code: "INTERNAL", message: "Failed to create incident" } };
        }
    }

    // ── Task Actions ─────────────────────────────────────

    async startTask(params: TaskActionParams): Promise<ServiceResult<TaskInstance>> {
        return this.updateTaskStatus({ ...params, newStatus: "IN_PROGRESS" });
    }

    async completeTask(params: TaskActionParams): Promise<ServiceResult<TaskInstance>> {
        return this.updateTaskStatus({ ...params, newStatus: "DONE" });
    }

    async updateTaskStatus(
        params: TaskActionParams & { newStatus: TaskStatus }
    ): Promise<ServiceResult<TaskInstance>> {
        const { incidentId, taskId, actorId, actorName, actorEmail, actorRole, newStatus } = params;

        // RBAC: permission-based only, no role name checks
        const canUpdateAll = this.checkPermission(actorRole, "task.update");
        const canUpdateAssigned = this.checkPermission(actorRole, "task.update_assigned");

        if (!canUpdateAll && !canUpdateAssigned) {
            return this.forbidden("You do not have permission to update tasks");
        }

        const agg = await this.repo.getIncidentAggregate(incidentId);
        if (!agg) return this.notFound("Incident");

        const task = agg.tasks.find((t) => t.task_id === taskId);
        if (!task) return this.notFound("Task");

        // Permission-scoped: can only change tasks assigned to them
        if (!canUpdateAll && canUpdateAssigned && task.assignee_id !== actorId) {
            return this.forbidden("You can only update tasks assigned to you");
        }

        // Validate transition
        try {
            assertTaskCanTransition(task, newStatus);
        } catch (e) {
            if (e instanceof DomainError) return this.invalidTransition(e.message);
            throw e;
        }

        // Persist
        const updated = await this.repo.updateTask(incidentId, taskId, { status: newStatus });
        if (!updated) return this.notFound("Task");

        // Append timeline
        await this.repo.appendTimelineEvent(incidentId, {
            type: "action",
            actor_id: actorId,
            actor_name: actorName,
            message: `Task "${task.title}" changed to ${newStatus}`,
        });

        // Append audit
        await this.repo.appendAuditEvent({
            action: "task.status_change",
            actor_id: actorId,
            actor_email: actorEmail,
            target: `task:${taskId}`,
            metadata: { incident_id: incidentId, from: task.status, to: newStatus },
        });

        return { ok: true, data: updated };
    }

    // ── Approval Actions ─────────────────────────────────

    async decideApproval(params: ApprovalActionParams): Promise<ServiceResult<Approval>> {
        const { incidentId, approvalId, actorId, actorName, actorEmail, actorRole, decision, reason } = params;

        if (!this.checkPermission(actorRole, "approval.approve")) {
            return this.forbidden("You do not have permission to decide approvals");
        }

        const agg = await this.repo.getIncidentAggregate(incidentId);
        if (!agg) return this.notFound("Incident");

        const approval = agg.approvals.find((a) => a.approval_id === approvalId);
        if (!approval) return this.notFound("Approval");

        try {
            assertApprovalIsPending(approval);
        } catch (e) {
            if (e instanceof DomainError) return this.invalidTransition(e.message);
            throw e;
        }

        const updated = await this.repo.decideApproval(incidentId, approvalId, decision, actorId, reason);
        if (!updated) return this.notFound("Approval");

        await this.repo.appendTimelineEvent(incidentId, {
            type: "action",
            actor_id: actorId,
            actor_name: actorName,
            message: `Approval "${approval.title}" ${decision.toLowerCase()}${reason ? ` — ${reason}` : ""}`,
        });

        await this.repo.appendAuditEvent({
            action: `approval.${decision.toLowerCase()}`,
            actor_id: actorId,
            actor_email: actorEmail,
            target: `approval:${approvalId}`,
            metadata: { incident_id: incidentId, decision, ...(reason ? { reason } : {}) },
        });

        return { ok: true, data: updated };
    }

    // ── Timeline Actions ─────────────────────────────────

    async addTimelineNote(params: TimelineNoteParams): Promise<ServiceResult<TimelineEvent>> {
        const { incidentId, actorId, actorName, actorEmail, actorRole, message, type } = params;

        if (!this.checkPermission(actorRole, "timeline.add")) {
            return this.forbidden("You do not have permission to add timeline entries");
        }

        const event = await this.repo.appendTimelineEvent(incidentId, {
            type: type ?? "message",
            actor_id: actorId,
            actor_name: actorName,
            message,
        });

        await this.repo.appendAuditEvent({
            action: "timeline.add",
            actor_id: actorId,
            actor_email: actorEmail,
            target: `timeline:${event.event_id}`,
            metadata: { incident_id: incidentId, type: event.type },
        });

        return { ok: true, data: event };
    }

    // ── Decision Actions ─────────────────────────────────

    async respondToDecision(params: DecisionActionParams): Promise<ServiceResult<Decision>> {
        const { incidentId, decisionId, actorId, actorName, actorEmail, actorRole, response } = params;

        if (!this.checkPermission(actorRole, "incident.edit")) {
            return this.forbidden("You do not have permission to respond to decisions");
        }

        const agg = await this.repo.getIncidentAggregate(incidentId);
        if (!agg) return this.notFound("Incident");

        const decision = agg.decisions.find((d) => d.decision_id === decisionId);
        if (!decision) return this.notFound("Decision");

        if (decision.response) {
            return this.invalidTransition("Decision has already been responded to");
        }

        const updated = await this.repo.respondToDecision(incidentId, decisionId, response, actorId);
        if (!updated) return this.notFound("Decision");

        await this.repo.appendTimelineEvent(incidentId, {
            type: "action",
            actor_id: actorId,
            actor_name: actorName,
            message: `Decision "${decision.prompt}" → "${response}"`,
        });

        await this.repo.appendAuditEvent({
            action: "decision.respond",
            actor_id: actorId,
            actor_email: actorEmail,
            target: `decision:${decisionId}`,
            metadata: { incident_id: incidentId, response },
        });

        return { ok: true, data: updated };
    }
}
