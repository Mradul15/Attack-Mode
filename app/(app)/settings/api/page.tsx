"use client";

import { useState } from "react";
import PermissionGate from "@/app/components/global/PermissionGate";

interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    created: string;
    lastUsed: string;
    scopes: string[];
    status: "active" | "revoked";
}

const mockKeys: ApiKey[] = [
    {
        id: "key_1",
        name: "Production CI/CD",
        prefix: "am_live_7f3k...x9q2",
        created: "2026-01-15",
        lastUsed: "2m ago",
        scopes: ["incidents:read", "incidents:write", "tasks:write"],
        status: "active",
    },
    {
        id: "key_2",
        name: "Monitoring Webhook",
        prefix: "am_live_2m8j...p4r1",
        created: "2026-02-01",
        lastUsed: "1h ago",
        scopes: ["incidents:read", "integrations:read"],
        status: "active",
    },
    {
        id: "key_3",
        name: "Legacy Integration",
        prefix: "am_live_9k2x...a7b3",
        created: "2025-11-20",
        lastUsed: "30d ago",
        scopes: ["incidents:read"],
        status: "revoked",
    },
];

export default function ApiSettingsPage() {
    const [keys] = useState<ApiKey[]>(mockKeys);
    const [showCreate, setShowCreate] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleCreate = () => {
        const fakeKey = `am_live_${Array.from({ length: 32 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("")}`;
        setGeneratedKey(fakeKey);
    };

    const handleCopy = () => {
        if (generatedKey) {
            navigator.clipboard.writeText(generatedKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">API Keys</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Manage API keys for programmatic access. Keys are shown once at creation.
                    </p>
                </div>
                <PermissionGate permission="people.manage_roles">
                    <button
                        onClick={() => {
                            setShowCreate(true);
                            setGeneratedKey(null);
                            setNewKeyName("");
                        }}
                        className="btn-primary text-sm"
                    >
                        + Generate Key
                    </button>
                </PermissionGate>
            </div>

            {/* Key generation modal */}
            {showCreate && (
                <div className="mb-6 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 p-5 animate-scale-in">
                    {!generatedKey ? (
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">Generate New API Key</h3>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-muted)]">Key Name</label>
                                <input
                                    type="text"
                                    value={newKeyName}
                                    onChange={(e) => setNewKeyName(e.target.value)}
                                    placeholder="e.g., Production CI/CD"
                                    className="input"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={handleCreate} disabled={!newKeyName.trim()} className="btn-primary text-xs disabled:opacity-50">
                                    Generate
                                </button>
                                <button onClick={() => setShowCreate(false)} className="btn-ghost text-xs">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">⚠️</span>
                                <h3 className="text-sm font-semibold text-[var(--color-accent)]">
                                    Copy this key now — it won&apos;t be shown again
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-3">
                                <code className="flex-1 break-all font-mono text-xs text-[var(--color-text-primary)]">
                                    {generatedKey}
                                </code>
                                <button onClick={handleCopy} className="btn-secondary shrink-0 text-xs">
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                            <button onClick={() => setShowCreate(false)} className="btn-ghost text-xs">
                                Done
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Security notice */}
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3">
                <span className="text-sm">🔐</span>
                <div>
                    <p className="text-sm font-medium text-blue-400">API Key Security</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                        Keys are encrypted at rest using AES-256. They are only displayed once at creation.
                        Rotate keys regularly and revoke any that may be compromised.
                    </p>
                </div>
            </div>

            {/* Keys list */}
            <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-surface)]">
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Key</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Scopes</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Last Used</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {keys.map((key) => (
                            <tr key={key.id} className="border-b border-[var(--color-border)] bg-[var(--color-bg-root)] transition-colors hover:bg-[var(--color-bg-hover)]">
                                <td className="px-4 py-3">
                                    <p className="font-medium text-[var(--color-text-primary)]">{key.name}</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)]">Created {key.created}</p>
                                </td>
                                <td className="px-4 py-3">
                                    <code className="rounded-md bg-[var(--color-bg-active)] px-2 py-0.5 font-mono text-xs text-[var(--color-text-muted)]">
                                        {key.prefix}
                                    </code>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                        {key.scopes.map((scope) => (
                                            <span key={scope} className="rounded-md bg-[var(--color-bg-active)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-muted)]">
                                                {scope}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-[var(--color-text-muted)]">{key.lastUsed}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${key.status === "active"
                                            ? "bg-green-500/10 text-green-400"
                                            : "bg-red-500/10 text-red-400"
                                            }`}>
                                            {key.status === "active" ? "Active" : "Revoked"}
                                        </span>
                                        {key.status === "active" && (
                                            <PermissionGate permission="people.manage_roles">
                                                <button className="text-xs text-red-400 transition-colors hover:text-red-300">
                                                    Revoke
                                                </button>
                                            </PermissionGate>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Rate limits */}
            <div className="mt-8">
                <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Rate Limits</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Burst Limit", value: "100 req/s", desc: "Per API key" },
                        { label: "Sustained", value: "1,000 req/min", desc: "Per API key" },
                        { label: "Daily Quota", value: "100,000 req/day", desc: "Per tenant" },
                    ].map((limit) => (
                        <div key={limit.label} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-4 text-center">
                            <div className="text-lg font-bold text-[var(--color-text-primary)]">{limit.value}</div>
                            <div className="text-xs font-semibold text-[var(--color-text-muted)]">{limit.label}</div>
                            <div className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">{limit.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
