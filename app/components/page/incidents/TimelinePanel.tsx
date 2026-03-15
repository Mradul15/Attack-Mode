"use client";

import { useState } from "react";
import type { TimelineEvent, TimelineEventType } from "@/lib/types";
import { useMe } from "@/lib/auth/auth-context";
import TimelineEventCard from "@/app/components/core/TimelineEventCard";

interface TimelinePanelProps {
    timeline: TimelineEvent[];
    onAddTimelineNote: (message: string, type: TimelineEventType) => void;
    className?: string;
}

const eventTypeOptions: { value: TimelineEventType; label: string; icon: string }[] = [
    { value: "message", label: "Note", icon: "💬" },
    { value: "action", label: "Action", icon: "⚡" },
    { value: "status_change", label: "Status Change", icon: "⟳" },
    { value: "escalation", label: "Escalation", icon: "🔺" },
    { value: "resolution", label: "Resolution", icon: "✓" },
];

export default function TimelinePanel({
    timeline,
    onAddTimelineNote,
    className = "",
}: TimelinePanelProps) {
    const { can } = useMe();
    const canAdd = can("timeline.add");
    const [message, setMessage] = useState("");
    const [eventType, setEventType] = useState<TimelineEventType>("message");
    const [adding, setAdding] = useState(false);

    function handleAddEntry() {
        if (!message.trim()) return;
        onAddTimelineNote(message.trim(), eventType);
        setMessage("");
        setEventType("message");
        setAdding(false);
    }

    return (
        <div className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5 ${className}`}>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Timeline
                    <span className="ml-2 text-xs font-normal text-[var(--color-text-muted)]">
                        {timeline.length} events
                    </span>
                </h3>
                {canAdd && !adding && (
                    <button onClick={() => setAdding(true)} className="btn-secondary text-xs">
                        + Add Entry
                    </button>
                )}
            </div>

            {adding && canAdd && (
                <div className="mb-4 rounded-lg border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/5 p-3 animate-scale-in">
                    <div className="mb-2 flex gap-1.5">
                        {eventTypeOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setEventType(opt.value)}
                                className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${eventType === opt.value
                                    ? "bg-[var(--color-accent)] text-white"
                                    : "bg-[var(--color-bg-raised)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                                    }`}
                                title={opt.label}
                            >
                                {opt.icon} {opt.label}
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="What happened? Add a note to the timeline..."
                        className="input resize-none text-sm"
                        rows={2}
                        autoFocus
                    />
                    <div className="mt-2 flex items-center justify-end gap-2">
                        <button
                            onClick={() => { setAdding(false); setMessage(""); setEventType("message"); }}
                            className="btn-ghost text-xs"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddEntry}
                            disabled={!message.trim()}
                            className="btn-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Add to Timeline
                        </button>
                    </div>
                </div>
            )}

            {timeline.length === 0 ? (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
                    No timeline events yet
                </div>
            ) : (
                <div className="stagger-children">
                    {timeline.map((event) => (
                        <TimelineEventCard
                            key={event.event_id}
                            type={event.type}
                            actor={event.actor_name}
                            message={event.message}
                            timestamp={new Date(event.created_at).toLocaleTimeString()}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
