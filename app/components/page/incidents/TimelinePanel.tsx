import TimelineEventCard from "@/app/components/core/TimelineEventCard";

interface TimelinePanelProps {
    className?: string;
}

const mockEvents = [
    { type: "escalation" as const, actor: "System", message: "Incident escalated to S0", timestamp: "2m ago" },
    { type: "action" as const, actor: "Alice Chen", message: "Initiated DB failover sequence", timestamp: "5m ago" },
    { type: "message" as const, actor: "Bob Park", message: "Primary node is unresponsive, connection pool exhausted", timestamp: "8m ago" },
    { type: "status_change" as const, actor: "System", message: "Status changed from Investigating to Active", timestamp: "10m ago" },
    { type: "action" as const, actor: "Carol Wu", message: "Paged DBA on-call team", timestamp: "12m ago" },
    { type: "message" as const, actor: "Alice Chen", message: "Seeing elevated error rates on /api/v2 endpoints", timestamp: "15m ago" },
];

export default function TimelinePanel({ className = "" }: TimelinePanelProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">Timeline</h3>
            <div>
                {mockEvents.map((event, i) => (
                    <TimelineEventCard key={i} {...event} />
                ))}
            </div>
        </div>
    );
}
