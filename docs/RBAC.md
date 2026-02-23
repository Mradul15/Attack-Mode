# RBAC (Roles & Permissions)

## Roles
- Admin
- Incident Commander (IC)
- Responder
- Observer
- Legal/Comms (optional role)

## Global Rules
- Object-level authorization: all objects must match tenant/org.
- Least privilege by default.
- Separation of duties option: approver cannot approve own gated action.

## Permissions Matrix (MVP)

### Incidents
- View incidents:
  - Admin, IC, Responder, Observer, Legal/Comms
- Create incident:
  - Admin, IC
- Edit incident metadata (severity, impacted services):
  - Admin, IC
- Assign participants:
  - Admin, IC
- Update tasks:
  - Admin, IC, Responder (assigned tasks), (Observer/Legal: no)
- Add timeline events:
  - Admin, IC, Responder
  - Observer: view only
  - Legal/Comms: view only
- Request approval:
  - Admin, IC, Responder (if configured)
- Approve/deny gated actions:
  - Admin, IC (if separation of duties allows)
  - Legal/Comms: approve customer-facing comms drafts only (if enabled)
- Close incident:
  - Admin, IC
- Export incident record/report:
  - Admin, IC
  - Responder: optional (configurable)
  - Observer/Legal: optional (configurable default: view-only, no export)

### Runbooks
- View runbooks:
  - Admin, IC, Responder, Observer, Legal/Comms
- Create runbook:
  - Admin, IC
- Edit draft runbook:
  - Admin, IC
- Activate runbook version:
  - Admin, IC
- Diff runbook versions:
  - Admin, IC, Responder, Observer

### Integrations
- View integration status:
  - Admin, IC (optional read for others)
- Configure integrations / rotate tokens:
  - Admin only

### People & Access
- View users:
  - Admin, IC
- Manage roles:
  - Admin only
- Break-glass activation:
  - Admin only (or Admin+IC via policy)

### Audit Logs
- View audit logs:
  - Admin only (or Admin + Compliance role if added)
- Export audit logs:
  - Admin only