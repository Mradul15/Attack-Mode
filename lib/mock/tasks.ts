import type { TaskInstance } from "@/lib/types";

export const mockTasks: TaskInstance[] = [
    // Tasks for inc_001 (OAuth tokens)
    { task_id: "tsk_001", incident_id: "inc_001", title: "Revoke compromised OAuth tokens", status: "IN_PROGRESS", assignee_id: "usr_3", due_in_minutes: 15, created_at: "2026-02-25T14:12:00Z", updated_at: "2026-02-25T14:40:00Z" },
    { task_id: "tsk_002", incident_id: "inc_001", title: "Audit token generation logs", status: "TODO", assignee_id: "usr_1", due_in_minutes: 30, created_at: "2026-02-25T14:12:00Z", updated_at: "2026-02-25T14:12:00Z" },
    { task_id: "tsk_003", incident_id: "inc_001", title: "Notify affected service owners", status: "TODO", assignee_id: "usr_2", created_at: "2026-02-25T14:15:00Z", updated_at: "2026-02-25T14:15:00Z" },
    { task_id: "tsk_004", incident_id: "inc_001", title: "Enable enhanced logging on auth service", status: "DONE", assignee_id: "usr_3", created_at: "2026-02-25T14:11:00Z", updated_at: "2026-02-25T14:25:00Z" },

    // Tasks for inc_002 (DB failover)
    { task_id: "tsk_005", incident_id: "inc_002", title: "Check upstream service health", status: "TODO", assignee_id: "usr_3", due_in_minutes: 15, created_at: "2026-02-25T13:32:00Z", updated_at: "2026-02-25T13:32:00Z" },
    { task_id: "tsk_006", incident_id: "inc_002", title: "Restart primary database cluster", status: "IN_PROGRESS", assignee_id: "usr_1", due_in_minutes: 5, created_at: "2026-02-25T13:35:00Z", updated_at: "2026-02-25T14:40:00Z" },
    { task_id: "tsk_007", incident_id: "inc_002", title: "Verify replication lag on read replicas", status: "DONE", assignee_id: "usr_2", created_at: "2026-02-25T13:33:00Z", updated_at: "2026-02-25T14:00:00Z" },
    { task_id: "tsk_008", incident_id: "inc_002", title: "Notify affected customers", status: "TODO", assignee_id: "usr_2", created_at: "2026-02-25T13:40:00Z", updated_at: "2026-02-25T13:40:00Z" },
    { task_id: "tsk_009", incident_id: "inc_002", title: "Draft customer communication", status: "TODO", assignee_id: "usr_5", created_at: "2026-02-25T13:45:00Z", updated_at: "2026-02-25T13:45:00Z" },
    { task_id: "tsk_010", incident_id: "inc_002", title: "Isolate failing pods", status: "DONE", assignee_id: "usr_3", created_at: "2026-02-25T13:31:00Z", updated_at: "2026-02-25T13:50:00Z" },
];

export function getTasksForIncident(incidentId: string): TaskInstance[] {
    return mockTasks.filter((t) => t.incident_id === incidentId);
}
