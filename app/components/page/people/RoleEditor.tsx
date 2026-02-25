interface RoleEditorProps {
    className?: string;
}

const mockRoles = [
    { id: "1", name: "Admin", description: "Full access to all features", userCount: 2, color: "text-red-400" },
    { id: "2", name: "Responder", description: "Can manage incidents and tasks", userCount: 8, color: "text-orange-400" },
    { id: "3", name: "Viewer", description: "Read-only access to incidents and reports", userCount: 15, color: "text-blue-400" },
];

export default function RoleEditor({ className = "" }: RoleEditorProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Roles</h3>
                <button className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]">
                    + Create Role
                </button>
            </div>
            <div className="space-y-2">
                {mockRoles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] px-4 py-3">
                        <div>
                            <p className={`text-sm font-semibold ${role.color}`}>{role.name}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{role.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[var(--color-text-muted)]">{role.userCount} users</span>
                            <button className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
