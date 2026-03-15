import type { TaskInstance, ApiResponse } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { wrapResponse } from "./client";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function updateTask(
    incidentId: string,
    taskId: string,
    data: Partial<Pick<TaskInstance, "status" | "assignee_id">>
): Promise<ApiResponse<TaskInstance> | null> {
    const { data: updated, error } = await supabase
        .from("task_instances")
        .update({
            ...data,
            updated_at: new Date().toISOString(),
        })
        .eq("task_id", taskId)
        .eq("incident_id", incidentId)
        .select()
        .single();

    if (error || !updated) return null;
    return wrapResponse(updated);
}
