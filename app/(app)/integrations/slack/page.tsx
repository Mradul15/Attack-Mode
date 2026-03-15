"use client";

import { useState } from "react";
import Link from "next/link";
import PermissionGate from "@/app/components/global/PermissionGate";

const scopes = [
    { name: "channels:read", description: "View basic channel info", granted: true },
    { name: "channels:manage", description: "Create and archive channels", granted: true },
    { name: "chat:write", description: "Send messages as Attack Mode", granted: true },
    { name: "commands", description: "Add slash commands", granted: true },
    { name: "users:read", description: "View user profiles", granted: false },
    { name: "reactions:write", description: "Add emoji reactions", granted: false },
];

const channelMappings = [
    { event: "Incident Created", channel: "#incidents", enabled: true },
    { event: "Severity Escalation", channel: "#incidents-critical", enabled: true },
    { event: "Status Update Posted", channel: "#incident-updates", enabled: true },
    { event: "Task Completed", channel: "#incidents", enabled: false },
    { event: "Approval Requested", channel: "#approvals", enabled: true },
    { event: "Incident Resolved", channel: "#incidents", enabled: true },
];

export default function SlackSettingsPage() {
    const [connected] = useState(true);
    const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
    const [mappings, setMappings] = useState(channelMappings);

    const handleTest = () => {
        setTestStatus("testing");
        setTimeout(() => setTestStatus("success"), 1500);
        setTimeout(() => setTestStatus("idle"), 4000);
    };

    const toggleMapping = (index: number) => {
        setMappings((prev) =>
            prev.map((m, i) => (i === index ? { ...m, enabled: !m.enabled } : m))
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
                        Slack Integration
                    </h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Configure incident notifications, channel creation, and bot commands.
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
                                {connected ? "Workspace: acme-corp.slack.com · Last sync: 2m ago" : "Click Connect to authorize Attack Mode"}
                            </p>
                        </div>
                    </div>
                    <PermissionGate permission="integration.configure">
                        <button className={connected ? "btn-ghost text-xs text-red-400" : "btn-primary text-xs"}>
                            {connected ? "Disconnect" : "Connect Slack"}
                        </button>
                    </PermissionGate>
                </div>
            </div>

            {/* Channel Mapping */}
            <div className="mb-6">
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Channel Mapping</h2>
                <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
                    {mappings.map((mapping, i) => (
                        <div
                            key={mapping.event}
                            className={`flex items-center justify-between px-4 py-3 ${i > 0 ? "border-t border-[var(--color-border)]" : ""
                                } bg-[var(--color-bg-surface)] transition-colors hover:bg-[var(--color-bg-hover)]`}
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleMapping(i)}
                                    className={`flex h-5 w-9 items-center rounded-full transition-colors ${mapping.enabled ? "bg-green-500" : "bg-[var(--color-bg-active)]"
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${mapping.enabled ? "translate-x-4.5" : "translate-x-1"
                                            }`}
                                    />
                                </button>
                                <span className="text-sm text-[var(--color-text-primary)]">{mapping.event}</span>
                            </div>
                            <code className="rounded-md bg-[var(--color-bg-root)] px-2 py-1 font-mono text-xs text-[var(--color-text-muted)]">
                                {mapping.channel}
                            </code>
                        </div>
                    ))}
                </div>
            </div>

            {/* OAuth Scopes */}
            <div className="mb-6">
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">OAuth Scopes</h2>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
                    <div className="space-y-2">
                        {scopes.map((scope) => (
                            <div key={scope.name} className="flex items-center justify-between rounded-lg bg-[var(--color-bg-root)] px-3 py-2">
                                <div>
                                    <code className="font-mono text-xs text-[var(--color-text-primary)]">{scope.name}</code>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">{scope.description}</p>
                                </div>
                                <span className={`text-xs font-medium ${scope.granted ? "text-green-400" : "text-[var(--color-text-muted)]"}`}>
                                    {scope.granted ? "Granted" : "Not requested"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bot Configuration */}
            <div>
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Bot Commands</h2>
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4">
                    <div className="space-y-2">
                        {[
                            { cmd: "/attack status", desc: "Get current incident status" },
                            { cmd: "/attack ack", desc: "Acknowledge an incident" },
                            { cmd: "/attack escalate", desc: "Escalate incident severity" },
                        ].map((item) => (
                            <div key={item.cmd} className="flex items-center justify-between rounded-lg bg-[var(--color-bg-root)] px-3 py-2">
                                <code className="font-mono text-xs text-[var(--color-accent)]">{item.cmd}</code>
                                <span className="text-xs text-[var(--color-text-muted)]">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
