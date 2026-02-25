interface ApprovalRequestCardProps {
    title: string;
    requester?: string;
    status?: "pending" | "approved" | "rejected";
    timestamp?: string;
    className?: string;
}

const statusStyles = {
    pending: "text-yellow-400 bg-yellow-500/10",
    approved: "text-green-400 bg-green-500/10",
    rejected: "text-red-400 bg-red-500/10",
};

export default function ApprovalRequestCard({
    title,
    requester = "Unknown",
    status = "pending",
    timestamp = "Just now",
    className = "",
}: ApprovalRequestCardProps) {
    return (
        <div
            className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 ${className}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        Requested by {requester} · {timestamp}
                    </p>
                </div>
                <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status]}`}
                >
                    {status}
                </span>
            </div>
            {status === "pending" && (
                <div className="mt-3 flex gap-2">
                    <button className="rounded-md bg-green-500/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-500">
                        Approve
                    </button>
                    <button className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-hover)]">
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
}
