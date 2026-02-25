import { ReactNode } from "react";

interface PermissionGateProps {
    allowed: boolean;
    children: ReactNode;
    fallback?: ReactNode;
    tooltip?: string;
}

export default function PermissionGate({
    allowed,
    children,
    fallback,
    tooltip = "You don't have permission to perform this action",
}: PermissionGateProps) {
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
