import SeverityBadge, { type Severity } from "./SeverityBadge";
import StatusPill, { type Status } from "./StatusPill";
import UserChip from "./UserChip";

export interface TaskCardProps {
    title: string;
    status: Status;
    severity?: Severity;
    assignee?: string;
    dueIn?: string;
    overdue?: boolean;
    className?: string;
}

export default function TaskCard({
    title,
    status,
    severity,
    assignee,
    dueIn,
    overdue = false,
    className = "",
}: TaskCardProps) {
    return (
        <div
            className={`rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 transition-colors hover:border-[var(--color-bg-active)] ${className}`}
        >
            <div className="flex items-start justify-between gap-3">
                <h4 className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">
                    {title}
                </h4>
                <StatusPill status={status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
                {severity && <SeverityBadge severity={severity} />}
                {assignee && <UserChip name={assignee} size="sm" />}
                {dueIn && (
                    <span
                        className={`text-xs font-medium ${overdue ? "text-red-400" : "text-[var(--color-text-muted)]"
                            }`}
                    >
                        {overdue ? `⏰ Overdue: ${dueIn}` : `Due: ${dueIn}`}
                    </span>
                )}
            </div>
        </div>
    );
}
