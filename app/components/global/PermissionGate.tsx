"use client";

import { type ReactNode } from "react";
import type { Permission } from "@/lib/types";
import { usePermission } from "@/lib/auth/auth-context";

interface PermissionGateProps {
    /** The permission string to check, e.g. "incident.create" */
    permission: Permission;
    children: ReactNode;
    /** Optional fallback to render when denied */
    fallback?: ReactNode;
    /** Tooltip shown on disabled overlay */
    tooltip?: string;
}

/**
 * Renders children only if the current user has the required permission.
 * Otherwise shows a disabled overlay with tooltip, or the optional fallback.
 */
export default function PermissionGate({
    permission,
    children,
    fallback,
    tooltip = "You don't have permission to perform this action",
}: PermissionGateProps) {
    const allowed = usePermission(permission);

    if (allowed) return <>{children}</>;

    if (fallback) return <>{fallback}</>;

    return (
        <div className="relative cursor-not-allowed" title={tooltip}>
            <div className="pointer-events-none opacity-40" aria-disabled="true">
                {children}
            </div>
        </div>
    );
}
