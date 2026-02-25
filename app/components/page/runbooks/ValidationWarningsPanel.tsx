interface ValidationWarningsPanelProps {
    className?: string;
}

const mockWarnings = [
    { id: "1", level: "error" as const, message: "Task 3 has no assigned role", line: "Step 3" },
    { id: "2", level: "warning" as const, message: "Decision node 'failover' has no 'No' branch", line: "Decision 1" },
    { id: "3", level: "info" as const, message: "Consider adding an approval gate before production deploy", line: "Step 4" },
];

const levelStyles = {
    error: "border-red-500/20 bg-red-500/5 text-red-400",
    warning: "border-yellow-500/20 bg-yellow-500/5 text-yellow-400",
    info: "border-blue-500/20 bg-blue-500/5 text-blue-400",
};

const levelIcons = { error: "✕", warning: "⚠", info: "ℹ" };

export default function ValidationWarningsPanel({ className = "" }: ValidationWarningsPanelProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Validation</h3>
            <div className="space-y-2">
                {mockWarnings.map((w) => (
                    <div key={w.id} className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm ${levelStyles[w.level]}`}>
                        <span className="mt-0.5 text-xs">{levelIcons[w.level]}</span>
                        <div>
                            <p>{w.message}</p>
                            <p className="mt-0.5 text-xs opacity-70">{w.line}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
