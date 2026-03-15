/**
 * Pure selector functions for incident aggregate data.
 * Panels use these to derive views — keeps logic centralized,
 * prevents divergence between components.
 */

import type { IncidentAggregate } from "@/lib/domain/models";
import type { TaskInstance, Approval, TimelineEvent, User, TaskStatus } from "@/lib/types";

export function selectTasksByStatus(
    agg: IncidentAggregate | null,
    status: TaskStatus,
): TaskInstance[] {
    if (!agg) return [];
    return agg.tasks.filter((t) => t.status === status);
}

export function selectPendingApprovals(
    agg: IncidentAggregate | null,
): Approval[] {
    if (!agg) return [];
    return agg.approvals.filter((a) => a.status === "PENDING");
}

export function selectNextSteps(
    agg: IncidentAggregate | null,
): TaskInstance[] {
    if (!agg) return [];
    return agg.tasks.filter((t) => t.status === "TODO" || t.status === "IN_PROGRESS");
}

export function selectTimelineSorted(
    agg: IncidentAggregate | null,
): TimelineEvent[] {
    if (!agg) return [];
    return [...agg.timeline].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
}

export function selectUserMap(
    agg: IncidentAggregate | null,
): Record<string, User> {
    return agg?.userMap ?? {};
}

export function selectActiveTasks(
    agg: IncidentAggregate | null,
): TaskInstance[] {
    if (!agg) return [];
    return agg.tasks.filter((t) => t.status === "IN_PROGRESS" || t.status === "SKIPPED");
}

export function selectPendingDecisions(
    agg: IncidentAggregate | null,
): import("@/lib/types").Decision[] {
    if (!agg) return [];
    return agg.decisions.filter((d) => !d.response);
}

export function selectRecentTimeline(
    agg: IncidentAggregate | null,
    count = 5,
): TimelineEvent[] {
    if (!agg) return [];
    return [...agg.timeline]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, count);
}
