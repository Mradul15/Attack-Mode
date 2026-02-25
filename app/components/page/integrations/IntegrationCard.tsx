import IntegrationStatusIndicator, { type IntegrationHealth } from "@/app/components/core/IntegrationStatusIndicator";

interface IntegrationCardProps {
    name: string;
    description?: string;
    health: IntegrationHealth;
    lastSync?: string;
    icon?: string;
    className?: string;
}

export default function IntegrationCard({
    name,
    description = "No description available.",
    health,
    lastSync,
    icon = "🔌",
    className = "",
}: IntegrationCardProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 transition-colors hover:border-[var(--color-bg-active)] ${className}`}>
            <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-bg-active)] text-xl">{icon}</span>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">{name}</h3>
                        <p className="text-xs text-[var(--color-text-muted)]">{description}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between">
                <IntegrationStatusIndicator name="" health={health} lastSync={lastSync} />
                <button className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
                    Configure
                </button>
            </div>
        </div>
    );
}
