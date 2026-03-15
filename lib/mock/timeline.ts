import type { TimelineEvent } from "@/lib/types";

export const mockTimeline: TimelineEvent[] = [
    // inc_001 timeline
    { event_id: "evt_001", incident_id: "inc_001", type: "escalation", actor_id: "usr_2", actor_name: "Bob Park", message: "Incident created — Suspicious OAuth tokens detected", created_at: "2026-02-25T14:10:00Z" },
    { event_id: "evt_002", incident_id: "inc_001", type: "action", actor_id: "usr_3", actor_name: "Carol Wu", message: "Enabled enhanced logging on auth service", created_at: "2026-02-25T14:15:00Z" },
    { event_id: "evt_003", incident_id: "inc_001", type: "message", actor_id: "usr_1", actor_name: "Alice Chen", message: "Seeing 47 tokens generated from anomalous IP range 203.x.x.x", created_at: "2026-02-25T14:20:00Z" },
    { event_id: "evt_004", incident_id: "inc_001", type: "action", actor_id: "usr_3", actor_name: "Carol Wu", message: "Started revoking compromised tokens — batch 1 of 3", created_at: "2026-02-25T14:30:00Z" },
    { event_id: "evt_005", incident_id: "inc_001", type: "status_change", actor_id: "usr_2", actor_name: "Bob Park", message: "Status changed to ACTIVE — confirmed credential compromise", created_at: "2026-02-25T14:35:00Z" },

    // inc_002 timeline
    { event_id: "evt_010", incident_id: "inc_002", type: "escalation", actor_id: "usr_1", actor_name: "Alice Chen", message: "Incident escalated to S0 — primary DB unresponsive", created_at: "2026-02-25T13:30:00Z" },
    { event_id: "evt_011", incident_id: "inc_002", type: "action", actor_id: "usr_3", actor_name: "Carol Wu", message: "Isolating failing pods from load balancer", created_at: "2026-02-25T13:35:00Z" },
    { event_id: "evt_012", incident_id: "inc_002", type: "message", actor_id: "usr_2", actor_name: "Bob Park", message: "Replication lag on read replicas is within acceptable range", created_at: "2026-02-25T14:00:00Z" },
    { event_id: "evt_013", incident_id: "inc_002", type: "status_change", actor_id: "usr_1", actor_name: "Alice Chen", message: "Status changed from MONITORING to INVESTIGATING", created_at: "2026-02-25T14:10:00Z" },
    { event_id: "evt_014", incident_id: "inc_002", type: "action", actor_id: "usr_1", actor_name: "Alice Chen", message: "Initiated primary node restart with failover flag", created_at: "2026-02-25T14:30:00Z" },
];

export function getTimelineForIncident(incidentId: string): TimelineEvent[] {
    return mockTimeline
        .filter((e) => e.incident_id === incidentId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
