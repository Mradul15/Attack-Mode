import SeverityBadge from "@/app/components/core/SeverityBadge";
import StatusPill from "@/app/components/core/StatusPill";
import OverdueTimer from "@/app/components/core/OverdueTimer";
import UserChip from "@/app/components/core/UserChip";

interface IncidentHeaderProps {
    id?: string;
    title?: string;
    className?: string;
}

export default function IncidentHeader({
    id = "INC-001",
    title = "Database cluster failover",
    className = "",
}: IncidentHeaderProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">{id}</span>
                        <SeverityBadge severity="S0" />
                        <StatusPill status="active" />
                    </div>
                    <h1 className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">{title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <OverdueTimer label="Duration" elapsed="47m 23s" />
                    <button className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]">
                        Update Status
                    </button>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">Commander:</span>
                    <UserChip name="Alice Chen" role="SRE Lead" size="sm" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">Responders:</span>
                    <UserChip name="Bob Park" size="sm" />
                    <UserChip name="Carol Wu" size="sm" />
                </div>
            </div>
        </div>
    );
}
