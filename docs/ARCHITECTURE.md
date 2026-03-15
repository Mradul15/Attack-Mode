# Architecture Overview

## Dependency Flow

```
                        ┌─────────────────────────────────────────────┐
                        │                 UI LAYER                    │
                        │                                             │
                        │  app/(app)/incidents/[id]/page.tsx          │
                        │       │                                     │
                        │       ├── IncidentHeader                    │
                        │       ├── NextStepsPanel                    │
                        │       ├── TaskBoard                         │
                        │       ├── DecisionsPanel                    │
                        │       ├── ApprovalsQueue                    │
                        │       ├── TimelinePanel                     │
                        │       └── ContextPanel                      │
                        │                                             │
                        │  Props flow DOWN from page to panels.       │
                        │  Panels never import store or service.      │
                        └──────────────────┬──────────────────────────┘
                                           │
                                      useIncidentStore()
                                           │
                        ┌──────────────────▼──────────────────────────┐
                        │              STATE LAYER                    │
                        │                                             │
                        │  lib/state/incidentStore.ts                 │
                        │    State shape:                              │
                        │      data: IncidentAggregate | null         │
                        │      async: { loading, error, lastAction }  │
                        │      ui: { approvalReasonDraft, ... }       │
                        │                                             │
                        │  lib/state/selectors.ts                     │
                        │    selectTasksByStatus()                     │
                        │    selectPendingApprovals()                  │
                        │    selectNextSteps()                         │
                        │    selectTimelineSorted()                    │
                        │    selectUserMap()                           │
                        └──────────────────┬──────────────────────────┘
                                           │
                                    getIncidentService()
                                           │
                        ┌──────────────────▼──────────────────────────┐
                        │            DI CONTAINER                     │
                        │                                             │
                        │  lib/container.ts                           │
                        │    Wires: repo + permissionChecker          │
                        │           → IncidentService                 │
                        │                                             │
                        │  ┌─ To swap to real backend: ─────────┐    │
                        │  │  1. Implement IncidentRepository    │    │
                        │  │  2. Replace import here             │    │
                        │  │  3. Nothing else changes            │    │
                        │  └────────────────────────────────────-┘    │
                        └──────────────────┬──────────────────────────┘
                                           │
                                   new IncidentService(repo, checker)
                                           │
                        ┌──────────────────▼──────────────────────────┐
                        │            SERVICE LAYER                    │
                        │                                             │
                        │  lib/services/incidentService.ts            │
                        │    class IncidentService {                   │
                        │      constructor(repo, checkPermission)     │
                        │      loadIncident()                          │
                        │      startTask() / completeTask()           │
                        │      updateTaskStatus()                      │
                        │      decideApproval()                        │
                        │      addTimelineNote()                       │
                        │      respondToDecision()                     │
                        │    }                                         │
                        │                                             │
                        │  Every method returns:                       │
                        │    ServiceResult<T>                          │
                        │      | { ok: true, data: T }                │
                        │      | { ok: false, error: ServiceError }   │
                        │                                             │
                        │  lib/services/types.ts                      │
                        │    ErrorCode: FORBIDDEN | NOT_FOUND         │
                        │             | INVALID_TRANSITION             │
                        │             | INVALID_INPUT | CONFLICT       │
                        │             | INTERNAL                       │
                        └───────┬─────────────────┬───────────────────┘
                                │                 │
                   ┌────────────▼───┐    ┌────────▼────────────────┐
                   │  DOMAIN LAYER  │    │  AUTH LAYER             │
                   │                │    │                         │
                   │  models.ts     │    │  permissions.ts         │
                   │   Incident     │    │   hasPermission(role,   │
                   │   TaskInstance │    │     permission)         │
                   │   Approval     │    │   permissionMatrix:     │
                   │   Decision     │    │     5 roles × 24 perms │
                   │   TimelineEvent│    │                         │
                   │   Aggregate    │    │  auth-context.tsx       │
                   │                │    │   useMe() / usePermission│
                   │  transitions.ts│    └─────────────────────────┘
                   │   TASK_TRANSITIONS
                   │   INCIDENT_TRANSITIONS
                   │                │
                   │  validation.ts │
                   │   assertTaskCanTransition()
                   │   assertApprovalIsPending()
                   └────────────────┘
                                │
                   Service calls repo via interface
                                │
                   ┌────────────▼─────────────────────────────────┐
                   │          REPOSITORY LAYER                    │
                   │                                              │
                   │  lib/repositories/types.ts (INTERFACE)       │
                   │    IncidentRepository {                       │
                   │      getAggregate(incidentId)                 │
                   │      updateTask(incidentId, taskId, patch)   │
                   │      decideApproval(...)                      │
                   │      respondToDecision(...)                   │
                   │      appendTimelineEvent(...)  ← APPEND ONLY │
                   │      appendAuditEvent(...)     ← APPEND ONLY │
                   │    }                                          │
                   │    ⛔ No update/delete for timeline or audit  │
                   │                                              │
                   │  lib/repositories/id.ts                      │
                   │    normalizeIncidentId/TaskId/ApprovalId/... │
                   │    (used ONLY inside repository impls)        │
                   │                                              │
                   │  lib/repositories/mockIncidentRepository.ts  │
                   │    implements IncidentRepository              │
                   │    ┌──────────────────────────────────┐      │
                   │    │  ONLY file that imports lib/mock │      │
                   │    └──────────────────────────────────┘      │
                   └──────────────────┬───────────────────────────┘
                                      │
                   ┌──────────────────▼───────────────────────────┐
                   │          MOCK DATA (isolated)                │
                   │                                              │
                   │  lib/mock/incidents.ts                       │
                   │  lib/mock/tasks.ts                           │
                   │  lib/mock/approvals.ts                       │
                   │  lib/mock/decisions.ts                       │
                   │  lib/mock/timeline.ts                        │
                   │  lib/mock/users.ts                           │
                   │  lib/mock/audit-logs.ts                      │
                   │  lib/mock/integrations.ts                    │
                   └──────────────────────────────────────────────┘


## Import Rules (enforced by ESLint)

```
  ┌────────────────────────────────────────────────────────────────┐
  │                    WHO CAN IMPORT WHAT                         │
  ├────────────────────┬───────────────────────────────────────────┤
  │                    │          Can import lib/mock/* ?          │
  ├────────────────────┼───────────────────────────────────────────┤
  │  app/**            │  ⛔ NO  (ESLint: no-restricted-imports)  │
  │  lib/services/**   │  ⛔ NO  (ESLint: no-restricted-imports)  │
  │  lib/state/**      │  ⛔ NO  (ESLint: no-restricted-imports)  │
  │  lib/domain/**     │  ⛔ NO  (ESLint: no-restricted-imports)  │
  │  lib/repositories/ │  ✅ YES (mock adapter lives here)        │
  │  lib/api/**        │  ✅ YES (API adapter layer)              │
  │  lib/auth/**       │  ✅ YES (dev role switcher)              │
  │  **/*.test.ts      │  ✅ YES (test files exempted)            │
  └────────────────────┴───────────────────────────────────────────┘
```


## Service Call Flow (example: startTask)

```
  Panel                Store                 Service              Repository
    │                    │                      │                      │
    │  onStartTask()     │                      │                      │
    │───────────────────>│                      │                      │
    │                    │                      │                      │
    │                    │  svc.startTask()     │                      │
    │                    │─────────────────────>│                      │
    │                    │                      │                      │
    │                    │                      │  checkPermission()   │
    │                    │                      │──────┐               │
    │                    │                      │<─────┘               │
    │                    │                      │                      │
    │                    │                      │  repo.getAggregate() │
    │                    │                      │─────────────────────>│
    │                    │                      │<─────────────────────│
    │                    │                      │                      │
    │                    │                      │  assertTaskCanTransition()
    │                    │                      │──────┐               │
    │                    │                      │<─────┘               │
    │                    │                      │                      │
    │                    │                      │  repo.updateTask()   │
    │                    │                      │─────────────────────>│
    │                    │                      │<─────────────────────│
    │                    │                      │                      │
    │                    │                      │  repo.appendTimelineEvent()
    │                    │                      │─────────────────────>│
    │                    │                      │<─────────────────────│
    │                    │                      │                      │
    │                    │                      │  repo.appendAuditEvent()
    │                    │                      │─────────────────────>│
    │                    │                      │<─────────────────────│
    │                    │                      │                      │
    │                    │  ServiceResult<Task> │                      │
    │                    │<─────────────────────│                      │
    │                    │                      │                      │
    │                    │  svc.loadIncident()  │  (reload aggregate)  │
    │                    │─────────────────────>│─────────────────────>│
    │                    │<─────────────────────│<─────────────────────│
    │                    │                      │                      │
    │  re-render (props) │                      │                      │
    │<───────────────────│                      │                      │
```


## State Shape

```typescript
IncidentStoreState {
  data: IncidentAggregate | null     // the domain aggregate
  async: {
    loading: boolean                  // is a request in flight?
    error: ServiceError | null        // { code, message, details? }
    lastAction: string | null         // which action just completed
  }
  ui: {
    approvalReasonDraft: string       // form state for approval reason
    timelineNoteDraft: string         // form state for timeline note
  }
}
```


## Test Coverage (24 tests)

```
  RBAC enforcement (9 tests)
    ✓ Observer cannot start/complete tasks
    ✓ Observer cannot approve/deny approvals
    ✓ Observer cannot add timeline notes
    ✓ Observer cannot respond to decisions
    ✓ Responder blocked from unassigned tasks
    ✓ Responder CAN update own assigned task
    ✓ Admin can update any task

  Transition rules (4 tests)
    ✓ Cannot complete TODO directly (must go through IN_PROGRESS)
    ✓ Cannot start a DONE task
    ✓ Approval must be PENDING to decide
    ✓ Decision cannot be responded to twice

  Append-only events (5 tests)
    ✓ startTask → +1 timeline, +1 audit
    ✓ completeTask → +1 timeline, +1 audit
    ✓ decideApproval → +1 timeline, +1 audit
    ✓ addTimelineNote → +1 timeline, +1 audit
    ✓ respondToDecision → +1 timeline, +1 audit

  ID normalization (4 tests)
    ✓ Inc_001 == inc_001
    ✓ INC-001 == inc_001
    ✓ INC_001 == inc_001
    ✓ All variants normalize to same value

  loadIncident (2 tests)
    ✓ Returns aggregate for valid ID
    ✓ Returns NOT_FOUND for missing ID
```
