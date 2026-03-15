"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { IncidentAggregate } from "@/lib/domain/models";
import type { IncidentStoreState, IncidentStoreActions } from "@/lib/state/incidentStore";

/**
 * React context that the incident layout provides to child pages.
 * Pages read data from here instead of calling useIncidentStore() directly.
 * This keeps the "only page-level containers call the store" rule intact:
 * the layout IS the container; child routes are sub-views.
 */

interface IncidentContextValue {
    state: IncidentStoreState;
    actions: IncidentStoreActions;
    /** Convenience: non-null aggregate (only available after loading) */
    aggregate: IncidentAggregate | null;
}

const IncidentContext = createContext<IncidentContextValue | null>(null);

export function IncidentContextProvider({
    state,
    actions,
    children,
}: {
    state: IncidentStoreState;
    actions: IncidentStoreActions;
    children: ReactNode;
}) {
    return (
        <IncidentContext.Provider value={{ state, actions, aggregate: state.data }}>
            {children}
        </IncidentContext.Provider>
    );
}

/**
 * Hook for child pages/components to access the incident store.
 * Must be used within the incident layout.
 */
export function useIncidentContext() {
    const ctx = useContext(IncidentContext);
    if (!ctx) throw new Error("useIncidentContext must be used within incident layout");
    return ctx;
}
