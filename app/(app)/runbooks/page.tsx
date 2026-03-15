"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getRunbooks } from "@/lib/api/runbooks";
import type { RunbookTemplate } from "@/lib/types";
import { getUserName } from "@/lib/api/users";
import PermissionGate from "@/app/components/global/PermissionGate";
import StatusPill from "@/app/components/core/StatusPill";

const statusMap: Record<string, string> = {
    PUBLISHED: "published",
    DRAFT: "draft",
    ARCHIVED: "closed",
};

export default function RunbooksPage() {
    const [runbooks, setRunbooks] = useState<RunbookTemplate[] | null>(null);
    const [search, setSearch] = useState("");
    const loading = runbooks === null;

    useEffect(() => {
        let cancelled = false;
        getRunbooks(search ? { q: search } : undefined).then((res) => {
            if (!cancelled) {
                setRunbooks(res.data);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [search]);

    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Runbooks</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Manage incident response playbooks and procedures.
                    </p>
                </div>
                <PermissionGate permission="runbook.create">
                    <Link href="/runbooks/create" className="btn-primary text-sm">
                        Create Runbook
                    </Link>
                </PermissionGate>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search runbooks..."
                    className="input max-w-sm text-sm"
                    onChange={(e) => {
                        setRunbooks(null);
                        setSearch(e.target.value);
                    }}
                    aria-label="Search runbooks"
                />
            </div>

            {loading ? (
                <div className="space-y-3 stagger-children">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton h-14 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Runbook</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Version</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Tasks</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(runbooks ?? []).map((rb) => (
                                <tr key={rb.runbook_id} className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)] cursor-pointer">
                                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{rb.runbook_id}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-[var(--color-text-primary)]">{rb.name}</p>
                                        {rb.description && <p className="mt-0.5 text-xs text-[var(--color-text-muted)] truncate max-w-xs">{rb.description}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{rb.category.replace(/_/g, " ")}</td>
                                    <td className="px-4 py-3"><StatusPill status={statusMap[rb.status] as "published" | "draft" | "closed"} /></td>
                                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">v{rb.version}</td>
                                    <td className="px-4 py-3 text-[var(--color-text-muted)]">{rb.tasks.length}</td>
                                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{getUserName(rb.author_id)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5">
                        <span className="text-xs text-[var(--color-text-muted)]">Showing {(runbooks ?? []).length} runbooks</span>
                    </div>
                </div>
            )}
        </div>
    );
}
