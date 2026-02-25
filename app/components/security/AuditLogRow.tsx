interface AuditLogRowProps {
    action: string;
    actor: string;
    target: string;
    timestamp: string;
    ipAddress?: string;
    className?: string;
}

export default function AuditLogRow({
    action,
    actor,
    target,
    timestamp,
    ipAddress,
    className = "",
}: AuditLogRowProps) {
    return (
        <div
            className={`flex items-center gap-6 border-b border-[var(--color-border)] px-4 py-3 text-sm transition-colors hover:bg-[var(--color-bg-hover)] ${className}`}
        >
            <span className="w-40 shrink-0 font-medium text-[var(--color-text-primary)]">{action}</span>
            <span className="w-32 shrink-0 text-[var(--color-text-secondary)]">{actor}</span>
            <span className="flex-1 truncate text-[var(--color-text-muted)]">{target}</span>
            {ipAddress && (
                <span className="w-28 shrink-0 font-mono text-xs text-[var(--color-text-muted)]">
                    {ipAddress}
                </span>
            )}
            <span className="w-36 shrink-0 text-right text-xs text-[var(--color-text-muted)]">
                {timestamp}
            </span>
        </div>
    );
}
