"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createReview(listingId: string, rating: number, comment: string) {
    try {
        const supabase = await supabaseServer();
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user) {
            return { error: "You must be logged in to leave a review" };
        }

        // First, fetch the listing to get the owner_id (reviewed_user_id)
        const { data: listing, error: listingError } = await supabase
            .from("listings")
            .select("owner_id")
            .eq("id", listingId)
            .single();

        if (listingError || !listing) {
            console.error("Listing not found for review:", listingError);
            return { error: "Listing not found" };
        }

        const { data, error } = await supabase
            .from("reviews")
            .insert({
                listing_id: listingId,
                reviewer_id: userData.user.id,
                reviewed_user_id: listing.owner_id, // Mandatory column
                rating,
                comment,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating review:", error);
            return { error: error.message };
        }

        revalidatePath(`/listings/${listingId}`);

        return { success: true, data };
    } catch (error) {
        console.error("Server error creating review:", error);
        return { error: "An unexpected error occurred" };
    }
}

export async function getListingReviews(listingId: string) {
    try {
        const supabase = await supabaseServer();

        const { data, error } = await supabase
            .from("reviews")
            .select(`
        *,
        profiles:reviewer_id(id, full_name, avatar_url)
      `)
            .eq("listing_id", listingId)
            .order("created_at", { ascending: false });

        if (error) {
            if (error.code === "42P01") return { success: true, data: [] }; // Table missing
            console.error("Error fetching reviews:", error);
            return { error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Server error fetching reviews:", error);
        return { error: "An unexpected error occurred" };
    }
}
