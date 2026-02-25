interface OverdueTimerProps {
    label: string;
    elapsed: string;
    overdue?: boolean;
    className?: string;
}

export default function OverdueTimer({
    label,
    elapsed,
    overdue = false,
    className = "",
}: OverdueTimerProps) {
    return (
        <div
            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${overdue
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]"
                } ${className}`}
        >
            <span>{overdue ? "⏰" : "⏱"}</span>
            <span>{label}:</span>
            <span className="font-semibold">{elapsed}</span>
        </div>
    );
}
