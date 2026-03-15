/**
 * Tests for IncidentService — RBAC, transitions, append-only timeline/audit.
 * Uses the mock repository via DI (not hardcoded).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { IncidentService } from "../incidentService";
import { mockIncidentRepository } from "@/lib/repositories/mockIncidentRepository";
import { hasPermission } from "@/lib/auth/permissions";
import { normalizeIncidentId } from "@/lib/repositories/id";
import { mockTasks, mockApprovals, mockTimeline, mockAuditLogs, mockDecisions } from "@/lib/repositories/mockData";

// ── Service instance via DI ──────────────────────────────

const svc = new IncidentService(mockIncidentRepository, hasPermission);

// ── Test helpers ─────────────────────────────────────────

function adminActor() {
    return {
        actorId: "usr_1",
        actorName: "Alice Chen",
        actorEmail: "alice@acme.com",
        actorRole: "Admin" as const,
    };
}

function responderActor() {
    return {
        actorId: "usr_3",
        actorName: "Carol Wu",
        actorEmail: "carol@acme.com",
        actorRole: "Responder" as const,
    };
}

function observerActor() {
    return {
        actorId: "usr_4",
        actorName: "Dan Kim",
        actorEmail: "dan@acme.com",
        actorRole: "Observer" as const,
    };
}

// ── Snapshot and restore mock state ──────────────────────
// Since the service mutates mock arrays in-place, we need to reset between tests.

let origTasks: typeof mockTasks;
let origApprovals: typeof mockApprovals;
let origTimeline: typeof mockTimeline;
let origAuditLogs: typeof mockAuditLogs;
let origDecisions: typeof mockDecisions;

beforeEach(() => {
    // Save deep copies
    origTasks = JSON.parse(JSON.stringify(mockTasks));
    origApprovals = JSON.parse(JSON.stringify(mockApprovals));
    origTimeline = JSON.parse(JSON.stringify(mockTimeline));
    origAuditLogs = JSON.parse(JSON.stringify(mockAuditLogs));
    origDecisions = JSON.parse(JSON.stringify(mockDecisions));

    return () => {
        // Restore after each test
        mockTasks.length = 0;
        mockTasks.push(...origTasks);
        mockApprovals.length = 0;
        mockApprovals.push(...origApprovals);
        mockTimeline.length = 0;
        mockTimeline.push(...origTimeline);
        mockAuditLogs.length = 0;
        mockAuditLogs.push(...origAuditLogs);
        mockDecisions.length = 0;
        mockDecisions.push(...origDecisions);
    };
});

// ── RBAC tests ───────────────────────────────────────────

describe("RBAC enforcement", () => {
    it("Observer cannot start a task", async () => {
        const result = await svc.startTask({
            ...observerActor(),
            incidentId: "inc_001",
            taskId: "tsk_002", // TODO task
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
        }
    });

    it("Observer cannot complete a task", async () => {
        const result = await svc.completeTask({
            ...observerActor(),
            incidentId: "inc_001",
            taskId: "tsk_001", // IN_PROGRESS task
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
        }
    });

    it("Observer cannot approve an approval", async () => {
        const result = await svc.decideApproval({
            ...observerActor(),
            incidentId: "inc_001",
            approvalId: "apr_001",
            decision: "APPROVED",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
        }
    });

    it("Observer cannot deny an approval", async () => {
        const result = await svc.decideApproval({
            ...observerActor(),
            incidentId: "inc_001",
            approvalId: "apr_001",
            decision: "DENIED",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
        }
    });

    it("Observer cannot add a timeline note", async () => {
        const result = await svc.addTimelineNote({
            ...observerActor(),
            incidentId: "inc_001",
            message: "test note",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
        }
    });

    it("Observer cannot respond to decisions", async () => {
        const result = await svc.respondToDecision({
            ...observerActor(),
            incidentId: "inc_001",
            decisionId: "dec_001",
            response: "Do it",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
        }
    });

    it("Responder can only update assigned tasks", async () => {
        // tsk_002 is assigned to usr_1, not usr_3 (the Responder)
        const result = await svc.startTask({
            ...responderActor(),
            incidentId: "inc_001",
            taskId: "tsk_002",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("FORBIDDEN");
            expect(result.error.message).toContain("assigned to you");
        }
    });

    it("Responder CAN update their own assigned task", async () => {
        // tsk_001 is assigned to usr_3 and is IN_PROGRESS
        const result = await svc.completeTask({
            ...responderActor(),
            incidentId: "inc_001",
            taskId: "tsk_001",
        });
        expect(result.ok).toBe(true);
    });

    it("Admin can update any task", async () => {
        const result = await svc.startTask({
            ...adminActor(),
            incidentId: "inc_001",
            taskId: "tsk_002", // assigned to usr_1, actor is usr_1 (Admin)
        });
        expect(result.ok).toBe(true);
    });
});

// ── Transition rule tests ────────────────────────────────

describe("Transition rules", () => {
    it("Cannot complete a TODO task directly", async () => {
        const result = await svc.completeTask({
            ...adminActor(),
            incidentId: "inc_001",
            taskId: "tsk_002", // TODO status
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("INVALID_TRANSITION");
        }
    });

    it("Cannot start a DONE task", async () => {
        const result = await svc.startTask({
            ...adminActor(),
            incidentId: "inc_001",
            taskId: "tsk_004", // DONE status
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("INVALID_TRANSITION");
        }
    });

    it("Approval must be PENDING to decide", async () => {
        // apr_003 is already APPROVED
        const result = await svc.decideApproval({
            ...adminActor(),
            incidentId: "inc_002",
            approvalId: "apr_003",
            decision: "DENIED",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("INVALID_TRANSITION");
        }
    });

    it("Decision cannot be responded to twice", async () => {
        // dec_003 already has a response
        const result = await svc.respondToDecision({
            ...adminActor(),
            incidentId: "inc_002",
            decisionId: "dec_003",
            response: "Override",
        });
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("INVALID_TRANSITION");
        }
    });
});

// ── Append-only timeline + audit tests ───────────────────

describe("Append-only events", () => {
    it("Starting a task appends BOTH timeline and audit events", async () => {
        const timelineBefore = mockTimeline.length;
        const auditBefore = mockAuditLogs.length;

        const result = await svc.startTask({
            ...adminActor(),
            incidentId: "inc_001",
            taskId: "tsk_002",
        });
        expect(result.ok).toBe(true);

        expect(mockTimeline.length).toBe(timelineBefore + 1);
        expect(mockTimeline[0].message).toContain("IN_PROGRESS");

        expect(mockAuditLogs.length).toBe(auditBefore + 1);
        expect(mockAuditLogs[0].action).toBe("task.status_change");
    });

    it("Completing a task appends BOTH timeline and audit events", async () => {
        const timelineBefore = mockTimeline.length;
        const auditBefore = mockAuditLogs.length;

        const result = await svc.completeTask({
            ...adminActor(),
            incidentId: "inc_001",
            taskId: "tsk_001", // IN_PROGRESS task
        });
        expect(result.ok).toBe(true);

        expect(mockTimeline.length).toBe(timelineBefore + 1);
        expect(mockTimeline[0].message).toContain("DONE");

        expect(mockAuditLogs.length).toBe(auditBefore + 1);
        expect(mockAuditLogs[0].action).toBe("task.status_change");
    });

    it("Approving appends BOTH timeline and audit", async () => {
        const timelineBefore = mockTimeline.length;
        const auditBefore = mockAuditLogs.length;

        const result = await svc.decideApproval({
            ...adminActor(),
            incidentId: "inc_001",
            approvalId: "apr_001",
            decision: "APPROVED",
            reason: "Looks good",
        });
        expect(result.ok).toBe(true);

        expect(mockTimeline.length).toBe(timelineBefore + 1);
        expect(mockTimeline[0].message).toContain("approved");

        expect(mockAuditLogs.length).toBe(auditBefore + 1);
        expect(mockAuditLogs[0].action).toBe("approval.approved");
    });

    it("Adding a timeline note appends BOTH timeline and audit events", async () => {
        const timelineBefore = mockTimeline.length;
        const auditBefore = mockAuditLogs.length;

        const result = await svc.addTimelineNote({
            ...adminActor(),
            incidentId: "inc_001",
            message: "Test note",
            type: "action",
        });
        expect(result.ok).toBe(true);

        expect(mockTimeline.length).toBe(timelineBefore + 1);
        expect(mockTimeline[0].type).toBe("action");
        expect(mockTimeline[0].message).toBe("Test note");

        expect(mockAuditLogs.length).toBe(auditBefore + 1);
        expect(mockAuditLogs[0].action).toBe("timeline.add");
    });

    it("Responding to a decision appends BOTH timeline and audit events", async () => {
        const timelineBefore = mockTimeline.length;
        const auditBefore = mockAuditLogs.length;

        const result = await svc.respondToDecision({
            ...adminActor(),
            incidentId: "inc_001",
            decisionId: "dec_001",
            response: "Option A",
        });
        expect(result.ok).toBe(true);

        expect(mockTimeline.length).toBe(timelineBefore + 1);
        expect(mockTimeline[0].message).toContain("Option A");

        expect(mockAuditLogs.length).toBe(auditBefore + 1);
        expect(mockAuditLogs[0].action).toBe("decision.respond");
    });
});

// ── ID normalization tests ───────────────────────────────

describe("ID normalization", () => {
    it("Inc_001 resolves to same incident as inc_001", async () => {
        const result = await svc.startTask({
            ...adminActor(),
            incidentId: "Inc_001",
            taskId: "tsk_002",
        });
        expect(result.ok).toBe(true);
    });

    it("INC-001 also resolves correctly", async () => {
        const result = await svc.addTimelineNote({
            ...adminActor(),
            incidentId: "INC-001",
            message: "test",
        });
        expect(result.ok).toBe(true);
    });

    it("INC_001 (all caps, underscore) resolves correctly", async () => {
        const result = await svc.addTimelineNote({
            ...adminActor(),
            incidentId: "INC_001",
            message: "test uppercase",
        });
        expect(result.ok).toBe(true);
    });

    it("normalizeIncidentId produces consistent results", () => {
        const variants = ["Inc_001", "inc-001", "INC_001", "INC-001", "inc_001"];
        const normalized = variants.map(normalizeIncidentId);
        const unique = new Set(normalized);
        expect(unique.size).toBe(1);
    });
});

// ── Load tests ───────────────────────────────────────────

describe("loadIncident", () => {
    it("returns aggregate for valid incident", async () => {
        const result = await svc.loadIncident("inc_001");
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.data.incident.incident_id).toBe("inc_001");
            expect(result.data.tasks.length).toBeGreaterThan(0);
        }
    });

    it("returns NOT_FOUND for missing incident", async () => {
        const result = await svc.loadIncident("inc_999");
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.code).toBe("NOT_FOUND");
        }
    });
});
