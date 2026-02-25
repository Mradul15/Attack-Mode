interface DecisionPromptCardProps {
    question: string;
    options?: string[];
    requester?: string;
    timestamp?: string;
    className?: string;
}

export default function DecisionPromptCard({
    question,
    options = ["Approve", "Reject", "Defer"],
    requester = "System",
    timestamp = "Just now",
    className = "",
}: DecisionPromptCardProps) {
    return (
        <div
            className={`rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 ${className}`}
        >
            <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                <span>Decision needed</span>
                <span>·</span>
                <span>{requester}</span>
                <span>·</span>
                <span>{timestamp}</span>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-primary)]">{question}</p>
            <div className="mt-3 flex gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)]"
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}
