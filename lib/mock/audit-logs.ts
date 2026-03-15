import type { AuditLog } from "@/lib/types";

export const mockAuditLogs: AuditLog[] = [
    { log_id: "log_001", action: "user.login", actor_id: "usr_1", actor_email: "alice@acme.com", target: "session:sess_abc123", ip_address: "192.168.1.42", request_id: "req_a1b2c3", metadata: { method: "SSO" }, created_at: "2026-02-25T14:32:00Z" },
    { log_id: "log_002", action: "incident.create", actor_id: "usr_2", actor_email: "bob@acme.com", target: "incident:inc_001", ip_address: "10.0.1.15", request_id: "req_d4e5f6", metadata: { severity: "S1", title: "Suspicious OAuth tokens detected" }, created_at: "2026-02-25T14:10:00Z" },
    { log_id: "log_003", action: "user.role.update", actor_id: "usr_1", actor_email: "alice@acme.com", target: "user:carol@acme.com", ip_address: "192.168.1.42", request_id: "req_g7h8i9", metadata: { role_from: "Observer", role_to: "Responder" }, created_at: "2026-02-25T13:55:00Z" },
    { log_id: "log_004", action: "api_key.create", actor_id: "usr_1", actor_email: "alice@acme.com", target: "key:ak_prod_xxx", ip_address: "192.168.1.42", request_id: "req_j0k1l2", metadata: { scope: "read:incidents" }, created_at: "2026-02-25T12:00:00Z" },
    { log_id: "log_005", action: "runbook.publish", actor_id: "usr_2", actor_email: "bob@acme.com", target: "runbook:rb_001", ip_address: "10.0.1.15", request_id: "req_m3n4o5", metadata: { version: "3.0" }, created_at: "2026-02-25T11:20:00Z" },
    { log_id: "log_006", action: "incident.resolve", actor_id: "usr_1", actor_email: "alice@acme.com", target: "incident:inc_004", ip_address: "192.168.1.42", request_id: "req_p6q7r8", metadata: { duration: "3h 45m" }, created_at: "2026-02-24T13:05:00Z" },
    { log_id: "log_007", action: "integration.rotate", actor_id: "usr_1", actor_email: "alice@acme.com", target: "integration:int_slack", ip_address: "192.168.1.42", request_id: "req_s9t0u1", metadata: { integration: "Slack" }, created_at: "2026-02-24T10:00:00Z" },
    { log_id: "log_008", action: "user.invite", actor_id: "usr_1", actor_email: "alice@acme.com", target: "user:newuser@acme.com", ip_address: "192.168.1.42", request_id: "req_v2w3x4", metadata: { role: "Observer" }, created_at: "2026-02-23T16:00:00Z" },
];

export function getAuditLogById(id: string): AuditLog | undefined {
    return mockAuditLogs.find((l) => l.log_id === id);
}
