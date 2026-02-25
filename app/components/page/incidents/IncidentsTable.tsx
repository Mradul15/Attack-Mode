import SeverityBadge, { type Severity } from "@/app/components/core/SeverityBadge";
import StatusPill, { type Status } from "@/app/components/core/StatusPill";

interface Incident {
    id: string;
    title: string;
    severity: Severity;
    status: Status;
    commander: string;
    started: string;
    duration: string;
}

interface IncidentsTableProps {
    incidents?: Incident[];
    className?: string;
}

const mockIncidents: Incident[] = [
    { id: "INC-001", title: "Database cluster failover", severity: "S0", status: "active", commander: "Alice Chen", started: "Jan 15, 14:32", duration: "47m" },
    { id: "INC-002", title: "API latency spike (p99 > 2s)", severity: "S1", status: "investigating", commander: "Bob Park", started: "Jan 15, 14:55", duration: "23m" },
    { id: "INC-003", title: "CDN cache invalidation failure", severity: "S2", status: "monitoring", commander: "Carol Wu", started: "Jan 15, 13:05", duration: "1h 12m" },
    { id: "INC-004", title: "Auth service memory leak", severity: "S1", status: "resolved", commander: "Dev Team", started: "Jan 14, 09:20", duration: "3h 45m" },
    { id: "INC-005", title: "Scheduled maintenance window", severity: "S4", status: "closed", commander: "SRE Team", started: "Jan 13, 02:00", duration: "2h" },
];

export default function IncidentsTable({
    incidents = mockIncidents,
    className = "",
}: IncidentsTableProps) {
    return (
        <div className={`overflow-hidden rounded-xl border border-[var(--color-border)] ${className}`}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="sticky top-0 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Incident</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Severity</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Commander</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Started</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map((inc) => (
                        <tr
                            key={inc.id}
                            className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)] cursor-pointer"
                        >
                            <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{inc.id}</td>
                            <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{inc.title}</td>
                            <td className="px-4 py-3"><SeverityBadge severity={inc.severity} /></td>
                            <td className="px-4 py-3"><StatusPill status={inc.status} /></td>
                            <td className="px-4 py-3 text-[var(--color-text-secondary)]">{inc.commander}</td>
                            <td className="px-4 py-3 text-[var(--color-text-muted)]">{inc.started}</td>
                            <td className="px-4 py-3 text-right font-mono text-xs text-[var(--color-text-muted)]">{inc.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5">
                <span className="text-xs text-[var(--color-text-muted)]">Showing {incidents.length} incidents</span>
                <div className="flex gap-1">
                    <button className="rounded px-2 py-1 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]">← Prev</button>
                    <button className="rounded px-2 py-1 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]">Next →</button>
                </div>
            </div>
        </div>
    );
}
