interface AuditFiltersBarProps {
    className?: string;
}

export default function AuditFiltersBar({ className = "" }: AuditFiltersBarProps) {
    return (
        <div className={`flex flex-wrap items-center gap-3 ${className}`}>
            <input
                type="text"
                placeholder="Search audit logs..."
                className="flex-1 min-w-[200px] max-w-sm rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)]"
                aria-label="Search audit logs"
            />
            <select className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none" aria-label="Action type">
                <option>All Actions</option>
                <option>user.login</option>
                <option>user.role.update</option>
                <option>incident.create</option>
                <option>incident.resolve</option>
                <option>api_key.create</option>
            </select>
            <select className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none" aria-label="Date range">
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Custom range</option>
            </select>
        </div>
    );
}
