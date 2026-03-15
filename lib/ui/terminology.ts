/**
 * Terminology map — single source of truth for user-facing labels.
 *
 * Pattern: "Friendly label (Canonical term)"
 * UI components import `term()` or `tooltip()` helpers.
 * docs/TERMINOLOGY_MAP.md is generated from this file — keep them in sync.
 */

export interface TermEntry {
    /** Machine key used in code references */
    key: string;
    /** Internal / domain term (e.g. "Approval") */
    canonical: string;
    /** User-facing friendly label (e.g. "Sign-off") */
    friendly: string;
    /** Plain-English definition for the glossary */
    definition: string;
    /** Where this term appears in the UI */
    usedIn: string[];
}

export const TERMINOLOGY: TermEntry[] = [
    {
        key: "severity",
        canonical: "Severity",
        friendly: "Impact level",
        definition:
            "How critical the incident is, from S0 (catastrophic) to S4 (minor). Determines escalation rules and SLA timers.",
        usedIn: ["Overview", "Execute", "Context rail"],
    },
    {
        key: "approval",
        canonical: "Approval",
        friendly: "Sign-off",
        definition:
            "A formal yes/no gate that must be cleared before a sensitive action can proceed. Requires an authorized team member to approve or deny.",
        usedIn: ["Overview", "Execute"],
    },
    {
        key: "decision",
        canonical: "Decision",
        friendly: "Decision needed",
        definition:
            "A question posed during the incident that requires a human choice between predefined options (e.g. rollback vs. hotfix).",
        usedIn: ["Overview", "Execute"],
    },
    {
        key: "task",
        canonical: "Task",
        friendly: "Action item",
        definition:
            "A discrete unit of work assigned to a responder with a status (Not started → In progress → Done) and optional due time.",
        usedIn: ["Overview", "Execute"],
    },
    {
        key: "timeline",
        canonical: "Timeline",
        friendly: "Activity log",
        definition:
            "An append-only record of every significant event during the incident — status changes, notes, escalations, and resolutions.",
        usedIn: ["Overview", "Updates"],
    },
    {
        key: "incident_commander",
        canonical: "IC (Incident Commander)",
        friendly: "Lead responder",
        definition:
            "The person in charge of coordinating the incident response. Has authority to assign tasks, approve actions, and make decisions.",
        usedIn: ["Overview", "Context rail"],
    },
    {
        key: "responder",
        canonical: "Responder",
        friendly: "Team member",
        definition:
            "A person actively working on resolving the incident. Can update tasks assigned to them and add timeline entries.",
        usedIn: ["Context rail"],
    },
    {
        key: "audit_log",
        canonical: "Audit Log",
        friendly: "Change history",
        definition:
            "A tamper-resistant record of every action taken in the system — who did what, when, and on which entity. Used for compliance and post-mortems.",
        usedIn: ["Sidebar", "Updates"],
    },
    {
        key: "runbook",
        canonical: "Runbook",
        friendly: "Playbook",
        definition:
            "A predefined checklist of steps to follow for a specific type of incident. Can be activated to auto-generate tasks.",
        usedIn: ["Sidebar"],
    },
    {
        key: "task_status_todo",
        canonical: "TODO",
        friendly: "Not started",
        definition: "The task has been created but work has not begun.",
        usedIn: ["Execute"],
    },
    {
        key: "task_status_in_progress",
        canonical: "IN_PROGRESS",
        friendly: "In progress",
        definition: "A responder is actively working on this task.",
        usedIn: ["Execute"],
    },
    {
        key: "task_status_done",
        canonical: "DONE",
        friendly: "Done",
        definition: "The task has been completed successfully.",
        usedIn: ["Execute"],
    },
    {
        key: "task_status_skipped",
        canonical: "SKIPPED",
        friendly: "Blocked",
        definition:
            "The task cannot proceed due to a dependency or external blocker.",
        usedIn: ["Execute"],
    },
    {
        key: "next_steps",
        canonical: "Next Steps",
        friendly: "What to do next",
        definition:
            "The highest-priority tasks that need attention right now — in-progress work first, then upcoming items sorted by urgency.",
        usedIn: ["Overview", "Execute"],
    },
    {
        key: "impacted_services",
        canonical: "Impacted Services",
        friendly: "Affected systems",
        definition:
            "The services, systems, or infrastructure components affected by this incident.",
        usedIn: ["Overview", "Context rail"],
    },
];

// ── Helpers ────────────────────────────────────────────────

const byKey = new Map(TERMINOLOGY.map((t) => [t.key, t]));

/** Get the friendly label for a term key, with optional canonical in parentheses */
export function term(key: string, style: "friendly" | "full" = "full"): string {
    const entry = byKey.get(key);
    if (!entry) return key;
    if (style === "friendly") return entry.friendly;
    return `${entry.friendly} (${entry.canonical})`;
}

/** Get the definition tooltip text for a term key */
export function tooltip(key: string): string {
    return byKey.get(key)?.definition ?? "";
}

/** Get a term entry by key */
export function getTerm(key: string): TermEntry | undefined {
    return byKey.get(key);
}
