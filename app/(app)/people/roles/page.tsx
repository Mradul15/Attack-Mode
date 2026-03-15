"use client";

import { useState } from "react";
import type { Role, Permission } from "@/lib/types";
import { hasPermission } from "@/lib/auth/permissions";
import PermissionGate from "@/app/components/global/PermissionGate";

const roles: { role: Role; description: string; color: string; userCount: number }[] = [
    { role: "Admin", description: "Full system access, user management, break-glass", color: "text-red-400 border-red-500/20 bg-red-500/5", userCount: 2 },
    { role: "IC", description: "Incident commander — full incident lifecycle control", color: "text-orange-400 border-orange-500/20 bg-orange-500/5", userCount: 5 },
    { role: "Responder", description: "Execute tasks, add timeline entries, update assigned work", color: "text-blue-400 border-blue-500/20 bg-blue-500/5", userCount: 12 },
    { role: "Observer", description: "Read-only access to incidents and timelines", color: "text-zinc-400 border-zinc-500/20 bg-zinc-500/5", userCount: 8 },
    { role: "Legal/Comms", description: "Approve communications, view incidents, manage comms tasks", color: "text-purple-400 border-purple-500/20 bg-purple-500/5", userCount: 3 },
];

const permissionGroups: { group: string; permissions: Permission[] }[] = [
    {
        group: "Incidents",
        permissions: ["incident.view", "incident.create", "incident.edit", "incident.assign", "incident.close", "incident.export"],
    },
    {
        group: "Tasks",
        permissions: ["task.update", "task.update_assigned"],
    },
    {
        group: "Timeline",
        permissions: ["timeline.add", "timeline.view"],
    },
    {
        group: "Approvals",
        permissions: ["approval.request", "approval.approve", "approval.approve_comms"],
    },
    {
        group: "Runbooks",
        permissions: ["runbook.view", "runbook.create", "runbook.edit", "runbook.activate", "runbook.diff"],
    },
    {
        group: "Integrations",
        permissions: ["integration.view", "integration.configure"],
    },
    {
        group: "People & Admin",
        permissions: ["people.view", "people.manage_roles", "people.break_glass"],
    },
    {
        group: "Audit",
        permissions: ["audit.view", "audit.export"],
    },
];

export default function RolesPage() {
    const [selectedRole, setSelectedRole] = useState<Role>("Admin");
    const allRoles: Role[] = ["Admin", "IC", "Responder", "Observer", "Legal/Comms"];

    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Roles & Permissions</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Define roles and configure granular access controls.
                    </p>
                </div>
                <PermissionGate permission="people.manage_roles">
                    <button className="btn-primary text-sm">
                        + Create Role
                    </button>
                </PermissionGate>
            </div>

            {/* Role cards */}
            <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 stagger-children">
                {roles.map(({ role, description, color, userCount }) => (
                    <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-xl border p-4 text-left transition-all ${color} ${selectedRole === role
                            ? "ring-2 ring-[var(--color-accent)]/40 shadow-[var(--shadow-md)]"
                            : "hover:shadow-[var(--shadow-sm)]"
                            }`}
                    >
                        <p className="text-sm font-semibold">{role}</p>
                        <p className="mt-1 text-xs opacity-70">{description}</p>
                        <p className="mt-2 text-[10px] font-medium uppercase tracking-wider opacity-50">{userCount} users</p>
                    </button>
                ))}
            </div>

            {/* Full Permission Matrix */}
            <div>
                <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">Permission Matrix</h2>
                <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                                <th className="sticky left-0 z-10 bg-[var(--color-bg-surface)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                                    Permission
                                </th>
                                {allRoles.map((role) => (
                                    <th
                                        key={role}
                                        className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${selectedRole === role
                                            ? "text-[var(--color-accent)]"
                                            : "text-[var(--color-text-muted)]"
                                            }`}
                                    >
                                        {role}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {permissionGroups.map((group) => (
                                <>
                                    <tr key={group.group}>
                                        <td
                                            colSpan={allRoles.length + 1}
                                            className="border-t border-[var(--color-border)] bg-[var(--color-bg-hover)] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
                                        >
                                            {group.group}
                                        </td>
                                    </tr>
                                    {group.permissions.map((perm) => (
                                        <tr key={perm} className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)]">
                                            <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 font-mono text-xs text-[var(--color-text-secondary)]">
                                                {perm}
                                            </td>
                                            {allRoles.map((role) => {
                                                const has = hasPermission(role, perm);
                                                return (
                                                    <td key={role} className="px-4 py-2.5 text-center">
                                                        {has ? (
                                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/15 text-xs text-green-400">
                                                                ✓
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-bg-active)] text-xs text-[var(--color-text-muted)]">
                                                                —
                                                            </span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
