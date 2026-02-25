interface QuickActionsPanelProps {
    className?: string;
}

const actions = [
    { label: "Create Incident", icon: "🚨", href: "/incidents/create" },
    { label: "New Runbook", icon: "📋", href: "/runbooks/create" },
    { label: "Invite User", icon: "👤", href: "/people" },
    { label: "View Audit Logs", icon: "📜", href: "/audit-logs" },
];

export default function QuickActionsPanel({ className = "" }: QuickActionsPanelProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
                {actions.map((action) => (
                    <a
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-3 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-accent)]/30 hover:text-[var(--color-text-primary)]"
                    >
                        <span>{action.icon}</span>
                        {action.label}
                    </a>
                ))}
            </div>
        </div>
    );
}
