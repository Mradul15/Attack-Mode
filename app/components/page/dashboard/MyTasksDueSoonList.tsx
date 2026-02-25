const mockTasks = [
    { id: "1", title: "Review post-mortem for INC-098", dueIn: "30m", overdue: false },
    { id: "2", title: "Approve Slack channel archival", dueIn: "15m", overdue: true },
    { id: "3", title: "Update runbook: DB failover v3", dueIn: "2h", overdue: false },
    { id: "4", title: "Assign on-call for next rotation", dueIn: "1d", overdue: false },
];

interface MyTasksDueSoonListProps {
    className?: string;
}

export default function MyTasksDueSoonList({ className = "" }: MyTasksDueSoonListProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">My Tasks Due Soon</h3>
            <div className="space-y-2">
                {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2.5">
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-4 rounded border border-[var(--color-border)]" />
                            <span className="text-sm text-[var(--color-text-primary)]">{task.title}</span>
                        </div>
                        <span className={`text-xs font-medium ${task.overdue ? "text-red-400" : "text-[var(--color-text-muted)]"}`}>
                            {task.overdue ? `⏰ ${task.dueIn}` : task.dueIn}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
