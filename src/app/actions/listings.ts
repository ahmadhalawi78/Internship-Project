"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createFavoriteNotification,
  createNotification,
} from "../actions/notificatons";

export type CreateListingInput = {
  title: string;
  description: string;
  category: string;
  location: string;
  image_url?: string;
  contact_info?: string;
  status?: "available" | "taken";
};

export async function createListing(listing: CreateListingInput) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to create a listing" };
    }

    const { data, error } = await supabase
      .from("listings")
      .insert({
        ...listing,
        user_id: userData.user.id,
        status: listing.status || "available",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating listing:", error);
      return { error: error.message };
    }

    await createNotification({
      userId: userData.user.id,
      type: "listing_created",
      title: "Listing Created",
      message: `Your listing "${listing.title}" has been created successfully.`,
      data: { listingId: data.id, listingTitle: listing.title },
      actionUrl: `/listings/${data.id}`,
    });

    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export type UpdateListingInput = Partial<CreateListingInput>;

export async function updateListing(id: string, updates: UpdateListingInput) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to update a listing" };
    }

    const { data: listing } = await supabase
      .from("listings")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!listing) {
      return { error: "Listing not found" };
    }

    if (listing.user_id !== userData.user.id) {
      return { error: "You can only update your own listings" };
    }

    const { data, error } = await supabase
      .from("listings")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating listing:", error);
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath(`/listings/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function deleteListing(id: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to delete a listing" };
    }

    const { data: listing } = await supabase
      .from("listings")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!listing) {
      return { error: "Listing not found" };
    }

    if (listing.user_id !== userData.user.id) {
      return { error: "You can only delete your own listings" };
    }

    const { error } = await supabase.from("listings").delete().eq("id", id);

    if (error) {
      console.error("Error deleting listing:", error);
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath(`/listings/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getListingById(id: string) {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        profiles:user_id (
          username,
          avatar_url,
          email
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching listing:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserListings() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to view your listings" };
    }

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user listings:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function toggleFavorite(listingId: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to favorite a listing" };
    }

    const { data: existing } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("listing_id", listingId)
      .single();

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);

      if (error) throw error;
      revalidatePath("/");
      return { success: true, favorited: false };
    } else {
      // Add to favorites
      const { error } = await supabase.from("favorites").insert({
        user_id: userData.user.id,
        listing_id: listingId,
      });

      if (error) throw error;

      // Get listing details
      const { data: listing } = await supabase
        .from("listings")
        .select("user_id, title")
        .eq("id", listingId)
        .single();

      // Only create notification if the favorite is not from the listing owner
      if (listing && listing.user_id !== userData.user.id) {
        await createFavoriteNotification(
          listingId,
          listing.title,
          userData.user.id,
          listing.user_id
        );
      }

      revalidatePath("/");
      return { success: true, favorited: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { error: "An unexpected error occurred" };
  }
}
