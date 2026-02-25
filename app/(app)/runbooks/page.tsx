import FiltersBar from "@/app/components/page/incidents/FiltersBar";
import StatusPill from "@/app/components/core/StatusPill";

const mockRunbooks = [
    { id: "RB-001", title: "Database Failover Procedure", status: "published" as const, tasks: 8, lastUpdated: "Jan 15, 2024", author: "Alice Chen" },
    { id: "RB-002", title: "API Gateway Rollback", status: "published" as const, tasks: 5, lastUpdated: "Jan 10, 2024", author: "Bob Park" },
    { id: "RB-003", title: "CDN Cache Purge", status: "draft" as const, tasks: 3, lastUpdated: "Jan 8, 2024", author: "Carol Wu" },
    { id: "RB-004", title: "Auth Service Recovery", status: "published" as const, tasks: 12, lastUpdated: "Dec 20, 2023", author: "Dev Team" },
    { id: "RB-005", title: "Full Region Failover", status: "draft" as const, tasks: 15, lastUpdated: "Dec 15, 2023", author: "SRE Team" },
];

const runbookFilters = [
    { label: "Status", options: ["All", "Published", "Draft"] },
    { label: "Category", options: ["All", "Database", "Networking", "Security", "General"] },
];

export default function RunbooksPage() {
    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Runbooks</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Manage incident response playbooks and procedures.
                    </p>
                </div>
                <a
                    href="/runbooks/create"
                    className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)]"
                >
                    Create Runbook
                </a>
            </div>

            <div className="mb-4">
                <FiltersBar filters={runbookFilters} />
            </div>

            <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Runbook</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Tasks</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Author</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockRunbooks.map((rb) => (
                            <tr key={rb.id} className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)] cursor-pointer">
                                <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{rb.id}</td>
                                <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{rb.title}</td>
                                <td className="px-4 py-3"><StatusPill status={rb.status} /></td>
                                <td className="px-4 py-3 text-[var(--color-text-muted)]">{rb.tasks} tasks</td>
                                <td className="px-4 py-3 text-[var(--color-text-secondary)]">{rb.author}</td>
                                <td className="px-4 py-3 text-right text-xs text-[var(--color-text-muted)]">{rb.lastUpdated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
