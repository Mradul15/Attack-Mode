import ApprovalRequestCard from "@/app/components/core/ApprovalRequestCard";

interface ApprovalsQueueProps {
    className?: string;
}

const mockApprovals = [
    { title: "Deploy hotfix to production", requester: "Bob Park", status: "pending" as const, timestamp: "3m ago" },
    { title: "Grant break-glass access to DB", requester: "Alice Chen", status: "pending" as const, timestamp: "10m ago" },
    { title: "Scale up API replicas to 20", requester: "SRE Bot", status: "approved" as const, timestamp: "25m ago" },
];

export default function ApprovalsQueue({ className = "" }: ApprovalsQueueProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Approvals</h3>
                <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
                    {mockApprovals.filter((a) => a.status === "pending").length} pending
                </span>
            </div>
            <div className="space-y-3">
                {mockApprovals.map((a, i) => (
                    <ApprovalRequestCard key={i} {...a} />
                ))}
            </div>
        </div>
    );
}
