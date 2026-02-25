interface PermissionMatrixViewerProps {
    className?: string;
}

const permissions = ["View Incidents", "Create Incidents", "Manage Tasks", "Access Runbooks", "Edit Settings", "Manage Users"];
const roles = ["Admin", "Responder", "Viewer"];

const matrix: Record<string, Record<string, boolean>> = {
    Admin: { "View Incidents": true, "Create Incidents": true, "Manage Tasks": true, "Access Runbooks": true, "Edit Settings": true, "Manage Users": true },
    Responder: { "View Incidents": true, "Create Incidents": true, "Manage Tasks": true, "Access Runbooks": true, "Edit Settings": false, "Manage Users": false },
    Viewer: { "View Incidents": true, "Create Incidents": false, "Manage Tasks": false, "Access Runbooks": true, "Edit Settings": false, "Manage Users": false },
};

export default function PermissionMatrixViewer({ className = "" }: PermissionMatrixViewerProps) {
    return (
        <div className={`overflow-hidden rounded-xl border border-[var(--color-border)] ${className}`}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Permission</th>
                        {roles.map((role) => (
                            <th key={role} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{role}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {permissions.map((perm) => (
                        <tr key={perm} className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)]">
                            <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{perm}</td>
                            {roles.map((role) => (
                                <td key={role} className="px-4 py-2.5 text-center">
                                    {matrix[role][perm] ? (
                                        <span className="text-green-400">✓</span>
                                    ) : (
                                        <span className="text-[var(--color-text-muted)]">—</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
