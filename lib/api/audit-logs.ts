import type { AuditLog, PaginatedResponse, ApiResponse } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { wrapPaginated, wrapResponse } from "./client";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface AuditLogFilters {
    action?: string;
    actor?: string;
    q?: string;
}

export async function getAuditLogs(
    filters?: AuditLogFilters
): Promise<PaginatedResponse<AuditLog>> {
    let query = supabase.from("audit_events").select("*").order("created_at", { ascending: false });

    if (filters?.action && filters.action !== "All Actions") {
        query = query.eq("action", filters.action);
    }
    if (filters?.q) {
        query = query.or(`action.ilike.%${filters.q}%,actor_email.ilike.%${filters.q}%,target.ilike.%${filters.q}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return wrapPaginated(data ?? []);
}

export async function getAuditLog(
    id: string
): Promise<ApiResponse<AuditLog> | null> {
    const { data } = await supabase
        .from("audit_events")
        .select("*")
        .eq("log_id", id)
        .single();

    if (!data) return null;
    return wrapResponse(data);
}
