"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";

export async function checkIsAdmin() {
    const supabase = await supabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    // 1. Check Env Vars
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim());
    if (user.email && adminEmails.includes(user.email)) {
        return true;
    }

    // 2. Check DB
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role === "admin") {
            return true;
        }
    } catch (error) {
        // ignore
    }

    return false;
}
