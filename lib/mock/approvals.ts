import type { Approval } from "@/lib/types";

export const mockApprovals: Approval[] = [
    { approval_id: "apr_001", incident_id: "inc_001", title: "Deploy token revocation hotfix to production", requester_id: "usr_3", status: "PENDING", created_at: "2026-02-25T14:30:00Z" },
    { approval_id: "apr_002", incident_id: "inc_001", title: "Grant break-glass access to auth DB", requester_id: "usr_2", status: "PENDING", created_at: "2026-02-25T14:35:00Z" },
    { approval_id: "apr_003", incident_id: "inc_002", title: "Scale up API replicas to 20", requester_id: "usr_3", status: "APPROVED", approved_by: "usr_1", created_at: "2026-02-25T13:45:00Z", resolved_at: "2026-02-25T13:50:00Z" },
    { approval_id: "apr_004", incident_id: "inc_002", title: "Approve customer notification draft", requester_id: "usr_5", status: "PENDING", created_at: "2026-02-25T14:00:00Z" },
];

export function getApprovalsForIncident(incidentId: string): Approval[] {
    return mockApprovals.filter((a) => a.incident_id === incidentId);
}
