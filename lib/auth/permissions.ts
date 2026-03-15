import type { Role, Permission } from "@/lib/types";

/**
 * Permission matrix derived from docs/RBAC.md
 * Maps each role to its granted permissions.
 */
export const permissionMatrix: Record<Role, Set<Permission>> = {
    Admin: new Set<Permission>([
        "incident.view", "incident.create", "incident.edit", "incident.assign",
        "incident.close", "incident.export",
        "task.update",
        "timeline.add", "timeline.view",
        "approval.request", "approval.approve",
        "runbook.view", "runbook.create", "runbook.edit", "runbook.activate", "runbook.diff",
        "integration.view", "integration.configure",
        "people.view", "people.manage_roles", "people.break_glass",
        "audit.view", "audit.export",
    ]),

    IC: new Set<Permission>([
        "incident.view", "incident.create", "incident.edit", "incident.assign",
        "incident.close", "incident.export",
        "task.update",
        "timeline.add", "timeline.view",
        "approval.request", "approval.approve",
        "runbook.view", "runbook.create", "runbook.edit", "runbook.activate", "runbook.diff",
        "integration.view",
        "people.view",
    ]),

    Responder: new Set<Permission>([
        "incident.view",
        "task.update_assigned",
        "timeline.add", "timeline.view",
        "approval.request",
        "runbook.view", "runbook.diff",
    ]),

    Observer: new Set<Permission>([
        "incident.view",
        "timeline.view",
        "runbook.view", "runbook.diff",
    ]),

    "Legal/Comms": new Set<Permission>([
        "incident.view",
        "timeline.view",
        "approval.approve_comms",
        "runbook.view",
    ]),
};

export function hasPermission(role: Role, permission: Permission): boolean {
    return permissionMatrix[role]?.has(permission) ?? false;
}

export function getPermissions(role: Role): Permission[] {
    return Array.from(permissionMatrix[role] ?? []);
}
