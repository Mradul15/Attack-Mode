// ── Enums ────────────────────────────────────────────────

export type Severity = "S0" | "S1" | "S2" | "S3" | "S4";

export type IncidentStatus =
    | "ACTIVE"
    | "INVESTIGATING"
    | "MONITORING"
    | "RESOLVED"
    | "CLOSED";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "SKIPPED";

export type ApprovalStatus = "PENDING" | "APPROVED" | "DENIED";

export type RunbookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type RunbookCategory =
    | "CRED_COMPROMISE"
    | "TOKEN_COMPROMISE"
    | "DATA_EXFIL"
    | "ENDPOINT_COMPROMISE"
    | "OTHER";

export type TimelineEventType =
    | "status_change"
    | "message"
    | "action"
    | "escalation"
    | "resolution";

export type IntegrationHealth = "connected" | "degraded" | "disconnected";

export type Role = "Admin" | "IC" | "Responder" | "Observer" | "Legal/Comms";

// ── Permission strings ───────────────────────────────────

export type Permission =
    | "incident.view"
    | "incident.create"
    | "incident.edit"
    | "incident.assign"
    | "incident.close"
    | "incident.export"
    | "task.update"
    | "task.update_assigned"
    | "timeline.add"
    | "timeline.view"
    | "approval.request"
    | "approval.approve"
    | "approval.approve_comms"
    | "runbook.view"
    | "runbook.create"
    | "runbook.edit"
    | "runbook.activate"
    | "runbook.diff"
    | "integration.view"
    | "integration.configure"
    | "people.view"
    | "people.manage_roles"
    | "people.break_glass"
    | "audit.view"
    | "audit.export";

// ── Core Entities ────────────────────────────────────────

export interface User {
    user_id: string;
    name: string;
    email: string;
    role: Role;
    avatar_url?: string;
    org_id: string;
}

export interface Incident {
    incident_id: string;
    title: string;
    description?: string;
    severity: Severity;
    status: IncidentStatus;
    ic_user_id: string;
    responder_ids: string[];
    impacted_services: string[];
    tags: string[];
    created_at: string;
    updated_at: string;
    resolved_at?: string;
    duration?: string;
}

export interface TaskInstance {
    task_id: string;
    incident_id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assignee_id: string;
    due_in_minutes?: number;
    created_at: string;
    updated_at: string;
}

export interface Decision {
    decision_id: string;
    incident_id: string;
    prompt: string;
    options: string[];
    requester_id: string;
    response?: string;
    responded_by?: string;
    created_at: string;
    responded_at?: string;
}

export interface Approval {
    approval_id: string;
    incident_id: string;
    title: string;
    requester_id: string;
    status: ApprovalStatus;
    approved_by?: string;
    created_at: string;
    resolved_at?: string;
}

export interface TimelineEvent {
    event_id: string;
    incident_id: string;
    type: TimelineEventType;
    actor_id: string;
    actor_name: string;
    message: string;
    created_at: string;
}

export interface AuditLog {
    log_id: string;
    action: string;
    actor_id: string;
    actor_email: string;
    target: string;
    ip_address: string;
    request_id: string;
    metadata: Record<string, string>;
    created_at: string;
}

export interface RunbookTemplate {
    runbook_id: string;
    name: string;
    description?: string;
    category: RunbookCategory;
    status: RunbookStatus;
    version: string;
    tasks: RunbookTask[];
    author_id: string;
    created_at: string;
    updated_at: string;
}

export interface RunbookTask {
    task_id: string;
    title: string;
    description?: string;
    owner_role: Role;
    due_in_minutes?: number;
    order: number;
}

export interface Integration {
    integration_id: string;
    name: string;
    description: string;
    health: IntegrationHealth;
    last_sync?: string;
    icon: string;
    scopes: string[];
}

// ── API Response Wrappers ────────────────────────────────

export interface ApiResponse<T> {
    data: T;
    request_id: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    request_id: string;
}

export interface ApiError {
    code: "validation_error" | "unauthenticated" | "forbidden" | "not_found" | "conflict" | "rate_limited" | "server_error";
    message: string;
    request_id: string;
    retry_after?: number;
}
