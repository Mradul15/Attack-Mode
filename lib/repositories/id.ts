/**
 * ID normalization — centralized so all repository lookups are robust.
 * Handles variations like Inc_001 / INC-001 / inc_001.
 */

/** Generic normalizer: lowercase, replace hyphens with underscores */
function normalize(raw: string): string {
    return raw.toLowerCase().replace(/-/g, "_");
}

export function normalizeIncidentId(raw: string): string {
    return normalize(raw);
}

export function normalizeTaskId(raw: string): string {
    return normalize(raw);
}

export function normalizeApprovalId(raw: string): string {
    return normalize(raw);
}

export function normalizeUserId(raw: string): string {
    return normalize(raw);
}

export function normalizeDecisionId(raw: string): string {
    return normalize(raw);
}
