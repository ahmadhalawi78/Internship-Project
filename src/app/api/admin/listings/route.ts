import { supabaseServer } from "@/backend/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get("status") || "pending";
        const supabase = await supabaseServer();

        const { data, error } = await supabase
            .from("listings")
            .select(`
        *,
        listing_images (
          image_url
        )
      `)
            .eq("status", status)
            .order("created_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ listings: data });
    } catch (error) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, rejectionReason } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const supabase = await supabaseServer();

        // Prepare update data
        const updateData: any = { status };
        // If we had a rejection_reason column, we would update it:
        // if (status === 'rejected' && rejectionReason) updateData.rejection_reason = rejectionReason;

        const { error } = await supabase
            .from("listings")
            .update(updateData)
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
