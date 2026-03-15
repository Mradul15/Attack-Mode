import SeverityBadge from "@/app/components/core/SeverityBadge";
import StatusPill from "@/app/components/core/StatusPill";

const mockIncidents = [
    { id: "INC-001", title: "Database cluster failover", severity: "S0" as const, status: "active" as const, commander: "Alice Chen", duration: "47m" },
    { id: "INC-002", title: "API latency spike (p99 > 2s)", severity: "S1" as const, status: "investigating" as const, commander: "Bob Park", duration: "23m" },
    { id: "INC-003", title: "CDN cache invalidation failure", severity: "S2" as const, status: "monitoring" as const, commander: "Carol Wu", duration: "1h 12m" },
];

interface ActiveIncidentsCardProps {
    className?: string;
}

export default function ActiveIncidentsCard({ className = "" }: ActiveIncidentsCardProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Active Incidents</h3>
                <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                    {mockIncidents.length} open
                </span>
            </div>
            <div className="space-y-3 stagger-children">
                {mockIncidents.map((inc) => (
                    <div key={inc.id} className="interactive-card flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2.5">
                        <SeverityBadge severity={inc.severity} />
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{inc.title}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{inc.id} · {inc.commander} · {inc.duration}</p>
                        </div>
                        <StatusPill status={inc.status} />
                    </div>
                ))}
            </div>
        </div>
    );
}
