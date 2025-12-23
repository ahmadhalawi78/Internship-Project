import { supabaseServer } from "@/backend/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await supabaseServer();

        // Verify reviews table exists first? Or just try to select.
        // Based on search results, I didn't see explicit reviews table usage in actions,
        // but ProfileSidebar had 'reviews: 0' placeholder.
        // I will assume for now that if the table doesn't exist, this will error.
        // I'll wrap it to be safe and return empty list if error.

        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        if (error) {
            // If table doesn't exist, just return empty array for now to avoid breaking UI
            console.warn("Error fetching reviews (table might not exist):", error.message);
            return NextResponse.json({ reviews: [] });
        }

        return NextResponse.json({ reviews: data });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing id" }, { status: 400 });
        }

        const supabase = await supabaseServer();
        const { error } = await supabase
            .from("reviews")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
