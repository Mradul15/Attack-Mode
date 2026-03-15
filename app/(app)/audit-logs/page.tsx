"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAuditLogs } from "@/lib/api/audit-logs";
import type { AuditLog } from "@/lib/types";
import { useMe } from "@/lib/auth/auth-context";
import ExportMenu from "@/app/components/core/ExportMenu";

export default function AuditLogsPage() {
    const { can, role } = useMe();
    const [logs, setLogs] = useState<AuditLog[] | null>(null);
    const [search, setSearch] = useState("");

    const hasAccess = can("audit.view");
    const loading = hasAccess && logs === null;

    useEffect(() => {
        if (!hasAccess) return;

        let cancelled = false;
        getAuditLogs(search ? { q: search } : undefined).then((res) => {
            if (!cancelled) {
                setLogs(res.data);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [search, hasAccess]);

    if (!hasAccess) {
        return (
            <div className="flex h-80 flex-col items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">🔒</div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Access Denied</h2>
                <p className="max-w-sm text-center text-sm text-[var(--color-text-muted)]">
                    Audit logs are restricted to Admin users. Your current role is <strong className="text-[var(--color-text-secondary)]">{role}</strong>.
                </p>
                <Link href="/" className="btn-secondary text-sm">
                    Return to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Audit Logs</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Complete audit trail of actions across your organization.
                    </p>
                </div>
                <ExportMenu formats={["CSV", "JSON", "PDF"]} />
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search audit logs..."
                    className="input flex-1 min-w-[200px] max-w-sm text-sm"
                    onChange={(e) => {
                        setLogs(null);
                        setSearch(e.target.value);
                    }}
                    aria-label="Search audit logs"
                />
                <select className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none" aria-label="Date range">
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                </select>
            </div>

            {loading ? (
                <div className="space-y-3 stagger-children">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton h-12 rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                    <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                        <div className="flex items-center gap-6 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                            <span className="w-40 shrink-0">Action</span>
                            <span className="w-36 shrink-0">Actor</span>
                            <span className="flex-1">Target</span>
                            <span className="w-28 shrink-0">IP</span>
                            <span className="w-36 shrink-0 text-right">Timestamp</span>
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-root)]">
                        {(logs ?? []).map((log) => (
                            <div
                                key={log.log_id}
                                className="flex items-center gap-6 border-b border-[var(--color-border)] px-4 py-3 text-sm transition-colors hover:bg-[var(--color-bg-hover)] cursor-pointer"
                            >
                                <span className="w-40 shrink-0 font-medium text-[var(--color-text-primary)]">{log.action}</span>
                                <span className="w-36 shrink-0 text-[var(--color-text-secondary)]">{log.actor_email}</span>
                                <span className="flex-1 truncate text-[var(--color-text-muted)]">{log.target}</span>
                                <span className="w-28 shrink-0 font-mono text-xs text-[var(--color-text-muted)]">{log.ip_address}</span>
                                <span className="w-36 shrink-0 text-right text-xs text-[var(--color-text-muted)]">
                                    {new Date(log.created_at).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5">
                        <span className="text-xs text-[var(--color-text-muted)]">Showing {(logs ?? []).length} entries</span>
                    </div>
                </div>
            )}
        </div>
    );
}
