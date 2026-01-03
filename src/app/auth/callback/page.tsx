"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/frontend/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const supabase = supabaseBrowser();
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                router.push("/");
            }
        });
    }, [router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="p-8 bg-white rounded-lg shadow-sm text-center">
                <div className="h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-medium">Signing you in...</p>
            </div>
        </div>
    );
}
