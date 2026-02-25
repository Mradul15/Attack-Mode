interface ApprovalPolicyPanelProps {
    className?: string;
}

const mockPolicies = [
    { id: "1", step: "Deploy hotfix", approvers: "Tech Lead + SRE Manager", required: 2 },
    { id: "2", step: "Customer notification", approvers: "Communications Lead", required: 1 },
    { id: "3", step: "Break glass access", approvers: "Security Team", required: 1 },
];

export default function ApprovalPolicyPanel({ className = "" }: ApprovalPolicyPanelProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Approval Policies</h3>
                <button className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
                    + Add Policy
                </button>
            </div>
            <div className="space-y-2">
                {mockPolicies.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2.5">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{p.step}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{p.approvers}</p>
                        </div>
                        <span className="rounded bg-[var(--color-bg-active)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                            {p.required} required
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
