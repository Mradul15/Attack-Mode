"use client";

/**
 * Post-Incident Report — read-only structured summary.
 * Composes a credible incident report from the aggregate data
 * available through useIncidentContext().
 */

import { useMemo } from "react";
import Link from "next/link";
import { useIncidentContext } from "../incident-context";
import { composeReport, type ReportData } from "@/lib/domain/reportComposer";

// ── Section Components ───────────────────────────────────

function SectionHeader({ title, id }: { title: string; id: string }) {
    return (
        <h2
            id={id}
            className="mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-2 text-base font-bold tracking-wide text-[var(--color-text-primary)] uppercase"
        >
            {title}
        </h2>
    );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-baseline gap-3 py-1.5">
            <span className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                {label}
            </span>
            <span className="text-sm text-[var(--color-text-primary)]">{children}</span>
        </div>
    );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" | "muted" }) {
    const colors: Record<string, string> = {
        default: "border-[var(--color-border)] bg-[var(--color-bg-active)] text-[var(--color-text-secondary)]",
        success: "border-green-500/30 bg-green-500/10 text-green-400",
        warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        danger: "border-red-500/30 bg-red-500/10 text-red-400",
        muted: "border-[var(--color-border)] bg-[var(--color-bg-root)] text-[var(--color-text-muted)]",
    };
    return (
        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${colors[variant]}`}>
            {children}
        </span>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg-root)]">
            <span className="text-sm text-[var(--color-text-muted)] italic">{message}</span>
        </div>
    );
}

// ── Section: Incident Summary ────────────────────────────

function IncidentSummarySection({ report }: { report: ReportData }) {
    const severityColors: Record<string, string> = {
        S0: "border-red-500/50 bg-red-500/10 text-red-400",
        S1: "border-orange-500/50 bg-orange-500/10 text-orange-400",
        S2: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
        S3: "border-blue-500/50 bg-blue-500/10 text-blue-400",
        S4: "border-[var(--color-border)] bg-[var(--color-bg-active)] text-[var(--color-text-muted)]",
    };
    const statusVariant = report.status === "RESOLVED" || report.status === "CLOSED"
        ? "success"
        : report.status === "ACTIVE" || report.status === "INVESTIGATING"
            ? "warning"
            : "default";

    return (
        <section>
            <SectionHeader title="Incident Summary" id="summary" />
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <MetaRow label="Incident ID">
                    <code className="font-mono text-xs">{report.incidentId}</code>
                </MetaRow>
                <MetaRow label="Title">
                    <span className="font-semibold">{report.title}</span>
                </MetaRow>
                <MetaRow label="Severity">
                    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${severityColors[report.severity] ?? severityColors.S4}`}>
                        ● {report.severityLabel}
                    </span>
                </MetaRow>
                <MetaRow label="Status">
                    <Badge variant={statusVariant}>{report.status}</Badge>
                </MetaRow>
                <MetaRow label="Opened">{report.createdAt}</MetaRow>
                {report.resolvedAt && <MetaRow label="Resolved">{report.resolvedAt}</MetaRow>}
                <MetaRow label="Duration">{report.duration}</MetaRow>
                <MetaRow label="Commander">{report.commander}</MetaRow>
                {report.services.length > 0 && (
                    <MetaRow label="Services">
                        <div className="flex flex-wrap gap-1.5">
                            {report.services.map((s) => (
                                <Badge key={s}>{s}</Badge>
                            ))}
                        </div>
                    </MetaRow>
                )}
                {report.tags.length > 0 && (
                    <MetaRow label="Tags">
                        <div className="flex flex-wrap gap-1.5">
                            {report.tags.map((t) => (
                                <Badge key={t} variant="muted">#{t}</Badge>
                            ))}
                        </div>
                    </MetaRow>
                )}
            </div>
        </section>
    );
}

// ── Section: Executive Summary ───────────────────────────

function ExecutiveSummarySection({ report }: { report: ReportData }) {
    return (
        <section>
            <SectionHeader title="Executive Summary" id="exec-summary" />
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
                    {report.executiveSummary}
                </p>
            </div>
        </section>
    );
}

// ── Section: Timeline Highlights ─────────────────────────

function TimelineSection({ report, incidentId }: { report: ReportData; incidentId: string }) {
    return (
        <section>
            <SectionHeader title="Timeline Highlights" id="timeline" />
            {report.timelineHighlights.length === 0 ? (
                <EmptyState message="No timeline events recorded" />
            ) : (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                    <div className="space-y-0">
                        {report.timelineHighlights.map((e, i) => {
                            const typeIcons: Record<string, string> = {
                                status_change: "🔄",
                                action: "⚡",
                                escalation: "🔺",
                                resolution: "✅",
                                message: "💬",
                            };
                            return (
                                <div key={i} className="flex gap-4 py-2.5 border-b border-[var(--color-border)] last:border-0">
                                    <span className="w-5 shrink-0 text-center text-sm">{typeIcons[e.type] ?? "•"}</span>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm text-[var(--color-text-primary)]">{e.message}</p>
                                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                                            {e.actor} · {e.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {report.totalTimelineEvents > report.timelineHighlights.length && (
                        <div className="mt-3 pt-3 border-t border-[var(--color-border)] text-center">
                            <Link
                                href={`/incidents/${incidentId}/updates`}
                                className="text-xs font-medium text-[var(--color-accent)] hover:underline"
                            >
                                View all {report.totalTimelineEvents} events →
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

// ── Section: Work Summary ────────────────────────────────

function WorkSummarySection({ report }: { report: ReportData }) {
    const { taskSummary: ts } = report;

    const statItems = [
        { label: "Total", value: ts.total, color: "text-[var(--color-text-primary)]" },
        { label: "Completed", value: ts.completed, color: "text-green-400" },
        { label: "In Progress", value: ts.inProgress, color: "text-blue-400" },
        { label: "Blocked", value: ts.blocked, color: "text-red-400" },
        { label: "Not Started", value: ts.notStarted, color: "text-[var(--color-text-muted)]" },
    ];

    return (
        <section>
            <SectionHeader title="Work Summary" id="work" />
            {ts.total === 0 ? (
                <EmptyState message="No tasks were assigned for this incident" />
            ) : (
                <div className="space-y-4">
                    {/* Stats row */}
                    <div className="grid grid-cols-5 gap-3">
                        {statItems.map((s) => (
                            <div key={s.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 text-center">
                                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                                <div className="mt-1 text-xs text-[var(--color-text-muted)]">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Progress bar */}
                    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-[var(--color-text-muted)]">COMPLETION</span>
                            <span className="text-sm font-bold text-[var(--color-text-primary)]">{ts.completionPct}%</span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-bg-root)]">
                            <div
                                className="h-full rounded-full bg-green-500 transition-all duration-500"
                                style={{ width: `${ts.completionPct}%` }}
                            />
                        </div>
                    </div>

                    {/* Completed tasks */}
                    {ts.completedTasks.length > 0 && (
                        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-green-400">Completed Tasks</h3>
                            <div className="space-y-2">
                                {ts.completedTasks.map((t) => (
                                    <div key={t.task_id} className="flex items-center gap-2 text-sm">
                                        <span className="text-green-400">✓</span>
                                        <span className="text-[var(--color-text-primary)]">{t.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blocked/incomplete */}
                    {ts.blockedTasks.length > 0 && (
                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-red-400">Blocked / Incomplete</h3>
                            <div className="space-y-2">
                                {ts.blockedTasks.map((t) => (
                                    <div key={t.task_id} className="flex items-center gap-2 text-sm">
                                        <span className="text-red-400">⚠</span>
                                        <span className="text-[var(--color-text-primary)]">{t.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

// ── Section: Decisions & Approvals ───────────────────────

function DecisionsApprovalsSection({ report }: { report: ReportData }) {
    const hasDecisions = report.decisions.total > 0;
    const hasApprovals = report.approvals.total > 0;

    if (!hasDecisions && !hasApprovals) {
        return (
            <section>
                <SectionHeader title="Decisions & Approvals" id="decisions" />
                <EmptyState message="No decisions or approvals were recorded for this incident" />
            </section>
        );
    }

    return (
        <section>
            <SectionHeader title="Decisions & Approvals" id="decisions" />
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Decisions */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        Decisions ({report.decisions.resolved} / {report.decisions.total} resolved)
                    </h3>
                    {report.decisions.total === 0 ? (
                        <p className="text-sm text-[var(--color-text-muted)] italic">None recorded</p>
                    ) : (
                        <div className="space-y-3">
                            {report.decisions.items.map((d, i) => (
                                <div key={i} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3">
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{d.prompt}</p>
                                    {d.response ? (
                                        <p className="mt-1.5 text-xs text-green-400">
                                            ✓ {d.response} {d.respondedBy && <span className="text-[var(--color-text-muted)]">— {d.respondedBy}</span>}
                                        </p>
                                    ) : (
                                        <p className="mt-1.5 text-xs text-yellow-400">⏳ Pending response</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Approvals */}
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                        Approvals ({report.approvals.approved} approved, {report.approvals.pending} pending)
                    </h3>
                    {report.approvals.total === 0 ? (
                        <p className="text-sm text-[var(--color-text-muted)] italic">None recorded</p>
                    ) : (
                        <div className="space-y-3">
                            {report.approvals.items.map((a, i) => {
                                const statusMap: Record<string, { label: string; variant: "success" | "warning" | "danger" }> = {
                                    APPROVED: { label: "Approved", variant: "success" },
                                    DENIED: { label: "Denied", variant: "danger" },
                                    PENDING: { label: "Pending", variant: "warning" },
                                };
                                const s = statusMap[a.status] ?? statusMap.PENDING;
                                return (
                                    <div key={i} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3">
                                        <div>
                                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{a.title}</p>
                                            {a.approvedBy && (
                                                <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">by {a.approvedBy}</p>
                                            )}
                                        </div>
                                        <Badge variant={s.variant}>{s.label}</Badge>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

// ── Section: Communications ──────────────────────────────

function CommunicationsSection({ report }: { report: ReportData }) {
    const { communications: comms } = report;
    const hasComms = comms.internalUpdates + comms.executiveUpdates + comms.customerUpdates > 0;

    return (
        <section>
            <SectionHeader title="Communications Summary" id="communications" />
            {!hasComms ? (
                <EmptyState message="No status updates were posted during this incident" />
            ) : (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {[
                            { label: "Internal Updates", count: comms.internalUpdates, icon: "🔧" },
                            { label: "Executive Updates", count: comms.executiveUpdates, icon: "📊" },
                            { label: "Customer Drafts", count: comms.customerUpdates, icon: "📢" },
                        ].map((c) => (
                            <div key={c.label} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3 text-center">
                                <div className="text-lg">{c.icon}</div>
                                <div className="text-xl font-bold text-[var(--color-text-primary)]">{c.count}</div>
                                <div className="text-xs text-[var(--color-text-muted)]">{c.label}</div>
                            </div>
                        ))}
                    </div>
                    {comms.lastCommunication && (
                        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Last Communication</span>
                            <p className="mt-1 text-sm text-[var(--color-text-primary)]">{comms.lastCommunication.message}</p>
                            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                                {comms.lastCommunication.actor} · {comms.lastCommunication.time}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

// ── Section: Follow-up / Improvement ─────────────────────

function FollowUpSection({ report }: { report: ReportData }) {
    if (report.followUps.length === 0) {
        return (
            <section>
                <SectionHeader title="Follow-up & Improvement" id="follow-up" />
                <div className="flex h-16 items-center justify-center rounded-lg border border-dashed border-green-500/30 bg-green-500/5">
                    <span className="text-sm text-green-400">✓ No outstanding follow-up items identified</span>
                </div>
            </section>
        );
    }

    const severityColors: Record<string, string> = {
        critical: "border-red-500/30 bg-red-500/5",
        warning: "border-yellow-500/30 bg-yellow-500/5",
        info: "border-blue-500/30 bg-blue-500/5",
    };
    const textColors: Record<string, string> = {
        critical: "text-red-400",
        warning: "text-yellow-400",
        info: "text-blue-400",
    };

    return (
        <section>
            <SectionHeader title="Follow-up & Improvement" id="follow-up" />
            <div className="space-y-2">
                {report.followUps.map((f, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-3 rounded-xl border p-4 ${severityColors[f.severity]}`}
                    >
                        <span className="text-lg">{f.icon}</span>
                        <span className={`text-sm font-medium ${textColors[f.severity]}`}>{f.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ── Main Report Page ─────────────────────────────────────

export default function IncidentReportPage() {
    const { aggregate } = useIncidentContext();

    const report = useMemo(() => {
        if (!aggregate) return null;
        return composeReport(aggregate);
    }, [aggregate]);

    if (!aggregate || !report) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent" />
            </div>
        );
    }

    const incidentId = aggregate.incident.incident_id;

    return (
        <div className="mx-auto max-w-4xl">
            {/* Report header */}
            <div className="mb-8 border-b border-[var(--color-border)] pb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                            Post-Incident Report
                        </p>
                        <h1 className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
                            {report.title}
                        </h1>
                        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                            {report.incidentId} · {report.severityLabel} · {report.status}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 no-print">
                        <Link
                            href={`/incidents/${incidentId}/execute`}
                            className="btn-secondary text-xs"
                        >
                            Execute →
                        </Link>
                        <Link
                            href={`/incidents/${incidentId}/updates`}
                            className="btn-secondary text-xs"
                        >
                            Updates →
                        </Link>
                        <button
                            onClick={() => {
                                const el = document.getElementById("report-content");
                                if (el) navigator.clipboard.writeText(el.innerText);
                            }}
                            className="btn-secondary text-xs"
                        >
                            📋 Copy
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="btn-primary text-xs"
                        >
                            🖨 Print / PDF
                        </button>
                    </div>
                </div>

                {/* Table of contents */}
                <nav className="mt-4 flex flex-wrap gap-3">
                    {[
                        { label: "Summary", id: "summary" },
                        { label: "Executive", id: "exec-summary" },
                        { label: "Timeline", id: "timeline" },
                        { label: "Work", id: "work" },
                        { label: "Decisions", id: "decisions" },
                        { label: "Comms", id: "communications" },
                        { label: "Follow-up", id: "follow-up" },
                    ].map((s) => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg-surface)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
                        >
                            {s.label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Report body */}
            <div id="report-content" className="space-y-10">
                <IncidentSummarySection report={report} />
                <ExecutiveSummarySection report={report} />
                <TimelineSection report={report} incidentId={incidentId} />
                <WorkSummarySection report={report} />
                <DecisionsApprovalsSection report={report} />
                <CommunicationsSection report={report} />
                <FollowUpSection report={report} />
            </div>

            {/* Footer */}
            <div className="mt-10 border-t border-[var(--color-border)] pt-4 text-center">
                <p className="text-xs text-[var(--color-text-muted)]">
                    Report generated {new Date(report.generatedAt).toLocaleString()} · Attack Mode Incident Response Platform
                </p>
            </div>
        </div>
    );
}
