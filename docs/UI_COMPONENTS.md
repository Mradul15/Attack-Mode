# UI Components

## Global Components
- TopBar (OrgSwitcher, Search, CreateButton, Notifications, UserMenu)
- SideNav
- GlobalBanner (integration degraded, security alerts)
- Toasts (success/error)
- ConfirmModal
- PermissionGate

## Core Components
- SeverityBadge
- StatusPill
- UserChip
- TaskCard
- TaskBoard (columns + drag/drop optional)
- DecisionPromptCard
- ApprovalRequestCard
- TimelineEventCard
- EvidenceReferenceList
- IntegrationStatusIndicator
- OverdueTimer
- ExportMenu

## Security Components
- SecretRevealOnceModal
- KeyFingerprintDisplay
- BreakGlassActivationModal
- SessionList + RevokeSessionButton
- DomainAllowlistEditor
- AuditLogRow + AuditLogDetailPanel

## Page Component Breakdown (MVP)
### Dashboard
- ActiveIncidentsCard
- MyTasksDueSoonList
- RecentActivityTimeline
- SystemHealthCard
- QuickActionsPanel

### Incidents List
- FiltersBar
- IncidentsTable

### Create Incident Wizard
- Stepper
- TemplatePicker
- ParticipantsPicker
- IntegrationToggles
- ReviewSummary

### Attack Mode
- IncidentHeader
- NextStepsPanel
- TaskBoard
- DecisionsPanel
- ApprovalsQueue
- TimelinePanel
- ContextPanel

### Runbook Editor
- TaskEditorList
- DecisionTreeEditor
- ApprovalPolicyPanel
- VersionSelector
- ValidationWarningsPanel

### Integrations
- IntegrationCard
- ScopesViewer
- TestIntegrationButton

### People & Access
- UsersTable
- RoleEditor
- PermissionMatrixViewer
- SessionsPanel

### Audit Logs
- AuditFiltersBar
- AuditLogTable
- ExportAuditButton