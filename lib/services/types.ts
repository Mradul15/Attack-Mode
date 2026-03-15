/**
 * Stable service-layer return contract.
 * All service methods return ServiceResult<T> — never throw for expected failures.
 */

export type ErrorCode =
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "INVALID_TRANSITION"
    | "INVALID_INPUT"
    | "CONFLICT"
    | "INTERNAL";

export interface ServiceError {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown>;
}

export type ServiceResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: ServiceError };
