/**
 * Centralized mock data gateway.
 * This is the ONLY file in the codebase that imports from lib/mock/*.
 * All other code that needs mock data must import from HERE.
 *
 * When swapping to a real backend, delete this file and
 * mockIncidentRepository.ts — nothing else should break.
 */

// ── Raw arrays ───────────────────────────────────────────
export { mockIncidents } from "@/lib/mock/incidents";
export { mockTasks } from "@/lib/mock/tasks";
export { mockApprovals } from "@/lib/mock/approvals";
export { mockTimeline } from "@/lib/mock/timeline";
export { mockDecisions } from "@/lib/mock/decisions";
export { mockUsers } from "@/lib/mock/users";
export { mockAuditLogs } from "@/lib/mock/audit-logs";
export { mockIntegrations } from "@/lib/mock/integrations";
export { mockRunbooks } from "@/lib/mock/runbooks";

// ── Lookup helpers ───────────────────────────────────────
export { getIncidentById } from "@/lib/mock/incidents";
export { getTasksForIncident } from "@/lib/mock/tasks";
export { getApprovalsForIncident } from "@/lib/mock/approvals";
export { getTimelineForIncident } from "@/lib/mock/timeline";
export { getDecisionsForIncident } from "@/lib/mock/decisions";
export { getUserById, getUserName } from "@/lib/mock/users";
export { getAuditLogById } from "@/lib/mock/audit-logs";
export { getRunbookById } from "@/lib/mock/runbooks";
