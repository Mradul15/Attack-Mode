import EvidenceReferenceList from "@/app/components/core/EvidenceReferenceList";
import UserChip from "@/app/components/core/UserChip";

interface ContextPanelProps {
    className?: string;
}

export default function ContextPanel({ className = "" }: ContextPanelProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Responders</h3>
                <div className="space-y-3">
                    <UserChip name="Alice Chen" role="Incident Commander" />
                    <UserChip name="Bob Park" role="Tech Lead" />
                    <UserChip name="Carol Wu" role="Communications" />
                    <UserChip name="SRE On-Call" role="Supporting" />
                </div>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Evidence & Links</h3>
                <EvidenceReferenceList items={[
                    { id: "1", label: "Grafana dashboard", type: "link", url: "#" },
                    { id: "2", label: "Error logs (Jan 15)", type: "log", url: "#" },
                    { id: "3", label: "Runbook: DB Failover v2", type: "file", url: "#" },
                ]} />
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Linked Services</h3>
                <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        Primary Database (us-east-1)
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        API Gateway (global)
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        Auth Service (us-east-1)
                    </div>
                </div>
            </div>
        </div>
    );
}
