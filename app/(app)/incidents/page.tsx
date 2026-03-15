"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getIncidents, type IncidentFilters } from "@/lib/api/incidents";
import type { Incident } from "@/lib/types";
import { getUserName } from "@/lib/api/users";
import PermissionGate from "@/app/components/global/PermissionGate";
import SeverityBadge from "@/app/components/core/SeverityBadge";
import StatusPill from "@/app/components/core/StatusPill";

const statusMap: Record<string, string> = {
    ACTIVE: "active",
    INVESTIGATING: "investigating",
    MONITORING: "monitoring",
    RESOLVED: "resolved",
    CLOSED: "closed",
};

export default function IncidentsPage() {
    const router = useRouter();
    const [incidents, setIncidents] = useState<Incident[] | null>(null);
    const [filters, setFilters] = useState<IncidentFilters>({});
    const loading = incidents === null;

    useEffect(() => {
        let cancelled = false;
        getIncidents(filters).then((res) => {
            if (!cancelled) {
                setIncidents(res.data);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [filters]);

    return (
        <div className="max-w-[1400px]">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Incidents</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        View and manage all incidents across your organization.
                    </p>
                </div>
                <PermissionGate permission="incident.create">
                    <Link href="/incidents/create" className="btn-primary text-sm" aria-label="Create a new incident">
                        Create Incident
                    </Link>
                </PermissionGate>
            </div>

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Search incidents..."
                    className="input flex-1 max-w-sm text-sm"
                    onChange={(e) => {
                        setIncidents(null);
                        setFilters((f) => ({ ...f, q: e.target.value }));
                    }}
                    aria-label="Search incidents by title or ID"
                />
                <select
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-accent)]"
                    onChange={(e) => {
                        setIncidents(null);
                        setFilters((f) => ({ ...f, status: e.target.value }));
                    }}
                    aria-label="Filter by status"
                >
                    <option value="">Status: All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INVESTIGATING">Investigating</option>
                    <option value="MONITORING">Monitoring</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                </select>
                <select
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-raised)] px-3 py-2 text-sm text-[var(--color-text-secondary)] outline-none focus:border-[var(--color-accent)]"
                    onChange={(e) => {
                        setIncidents(null);
                        setFilters((f) => ({ ...f, severity: e.target.value }));
                    }}
                    aria-label="Filter by severity"
                >
                    <option value="">Severity: All</option>
                    <option value="S0">S0 · Critical</option>
                    <option value="S1">S1 · High</option>
                    <option value="S2">S2 · Medium</option>
                    <option value="S3">S3 · Low</option>
                    <option value="S4">S4 · Info</option>
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className="space-y-3 stagger-children">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="skeleton h-14 rounded-xl" />
                    ))}
                </div>
            ) : (incidents ?? []).length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                    <span className="text-2xl">🔍</span>
                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">No incidents found</p>
                    <p className="text-xs text-[var(--color-text-muted)]">Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                    <table className="w-full text-sm" role="grid" aria-label="Incidents list">
                        <thead>
                            <tr className="sticky top-0 border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Incident</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Severity</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Commander</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(incidents ?? []).map((inc) => (
                                <tr
                                    key={inc.incident_id}
                                    className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)] cursor-pointer focus-within:bg-[var(--color-bg-hover)] outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-accent)]/40"
                                    tabIndex={0}
                                    role="row"
                                    aria-label={`${inc.title} — ${inc.severity}, ${inc.status}`}
                                    onClick={() => router.push(`/incidents/${inc.incident_id}`)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            router.push(`/incidents/${inc.incident_id}`);
                                        }
                                    }}
                                >
                                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">{inc.incident_id}</td>
                                    <td className="px-4 py-3 font-medium text-[var(--color-text-primary)]">{inc.title}</td>
                                    <td className="px-4 py-3"><SeverityBadge severity={inc.severity} /></td>
                                    <td className="px-4 py-3"><StatusPill status={statusMap[inc.status] as "active" | "investigating" | "monitoring" | "resolved" | "closed"} /></td>
                                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{getUserName(inc.ic_user_id)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-xs text-[var(--color-text-muted)]">{inc.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg-surface)] px-4 py-2.5">
                        <span className="text-xs text-[var(--color-text-muted)]">Showing {(incidents ?? []).length} incidents</span>
                    </div>
                </div>
            )}
        </div>
    );
}
