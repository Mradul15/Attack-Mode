import type { Integration, ApiResponse } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { wrapResponse } from "./client";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function getIntegrations(): Promise<ApiResponse<Integration[]>> {
    const { data, error } = await supabase.from("integrations").select("*");
    if (error) throw new Error(error.message);
    return wrapResponse(data ?? []);
}
