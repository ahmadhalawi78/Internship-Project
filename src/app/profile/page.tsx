import UserProfile from "@/frontend/components/profile/UserProfile";
import { supabaseServer } from "@/backend/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUserListings, getUserFavorites } from "@/app/actions/listings";

export default async function ProfilePage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const [listingsResult, favoritesResult] = await Promise.all([
    getUserListings(),
    getUserFavorites(),
  ]);

  const listings = listingsResult.success ? listingsResult.data : [];
  const favorites = favoritesResult.success ? favoritesResult.data : [];
  const favoriteIds = favorites.map((f: any) => f.id);

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stats = {
    listings: listings.length,
    favorites: favorites.length,
    joined: `Joined ${joinedDate}`,
  };

  return (
    <UserProfile
      user={{
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata as {
          name?: string;
          avatar_url?: string;
        },
      }}
      location="Beirut, Lebanon"
      stats={stats}
      listings={listings}
      favorites={favorites}
      favoriteIds={favoriteIds}
    />
  );
}
