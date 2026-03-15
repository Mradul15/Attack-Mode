"use client";

import { useEffect, useState, useCallback } from "react";
import { use } from "react";
import Link from "next/link";
import { getRunbook } from "@/lib/api/runbooks";
import type { RunbookTemplate, RunbookTask, Role } from "@/lib/types";
import { getUserName } from "@/lib/api/users";
import StatusPill from "@/app/components/core/StatusPill";
import PermissionGate from "@/app/components/global/PermissionGate";

const roleColors: Record<Role, string> = {
    Admin: "text-red-400 bg-red-500/10 border-red-500/20",
    IC: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    Responder: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    Observer: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
    "Legal/Comms": "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const statusMap: Record<string, string> = {
    PUBLISHED: "published",
    DRAFT: "draft",
    ARCHIVED: "closed",
};

function getPhase(index: number, total: number): string {
    if (total <= 2) return index === 0 ? "Containment" : "Recovery";
    const ratio = index / total;
    if (ratio < 0.2) return "Identification";
    if (ratio < 0.5) return "Containment";
    if (ratio < 0.7) return "Eradication";
    if (ratio < 0.9) return "Recovery";
    return "Post-Incident";
}

function TaskRow({ task, index, total, isEditing, onMoveUp, onMoveDown }: {
    task: RunbookTask;
    index: number;
    total: number;
    isEditing: boolean;
    onMoveUp: () => void;
    onMoveDown: () => void;
}) {
    const phase = getPhase(index, total);

    return (
        <div className="group flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-4 transition-all hover:border-[var(--color-bg-active)] hover:shadow-[var(--shadow-sm)]">
            {isEditing && (
                <div className="flex flex-col gap-0.5 pt-1">
                    <button
                        onClick={onMoveUp}
                        disabled={index === 0}
                        className="flex h-5 w-5 items-center justify-center rounded text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-30"
                    >
                        ▲
                    </button>
                    <button
                        onClick={onMoveDown}
                        disabled={index === total - 1}
                        className="flex h-5 w-5 items-center justify-center rounded text-xs text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] disabled:opacity-30"
                    >
                        ▼
                    </button>
                </div>
            )}

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-bg-active)] text-xs font-semibold text-[var(--color-text-muted)]">
                {index + 1}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text-primary)]">{task.title}</p>
                {task.description && (
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">{task.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${roleColors[task.owner_role]}`}>
                        {task.owner_role}
                    </span>
                    {task.due_in_minutes != null && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
                            ⏱ {task.due_in_minutes}m
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-active)] px-2 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                        {phase}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function RunbookDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [runbook, setRunbook] = useState<RunbookTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [tasks, setTasks] = useState<RunbookTask[]>([]);

    useEffect(() => {
        getRunbook(id).then((res) => {
            if (res) {
                setRunbook(res.data);
                setTasks(res.data.tasks);
            }
            setLoading(false);
        });
    }, [id]);

    const moveTask = useCallback((from: number, direction: "up" | "down") => {
        const to = direction === "up" ? from - 1 : from + 1;
        if (to < 0 || to >= tasks.length) return;
        const updated = [...tasks];
        [updated[from], updated[to]] = [updated[to], updated[from]];
        updated.forEach((t, i) => (t.order = i + 1));
        setTasks(updated);
    }, [tasks]);

    if (loading) {
        return (
            <div className="mx-auto max-w-4xl space-y-4">
                <div className="skeleton skeleton-heading" />
                <div className="skeleton" style={{ height: 40 }} />
                <div className="space-y-3 stagger-children">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton skeleton-card" />
                    ))}
                </div>
            </div>
        );
    }

    if (!runbook) {
        return (
            <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-[var(--color-text-muted)]">Runbook not found</p>
            </div>
        );
    }

    const isDraft = runbook.status === "DRAFT";

    return (
        <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-3">
                        <Link
                            href="/runbooks"
                            className="text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                        >
                            ← Runbooks
                        </Link>
                        <span className="text-xs text-[var(--color-text-muted)]">/</span>
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">{runbook.runbook_id}</span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        {runbook.name}
                    </h1>
                    {runbook.description && (
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{runbook.description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <StatusPill status={statusMap[runbook.status] as "published" | "draft" | "closed"} />
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">v{runbook.version}</span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                            {runbook.category.replace(/_/g, " ")}
                        </span>
                        <span className="text-xs text-[var(--color-text-muted)]">
                            by {getUserName(runbook.author_id)}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <PermissionGate permission="runbook.diff">
                        <Link
                            href={`/runbooks/${id}/diff`}
                            className="btn-secondary text-xs"
                        >
                            Version History
                        </Link>
                    </PermissionGate>
                    <PermissionGate permission="runbook.edit">
                        {isDraft && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={isEditing ? "btn-primary text-xs" : "btn-secondary text-xs"}
                            >
                                {isEditing ? "Done Editing" : "Edit Draft"}
                            </button>
                        )}
                    </PermissionGate>
                    {!isDraft && (
                        <div className="rounded-md border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-xs text-green-400">
                            Published — read only
                        </div>
                    )}
                </div>
            </div>

            {/* Immutability notice for published runbooks */}
            {!isDraft && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 animate-fade-in">
                    <span className="text-sm">🔒</span>
                    <div>
                        <p className="text-sm font-medium text-blue-400">Published runbooks are immutable</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            To make changes, create a new version. Active incidents using this runbook will not be affected.
                        </p>
                    </div>
                    <PermissionGate permission="runbook.edit">
                        <button className="btn-secondary ml-auto shrink-0 text-xs">
                            Create v{(parseFloat(runbook.version) + 1).toFixed(1)}
                        </button>
                    </PermissionGate>
                </div>
            )}

            {/* Stats row */}
            <div className="mb-6 grid grid-cols-4 gap-3">
                {[
                    { label: "Tasks", value: tasks.length, color: "text-[var(--color-text-primary)]" },
                    { label: "Roles Involved", value: [...new Set(tasks.map((t) => t.owner_role))].length, color: "text-blue-400" },
                    { label: "Est. Duration", value: `${tasks.reduce((sum, t) => sum + (t.due_in_minutes ?? 0), 0)}m`, color: "text-orange-400" },
                    { label: "Version", value: `v${runbook.version}`, color: "text-[var(--color-text-muted)]" },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 text-center">
                        <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="mt-1 text-xs text-[var(--color-text-muted)]">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Task list */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Response Steps
                </h2>
                {isEditing && (
                    <button className="btn-ghost text-xs text-[var(--color-accent)]">
                        + Add Step
                    </button>
                )}
            </div>

            <div className="space-y-2 stagger-children">
                {tasks
                    .sort((a, b) => a.order - b.order)
                    .map((task, i) => (
                        <TaskRow
                            key={task.task_id}
                            task={task}
                            index={i}
                            total={tasks.length}
                            isEditing={isEditing}
                            onMoveUp={() => moveTask(i, "up")}
                            onMoveDown={() => moveTask(i, "down")}
                        />
                    ))}
            </div>

            {/* Role summary */}
            <div className="mt-8">
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Role Assignment Summary</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {(["Admin", "IC", "Responder", "Observer", "Legal/Comms"] as Role[]).map((role) => {
                        const count = tasks.filter((t) => t.owner_role === role).length;
                        if (count === 0) return null;
                        return (
                            <div key={role} className={`rounded-xl border p-3 text-center ${roleColors[role]}`}>
                                <div className="text-lg font-bold">{count}</div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider">{role}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
