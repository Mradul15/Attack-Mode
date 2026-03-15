"use client";

import { useState } from "react";
import type { TaskInstance, TaskStatus, User } from "@/lib/types";
import { useMe } from "@/lib/auth/auth-context";
import UserChip from "@/app/components/core/UserChip";

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

interface TaskBoardProps {
    tasks: TaskInstance[];
    incidentId: string;
    userMap: Record<string, User>;
    onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
    className?: string;
}

const columns: { key: TaskStatus; label: string; color: string }[] = [
    { key: "TODO", label: "Not Started", color: "text-zinc-400" },
    { key: "IN_PROGRESS", label: "In Progress", color: "text-blue-400" },
    { key: "SKIPPED", label: "Blocked", color: "text-red-400" },
    { key: "DONE", label: "Done", color: "text-green-400" },
];

function TaskCard({
    task,
    userMap,
    canEdit,
    onStatusChange,
    onAssigneeChange,
}: {
    task: TaskInstance;
    userMap: Record<string, User>;
    canEdit: boolean;
    onStatusChange: (taskId: string, status: TaskStatus) => void;
    onAssigneeChange: (taskId: string, assigneeId: string) => void;
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [showAssignee, setShowAssignee] = useState(false);

    return (
        <div className="interactive-card group rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-3">
            <p className="text-sm font-medium text-[var(--color-text-primary)] leading-snug">{task.title}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
                <div className="relative">
                    <button
                        onClick={() => canEdit && setShowAssignee(!showAssignee)}
                        className={canEdit ? "cursor-pointer" : "cursor-default"}
                    >
                        <UserChip name={getUserName(userMap, task.assignee_id)} size="sm" />
                    </button>
                    {showAssignee && canEdit && (
                        <div className="absolute left-0 top-full z-20 mt-1 w-44 glass-elevated rounded-lg py-1">
                            {Object.values(userMap).map((u) => (
                                <button
                                    key={u.user_id}
                                    onClick={() => {
                                        onAssigneeChange(task.task_id, u.user_id);
                                        setShowAssignee(false);
                                    }}
                                    className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-[var(--color-bg-hover)] ${u.user_id === task.assignee_id ? "text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"
                                        }`}
                                >
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-bg-active)] text-[10px] font-semibold">
                                        {u.name.split(" ").map((n) => n[0]).join("")}
                                    </span>
                                    {u.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {task.due_in_minutes && (
                        <span className="text-[10px] text-orange-400 font-medium">{task.due_in_minutes}m</span>
                    )}
                    {canEdit && (
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex h-6 w-6 items-center justify-center rounded text-[var(--color-text-muted)] opacity-0 transition-all group-hover:opacity-100 hover:bg-[var(--color-bg-hover)]"
                            >
                                ⋮
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-full z-20 mt-1 w-36 glass-elevated rounded-lg py-1">
                                    {columns.map((col) => (
                                        <button
                                            key={col.key}
                                            onClick={() => {
                                                onStatusChange(task.task_id, col.key);
                                                setShowMenu(false);
                                            }}
                                            className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs transition-colors ${col.key === task.status
                                                ? "text-[var(--color-accent)] bg-[var(--color-accent)]/5"
                                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                                                }`}
                                        >
                                            <span className={`h-1.5 w-1.5 rounded-full ${col.color.replace("text-", "bg-")}`} />
                                            {col.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function TaskBoard({ tasks, incidentId: _incidentId, userMap, onUpdateTaskStatus, className = "" }: TaskBoardProps) {
    const { user, can } = useMe();
    const canEditAll = can("task.update");
    const canEditAssigned = can("task.update_assigned");

    function canEditTask(task: TaskInstance): boolean {
        if (canEditAll) return true;
        if (canEditAssigned && task.assignee_id === user.user_id) return true;
        return false;
    }

    async function handleStatusChange(taskId: string, newStatus: TaskStatus) {
        onUpdateTaskStatus(taskId, newStatus);
    }

    async function handleAssigneeChange(_taskId: string, _assigneeId: string) {
        // TODO: Wire assignee change through service layer when needed
    }

    return (
        <div className={className}>
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Task Board</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 stagger-children">
                {columns.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.key);
                    return (
                        <div
                            key={col.key}
                            className="flex w-60 shrink-0 flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3"
                        >
                            <div className="flex items-center justify-between px-1 mb-1">
                                <h3 className={`text-xs font-semibold uppercase tracking-wider ${col.color}`}>{col.label}</h3>
                                <span className="rounded-full bg-[var(--color-bg-active)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
                                    {colTasks.length}
                                </span>
                            </div>
                            {colTasks.length === 0 && (
                                <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                                    No tasks
                                </div>
                            )}
                            {colTasks.map((task) => (
                                <TaskCard
                                    key={task.task_id}
                                    task={task}
                                    userMap={userMap}
                                    canEdit={canEditTask(task)}
                                    onStatusChange={handleStatusChange}
                                    onAssigneeChange={handleAssigneeChange}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
