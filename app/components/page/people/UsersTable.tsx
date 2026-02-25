import StatusPill from "@/app/components/core/StatusPill";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: "active" | "draft";
    lastSeen: string;
}

interface UsersTableProps {
    users?: User[];
    className?: string;
}

const mockUsers: User[] = [
    { id: "1", name: "Alice Chen", email: "alice@acme.com", role: "Admin", status: "active", lastSeen: "Now" },
    { id: "2", name: "Bob Park", email: "bob@acme.com", role: "Responder", status: "active", lastSeen: "5m ago" },
    { id: "3", name: "Carol Wu", email: "carol@acme.com", role: "Viewer", status: "active", lastSeen: "1h ago" },
    { id: "4", name: "Dan Kim", email: "dan@acme.com", role: "Responder", status: "active", lastSeen: "3h ago" },
    { id: "5", name: "Eve Robinson", email: "eve@acme.com", role: "Viewer", status: "draft", lastSeen: "Never" },
];

export default function UsersTable({
    users = mockUsers,
    className = "",
}: UsersTableProps) {
    return (
        <div className={`overflow-hidden rounded-xl border border-[var(--color-border)] ${className}`}>
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">User</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Last Seen</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)]">
                            <td className="px-4 py-3">
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">{user.name}</p>
                                    <p className="text-xs text-[var(--color-text-muted)]">{user.email}</p>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-[var(--color-text-secondary)]">{user.role}</td>
                            <td className="px-4 py-3"><StatusPill status={user.status} /></td>
                            <td className="px-4 py-3 text-right text-xs text-[var(--color-text-muted)]">{user.lastSeen}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
