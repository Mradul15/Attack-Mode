interface TaskEditorListProps {
    className?: string;
}

const mockTasks = [
    { id: "1", title: "Identify affected services", role: "Incident Commander", automatable: false },
    { id: "2", title: "Check monitoring dashboards", role: "SRE On-Call", automatable: true },
    { id: "3", title: "Isolate failing components", role: "Tech Lead", automatable: false },
    { id: "4", title: "Deploy hotfix or rollback", role: "Dev Team", automatable: true },
    { id: "5", title: "Verify service recovery", role: "SRE On-Call", automatable: true },
];

export default function TaskEditorList({ className = "" }: TaskEditorListProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Tasks</h3>
                <button className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
                    + Add Task
                </button>
            </div>
            <div className="space-y-2">
                {mockTasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-3 py-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--color-bg-active)] text-xs font-mono text-[var(--color-text-muted)]">{task.id}</span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{task.title}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">Assigned to: {task.role}</p>
                        </div>
                        {task.automatable && (
                            <span className="rounded bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">Auto</span>
                        )}
                        <button className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">⋮</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
