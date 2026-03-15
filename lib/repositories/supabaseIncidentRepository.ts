/**
 * Supabase implementation of IncidentRepository.
 * Replaces mockIncidentRepository with real PostgreSQL queries via Supabase.
 */

import { createClient } from "@supabase/supabase-js";
import type { IncidentAggregate } from "@/lib/domain/models";
import type { AuditLog, TaskInstance, Approval, TimelineEvent, Decision, Incident, User } from "@/lib/types";
import type {
    IncidentRepository,
    TaskPatch,
    NewTimelineEvent,
    NewAuditEvent,
    NewIncidentInput,
} from "./types";

// Use service-level client for repository operations (server-side only)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function generateId(prefix: string): string {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function buildUserMap(users: User[]): Record<string, User> {
    const map: Record<string, User> = {};
    for (const u of users) {
        map[u.user_id] = u;
    }
    return map;
}

export const supabaseIncidentRepository: IncidentRepository = {
    async getIncidentAggregate(incidentId: string): Promise<IncidentAggregate | null> {
        // Fetch incident
        const { data: incident, error: incErr } = await supabase
            .from("incidents")
            .select("*")
            .eq("incident_id", incidentId)
            .single();

        if (incErr || !incident) return null;

        // Fetch related data in parallel
        const [tasksRes, approvalsRes, timelineRes, decisionsRes, usersRes, integrationsRes] =
            await Promise.all([
                supabase
                    .from("task_instances")
                    .select("*")
                    .eq("incident_id", incidentId)
                    .order("created_at", { ascending: true }),
                supabase
                    .from("approvals")
                    .select("*")
                    .eq("incident_id", incidentId)
                    .order("created_at", { ascending: true }),
                supabase
                    .from("timeline_events")
                    .select("*")
                    .eq("incident_id", incidentId)
                    .order("created_at", { ascending: false }),
                supabase
                    .from("decisions")
                    .select("*")
                    .eq("incident_id", incidentId)
                    .order("created_at", { ascending: true }),
                supabase.from("users").select("*"),
                supabase.from("integrations").select("*"),
            ]);

        return {
            incident: mapIncident(incident),
            tasks: (tasksRes.data ?? []).map(mapTask),
            approvals: (approvalsRes.data ?? []).map(mapApproval),
            timeline: (timelineRes.data ?? []).map(mapTimelineEvent),
            decisions: (decisionsRes.data ?? []).map(mapDecision),
            integrations: integrationsRes.data ?? [],
            userMap: buildUserMap((usersRes.data ?? []).map(mapUser)),
        };
    },

    async createIncident(input: NewIncidentInput): Promise<IncidentAggregate> {
        const now = new Date().toISOString();
        const incidentId = generateId("inc");

        // Insert incident
        const { error: incErr } = await supabase.from("incidents").insert({
            incident_id: incidentId,
            title: input.title,
            description: input.description ?? null,
            severity: input.severity,
            status: "ACTIVE",
            ic_user_id: input.ic_user_id,
            responder_ids: input.responder_ids,
            impacted_services: input.impacted_services,
            tags: input.tags,
            created_at: now,
            updated_at: now,
        });
        if (incErr) throw new Error(`Failed to create incident: ${incErr.message}`);

        // Seed tasks from runbook if provided
        const tasks: TaskInstance[] = [];
        if (input.runbook_id) {
            const { data: runbook } = await supabase
                .from("runbook_templates")
                .select("tasks")
                .eq("runbook_id", input.runbook_id)
                .single();

            if (runbook?.tasks) {
                const runbookTasks = runbook.tasks as Array<{
                    task_id: string;
                    title: string;
                    description?: string;
                    owner_role: string;
                    due_in_minutes?: number;
                    order: number;
                }>;
                const assignees = [input.ic_user_id, ...input.responder_ids];

                const taskRows = runbookTasks.map((rt) => {
                    const taskId = `tsk_${Date.now().toString(36)}_${rt.order}`;
                    return {
                        task_id: taskId,
                        incident_id: incidentId,
                        title: rt.title,
                        description: rt.description ?? null,
                        status: "TODO" as const,
                        assignee_id: assignees[rt.order % assignees.length] ?? input.ic_user_id,
                        due_in_minutes: rt.due_in_minutes ?? null,
                        created_at: now,
                        updated_at: now,
                    };
                });

                if (taskRows.length > 0) {
                    const { data: insertedTasks } = await supabase
                        .from("task_instances")
                        .insert(taskRows)
                        .select();
                    if (insertedTasks) {
                        tasks.push(...insertedTasks.map(mapTask));
                    }
                }
            }
        }

        // Create initial timeline event
        const eventId = generateId("evt");
        const { data: timelineRow } = await supabase
            .from("timeline_events")
            .insert({
                event_id: eventId,
                incident_id: incidentId,
                type: "status_change",
                actor_id: input.actor_id,
                actor_name: input.actor_name,
                message: `Incident created: ${input.title}`,
                created_at: now,
            })
            .select()
            .single();

        // Create audit event
        await supabase.from("audit_events").insert({
            log_id: generateId("log"),
            action: "incident.create",
            actor_id: input.actor_id,
            actor_email: input.actor_email,
            target: `incident:${incidentId}`,
            ip_address: "0.0.0.0",
            request_id: generateId("req"),
            metadata: { severity: input.severity, title: input.title },
            created_at: now,
        });

        // Fetch users and integrations for the aggregate
        const [usersRes, integrationsRes] = await Promise.all([
            supabase.from("users").select("*"),
            supabase
                .from("integrations")
                .select("*")
                .in("integration_id", input.integration_ids.length > 0 ? input.integration_ids : [""]),
        ]);

        const createdEvent = timelineRow ? mapTimelineEvent(timelineRow) : {
            event_id: eventId,
            incident_id: incidentId,
            type: "status_change" as const,
            actor_id: input.actor_id,
            actor_name: input.actor_name,
            message: `Incident created: ${input.title}`,
            created_at: now,
        };

        return {
            incident: {
                incident_id: incidentId,
                title: input.title,
                description: input.description,
                severity: input.severity,
                status: "ACTIVE",
                ic_user_id: input.ic_user_id,
                responder_ids: input.responder_ids,
                impacted_services: input.impacted_services,
                tags: input.tags,
                created_at: now,
                updated_at: now,
            },
            tasks,
            approvals: [],
            timeline: [createdEvent],
            decisions: [],
            integrations: integrationsRes.data ?? [],
            userMap: buildUserMap((usersRes.data ?? []).map(mapUser)),
        };
    },

    async updateTask(
        incidentId: string,
        taskId: string,
        patch: TaskPatch,
    ): Promise<TaskInstance | null> {
        const updates: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };
        if (patch.status !== undefined) updates.status = patch.status;
        if (patch.assignee_id !== undefined) updates.assignee_id = patch.assignee_id;

        const { data, error } = await supabase
            .from("task_instances")
            .update(updates)
            .eq("task_id", taskId)
            .eq("incident_id", incidentId)
            .select()
            .single();

        if (error || !data) return null;
        return mapTask(data);
    },

    async decideApproval(
        incidentId: string,
        approvalId: string,
        decision: "APPROVED" | "DENIED" | "PENDING",
        actorId: string,
        reason?: string,
    ): Promise<Approval | null> {
        const now = new Date().toISOString();
        const updates: Record<string, unknown> = {
            status: decision,
            approved_by: actorId,
            resolved_at: now,
        };
        if (reason) updates.reason = reason;

        const { data, error } = await supabase
            .from("approvals")
            .update(updates)
            .eq("approval_id", approvalId)
            .eq("incident_id", incidentId)
            .select()
            .single();

        if (error || !data) return null;
        return mapApproval(data);
    },

    async appendTimelineEvent(
        incidentId: string,
        event: NewTimelineEvent,
    ): Promise<TimelineEvent> {
        const newEvent = {
            event_id: generateId("evt"),
            incident_id: incidentId,
            type: event.type,
            actor_id: event.actor_id,
            actor_name: event.actor_name,
            message: event.message,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("timeline_events")
            .insert(newEvent)
            .select()
            .single();

        if (error) throw new Error(`Failed to append timeline event: ${error.message}`);
        return mapTimelineEvent(data);
    },

    async appendAuditEvent(event: NewAuditEvent): Promise<AuditLog> {
        const newLog = {
            log_id: generateId("log"),
            action: event.action,
            actor_id: event.actor_id,
            actor_email: event.actor_email,
            target: event.target,
            ip_address: "0.0.0.0",
            request_id: generateId("req"),
            metadata: event.metadata,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from("audit_events")
            .insert(newLog)
            .select()
            .single();

        if (error) throw new Error(`Failed to append audit event: ${error.message}`);
        return mapAuditLog(data);
    },

    async respondToDecision(
        incidentId: string,
        decisionId: string,
        response: string,
        actorId: string,
    ): Promise<Decision | null> {
        const now = new Date().toISOString();

        const { data, error } = await supabase
            .from("decisions")
            .update({
                response,
                responded_by: actorId,
                responded_at: now,
            })
            .eq("decision_id", decisionId)
            .eq("incident_id", incidentId)
            .select()
            .single();

        if (error || !data) return null;
        return mapDecision(data);
    },
};

// ── Row mappers (DB row → domain type) ──────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapIncident(row: any): Incident {
    return {
        incident_id: row.incident_id,
        title: row.title,
        description: row.description ?? undefined,
        severity: row.severity,
        status: row.status,
        ic_user_id: row.ic_user_id,
        responder_ids: row.responder_ids ?? [],
        impacted_services: row.impacted_services ?? [],
        tags: row.tags ?? [],
        created_at: row.created_at,
        updated_at: row.updated_at,
        resolved_at: row.resolved_at ?? undefined,
        duration: row.duration ?? undefined,
    };
}

function mapTask(row: any): TaskInstance {
    return {
        task_id: row.task_id,
        incident_id: row.incident_id,
        title: row.title,
        description: row.description ?? undefined,
        status: row.status,
        assignee_id: row.assignee_id,
        due_in_minutes: row.due_in_minutes ?? undefined,
        created_at: row.created_at,
        updated_at: row.updated_at,
    };
}

function mapApproval(row: any): Approval {
    return {
        approval_id: row.approval_id,
        incident_id: row.incident_id,
        title: row.title,
        requester_id: row.requester_id,
        status: row.status,
        approved_by: row.approved_by ?? undefined,
        created_at: row.created_at,
        resolved_at: row.resolved_at ?? undefined,
    };
}

function mapDecision(row: any): Decision {
    return {
        decision_id: row.decision_id,
        incident_id: row.incident_id,
        prompt: row.prompt,
        options: row.options ?? [],
        requester_id: row.requester_id,
        response: row.response ?? undefined,
        responded_by: row.responded_by ?? undefined,
        created_at: row.created_at,
        responded_at: row.responded_at ?? undefined,
    };
}

function mapTimelineEvent(row: any): TimelineEvent {
    return {
        event_id: row.event_id,
        incident_id: row.incident_id,
        type: row.type,
        actor_id: row.actor_id,
        actor_name: row.actor_name,
        message: row.message,
        created_at: row.created_at,
    };
}

function mapAuditLog(row: any): AuditLog {
    return {
        log_id: row.log_id,
        action: row.action,
        actor_id: row.actor_id,
        actor_email: row.actor_email,
        target: row.target,
        ip_address: row.ip_address,
        request_id: row.request_id,
        metadata: row.metadata ?? {},
        created_at: row.created_at,
    };
}

function mapUser(row: any): User {
    return {
        user_id: row.user_id,
        name: row.name,
        email: row.email,
        role: row.role,
        avatar_url: row.avatar_url ?? undefined,
        org_id: row.org_id,
    };
}

/* eslint-enable @typescript-eslint/no-explicit-any */
