"use client";

import { useState } from "react";
import Link from "next/link";
import PermissionGate from "@/app/components/global/PermissionGate";

const projectMappings = [
    { severity: "S0", project: "OPS", issueType: "Critical Incident", priority: "Highest", enabled: true },
    { severity: "S1", project: "OPS", issueType: "Incident", priority: "High", enabled: true },
    { severity: "S2", project: "OPS", issueType: "Incident", priority: "Medium", enabled: true },
    { severity: "S3", project: "ENG", issueType: "Task", priority: "Low", enabled: false },
    { severity: "S4", project: "ENG", issueType: "Task", priority: "Lowest", enabled: false },
];

const fieldMappings = [
    { attackField: "Incident Title", jiraField: "Summary", synced: true },
    { attackField: "Severity", jiraField: "Priority", synced: true },
    { attackField: "Status", jiraField: "Status", synced: true },
    { attackField: "Commander", jiraField: "Assignee", synced: true },
    { attackField: "Impacted Services", jiraField: "Labels", synced: false },
    { attackField: "Description", jiraField: "Description", synced: false },
];

const syncRules = [
    { rule: "Create Jira issue on incident creation", enabled: true },
    { rule: "Sync status changes bidirectionally", enabled: true },
    { rule: "Close Jira issue when incident resolves", enabled: true },
    { rule: "Create sub-tasks for incident tasks", enabled: false },
    { rule: "Sync comments and timeline events", enabled: false },
];

export default function JiraSettingsPage() {
    const [connected] = useState(true);
    const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
    const [rules, setRules] = useState(syncRules);

    const handleTest = () => {
        setTestStatus("testing");
        setTimeout(() => setTestStatus("success"), 1500);
        setTimeout(() => setTestStatus("idle"), 4000);
    };

    const toggleRule = (index: number) => {
        setRules((prev) =>
            prev.map((r, i) => (i === index ? { ...r, enabled: !r.enabled } : r))
        );
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex items-center gap-3">
                <Link
                    href="/integrations"
                    className="text-xs text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                    ← Integrations
                </Link>
            </div>

            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
                        Jira Integration
                    </h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Configure ticket creation, two-way status syncing, and field mapping.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleTest}
                        disabled={testStatus === "testing"}
                        className="btn-secondary text-xs"
                    >
                        {testStatus === "testing" ? "Testing..." : testStatus === "success" ? "Connected" : "Test Connection"}
                    </button>
                </div>
            </div>

            {/* Connection Status */}
            <div className={`mb-6 rounded-xl border p-5 animate-fade-in ${connected
                ? "border-green-500/20 bg-green-500/5"
                : "border-red-500/20 bg-red-500/5"
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`h-3 w-3 rounded-full ${connected ? "bg-green-400 animate-pulse-glow" : "bg-red-400"}`} />
                        <div>
                            <p className={`text-sm font-semibold ${connected ? "text-green-400" : "text-red-400"}`}>
                                {connected ? "Connected" : "Disconnected"}
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {connected ? "Site: acme-corp.atlassian.net · Last sync: 5m ago" : "Click Connect to authorize via OAuth 2.0"}
                            </p>
                        </div>
                    </div>
                    <PermissionGate permission="integration.configure">
                        <button className={connected ? "btn-ghost text-xs text-red-400" : "btn-primary text-xs"}>
                            {connected ? "Disconnect" : "Connect Jira"}
                        </button>
                    </PermissionGate>
                </div>
            </div>

            {/* Project Mapping */}
            <div className="mb-6">
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Project Mapping</h2>
                <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Severity</th>
                                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Project</th>
                                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Issue Type</th>
                                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Priority</th>
                                <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectMappings.map((m) => {
                                const sevColors: Record<string, string> = {
                                    S0: "text-red-400", S1: "text-orange-400", S2: "text-yellow-400",
                                    S3: "text-blue-400", S4: "text-[var(--color-text-muted)]",
                                };
                                return (
                                    <tr key={m.severity} className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)]">
                                        <td className={`px-4 py-2.5 font-semibold ${sevColors[m.severity]}`}>{m.severity}</td>
                                        <td className="px-4 py-2.5 font-mono text-xs text-[var(--color-text-secondary)]">{m.project}</td>
                                        <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">{m.issueType}</td>
                                        <td className="px-4 py-2.5 text-[var(--color-text-muted)]">{m.priority}</td>
                                        <td className="px-4 py-2.5 text-right">
                                            <span className={`inline-block h-2 w-2 rounded-full ${m.enabled ? "bg-green-400" : "bg-[var(--color-bg-active)]"}`} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Field Mapping */}
            <div className="mb-6">
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Field Mapping</h2>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
                    <div className="space-y-2">
                        {fieldMappings.map((f) => (
                            <div key={f.attackField} className="flex items-center justify-between rounded-lg bg-[var(--color-bg-root)] px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <code className="font-mono text-xs text-[var(--color-accent)]">{f.attackField}</code>
                                    <span className="text-xs text-[var(--color-text-muted)]">→</span>
                                    <code className="font-mono text-xs text-blue-400">{f.jiraField}</code>
                                </div>
                                <span className={`text-xs font-medium ${f.synced ? "text-green-400" : "text-[var(--color-text-muted)]"}`}>
                                    {f.synced ? "Synced" : "Manual"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sync Rules */}
            <div>
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Sync Rules</h2>
                <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
                    {rules.map((rule, i) => (
                        <div
                            key={rule.rule}
                            className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-[var(--color-border)]" : ""
                                } bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-hover)]`}
                        >
                            <span className="text-sm text-[var(--color-text-primary)]">{rule.rule}</span>
                            <button
                                onClick={() => toggleRule(i)}
                                className={`flex h-5 w-9 items-center rounded-full transition-colors ${rule.enabled ? "bg-green-500" : "bg-[var(--color-bg-active)]"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${rule.enabled ? "translate-x-4.5" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
