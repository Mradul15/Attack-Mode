/**
 * Dependency injection container.
 * Wires up repository implementations and services.
 *
 * To swap mock → real backend:
 *   1. Create a real IncidentRepository implementation
 *   2. Replace mockIncidentRepository import below
 *   3. No other files need to change
 */

import { IncidentService } from "./services/incidentService";
import { supabaseIncidentRepository } from "./repositories/supabaseIncidentRepository";
import { hasPermission } from "./auth/permissions";
import type { IncidentRepository } from "./repositories/types";
import type { PermissionChecker } from "./services/incidentService";

// ── Singleton instances ──────────────────────────────────

let _incidentService: IncidentService | null = null;

export function getIncidentService(): IncidentService {
    if (!_incidentService) {
        _incidentService = new IncidentService(supabaseIncidentRepository, hasPermission);
    }
    return _incidentService;
}

/** For testing: create a service with custom dependencies */
export function createIncidentService(
    repo: IncidentRepository,
    permissionChecker: PermissionChecker = hasPermission,
): IncidentService {
    return new IncidentService(repo, permissionChecker);
}

/** Reset singletons (for testing only) */
export function _resetContainer(): void {
    _incidentService = null;
}
