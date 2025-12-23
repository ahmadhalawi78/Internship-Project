"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNotification } from "./notificatons";
import { checkIsAdmin } from "./auth";

export type ListingImageInput = {
  image_url: string;
  path: string;
  position: number;
};

export type CreateListingInput = {
  title: string;
  description: string;
  category: string;
  type: string;
  status?: string;
  quantity?: number;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  is_urgent?: boolean;
  expires_at?: string | null;
  location?: string;
  contact_info?: string;
  images?: ListingImageInput[];
};

export type UpdateListingInput = Partial<CreateListingInput>;

const LISTING_IMAGES_BUCKET = "uploads";

/**
 * Toggles the favorite status of a listing for the current user.
 */
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
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userData.user.id)
        .eq("listing_id", listingId);

      if (error) throw error;

      revalidatePath("/");
      revalidatePath(`/listings/${listingId}`);
      return { success: true, favorited: false };
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: userData.user.id,
        listing_id: listingId,
      });

      if (error) throw error;
      revalidatePath("/");
      revalidatePath(`/listings/${listingId}`);
      return { success: true, favorited: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Creates a new listing.
 */
export async function createListing(listing: CreateListingInput) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to create a listing" };
    }

    const { images, ...listingData } = listing;

    const { data, error } = await supabase
      .from("listings")
      .insert({
        ...listingData,
        owner_id: userData.user.id,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error || !data) {
      console.error("Error creating listing:", error);
      return { error: error?.message ?? "Failed to create listing" };
    }

    if (images && images.length > 0) {
      const payload = images.map((img) => ({
        listing_id: data.id,
        image_url: img.image_url,
        path: img.path,
        position: img.position,
      }));

      const { error: imagesError } = await supabase
        .from("listing_images")
        .insert(payload);

      if (imagesError) {
        console.error("Error inserting listing images:", imagesError);
      }
    }

    try {
      await createNotification({
        userId: userData.user.id,
        type: "listing_created",
        title: "Listing Created",
        message: `Your listing "${listing.title}" has been created successfully.`,
        data: { listingId: data.id, listingTitle: listing.title },
        actionUrl: `/listings/${data.id}`,
      });
    } catch (notiError) {
      console.error("Notification failed but listing was created:", notiError);
    }

    revalidatePath("/");
    return { success: true, data };
  } catch (error) {
    console.error("Server error creating listing:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function createListingAndRedirect(listing: CreateListingInput) {
  const result = await createListing(listing);
  if (result.success) {
    redirect("/");
  }
  return result;
}

export async function updateListing(id: string, updates: UpdateListingInput) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to update a listing" };
    }

    const { data: listing } = await supabase
      .from("listings")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!listing) return { error: "Listing not found" };

    if (listing.owner_id !== userData.user.id) {
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
    console.error("Server error updating listing:", error);
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
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!listing) return { error: "Listing not found" };

    if (listing.owner_id !== userData.user.id) {
      return { error: "You can only delete your own listings" };
    }

    const { data: images } = await supabase
      .from("listing_images")
      .select("path")
      .eq("listing_id", id);

    if (images && images.length > 0) {
      const paths = images.map((img) => img.path);
      await supabase.storage.from(LISTING_IMAGES_BUCKET).remove(paths);
    }

    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/");
    revalidatePath(`/listings/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Server error deleting listing:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getListingById(id: string) {
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images (id, image_url, path, position, created_at)")
      .eq("id", id)
      .single();

    if (error) return { error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error("Server error fetching listing:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserListings() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return { error: "Unauthorized" };

    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images(image_url)")
      .eq("owner_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error("Server error fetching listings:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserFavorites() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return { error: "Unauthorized" };

    const { data, error } = await supabase
      .from("favorites")
      .select(`
        listing_id,
        listings:listings (
          id, title, category, location, owner_id, created_at, status, type,
          listing_images (image_url)
        )
      `)
      .eq("user_id", userData.user.id);

    if (error) return { error: error.message };
    const favorites = data.map((item: any) => item.listings);
    return { success: true, data: favorites };
  } catch (error) {
    console.error("Server error fetching favorites:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getPendingListings() {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return { error: "Unauthorized" };

    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("listings")
      .select("*, listing_images(image_url)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) return { error: error.message };
    return { success: true, data };
  } catch (error) {
    console.error("Server error fetching pending listings:", error);
    return { error: "An unexpected error occurred" };
  }
}


export async function updateListingStatus(id: string, status: string) {
  try {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return { error: "Unauthorized" };

    const supabase = await supabaseServer();
    console.log(`Updating listing ${id} to status ${status}`);
    const { data, error } = await supabase
      .from("listings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating listing status in Supabase:", error);
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath(`/listings/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Server error updating listing status:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function markListingAsTraded(id: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to update a listing" };
    }

    const { data: listing } = await supabase
      .from("listings")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!listing) return { error: "Listing not found" };

    if (listing.owner_id !== userData.user.id) {
      return { error: "You can only update your own listings" };
    }

    const { data, error } = await supabase
      .from("listings")
      .update({
        status: "traded",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error marking listing as traded:", error);
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/profile");
    revalidatePath(`/listings/${id}`);
    return { success: true, data };
  } catch (error) {
    console.error("Server error marking listing as traded:", error);
    return { error: "An unexpected error occurred" };
  }
}
