"use client";

/**
 * Status Update Generator — modal for composing and sharing incident updates.
 * Props-driven: receives aggregate + actions from the layout.
 * Uses the deterministic statusUpdateComposer for content generation.
 * RBAC: timeline.add for internal/executive posting, approval.approve_comms for customer draft.
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import type { IncidentAggregate } from "@/lib/domain/models";
import type { Integration, TimelineEventType } from "@/lib/types";
import { composeStatusUpdate, type UpdateAudience } from "@/lib/domain/statusUpdateComposer";
import { useMe } from "@/lib/auth/auth-context";

const AUDIENCES: { key: UpdateAudience; label: string; icon: string; description: string }[] = [
    { key: "internal", label: "Internal", icon: "🔧", description: "Team-facing, operational detail" },
    { key: "executive", label: "Executive", icon: "📊", description: "Business-oriented brief" },
    { key: "customer", label: "Customer Draft", icon: "📢", description: "External-facing, cautious" },
];

type PostState = "idle" | "posting" | "posted" | "copied";

interface StatusUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    aggregate: IncidentAggregate;
    /** Calls store.addTimelineNote under the hood */
    onPostUpdate: (message: string, type?: TimelineEventType) => Promise<unknown>;
    integrations: Integration[];
}

export default function StatusUpdateModal({
    isOpen,
    onClose,
    aggregate,
    onPostUpdate,
    integrations,
}: StatusUpdateModalProps) {
    const { can } = useMe();
    const canPost = can("timeline.add");
    const canPostCustomer = can("approval.approve_comms") || can("incident.edit");

    const [audience, setAudience] = useState<UpdateAudience>("internal");
    const [editedBody, setEditedBody] = useState("");
    const [postState, setPostState] = useState<PostState>("idle");

    const slackIntegration = useMemo(
        () => integrations.find((i) => i.name.toLowerCase().includes("slack")),
        [integrations],
    );
    const slackConnected = slackIntegration?.health === "connected";

    // Generate fresh content — called on tab change and regenerate
    const generate = useCallback((targetAudience: UpdateAudience) => {
        const update = composeStatusUpdate(aggregate, targetAudience);
        setEditedBody(update.body);
        setPostState("idle");
    }, [aggregate]);

    // Regenerate when modal opens or audience changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { if (isOpen) generate(audience); }, [isOpen, audience, generate]);

    if (!isOpen) return null;

    function handleAudienceChange(newAudience: UpdateAudience) {
        setAudience(newAudience);
        generate(newAudience);
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(editedBody);
            setPostState("copied");
            setTimeout(() => setPostState("idle"), 2000);
        } catch {
            // Fallback for environments without clipboard API
            setPostState("copied");
            setTimeout(() => setPostState("idle"), 2000);
        }
    }

    async function handlePost(channel: string) {
        if (!canPost && audience !== "customer") return;
        if (audience === "customer" && !canPostCustomer) return;

        setPostState("posting");

        const label = AUDIENCES.find((a) => a.key === audience)?.label ?? audience;
        const message = channel === "slack"
            ? `${label} update posted to Slack:\n\n${editedBody}`
            : `${label} update posted:\n\n${editedBody}`;

        await onPostUpdate(message, "action");
        setPostState("posted");
    }

    const isCustomerRestricted = audience === "customer" && !canPostCustomer;
    const subject = `${AUDIENCES.find((a) => a.key === audience)?.label ?? audience} update — ${aggregate.incident.title}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="glass-elevated relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                            📋 Status Update Generator
                        </h2>
                        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{subject}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Audience tabs */}
                <div className="flex gap-1 border-b border-[var(--color-border)] px-6 py-2">
                    {AUDIENCES.map((a) => (
                        <button
                            key={a.key}
                            onClick={() => handleAudienceChange(a.key)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${audience === a.key
                                ? "bg-[var(--color-accent)] text-white"
                                : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-secondary)]"
                                }`}
                        >
                            <span>{a.icon}</span>
                            <span>{a.label}</span>
                        </button>
                    ))}
                </div>

                {/* Audience description + customer draft warning */}
                <div className="px-6 pt-3">
                    <p className="text-xs text-[var(--color-text-muted)]">
                        {AUDIENCES.find((a) => a.key === audience)?.description}
                    </p>
                    {audience === "customer" && (
                        <div className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
                            ⚠ Customer-facing text — review carefully before sharing externally.
                            {isCustomerRestricted && (
                                <span className="ml-1 font-semibold">
                                    You need comms or edit permission to post this draft.
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Editable content area */}
                <div className="flex-1 overflow-hidden px-6 py-3">
                    <textarea
                        value={editedBody}
                        onChange={(e) => {
                            setEditedBody(e.target.value);
                            setPostState("idle");
                        }}
                        className="h-full w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-root)] px-4 py-3 font-mono text-sm leading-relaxed text-[var(--color-text-primary)] outline-none focus:border-[var(--color-accent)] transition-colors"
                        spellCheck={false}
                    />
                </div>

                {/* Action bar */}
                <div className="flex items-center justify-between border-t border-[var(--color-border)] px-6 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => generate(audience)}
                            className="btn-ghost text-xs"
                            title="Regenerate from latest incident data"
                        >
                            ↻ Regenerate
                        </button>
                        {postState === "posted" && (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-400">
                                ✓ Posted to timeline
                            </span>
                        )}
                        {postState === "copied" && (
                            <span className="flex items-center gap-1 text-xs font-medium text-blue-400">
                                ✓ Copied to clipboard
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Copy */}
                        <button onClick={handleCopy} className="btn-secondary text-sm">
                            {postState === "copied" ? "✓ Copied" : "Copy"}
                        </button>

                        {/* Post to Slack — internal + executive, gated on integration health */}
                        {(audience === "internal" || audience === "executive") && (
                            <button
                                onClick={() => handlePost("slack")}
                                disabled={!canPost || !slackConnected || postState === "posting" || postState === "posted"}
                                className="flex items-center gap-2 rounded-lg bg-[#4A154B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#611f64] disabled:opacity-40 disabled:cursor-not-allowed"
                                title={
                                    !canPost
                                        ? "You need timeline.add permission to post"
                                        : !slackConnected
                                            ? "Slack is not connected"
                                            : undefined
                                }
                            >
                                {postState === "posting" ? (
                                    "Posting…"
                                ) : postState === "posted" ? (
                                    "✓ Posted"
                                ) : (
                                    <>
                                        <SlackIcon />
                                        Post to Slack
                                    </>
                                )}
                            </button>
                        )}

                        {/* Post update — customer draft (stricter gating) */}
                        {audience === "customer" && (
                            <button
                                onClick={() => handlePost("post")}
                                disabled={isCustomerRestricted || postState === "posting" || postState === "posted"}
                                className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed"
                                title={isCustomerRestricted ? "You need comms or edit permission to post customer updates" : undefined}
                            >
                                {postState === "posting" ? "Posting…" : postState === "posted" ? "✓ Posted" : "Post Draft"}
                            </button>
                        )}

                        <button onClick={onClose} className="btn-ghost text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Inline Slack icon
function SlackIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.124 2.521a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.52V8.834zm-1.271 0a2.527 2.527 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.527 2.527 0 0 1 2.521 2.522v6.312zm-2.521 10.124a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.521-2.522v-2.52h2.521zm0-1.271a2.527 2.527 0 0 1-2.521-2.521 2.528 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.522h-6.312z" />
        </svg>
    );
}
