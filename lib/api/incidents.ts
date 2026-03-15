import type {
    Incident, PaginatedResponse, ApiResponse, TaskInstance,
    TimelineEvent, Approval, Decision
} from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { wrapPaginated, wrapResponse } from "./client";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface IncidentFilters {
    status?: string;
    severity?: string;
    q?: string;
}

export interface IncidentDetail {
    incident: Incident;
    tasks: TaskInstance[];
    timeline: TimelineEvent[];
    approvals: Approval[];
    decisions: Decision[];
}

export async function getIncidents(
    filters?: IncidentFilters
): Promise<PaginatedResponse<Incident>> {
    let query = supabase.from("incidents").select("*").order("created_at", { ascending: false });

    if (filters?.status && filters.status !== "All") {
        query = query.eq("status", filters.status);
    }
    if (filters?.severity && filters.severity !== "All") {
        query = query.eq("severity", filters.severity);
    }
    if (filters?.q) {
        query = query.or(`title.ilike.%${filters.q}%,incident_id.ilike.%${filters.q}%`);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return wrapPaginated(data ?? []);
}

export async function getIncident(
    id: string
): Promise<ApiResponse<IncidentDetail> | null> {
    const { data: incident } = await supabase
        .from("incidents")
        .select("*")
        .eq("incident_id", id)
        .single();

    if (!incident) return null;

    const [tasksRes, timelineRes, approvalsRes, decisionsRes] = await Promise.all([
        supabase.from("task_instances").select("*").eq("incident_id", id).order("created_at"),
        supabase.from("timeline_events").select("*").eq("incident_id", id).order("created_at", { ascending: false }),
        supabase.from("approvals").select("*").eq("incident_id", id).order("created_at"),
        supabase.from("decisions").select("*").eq("incident_id", id).order("created_at"),
    ]);

    return wrapResponse({
        incident,
        tasks: tasksRes.data ?? [],
        timeline: timelineRes.data ?? [],
        approvals: approvalsRes.data ?? [],
        decisions: decisionsRes.data ?? [],
    });
}
