# API Contract (Stub v1)

## Conventions
- Base URL: /api/v1
- Auth: session cookie via SSO OR bearer token for API usage (TBD)
- Errors:
  - 400 validation_error
  - 401 unauthenticated
  - 403 forbidden
  - 404 not_found
  - 409 conflict
  - 429 rate_limited (includes Retry-After)
  - 500 server_error
- All responses include: request_id

## Entities
- Incident, RunbookTemplate, TaskInstance, Decision, Approval, TimelineEvent, AuditLog

## Endpoints (MVP)

### Auth / Session
GET /me
- returns current user, org, roles, permissions

### Incidents
GET /incidents?status=&severity=&q=&from=&to=
POST /incidents
GET /incidents/{incident_id}
PATCH /incidents/{incident_id}
POST /incidents/{incident_id}/close

### Tasks
PATCH /incidents/{incident_id}/tasks/{task_id}
POST /incidents/{incident_id}/tasks/{task_id}/evidence (link refs only in MVP)

### Decisions
POST /incidents/{incident_id}/decisions/{decision_id}/response

### Approvals
POST /incidents/{incident_id}/approvals
POST /incidents/{incident_id}/approvals/{approval_id}/approve
POST /incidents/{incident_id}/approvals/{approval_id}/deny

### Timeline
GET /incidents/{incident_id}/timeline
POST /incidents/{incident_id}/timeline

### Reports
GET /incidents/{incident_id}/report
POST /incidents/{incident_id}/export (pdf|md|json)

### Runbooks
GET /runbooks
POST /runbooks
GET /runbooks/{runbook_id}
PATCH /runbooks/{runbook_id}
POST /runbooks/{runbook_id}/activate
GET /runbooks/{runbook_id}/diff?from=&to=

### Integrations
GET /integrations
POST /integrations/slack/connect
POST /integrations/jira/connect
POST /integrations/{integration}/rotate

### Audit Logs (Admin only)
GET /audit-logs?actor=&action=&from=&to=
GET /audit-logs/{log_id}
POST /audit-logs/export

## Payload Examples (minimal)
Example Incident:
{
  "incident_id": "inc_123",
  "title": "Suspicious OAuth tokens detected",
  "severity": "S1",
  "status": "ACTIVE",
  "ic_user_id": "usr_1",
  "impacted_services": ["Auth", "API"],
  "created_at": "2026-02-19T22:10:00Z"
}