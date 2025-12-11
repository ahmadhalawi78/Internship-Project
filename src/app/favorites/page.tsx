import { supabaseServer } from "@/backend/lib/supabase/server";
import { redirect } from "next/navigation";
import FavoritesList from "@/frontend/components/favorites/FavoritesList";

interface ListingRow {
  id: string;
  title: string;
  location: string | null;
  category: string | null;
  images: Array<{ url: string }> | null;
}

export default async function FavoritesPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  const { data: favorites, error: favoritesError } = await supabase
    .from("favorites")
    .select(
      `
      listing_id,
      listings (
        id,
        title,
        location,
        category,
        images
      )
    `
    )
    .eq("user_id", user.id);

  if (favoritesError) {
    console.error("Error fetching favorites:", favoritesError);
  }
  const favoriteItems = (favorites || [])
    .filter((fav) => fav.listings)
    .map((fav) => {
      const listing = fav.listings as unknown as ListingRow;
      return {
        id: listing.id,
        title: listing.title,
        location: listing.location || "Unknown location",
        category: listing.category || "General",
        imageUrl:
          listing.images && listing.images.length > 0
            ? listing.images[0].url
            : undefined,
        isFavorited: true,
      };
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Your Favorites
          </h1>
          <p className="mt-2 text-gray-600">
            Manage all your saved listings in one place
          </p>
        </div>

        {}
        <FavoritesList items={favoriteItems} />
      </div>
    </div>
  );
}
