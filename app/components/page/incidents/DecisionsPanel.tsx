"use client";

import type { Decision, User } from "@/lib/types";
import { useMe } from "@/lib/auth/auth-context";

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

interface DecisionsPanelProps {
    decisions: Decision[];
    userMap: Record<string, User>;
    onRespondToDecision: (decisionId: string, response: string) => void;
    className?: string;
}

export default function DecisionsPanel({
    decisions,
    userMap,
    onRespondToDecision,
    className = "",
}: DecisionsPanelProps) {
    const { can } = useMe();
    const canDecide = can("approval.approve") || can("incident.edit");
    const pending = decisions.filter((d) => !d.response);
    const resolved = decisions.filter((d) => d.response);

    function handleRespond(decisionId: string, response: string) {
        onRespondToDecision(decisionId, response);
    }

    if (decisions.length === 0) {
        return (
            <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Decisions</h3>
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    No decisions pending
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Decisions</h3>
                {pending.length > 0 && (
                    <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-xs font-medium text-yellow-400">
                        {pending.length} pending
                    </span>
                )}
            </div>
            <div className="space-y-3 stagger-children">
                {pending.map((d) => (
                    <div key={d.decision_id} className="interactive-card rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{d.prompt}</p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                            Asked by {getUserName(userMap, d.requester_id)} · {new Date(d.created_at).toLocaleTimeString()}
                        </p>
                        {canDecide && (
                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                {d.options.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => handleRespond(d.decision_id, opt)}
                                        className="btn-secondary text-xs hover:!bg-[var(--color-accent)] hover:!text-white hover:!border-transparent"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {resolved.map((d) => (
                    <div key={d.decision_id} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3 opacity-70">
                        <p className="text-sm text-[var(--color-text-secondary)] line-through">{d.prompt}</p>
                        <p className="mt-1 text-xs text-green-400">
                            ✓ {d.response} — by {getUserName(userMap, d.responded_by ?? "")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
