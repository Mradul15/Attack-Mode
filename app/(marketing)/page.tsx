import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MarketingPage from "./MarketingPage";

export default async function LandingPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect("/dashboard");
    }

    return <MarketingPage />;
}
