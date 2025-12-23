import { supabaseServer } from "@/backend/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range") || "all";
        const supabase = await supabaseServer();

        // Helper to get date filter
        const getDateFilter = () => {
            const now = new Date();
            if (range === "7d") {
                now.setDate(now.getDate() - 7);
                return now.toISOString();
            }
            if (range === "30d") {
                now.setDate(now.getDate() - 30);
                return now.toISOString();
            }
            return null;
        };

        const startDate = getDateFilter();

        // Helper to fetch count with optional date filter
        const getCount = async (table: string, status?: string) => {
            let query = supabase.from(table).select("*", { count: "exact", head: true });
            if (status) {
                query = query.eq("status", status);
            }
            if (startDate) {
                query = query.gte("created_at", startDate);
            }
            const { count, error } = await query;
            if (error && error.code !== "42P01") { // Ignore missing table error
                console.error(`Error fetching ${table} stats:`, error);
            }
            return count || 0;
        };

        // 1. Listings Stats
        const totalListings = await getCount("listings");
        const activeListings = await getCount("listings", "active");
        const pendingListings = await getCount("listings", "pending");

        // 2. Users Stats
        const totalUsers = await getCount("profiles");

        // 3. Reviews Stats
        // Assuming 'reviews' table exists. 
        const totalReviews = await getCount("reviews");

        // Growth Calculation (Simple approximation: current period vs previous period is harder without complex queries, 
        // so we will just return the "New in Range" count as the primary metric if range is selected, 
        // or just total if 'all').
        // Actually, let's return totals AND 'new in range' separately if needed, 
        // but for now let's stick to the requested structure.
        // The dashboard expects totals.

        // Let's also fetch a simple time-series for the chart if range is provided
        // Fetch Chart Data (Daily counts for the range)
        const getChartData = async (table: string) => {
            const countRange = range === "7d" ? 7 : range === "30d" ? 30 : 14;
            const data = [];
            const now = new Date();

            for (let i = countRange - 1; i >= 0; i--) {
                const date = new Date();
                date.setDate(now.getDate() - i);
                const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString();
                const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString();

                const { count } = await supabase
                    .from(table)
                    .select("*", { count: "exact", head: true })
                    .gte("created_at", startOfDay)
                    .lte("created_at", endOfDay);

                data.push({
                    name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    value: count || 0
                });
            }
            return data;
        };

        const userGrowth = await getChartData("profiles");
        const listingActivity = await getChartData("listings");

        return NextResponse.json({
            totalListings,
            activeListings,
            pendingListings,
            totalUsers,
            totalReviews,
            reportedItems: 0,
            userGrowth,
            listingActivity
        });

    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
