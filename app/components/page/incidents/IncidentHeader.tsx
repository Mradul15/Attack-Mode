"use client";

import type { Incident, User } from "@/lib/types";
import PermissionGate from "@/app/components/global/PermissionGate";
import SeverityBadge from "@/app/components/core/SeverityBadge";
import StatusPill, { type Status } from "@/app/components/core/StatusPill";
import OverdueTimer from "@/app/components/core/OverdueTimer";
import UserChip from "@/app/components/core/UserChip";

const statusMap: Record<string, Status> = {
    ACTIVE: "active",
    INVESTIGATING: "investigating",
    MONITORING: "monitoring",
    RESOLVED: "resolved",
    CLOSED: "closed",
};

interface IncidentHeaderProps {
    incident: Incident;
    userMap: Record<string, User>;
    onGenerateStatusUpdate?: () => void;
    className?: string;
}

function getUserName(userMap: Record<string, User>, id: string): string {
    return userMap[id]?.name ?? "Unknown";
}

export default function IncidentHeader({
    incident,
    userMap,
    onGenerateStatusUpdate,
    className = "",
}: IncidentHeaderProps) {
    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 animate-fade-in-up ${className}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                        {(incident.status === "ACTIVE" || incident.status === "INVESTIGATING") && (
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                            </span>
                        )}
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">{incident.incident_id}</span>
                        <SeverityBadge severity={incident.severity} />
                        <StatusPill status={statusMap[incident.status]} />
                    </div>
                    <h1 className="mt-2 text-xl font-bold text-[var(--color-text-primary)]">{incident.title}</h1>
                    {incident.description && (
                        <p className="mt-1 text-sm text-[var(--color-text-muted)] max-w-2xl">{incident.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <OverdueTimer label="Duration" elapsed={incident.duration ?? "—"} />
                    {onGenerateStatusUpdate && (
                        <button
                            onClick={onGenerateStatusUpdate}
                            className="btn-secondary text-sm"
                        >
                            📋 Generate Status Update
                        </button>
                    )}
                    <PermissionGate permission="incident.edit">
                        <button className="btn-primary text-sm">
                            Update Status
                        </button>
                    </PermissionGate>
                    <PermissionGate permission="incident.close">
                        <button className="btn-secondary text-sm !border-red-500/30 !bg-red-500/10 !text-red-400 hover:!bg-red-500/20">
                            Close
                        </button>
                    </PermissionGate>
                </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[var(--color-border)] pt-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">Commander:</span>
                    <UserChip name={getUserName(userMap, incident.ic_user_id)} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">Services:</span>
                    {incident.impacted_services.map((svc) => (
                        <span key={svc} className="rounded bg-[var(--color-bg-active)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">{svc}</span>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-muted)]">Tags:</span>
                    {incident.tags.map((tag) => (
                        <span key={tag} className="rounded bg-[var(--color-bg-active)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]">#{tag}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
