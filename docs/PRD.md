# Attack Mode — Product Requirements Document (PRD)

## 1) Executive Summary
Attack Mode is an incident-response execution layer for mid-market SaaS (Series B–D). It turns a company’s playbooks into executable runbooks and provides an “Attack Mode” cockpit to coordinate tasks, approvals, timeline, and reporting during incidents.

## 2) Problem Statement
- Playbooks exist but are hard to execute under pressure.
- Ownership, approvals, comms, evidence tracking, and documentation often break down.
- Post-incident reporting is slow and incomplete.

## 3) Goals
### MVP Goals
1. Convert playbooks into executable runbooks (tasks, ownership, branching, approvals).
2. Provide Attack Mode cockpit: next steps, tasks, decisions, approvals, timeline.
3. Integrate with Slack + Jira.
4. Generate post-incident report.
5. Meet security baseline: tenant isolation, RBAC, audit logs, rate limiting, strict input validation, secure secret handling.

## 4) Non-Goals (MVP)
- Not SIEM/EDR/SOAR replacement.
- No automated remediation pipelines.
- Not full GRC/compliance certification engine.
- Not a forensic data vault for large artifacts.

## 5) Target Market & Personas
### Market
Mid-market SaaS (Series B–D), 200–2,000 employees, Slack + Jira, cloud-native, SSO.
### Personas
- Head of Security (buyer/owner)
- Incident Commander (IC)
- Responder (Sec Eng/Analyst)
- SRE/Platform
- Legal/Comms/Exec (observer/approver)

## 6) Core Use Cases
UC1: Create runbook from playbook text/template  
UC2: Create incident from runbook template  
UC3: Execute tasks + decisions + approvals; maintain timeline  
UC4: Close incident + generate report + improve runbook  

## 7) Key Features (MVP)
### Runbook Builder
- Create template with tasks, owners, deadlines, dependencies, decision points, approval gates.
- Versioning: Active versions immutable; edits create new versions.

### Attack Mode
- Next steps panel, task board, decision log, approval queue, live timeline
- Status update generator (internal/exec/customer draft)
- Evidence tracking via references + optional small files (policy-controlled)

### Integrations
- Slack: incident channel, updates, reminders
- Jira: epic + tasks synced
- SSO: OIDC

## 8) Security & Safety Requirements
### CIA + AAA + PIAAA
- Confidentiality: tenant isolation, TLS, encryption at rest, least privilege
- Integrity: append-only audit logs, tamper-evident timeline, version controls
- Availability: rate limiting, resiliency, backups/restore drills
- AAA: SSO auth, RBAC authz, audit accounting
- PIAAA defined in product docs: Privacy/Integrity/Availability/AAA

### Rate Limiting
- All public endpoints rate limited per IP, tenant, user, token
- Burst + sustained limits; 429 with Retry-After; tenant-level throttling

### Input Validation & Sanitization
- Server-side schema validation for every request
- Allowlist enums/roles
- XSS/Injection/SSRF protections
- File upload allowlist + size limits + malware scanning (if enabled)

### Secure API Key Handling
- Secrets encrypted via KMS
- Keys revealed once; show fingerprints after
- Rotation/revocation; least-privilege scopes
- No secrets in logs/client/URLs

### Authorization
- Object-level authorization on every request
- Separation of duties option for approvals
- Break-glass policy (time-bounded + audited)

### Auditability
- Append-only audit logs for access + privileged actions
- Export audit + incident record

## 9) Metrics
- Time to first containment step completion
- Task completion vs skip rates
- Documentation completeness (timeline + decisions)
- Time to produce incident report

## 10) Roadmap
Phase 1 MVP: core runbooks + attack mode + Slack/Jira + SSO + security baseline  
Phase 2: PDF/DOCX ingestion, tabletop mode, PagerDuty, runbook diffs  
Phase 3: Confluence/Notion ingestion, ServiceNow, advanced branching

## 11) Open Decisions
- Links-only evidence vs enabling file uploads in v1
- OIDC only vs SAML in v1
- Default gated actions
- AI-assisted parsing in MVP vs v1