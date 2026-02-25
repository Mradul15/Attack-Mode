interface DecisionTreeEditorProps {
    className?: string;
}

const mockNodes = [
    { id: "1", type: "question", label: "Is the primary database responsive?", yes: "2", no: "3" },
    { id: "2", type: "action", label: "Monitor and check replication lag" },
    { id: "3", type: "question", label: "Can we failover to secondary?", yes: "4", no: "5" },
    { id: "4", type: "action", label: "Execute failover procedure" },
    { id: "5", type: "escalation", label: "Escalate to CTO and page all DBAs" },
];

export default function DecisionTreeEditor({ className = "" }: DecisionTreeEditorProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Decision Tree</h3>
                <button className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
                    + Add Node
                </button>
            </div>
            <div className="space-y-2">
                {mockNodes.map((node) => (
                    <div key={node.id} className="flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2.5">
                        <span className={`mt-0.5 rounded px-1.5 py-0.5 text-xs font-semibold ${node.type === "question" ? "bg-blue-500/15 text-blue-400"
                                : node.type === "escalation" ? "bg-red-500/15 text-red-400"
                                    : "bg-green-500/15 text-green-400"
                            }`}>
                            {node.type === "question" ? "?" : node.type === "escalation" ? "!" : "→"}
                        </span>
                        <div className="flex-1">
                            <p className="text-sm text-[var(--color-text-primary)]">{node.label}</p>
                            {"yes" in node && (
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                                    Yes → Node {node.yes} · No → Node {node.no}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
