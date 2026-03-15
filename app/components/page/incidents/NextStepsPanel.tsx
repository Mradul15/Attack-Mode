"use client";

import type { TaskInstance, User } from "@/lib/types";
import { useMe } from "@/lib/auth/auth-context";

interface NextStepsPanelProps {
    tasks: TaskInstance[];
    userMap: Record<string, User>;
    onStartTask: (taskId: string) => void;
    onCompleteTask: (taskId: string) => void;
    className?: string;
}

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

/**
 * Shows the top 3-5 next tasks computed from the task list:
 * IN_PROGRESS first, then TODO sorted by nearest due_in_minutes.
 * Provides "Start" and "Mark Done" action buttons (RBAC-gated).
 */
export default function NextStepsPanel({
    tasks,
    userMap,
    onStartTask,
    onCompleteTask,
    className = "",
}: NextStepsPanelProps) {
    const { user, can } = useMe();
    const canEditAll = can("task.update");
    const canEditAssigned = can("task.update_assigned");

    function canEdit(task: TaskInstance): boolean {
        if (canEditAll) return true;
        if (canEditAssigned && task.assignee_id === user.user_id) return true;
        return false;
    }



    const nextTasks = tasks
        .filter((t) => t.status === "TODO" || t.status === "IN_PROGRESS")
        .sort((a, b) => {
            if (a.status === "IN_PROGRESS" && b.status !== "IN_PROGRESS") return -1;
            if (b.status === "IN_PROGRESS" && a.status !== "IN_PROGRESS") return 1;
            return (a.due_in_minutes ?? 999) - (b.due_in_minutes ?? 999);
        })
        .slice(0, 5);

    if (nextTasks.length === 0) {
        return (
            <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Next Steps</h3>
                <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    All tasks completed 🎉
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Next Steps</h3>
            <div className="space-y-2">
                {nextTasks.map((task, i) => {
                    const isCurrent = i === 0;
                    const editable = canEdit(task);
                    return (
                        <div
                            key={task.task_id}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${isCurrent
                                ? "border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5"
                                : ""
                                }`}
                        >
                            <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${task.status === "IN_PROGRESS"
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]"
                                    : "border-[var(--color-border)] text-[var(--color-text-muted)]"
                                    }`}
                            >
                                {task.status === "IN_PROGRESS" ? "▶" : i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span
                                    className={
                                        isCurrent
                                            ? "font-medium text-[var(--color-text-primary)]"
                                            : "text-[var(--color-text-secondary)]"
                                    }
                                >
                                    {task.title}
                                </span>
                                <div className="mt-0.5 flex items-center gap-2">
                                    <span className="text-[10px] text-[var(--color-text-muted)]">
                                        {getUserName(userMap, task.assignee_id)}
                                    </span>
                                    {task.due_in_minutes != null && (
                                        <span className="text-[10px] text-orange-400">
                                            {task.due_in_minutes}m
                                        </span>
                                    )}
                                </div>
                            </div>
                            {editable && (
                                <div className="flex shrink-0 gap-1">
                                    {task.status === "TODO" && (
                                        <button
                                            onClick={() => onStartTask(task.task_id)}
                                            className="rounded-md bg-[var(--color-accent)]/15 px-2 py-1 text-[10px] font-semibold text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)]/25"
                                            title="Start this task"
                                        >
                                            Start
                                        </button>
                                    )}
                                    {task.status === "IN_PROGRESS" && (
                                        <button
                                            onClick={() => onCompleteTask(task.task_id)}
                                            className="rounded-md bg-green-500/15 px-2 py-1 text-[10px] font-semibold text-green-400 transition-colors hover:bg-green-500/25"
                                            title="Mark as done"
                                        >
                                            Done
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
