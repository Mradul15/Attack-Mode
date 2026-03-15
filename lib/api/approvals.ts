import type { Approval, ApiResponse } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { wrapResponse } from "./client";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function getApprovals(
    incidentId: string
): Promise<ApiResponse<Approval[]>> {
    const { data, error } = await supabase
        .from("approvals")
        .select("*")
        .eq("incident_id", incidentId)
        .order("created_at");
    if (error) throw new Error(error.message);
    return wrapResponse(data ?? []);
}

export async function approveApproval(
    approvalId: string
): Promise<ApiResponse<Approval> | null> {
    const { data, error } = await supabase
        .from("approvals")
        .update({
            status: "APPROVED",
            resolved_at: new Date().toISOString(),
        })
        .eq("approval_id", approvalId)
        .select()
        .single();
    if (error || !data) return null;
    return wrapResponse(data);
}

export async function denyApproval(
    approvalId: string
): Promise<ApiResponse<Approval> | null> {
    const { data, error } = await supabase
        .from("approvals")
        .update({
            status: "DENIED",
            resolved_at: new Date().toISOString(),
        })
        .eq("approval_id", approvalId)
        .select()
        .single();
    if (error || !data) return null;
    return wrapResponse(data);
}
