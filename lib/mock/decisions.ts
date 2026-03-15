import type { Decision } from "@/lib/types";

export const mockDecisions: Decision[] = [
    {
        decision_id: "dec_001",
        incident_id: "inc_001",
        prompt: "Should we rotate all OAuth client secrets?",
        options: ["Rotate all now", "Rotate only compromised", "Defer to post-mortem"],
        requester_id: "usr_2",
        created_at: "2026-02-25T14:25:00Z",
    },
    {
        decision_id: "dec_002",
        incident_id: "inc_002",
        prompt: "Should we failover to the secondary region?",
        options: ["Yes — failover now", "Attempt local repair first", "Escalate to VP Eng"],
        requester_id: "usr_1",
        created_at: "2026-02-25T13:40:00Z",
    },
    {
        decision_id: "dec_003",
        incident_id: "inc_002",
        prompt: "Approve customer notification draft?",
        options: ["Approve & Send", "Request Changes", "Defer"],
        requester_id: "usr_5",
        response: "Approve & Send",
        responded_by: "usr_1",
        created_at: "2026-02-25T14:15:00Z",
        responded_at: "2026-02-25T14:20:00Z",
    },
];

export function getDecisionsForIncident(incidentId: string): Decision[] {
    return mockDecisions.filter((d) => d.incident_id === incidentId);
}
