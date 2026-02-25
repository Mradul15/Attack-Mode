interface AuditLogDetailPanelProps {
    action?: string;
    actor?: string;
    target?: string;
    timestamp?: string;
    ipAddress?: string;
    requestId?: string;
    metadata?: Record<string, string>;
    className?: string;
}

export default function AuditLogDetailPanel({
    action = "user.role.update",
    actor = "admin@acme.com",
    target = "user:jane@acme.com",
    timestamp = "2024-01-15 14:32:05 UTC",
    ipAddress = "192.168.1.42",
    requestId = "req_abc123def456",
    metadata = { role_from: "viewer", role_to: "editor" },
    className = "",
}: AuditLogDetailPanelProps) {
    return (
        <div
            className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 ${className}`}
        >
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{action}</h3>
            <div className="mt-4 space-y-3">
                {[
                    ["Actor", actor],
                    ["Target", target],
                    ["Timestamp", timestamp],
                    ["IP Address", ipAddress],
                    ["Request ID", requestId],
                ].map(([label, value]) => (
                    <div key={label} className="flex items-start gap-4">
                        <span className="w-28 shrink-0 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                            {label}
                        </span>
                        <span className="text-sm text-[var(--color-text-primary)]">{value}</span>
                    </div>
                ))}
            </div>
            {Object.keys(metadata).length > 0 && (
                <div className="mt-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3">
                    <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                        Metadata
                    </span>
                    <pre className="mt-2 text-xs text-[var(--color-text-secondary)]">
                        {JSON.stringify(metadata, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
