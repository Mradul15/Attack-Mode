import type { RunbookTemplate, PaginatedResponse, ApiResponse } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { wrapPaginated, wrapResponse } from "./client";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface RunbookFilters {
    status?: string;
    category?: string;
    q?: string;
}

export async function getRunbooks(
    filters?: RunbookFilters
): Promise<PaginatedResponse<RunbookTemplate>> {
    let query = supabase.from("runbook_templates").select("*").order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "All") {
        query = query.eq("status", filters.status);
    }
    if (filters?.category && filters.category !== "All") {
        query = query.eq("category", filters.category);
    }
    if (filters?.q) {
        query = query.ilike("name", `%${filters.q}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return wrapPaginated(data ?? []);
}

export async function getRunbook(
    id: string
): Promise<ApiResponse<RunbookTemplate> | null> {
    const { data } = await supabase
        .from("runbook_templates")
        .select("*")
        .eq("runbook_id", id)
        .single();

    if (!data) return null;
    return wrapResponse(data);
}
