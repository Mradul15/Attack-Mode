"use client";

import { useState } from "react";
import type { Approval, ApprovalStatus, User } from "@/lib/types";
import { useMe } from "@/lib/auth/auth-context";

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

interface ApprovalsQueueProps {
    approvals: Approval[];
    userMap: Record<string, User>;
    onApprove: (approvalId: string, reason?: string) => void;
    onDeny: (approvalId: string, reason?: string) => void;
    className?: string;
}

const statusStyles: Record<ApprovalStatus, string> = {
    PENDING: "text-yellow-400 bg-yellow-500/10",
    APPROVED: "text-green-400 bg-green-500/10",
    DENIED: "text-red-400 bg-red-500/10",
};

function ApprovalCard({
    approval,
    userMap,
    canApprove,
    onApproveAction,
    onDenyAction,
}: {
    approval: Approval;
    userMap: Record<string, User>;
    canApprove: boolean;
    onApproveAction: (id: string, reason: string) => void;
    onDenyAction: (id: string, reason: string) => void;
}) {
    const [showReason, setShowReason] = useState<"approve" | "deny" | null>(null);
    const [reason, setReason] = useState("");

    function handleSubmit(action: "approve" | "deny") {
        if (action === "approve") {
            onApproveAction(approval.approval_id, reason);
        } else {
            onDenyAction(approval.approval_id, reason);
        }
        setShowReason(null);
        setReason("");
    }

    return (
        <div className="interactive-card rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{approval.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                        Requested by {getUserName(userMap, approval.requester_id)} · {new Date(approval.created_at).toLocaleTimeString()}
                    </p>
                </div>
                <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[approval.status]}`}
                >
                    {approval.status.toLowerCase()}
                </span>
            </div>

            {approval.status === "PENDING" && canApprove && !showReason && (
                <div className="mt-2.5 flex gap-2">
                    <button
                        onClick={() => setShowReason("approve")}
                        className="btn-primary text-xs !bg-green-500/90 hover:!bg-green-500"
                    >
                        Approve
                    </button>
                    <button onClick={() => setShowReason("deny")} className="btn-secondary text-xs">
                        Deny
                    </button>
                </div>
            )}

            {approval.status === "PENDING" && canApprove && showReason && (
                <div className="mt-2.5 space-y-2">
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={`Reason for ${showReason} (optional)...`}
                        className="input text-xs"
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleSubmit(showReason)}
                            className={`btn-primary text-xs ${showReason === "approve"
                                ? "!bg-green-500/90 hover:!bg-green-500"
                                : "!bg-red-500/90 hover:!bg-red-500"
                                }`}
                        >
                            Confirm {showReason === "approve" ? "Approval" : "Denial"}
                        </button>
                        <button
                            onClick={() => { setShowReason(null); setReason(""); }}
                            className="btn-ghost text-xs"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {approval.status === "PENDING" && !canApprove && (
                <p className="mt-2 text-xs text-[var(--color-text-muted)] italic">
                    Awaiting approval from authorized personnel
                </p>
            )}
        </div>
    );
}

export default function ApprovalsQueue({
    approvals,
    userMap,
    onApprove,
    onDeny,
    className = "",
}: ApprovalsQueueProps) {
    const { can } = useMe();
    const canApprovePerm = can("approval.approve");
    const pending = approvals.filter((a) => a.status === "PENDING").length;

    function handleApprove(approvalId: string, reason: string) {
        onApprove(approvalId, reason || undefined);
    }

    function handleDeny(approvalId: string, reason: string) {
        onDeny(approvalId, reason || undefined);
    }

    if (approvals.length === 0) {
        return (
            <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Approvals</h3>
                <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    No approval requests
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Approvals</h3>
                {pending > 0 && (
                    <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400">
                        {pending} pending
                    </span>
                )}
            </div>
            <div className="space-y-3 stagger-children">
                {approvals.map((a) => (
                    <ApprovalCard
                        key={a.approval_id}
                        approval={a}
                        userMap={userMap}
                        canApprove={canApprovePerm}
                        onApproveAction={handleApprove}
                        onDenyAction={handleDeny}
                    />
                ))}
            </div>
        </div>
    );
}
