import TimelineEventCard from "@/app/components/core/TimelineEventCard";

const mockEvents = [
    { type: "escalation" as const, actor: "System", message: "INC-001 escalated to S0 — database cluster failover", timestamp: "5m ago" },
    { type: "action" as const, actor: "Alice Chen", message: "Initiated failover sequence for primary DB cluster", timestamp: "12m ago" },
    { type: "status_change" as const, actor: "Bob Park", message: "INC-002 status changed to Investigating", timestamp: "23m ago" },
    { type: "message" as const, actor: "Carol Wu", message: "CDN cache purge completed for all edge nodes", timestamp: "1h ago" },
    { type: "resolution" as const, actor: "Dev Team", message: "INC-099 resolved — auth service memory leak patched", timestamp: "2h ago" },
];

interface RecentActivityTimelineProps {
    className?: string;
}

export default function RecentActivityTimeline({ className = "" }: RecentActivityTimelineProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">Recent Activity</h3>
            <div className="stagger-children">
                {mockEvents.map((event, i) => (
                    <TimelineEventCard key={i} {...event} />
                ))}
            </div>
        </div>
    );
}
