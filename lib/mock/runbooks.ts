import type { RunbookTemplate } from "@/lib/types";

export const mockRunbooks: RunbookTemplate[] = [
    {
        runbook_id: "rb_001",
        name: "Credential Compromise Response",
        description: "Standard procedure for responding to compromised credentials or tokens.",
        category: "CRED_COMPROMISE",
        status: "PUBLISHED",
        version: "3.0",
        author_id: "usr_1",
        tasks: [
            { task_id: "rbt_001", title: "Identify compromised credentials", owner_role: "IC", due_in_minutes: 15, order: 1 },
            { task_id: "rbt_002", title: "Revoke affected tokens/keys", owner_role: "Responder", due_in_minutes: 30, order: 2 },
            { task_id: "rbt_003", title: "Audit access logs for abuse", owner_role: "Responder", due_in_minutes: 60, order: 3 },
            { task_id: "rbt_004", title: "Notify affected users", owner_role: "Legal/Comms", due_in_minutes: 120, order: 4 },
            { task_id: "rbt_005", title: "Implement rotation policy", owner_role: "Admin", order: 5 },
        ],
        created_at: "2026-01-10T10:00:00Z",
        updated_at: "2026-02-15T14:30:00Z",
    },
    {
        runbook_id: "rb_002",
        name: "Database Failover Procedure",
        description: "Steps to safely failover primary database to secondary replica.",
        category: "OTHER",
        status: "PUBLISHED",
        version: "2.1",
        author_id: "usr_2",
        tasks: [
            { task_id: "rbt_010", title: "Verify replication status", owner_role: "Responder", due_in_minutes: 5, order: 1 },
            { task_id: "rbt_011", title: "Promote secondary to primary", owner_role: "IC", due_in_minutes: 10, order: 2 },
            { task_id: "rbt_012", title: "Update connection strings", owner_role: "Responder", due_in_minutes: 15, order: 3 },
            { task_id: "rbt_013", title: "Validate application connectivity", owner_role: "Responder", due_in_minutes: 30, order: 4 },
        ],
        created_at: "2025-11-05T08:00:00Z",
        updated_at: "2026-01-20T16:00:00Z",
    },
    {
        runbook_id: "rb_003",
        name: "API Token Compromise",
        description: "Response playbook for compromised API keys or service tokens.",
        category: "TOKEN_COMPROMISE",
        status: "DRAFT",
        version: "1.0",
        author_id: "usr_1",
        tasks: [
            { task_id: "rbt_020", title: "Identify exposed token scope", owner_role: "IC", due_in_minutes: 10, order: 1 },
            { task_id: "rbt_021", title: "Rotate affected API keys", owner_role: "Admin", due_in_minutes: 20, order: 2 },
            { task_id: "rbt_022", title: "Review API access logs", owner_role: "Responder", due_in_minutes: 60, order: 3 },
        ],
        created_at: "2026-02-01T12:00:00Z",
        updated_at: "2026-02-20T09:00:00Z",
    },
    {
        runbook_id: "rb_004",
        name: "Data Exfiltration Response",
        description: "Playbook for suspected or confirmed data exfiltration events.",
        category: "DATA_EXFIL",
        status: "PUBLISHED",
        version: "1.2",
        author_id: "usr_2",
        tasks: [
            { task_id: "rbt_030", title: "Isolate affected systems", owner_role: "IC", due_in_minutes: 5, order: 1 },
            { task_id: "rbt_031", title: "Capture forensic evidence", owner_role: "Responder", due_in_minutes: 30, order: 2 },
            { task_id: "rbt_032", title: "Assess data scope and sensitivity", owner_role: "IC", due_in_minutes: 60, order: 3 },
            { task_id: "rbt_033", title: "Engage legal counsel", owner_role: "Legal/Comms", due_in_minutes: 120, order: 4 },
            { task_id: "rbt_034", title: "Prepare regulatory notification", owner_role: "Legal/Comms", order: 5 },
        ],
        created_at: "2025-12-15T10:00:00Z",
        updated_at: "2026-02-10T11:00:00Z",
    },
    {
        runbook_id: "rb_005",
        name: "Endpoint Compromise Triage",
        description: "Initial triage steps for a compromised endpoint or workstation.",
        category: "ENDPOINT_COMPROMISE",
        status: "DRAFT",
        version: "0.5",
        author_id: "usr_3",
        tasks: [
            { task_id: "rbt_040", title: "Isolate endpoint from network", owner_role: "Responder", due_in_minutes: 5, order: 1 },
            { task_id: "rbt_041", title: "Collect endpoint telemetry", owner_role: "Responder", due_in_minutes: 15, order: 2 },
        ],
        created_at: "2026-02-18T14:00:00Z",
        updated_at: "2026-02-22T10:00:00Z",
    },
];

export function getRunbookById(id: string): RunbookTemplate | undefined {
    return mockRunbooks.find((r) => r.runbook_id === id);
}
