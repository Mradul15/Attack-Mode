import DecisionPromptCard from "@/app/components/core/DecisionPromptCard";

interface DecisionsPanelProps {
    className?: string;
}

const mockDecisions = [
    { question: "Should we failover to the secondary region?", requester: "Alice Chen", timestamp: "5m ago" },
    { question: "Approve customer notification draft?", requester: "Carol Wu", timestamp: "12m ago", options: ["Approve & Send", "Request Changes", "Defer"] },
];

export default function DecisionsPanel({ className = "" }: DecisionsPanelProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Decisions</h3>
                <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-400">
                    {mockDecisions.length} pending
                </span>
            </div>
            <div className="space-y-3">
                {mockDecisions.map((d, i) => (
                    <DecisionPromptCard key={i} {...d} />
                ))}
            </div>
        </div>
    );
}
