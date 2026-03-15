"use client";

/**
 * Incident cockpit store — single source of truth via useReducer.
 * Actions call the service layer (obtained from container), then dispatch state updates.
 * Store NEVER imports mock repository or mock data directly.
 */

import { useReducer, useCallback, useRef } from "react";
import type { IncidentAggregate, TaskInstance, Approval, TimelineEvent, Decision } from "@/lib/domain/models";
import type { TaskStatus, TimelineEventType } from "@/lib/types";
import type { User } from "@/lib/types";
import type { ServiceError } from "@/lib/services/types";
import { getIncidentService } from "@/lib/container";

// ── State ────────────────────────────────────────────────

export interface IncidentStoreState {
    data: IncidentAggregate | null;
    async: {
        loading: boolean;
        error: ServiceError | null;
        lastAction: string | null;
    };
    ui: {
        approvalReasonDraft: string;
        timelineNoteDraft: string;
    };
}

const initialState: IncidentStoreState = {
    data: null,
    async: { loading: true, error: null, lastAction: null },
    ui: { approvalReasonDraft: "", timelineNoteDraft: "" },
};

// ── Actions ──────────────────────────────────────────────

type Action =
    | { type: "LOAD_START" }
    | { type: "LOAD_SUCCESS"; payload: IncidentAggregate }
    | { type: "LOAD_ERROR"; payload: ServiceError }
    | { type: "UPDATE_TASK"; payload: TaskInstance }
    | { type: "UPDATE_APPROVAL"; payload: Approval }
    | { type: "PREPEND_TIMELINE"; payload: TimelineEvent }
    | { type: "UPDATE_DECISION"; payload: Decision }
    | { type: "SET_ERROR"; payload: ServiceError }
    | { type: "CLEAR_ERROR" }
    | { type: "SET_LAST_ACTION"; payload: string }
    | { type: "SET_UI"; payload: Partial<IncidentStoreState["ui"]> };

function reducer(state: IncidentStoreState, action: Action): IncidentStoreState {
    switch (action.type) {
        case "LOAD_START":
            return { ...state, async: { ...state.async, loading: true, error: null } };
        case "LOAD_SUCCESS":
            return { ...state, data: action.payload, async: { ...state.async, loading: false, error: null } };
        case "LOAD_ERROR":
            return { ...state, async: { ...state.async, loading: false, error: action.payload } };
        case "UPDATE_TASK":
            if (!state.data) return state;
            return {
                ...state,
                data: {
                    ...state.data,
                    tasks: state.data.tasks.map((t) =>
                        t.task_id === action.payload.task_id ? action.payload : t
                    ),
                },
            };
        case "UPDATE_APPROVAL":
            if (!state.data) return state;
            return {
                ...state,
                data: {
                    ...state.data,
                    approvals: state.data.approvals.map((a) =>
                        a.approval_id === action.payload.approval_id ? action.payload : a
                    ),
                },
            };
        case "PREPEND_TIMELINE":
            if (!state.data) return state;
            return {
                ...state,
                data: {
                    ...state.data,
                    timeline: [action.payload, ...state.data.timeline],
                },
            };
        case "UPDATE_DECISION":
            if (!state.data) return state;
            return {
                ...state,
                data: {
                    ...state.data,
                    decisions: state.data.decisions.map((d) =>
                        d.decision_id === action.payload.decision_id ? action.payload : d
                    ),
                },
            };
        case "SET_ERROR":
            return { ...state, async: { ...state.async, error: action.payload } };
        case "CLEAR_ERROR":
            return { ...state, async: { ...state.async, error: null } };
        case "SET_LAST_ACTION":
            return { ...state, async: { ...state.async, lastAction: action.payload } };
        case "SET_UI":
            return { ...state, ui: { ...state.ui, ...action.payload } };
        default:
            return state;
    }
}

// ── Hook ─────────────────────────────────────────────────

function buildActorContext(user: User) {
    return {
        actorId: user.user_id,
        actorName: user.name,
        actorEmail: user.email,
        actorRole: user.role,
    };
}

/** Reload aggregate via service after mutations */
async function reloadAggregate(incidentId: string, dispatch: React.ActionDispatch<[action: Action]>) {
    const svc = getIncidentService();
    const result = await svc.loadIncident(incidentId);
    if (result.ok) {
        dispatch({ type: "LOAD_SUCCESS", payload: result.data });
    }
}

export function useIncidentStore(incidentId: string, user: User) {
    const [state, dispatch] = useReducer(reducer, initialState);
    const loadedRef = useRef(false);

    const load = useCallback(async () => {
        if (loadedRef.current) return;
        loadedRef.current = true;
        dispatch({ type: "LOAD_START" });
        const svc = getIncidentService();
        const result = await svc.loadIncident(incidentId);
        if (result.ok) {
            dispatch({ type: "LOAD_SUCCESS", payload: result.data });
        } else {
            dispatch({ type: "LOAD_ERROR", payload: result.error });
        }
    }, [incidentId]);

    const actor = buildActorContext(user);

    // ── Task Actions ─────────────────────────────────────

    const startTask = useCallback(
        async (taskId: string) => {
            const svc = getIncidentService();
            const result = await svc.startTask({ ...actor, incidentId, taskId });
            if (result.ok) {
                dispatch({ type: "SET_LAST_ACTION", payload: "startTask" });
                await reloadAggregate(incidentId, dispatch);
            } else {
                dispatch({ type: "SET_ERROR", payload: result.error });
            }
            return result;
        },
        [actor, incidentId]
    );

    const completeTask = useCallback(
        async (taskId: string) => {
            const svc = getIncidentService();
            const result = await svc.completeTask({ ...actor, incidentId, taskId });
            if (result.ok) {
                dispatch({ type: "SET_LAST_ACTION", payload: "completeTask" });
                await reloadAggregate(incidentId, dispatch);
            } else {
                dispatch({ type: "SET_ERROR", payload: result.error });
            }
            return result;
        },
        [actor, incidentId]
    );

    const updateTaskStatus = useCallback(
        async (taskId: string, newStatus: TaskStatus) => {
            const svc = getIncidentService();
            const result = await svc.updateTaskStatus({ ...actor, incidentId, taskId, newStatus });
            if (result.ok) {
                dispatch({ type: "SET_LAST_ACTION", payload: "updateTaskStatus" });
                await reloadAggregate(incidentId, dispatch);
            } else {
                dispatch({ type: "SET_ERROR", payload: result.error });
            }
            return result;
        },
        [actor, incidentId]
    );

    // ── Approval Actions ─────────────────────────────────

    const approveApproval = useCallback(
        async (approvalId: string, reason?: string) => {
            const svc = getIncidentService();
            const result = await svc.decideApproval({
                ...actor, incidentId, approvalId, decision: "APPROVED", reason,
            });
            if (result.ok) {
                dispatch({ type: "SET_LAST_ACTION", payload: "approveApproval" });
                await reloadAggregate(incidentId, dispatch);
            } else {
                dispatch({ type: "SET_ERROR", payload: result.error });
            }
            return result;
        },
        [actor, incidentId]
    );

    const denyApproval = useCallback(
        async (approvalId: string, reason?: string) => {
            const svc = getIncidentService();
            const result = await svc.decideApproval({
                ...actor, incidentId, approvalId, decision: "DENIED", reason,
            });
            if (result.ok) {
                dispatch({ type: "SET_LAST_ACTION", payload: "denyApproval" });
                await reloadAggregate(incidentId, dispatch);
            } else {
                dispatch({ type: "SET_ERROR", payload: result.error });
            }
            return result;
        },
        [actor, incidentId]
    );

    // ── Timeline Actions ─────────────────────────────────

    const addTimelineNote = useCallback(
        async (message: string, type?: TimelineEventType) => {
            const svc = getIncidentService();
            const result = await svc.addTimelineNote({ ...actor, incidentId, message, type });
            if (result.ok) {
                dispatch({ type: "SET_LAST_ACTION", payload: "addTimelineNote" });
                await reloadAggregate(incidentId, dispatch);
            } else {
                dispatch({ type: "SET_ERROR", payload: result.error });
            }
            return result;
        },
        [actor, incidentId]
    );

    // ── Decision Actions ─────────────────────────────────

    const respondToDecisionAction = useCallback(
        async (decisionId: string, response: string) => {
            const svc = getIncidentService();
            const result = await svc.respondToDecision({
                ...actor, incidentId, decisionId, response,
            });
            if (result.ok) {
                dispatch({ type: "SET_LAST_ACTION", payload: "respondToDecision" });
                await reloadAggregate(incidentId, dispatch);
            } else {
                dispatch({ type: "SET_ERROR", payload: result.error });
            }
            return result;
        },
        [actor, incidentId]
    );

    const clearError = useCallback(() => {
        dispatch({ type: "CLEAR_ERROR" });
    }, []);

    const setUi = useCallback((patch: Partial<IncidentStoreState["ui"]>) => {
        dispatch({ type: "SET_UI", payload: patch });
    }, []);

    return {
        state,
        actions: {
            load,
            startTask,
            completeTask,
            updateTaskStatus,
            approveApproval,
            denyApproval,
            addTimelineNote,
            respondToDecision: respondToDecisionAction,
            clearError,
            setUi,
        },
    };
}

export type IncidentStoreActions = ReturnType<typeof useIncidentStore>["actions"];
