import AuditLogRow from "@/app/components/security/AuditLogRow";

interface AuditLogTableProps {
    className?: string;
}

const mockLogs = [
    { action: "user.login", actor: "alice@acme.com", target: "session:sess_abc123", timestamp: "Jan 15, 14:32 UTC", ipAddress: "192.168.1.42" },
    { action: "incident.create", actor: "bob@acme.com", target: "incident:INC-001", timestamp: "Jan 15, 14:30 UTC", ipAddress: "10.0.1.15" },
    { action: "user.role.update", actor: "admin@acme.com", target: "user:carol@acme.com", timestamp: "Jan 15, 13:55 UTC", ipAddress: "192.168.1.10" },
    { action: "api_key.create", actor: "alice@acme.com", target: "key:ak_prod_xxx", timestamp: "Jan 15, 12:00 UTC", ipAddress: "192.168.1.42" },
    { action: "runbook.publish", actor: "carol@acme.com", target: "runbook:rb_failover_v3", timestamp: "Jan 15, 11:20 UTC", ipAddress: "10.0.2.30" },
    { action: "incident.resolve", actor: "dev-team@acme.com", target: "incident:INC-099", timestamp: "Jan 14, 18:45 UTC", ipAddress: "10.0.1.50" },
];

export default function AuditLogTable({ className = "" }: AuditLogTableProps) {
    return (
        <div className={`overflow-hidden rounded-xl border border-[var(--color-border)] ${className}`}>
            <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                <div className="flex items-center gap-6 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    <span className="w-40 shrink-0">Action</span>
                    <span className="w-32 shrink-0">Actor</span>
                    <span className="flex-1">Target</span>
                    <span className="w-28 shrink-0">IP</span>
                    <span className="w-36 shrink-0 text-right">Timestamp</span>
                </div>
            </div>
            <div className="bg-[var(--color-bg-root)]">
                {mockLogs.map((log, i) => (
                    <AuditLogRow key={i} {...log} />
                ))}
            </div>
            <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5">
                <span className="text-xs text-[var(--color-text-muted)]">Showing {mockLogs.length} entries</span>
                <div className="flex gap-1">
                    <button className="rounded px-2 py-1 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]">← Prev</button>
                    <button className="rounded px-2 py-1 text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]">Next →</button>
                </div>
            </div>
        </div>
    );
}
