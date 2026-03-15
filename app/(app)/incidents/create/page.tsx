"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMe } from "@/lib/auth/auth-context";
import { getIncidentService } from "@/lib/container";
import { getRunbooks } from "@/lib/api/runbooks";
import { getUsers } from "@/lib/api/users";
import { getIntegrations } from "@/lib/api/integrations";
import type { RunbookTemplate, User, Integration, Severity } from "@/lib/types";

// ── Step labels ──────────────────────────────────────────
const STEPS = ["Basics", "Runbook", "People", "Integrations", "Review"] as const;
type StepIndex = 0 | 1 | 2 | 3 | 4;

const SEVERITIES: Severity[] = ["S0", "S1", "S2", "S3", "S4"];
const SEVERITY_LABELS: Record<Severity, string> = {
    S0: "S0 — Critical",
    S1: "S1 — High",
    S2: "S2 — Medium",
    S3: "S3 — Low",
    S4: "S4 — Informational",
};

const SERVICES = [
    "auth-service", "payment-gateway", "user-api", "notification-service",
    "data-pipeline", "cdn-edge", "search-index", "billing-service",
];

// ── Form state ───────────────────────────────────────────
interface FormState {
    title: string;
    description: string;
    severity: Severity | "";
    impacted_services: string[];
    tags: string[];
    tagInput: string;
    runbook_id: string;
    ic_user_id: string;
    responder_ids: string[];
    observer_ids: string[];
    integration_ids: string[];
}

const initialForm: FormState = {
    title: "",
    description: "",
    severity: "",
    impacted_services: [],
    tags: [],
    tagInput: "",
    runbook_id: "",
    ic_user_id: "",
    responder_ids: [],
    observer_ids: [],
    integration_ids: [],
};

// ── Validation ───────────────────────────────────────────
interface StepErrors {
    title?: string;
    severity?: string;
    runbook_id?: string;
    ic_user_id?: string;
    responder_ids?: string;
}

function validateStep(step: StepIndex, form: FormState): StepErrors {
    const errors: StepErrors = {};
    if (step === 0) {
        if (!form.title.trim()) errors.title = "Title is required";
        if (!form.severity) errors.severity = "Severity is required";
    }
    if (step === 1) {
        if (!form.runbook_id) errors.runbook_id = "Select a response runbook";
    }
    if (step === 2) {
        if (!form.ic_user_id) errors.ic_user_id = "Incident commander is required";
        if (!form.responder_ids.length) errors.responder_ids = "At least one responder is required";
    }
    return errors;
}

function isStepValid(step: StepIndex, form: FormState): boolean {
    return Object.keys(validateStep(step, form)).length === 0;
}

// ── Main component ───────────────────────────────────────
export default function CreateIncidentPage() {
    const router = useRouter();
    const { user, can, role } = useMe();
    const hasPermission = can("incident.create");

    const [step, setStep] = useState<StepIndex>(0);
    const [form, setForm] = useState<FormState>(initialForm);
    const [errors, setErrors] = useState<StepErrors>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Reference data
    const [runbooks, setRunbooks] = useState<RunbookTemplate[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        if (!hasPermission) return;
        Promise.all([
            getRunbooks({ status: "PUBLISHED" }),
            getIntegrations(),
        ]).then(([rb, ig]) => {
            setRunbooks(rb.data);
            setIntegrations(ig.data);
            setUsers(getUsers());
            setDataLoading(false);
        });
    }, [hasPermission]);

    const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }, []);

    function goNext() {
        const stepErrors = validateStep(step, form);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }
        setErrors({});
        if (step < 4) setStep((step + 1) as StepIndex);
    }

    function goBack() {
        if (step > 0) setStep((step - 1) as StepIndex);
    }

    async function handleSubmit() {
        // Final validation
        for (let s = 0; s <= 2; s++) {
            const stepErrors = validateStep(s as StepIndex, form);
            if (Object.keys(stepErrors).length > 0) {
                setStep(s as StepIndex);
                setErrors(stepErrors);
                return;
            }
        }

        setSubmitting(true);
        setSubmitError(null);

        const service = getIncidentService();
        const result = await service.createIncident({
            actorId: user.user_id,
            actorName: user.name,
            actorEmail: user.email,
            actorRole: role,
            title: form.title.trim(),
            description: form.description.trim() || undefined,
            severity: form.severity as Severity,
            ic_user_id: form.ic_user_id,
            responder_ids: form.responder_ids,
            impacted_services: form.impacted_services,
            tags: form.tags,
            runbook_id: form.runbook_id || undefined,
            integration_ids: form.integration_ids,
        });

        if (result.ok) {
            router.push(`/incidents/${result.data.incident.incident_id}`);
        } else {
            setSubmitError(result.error.message);
            setSubmitting(false);
        }
    }

    // ── Access denied state ──────────────────────────────
    if (!hasPermission) {
        return (
            <div className="flex h-80 flex-col items-center justify-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl">🔒</div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Access Denied</h2>
                <p className="max-w-sm text-center text-sm text-[var(--color-text-muted)]">
                    You need <strong className="text-[var(--color-text-secondary)]">incident.create</strong> permission to create incidents. Your current role is <strong className="text-[var(--color-text-secondary)]">{role}</strong>.
                </p>
                <Link href="/incidents" className="btn-secondary text-sm">
                    Back to Incidents
                </Link>
            </div>
        );
    }

    // ── Loading state ────────────────────────────────────
    if (dataLoading) {
        return (
            <div className="max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Create Incident</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">Launch a new incident response workflow.</p>
                </div>
                <div className="space-y-4 stagger-children">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-16 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const selectedRunbook = runbooks.find((r) => r.runbook_id === form.runbook_id);
    const selectedIC = users.find((u) => u.user_id === form.ic_user_id);

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">Create Incident</h1>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">Launch a new incident response workflow.</p>
            </div>

            {/* Stepper */}
            <div className="mb-8 flex items-center gap-1">
                {STEPS.map((label, i) => {
                    const isActive = i === step;
                    const isComplete = i < step;
                    const isValid = isStepValid(i as StepIndex, form);
                    return (
                        <button
                            key={label}
                            onClick={() => {
                                // Allow going to any prior/current step, or next if current is valid
                                if (i <= step || isStepValid(step, form)) {
                                    setErrors({});
                                    setStep(i as StepIndex);
                                }
                            }}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${isActive
                                    ? "bg-[var(--color-accent)] text-white"
                                    : isComplete && isValid
                                        ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                                        : "bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                                }`}
                        >
                            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${isActive
                                    ? "bg-white/20 text-white"
                                    : isComplete && isValid
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-[var(--color-bg-active)] text-[var(--color-text-muted)]"
                                }`}>
                                {isComplete && isValid ? "✓" : i + 1}
                            </span>
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Step content */}
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 animate-fade-in-up" key={step}>
                {step === 0 && (
                    <StepBasics form={form} errors={errors} update={update} />
                )}
                {step === 1 && (
                    <StepRunbook
                        form={form}
                        errors={errors}
                        runbooks={runbooks}
                        update={update}
                    />
                )}
                {step === 2 && (
                    <StepPeople
                        form={form}
                        errors={errors}
                        users={users}
                        update={update}
                    />
                )}
                {step === 3 && (
                    <StepIntegrations
                        form={form}
                        integrations={integrations}
                        update={update}
                    />
                )}
                {step === 4 && (
                    <StepReview
                        form={form}
                        selectedRunbook={selectedRunbook}
                        selectedIC={selectedIC}
                        users={users}
                        integrations={integrations}
                    />
                )}
            </div>

            {/* Submit error */}
            {submitError && (
                <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {submitError}
                </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={goBack}
                    disabled={step === 0}
                    className="btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ← Back
                </button>
                <div className="flex gap-3">
                    {step < 4 ? (
                        <button onClick={goNext} className="btn-primary text-sm">
                            Continue →
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-primary text-sm disabled:opacity-50"
                        >
                            {submitting ? "Creating…" : "Create Incident"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// Step Components (props-only, no service/store/repo imports)
// ═══════════════════════════════════════════════════════════

interface StepProps {
    form: FormState;
    errors: StepErrors;
    update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

// ── Step 1: Basics ───────────────────────────────────────
function StepBasics({ form, errors, update }: StepProps) {
    function addTag() {
        const tag = form.tagInput.trim();
        if (tag && !form.tags.includes(tag)) {
            update("tags", [...form.tags, tag]);
            update("tagInput", "");
        }
    }

    return (
        <div className="space-y-5">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Incident Details</h2>

            {/* Title */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Title <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Auth service latency spike"
                    className={`input text-sm ${errors.title ? "!border-red-500" : ""}`}
                />
                {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
            </div>

            {/* Severity */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Severity <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {SEVERITIES.map((sev) => (
                        <button
                            key={sev}
                            onClick={() => update("severity", sev)}
                            className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${form.severity === sev
                                    ? sev === "S0"
                                        ? "border-red-500 bg-red-500/15 text-red-400"
                                        : sev === "S1"
                                            ? "border-orange-500 bg-orange-500/15 text-orange-400"
                                            : sev === "S2"
                                                ? "border-yellow-500 bg-yellow-500/15 text-yellow-400"
                                                : "border-green-500 bg-green-500/15 text-green-400"
                                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-bg-active)] hover:bg-[var(--color-bg-hover)]"
                                }`}
                        >
                            {SEVERITY_LABELS[sev]}
                        </button>
                    ))}
                </div>
                {errors.severity && <p className="mt-1 text-xs text-red-400">{errors.severity}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Description
                </label>
                <textarea
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    placeholder="Brief summary of the incident…"
                    rows={3}
                    className="input text-sm resize-none"
                />
            </div>

            {/* Impacted Services */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Impacted Services
                </label>
                <div className="flex flex-wrap gap-2">
                    {SERVICES.map((svc) => (
                        <button
                            key={svc}
                            onClick={() => {
                                const current = form.impacted_services;
                                update(
                                    "impacted_services",
                                    current.includes(svc)
                                        ? current.filter((s) => s !== svc)
                                        : [...current, svc]
                                );
                            }}
                            className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-all ${form.impacted_services.includes(svc)
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                                    : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                                }`}
                        >
                            {svc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Tags
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={form.tagInput}
                        onChange={(e) => update("tagInput", e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                        placeholder="Add tag…"
                        className="input flex-1 text-sm"
                    />
                    <button
                        onClick={addTag}
                        className="btn-secondary text-sm"
                    >
                        Add
                    </button>
                </div>
                {form.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {form.tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-md bg-[var(--color-bg-active)] px-2 py-1 text-xs text-[var(--color-text-secondary)]"
                            >
                                {tag}
                                <button
                                    onClick={() => update("tags", form.tags.filter((t) => t !== tag))}
                                    className="text-[var(--color-text-muted)] hover:text-red-400"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Step 2: Runbook ──────────────────────────────────────
interface StepRunbookProps extends StepProps {
    runbooks: RunbookTemplate[];
}

function StepRunbook({ form, errors, runbooks, update }: StepRunbookProps) {
    const published = runbooks.filter((r) => r.status === "PUBLISHED");

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Response Runbook</h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Select a published runbook to seed the incident&apos;s task list.
                </p>
            </div>

            {errors.runbook_id && <p className="text-xs text-red-400">{errors.runbook_id}</p>}

            <div className="space-y-2">
                {published.map((rb) => {
                    const isSelected = form.runbook_id === rb.runbook_id;
                    return (
                        <button
                            key={rb.runbook_id}
                            onClick={() => update("runbook_id", rb.runbook_id)}
                            className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${isSelected
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                                    : "border-[var(--color-border)] hover:border-[var(--color-bg-active)] hover:bg-[var(--color-bg-hover)]"
                                }`}
                        >
                            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isSelected
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                                    : "border-[var(--color-border)]"
                                }`}>
                                {isSelected && <span className="text-white text-[10px]">✓</span>}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className={`font-medium ${isSelected ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)]"}`}>
                                    {rb.name}
                                </p>
                                {rb.description && (
                                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)] line-clamp-2">{rb.description}</p>
                                )}
                                <div className="mt-2 flex items-center gap-4 text-xs text-[var(--color-text-muted)]">
                                    <span>v{rb.version}</span>
                                    <span>{rb.tasks.length} tasks</span>
                                    <span className="capitalize">{rb.category.replace(/_/g, " ").toLowerCase()}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {published.length === 0 && (
                <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-6 text-center text-sm text-[var(--color-text-muted)]">
                    No published runbooks available. You can still create the incident without a runbook.
                </div>
            )}
        </div>
    );
}

// ── Step 3: People ───────────────────────────────────────
interface StepPeopleProps extends StepProps {
    users: User[];
}

function StepPeople({ form, errors, users, update }: StepPeopleProps) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">People Assignment</h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Assign an incident commander and response team members.
                </p>
            </div>

            {/* Incident Commander */}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Incident Commander <span className="text-red-400">*</span>
                </label>
                <div className="space-y-1.5">
                    {users.map((u) => (
                        <button
                            key={u.user_id}
                            onClick={() => update("ic_user_id", u.user_id)}
                            className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${form.ic_user_id === u.user_id
                                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                                    : "border-[var(--color-border)] hover:bg-[var(--color-bg-hover)]"
                                }`}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-active)] text-xs font-semibold text-[var(--color-text-secondary)]">
                                {u.name.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-[var(--color-text-primary)]">{u.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{u.role} · {u.email}</p>
                            </div>
                            {form.ic_user_id === u.user_id && (
                                <span className="text-xs font-semibold text-[var(--color-accent)]">IC</span>
                            )}
                        </button>
                    ))}
                </div>
                {errors.ic_user_id && <p className="mt-1 text-xs text-red-400">{errors.ic_user_id}</p>}
            </div>

            {/* Responders */}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Responders <span className="text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {users.filter((u) => u.user_id !== form.ic_user_id).map((u) => {
                        const isSelected = form.responder_ids.includes(u.user_id);
                        return (
                            <button
                                key={u.user_id}
                                onClick={() => {
                                    update(
                                        "responder_ids",
                                        isSelected
                                            ? form.responder_ids.filter((id) => id !== u.user_id)
                                            : [...form.responder_ids, u.user_id]
                                    );
                                }}
                                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${isSelected
                                        ? "border-blue-500 bg-blue-500/10 text-blue-400"
                                        : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                                    }`}
                            >
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-bg-active)] text-[10px] font-semibold text-[var(--color-text-muted)]">
                                    {u.name.split(" ").map((n) => n[0]).join("")}
                                </span>
                                {u.name}
                                {isSelected && <span className="text-xs">✓</span>}
                            </button>
                        );
                    })}
                </div>
                {errors.responder_ids && <p className="mt-1 text-xs text-red-400">{errors.responder_ids}</p>}
            </div>

            {/* Observers */}
            <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Observers <span className="text-[var(--color-text-muted)]">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {users
                        .filter((u) => u.user_id !== form.ic_user_id && !form.responder_ids.includes(u.user_id))
                        .map((u) => {
                            const isSelected = form.observer_ids.includes(u.user_id);
                            return (
                                <button
                                    key={u.user_id}
                                    onClick={() => {
                                        update(
                                            "observer_ids",
                                            isSelected
                                                ? form.observer_ids.filter((id) => id !== u.user_id)
                                                : [...form.observer_ids, u.user_id]
                                        );
                                    }}
                                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${isSelected
                                            ? "border-zinc-500 bg-zinc-500/10 text-zinc-300"
                                            : "border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)]"
                                        }`}
                                >
                                    {u.name}
                                    {isSelected && <span className="text-xs">👁</span>}
                                </button>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

// ── Step 4: Integrations ─────────────────────────────────
interface StepIntegrationsProps {
    form: FormState;
    integrations: Integration[];
    update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

function StepIntegrations({ form, integrations, update }: StepIntegrationsProps) {
    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Integrations</h2>
                <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Choose which integrations to activate for this incident.
                </p>
            </div>

            <div className="space-y-2">
                {integrations.map((ig) => {
                    const isConnected = ig.health === "connected";
                    const isSelected = form.integration_ids.includes(ig.integration_id);
                    return (
                        <button
                            key={ig.integration_id}
                            onClick={() => {
                                if (!isConnected) return;
                                update(
                                    "integration_ids",
                                    isSelected
                                        ? form.integration_ids.filter((id) => id !== ig.integration_id)
                                        : [...form.integration_ids, ig.integration_id]
                                );
                            }}
                            disabled={!isConnected}
                            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${!isConnected
                                    ? "cursor-not-allowed border-[var(--color-border)] opacity-50"
                                    : isSelected
                                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                                        : "border-[var(--color-border)] hover:border-[var(--color-bg-active)] hover:bg-[var(--color-bg-hover)]"
                                }`}
                        >
                            <span className="text-2xl">{ig.icon}</span>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-[var(--color-text-primary)]">{ig.name}</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{ig.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`inline-block h-2 w-2 rounded-full ${ig.health === "connected" ? "bg-green-500" :
                                        ig.health === "degraded" ? "bg-yellow-500" : "bg-zinc-500"
                                    }`} />
                                <span className="text-xs text-[var(--color-text-muted)] capitalize">{ig.health}</span>
                            </div>
                            {isConnected && (
                                <div className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${isSelected ? "bg-[var(--color-accent)]" : "bg-[var(--color-bg-active)]"
                                    }`}>
                                    <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${isSelected ? "translate-x-4" : "translate-x-0"
                                        }`} />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Step 5: Review ───────────────────────────────────────
interface StepReviewProps {
    form: FormState;
    selectedRunbook?: RunbookTemplate;
    selectedIC?: User;
    users: User[];
    integrations: Integration[];
}

function StepReview({ form, selectedRunbook, selectedIC, users, integrations }: StepReviewProps) {
    const responders = users.filter((u) => form.responder_ids.includes(u.user_id));
    const observers = users.filter((u) => form.observer_ids.includes(u.user_id));
    const selectedIntegrations = integrations.filter((i) => form.integration_ids.includes(i.integration_id));

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Review &amp; Create</h2>

            {/* Basics */}
            <ReviewSection title="Incident Details">
                <ReviewRow label="Title" value={form.title} />
                <ReviewRow label="Severity" value={form.severity ? SEVERITY_LABELS[form.severity as Severity] : "—"} />
                {form.description && <ReviewRow label="Description" value={form.description} />}
                {form.impacted_services.length > 0 && (
                    <ReviewRow label="Services" value={form.impacted_services.join(", ")} />
                )}
                {form.tags.length > 0 && <ReviewRow label="Tags" value={form.tags.join(", ")} />}
            </ReviewSection>

            {/* Runbook */}
            <ReviewSection title="Response Runbook">
                {selectedRunbook ? (
                    <>
                        <ReviewRow label="Runbook" value={selectedRunbook.name} />
                        <ReviewRow label="Version" value={`v${selectedRunbook.version}`} />
                        <ReviewRow label="Tasks" value={`${selectedRunbook.tasks.length} tasks will be created`} />
                    </>
                ) : (
                    <p className="text-sm text-[var(--color-text-muted)]">No runbook selected</p>
                )}
            </ReviewSection>

            {/* People */}
            <ReviewSection title="Response Team">
                <ReviewRow label="Incident Commander" value={selectedIC?.name ?? "—"} />
                <ReviewRow label="Responders" value={responders.map((u) => u.name).join(", ") || "—"} />
                {observers.length > 0 && (
                    <ReviewRow label="Observers" value={observers.map((u) => u.name).join(", ")} />
                )}
            </ReviewSection>

            {/* Integrations */}
            <ReviewSection title="Integrations">
                {selectedIntegrations.length > 0 ? (
                    selectedIntegrations.map((ig) => (
                        <ReviewRow key={ig.integration_id} label={ig.name} value="Enabled" />
                    ))
                ) : (
                    <p className="text-sm text-[var(--color-text-muted)]">No integrations selected</p>
                )}
            </ReviewSection>
        </div>
    );
}

// ── Review helpers ───────────────────────────────────────
function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-root)] p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{title}</h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start gap-4 text-sm">
            <span className="w-36 shrink-0 text-[var(--color-text-muted)]">{label}</span>
            <span className="text-[var(--color-text-primary)]">{value}</span>
        </div>
    );
}
