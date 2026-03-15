"use client";

import type { Incident, User, Integration } from "@/lib/types";
import PermissionGate from "@/app/components/global/PermissionGate";
import SeverityBadge from "@/app/components/core/SeverityBadge";
import UserChip from "@/app/components/core/UserChip";
import EvidenceReferenceList from "@/app/components/core/EvidenceReferenceList";

interface ContextPanelProps {
    incident: Incident;
    userMap: Record<string, User>;
    integrations: Integration[];
    className?: string;
}

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

const evidenceItems = [
    { id: "ev_1", label: "Grafana — Auth Service Dashboard", type: "link" as const, url: "#" },
    { id: "ev_2", label: "CloudTrail logs (Feb 25)", type: "log" as const, url: "#" },
    { id: "ev_3", label: "Runbook: Credential Compromise v3", type: "file" as const, url: "#" },
];

const healthColor: Record<string, string> = {
    connected: "bg-green-400",
    degraded: "bg-yellow-400",
    disconnected: "bg-red-400",
};

export default function ContextPanel({ incident, userMap, integrations, className = "" }: ContextPanelProps) {
    // Show only integrations that are connected or degraded (relevant to active incident)
    const activeIntegrations = integrations.filter(
        (intg) => intg.health === "connected" || intg.health === "degraded"
    );

    return (
        <div className={`space-y-4 stagger-children ${className}`}>
            {/* Severity & Metadata */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Incident Context</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--color-text-muted)]">Severity</span>
                        <SeverityBadge severity={incident.severity} />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--color-text-muted)]">Created</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                            {new Date(incident.created_at).toLocaleString()}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[var(--color-text-muted)]">Updated</span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                            {new Date(incident.updated_at).toLocaleString()}
                        </span>
                    </div>
                    {incident.resolved_at && (
                        <div className="flex items-center justify-between">
                            <span className="text-[var(--color-text-muted)]">Resolved</span>
                            <span className="text-xs text-green-400">
                                {new Date(incident.resolved_at).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Responders */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Responders</h3>
                <div className="space-y-3">
                    <UserChip name={getUserName(userMap, incident.ic_user_id)} role="Incident Commander" />
                    {incident.responder_ids.map((id) => (
                        <UserChip key={id} name={getUserName(userMap, id)} role="Responder" />
                    ))}
                </div>
                <PermissionGate permission="incident.assign">
                    <button className="btn-ghost mt-3 w-full border border-dashed border-[var(--color-border)] text-xs">
                        + Add Responder
                    </button>
                </PermissionGate>
            </div>

            {/* Impacted Services */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Impacted Services</h3>
                {incident.impacted_services.length === 0 ? (
                    <p className="text-xs text-[var(--color-text-muted)]">No services affected</p>
                ) : (
                    <div className="space-y-2">
                        {incident.impacted_services.map((svc) => (
                            <div key={svc} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-400" />
                                </span>
                                {svc}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tags */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Tags</h3>
                {incident.tags.length === 0 ? (
                    <p className="text-xs text-[var(--color-text-muted)]">No tags</p>
                ) : (
                    <div className="flex flex-wrap gap-1.5">
                        {incident.tags.map((tag) => (
                            <span key={tag} className="rounded bg-[var(--color-bg-active)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Integrations */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Integrations</h3>
                <div className="space-y-2">
                    {activeIntegrations.map((intg) => (
                        <div key={intg.integration_id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{intg.icon}</span>
                                <span className="text-[var(--color-text-secondary)]">{intg.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className={`h-1.5 w-1.5 rounded-full ${healthColor[intg.health]} ${intg.health === "connected" ? "animate-pulse-glow" : ""}`} />
                                <span className="text-[10px] text-[var(--color-text-muted)] capitalize">
                                    {intg.health}
                                </span>
                                {intg.last_sync && (
                                    <span className="text-[10px] text-[var(--color-text-muted)]">
                                        · {intg.last_sync}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Evidence & Links */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
                <h3 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Evidence & Links</h3>
                <EvidenceReferenceList items={evidenceItems} />
            </div>
        </div>
    );
}
