import type { Decision, ApiResponse } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { wrapResponse } from "./client";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function getDecisions(
    incidentId: string
): Promise<ApiResponse<Decision[]>> {
    const { data, error } = await supabase
        .from("decisions")
        .select("*")
        .eq("incident_id", incidentId)
        .order("created_at");
    if (error) throw new Error(error.message);
    return wrapResponse(data ?? []);
}

export async function respondToDecision(
    decisionId: string,
    response: string,
    responderId: string
): Promise<ApiResponse<Decision> | null> {
    const { data, error } = await supabase
        .from("decisions")
        .update({
            response,
            responded_by: responderId,
            responded_at: new Date().toISOString(),
        })
        .eq("decision_id", decisionId)
        .select()
        .single();
    if (error || !data) return null;
    return wrapResponse(data);
}
