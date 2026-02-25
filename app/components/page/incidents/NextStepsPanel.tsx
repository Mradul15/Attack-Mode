interface NextStepsPanelProps {
    className?: string;
}

const mockSteps = [
    { id: "1", label: "Verify database replication lag", done: true },
    { id: "2", label: "Restart primary node with failover flag", done: false, current: true },
    { id: "3", label: "Validate read replicas are healthy", done: false },
    { id: "4", label: "Notify affected downstream services", done: false },
    { id: "5", label: "Draft customer communication", done: false },
];

export default function NextStepsPanel({ className = "" }: NextStepsPanelProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Next Steps</h3>
            <div className="space-y-2">
                {mockSteps.map((step) => (
                    <div
                        key={step.id}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${step.current
                                ? "border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5"
                                : ""
                            }`}
                    >
                        <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${step.done
                                    ? "border-green-500 bg-green-500/15 text-green-400"
                                    : step.current
                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                                        : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                                }`}
                        >
                            {step.done ? "✓" : step.id}
                        </div>
                        <span
                            className={
                                step.done
                                    ? "text-[var(--color-text-muted)] line-through"
                                    : step.current
                                        ? "font-medium text-[var(--color-text-primary)]"
                                        : "text-[var(--color-text-secondary)]"
                            }
                        >
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
