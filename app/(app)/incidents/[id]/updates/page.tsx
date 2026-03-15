"use client";

/**
 * Updates page — timeline-focused view.
 * Filterable: All / Actions / Decisions / System.
 * Default filter shows Actions + Decisions.
 */

import { useState, useMemo } from "react";
import { useIncidentContext } from "../incident-context";
import type { TimelineEventType } from "@/lib/types";
import TimelinePanel from "@/app/components/page/incidents/TimelinePanel";

type FilterKey = "all" | "actions" | "decisions" | "system";

const filterConfig: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "actions", label: "Actions" },
    { key: "decisions", label: "Decisions" },
    { key: "system", label: "System" },
];

const filterMap: Record<FilterKey, TimelineEventType[] | null> = {
    all: null,
    actions: ["action", "message"],
    decisions: ["escalation", "resolution"],
    system: ["status_change"],
};

export default function UpdatesPage() {
    const { aggregate, actions } = useIncidentContext();
    const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(
        new Set(["actions", "decisions"]),
    );

    const timeline = useMemo(() => aggregate?.timeline ?? [], [aggregate?.timeline]);

    const filteredTimeline = useMemo(() => {
        // "all" overrides other filters
        if (activeFilters.has("all") || activeFilters.size === 0) return timeline;

        const allowedTypes = new Set<TimelineEventType>();
        for (const filter of activeFilters) {
            const types = filterMap[filter];
            if (types) types.forEach((t) => allowedTypes.add(t));
        }
        return timeline.filter((e) => allowedTypes.has(e.type));
    }, [timeline, activeFilters]);

    function toggleFilter(key: FilterKey) {
        setActiveFilters((prev) => {
            const next = new Set(prev);
            if (key === "all") {
                // Toggle "all" clears other filters
                return next.has("all") ? new Set() : new Set(["all"]);
            }
            next.delete("all");
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }

    const sorted = useMemo(
        () =>
            [...filteredTimeline].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
            ),
        [filteredTimeline],
    );

    return (
        <div className="max-w-3xl">
            {/* Filter bar */}
            <div className="mb-4 flex items-center gap-2">
                <span className="text-xs font-medium text-[var(--color-text-muted)]">Filter:</span>
                {filterConfig.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => toggleFilter(f.key)}
                        aria-pressed={activeFilters.has(f.key)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40 ${activeFilters.has(f.key)
                                ? "bg-[var(--color-accent)] text-white"
                                : "bg-[var(--color-bg-raised)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
                <span className="ml-auto text-xs text-[var(--color-text-muted)]">
                    {sorted.length} of {timeline.length} events
                </span>
            </div>

            {/* Timeline */}
            <TimelinePanel
                timeline={sorted}
                onAddTimelineNote={actions.addTimelineNote}
            />
        </div>
    );
}
