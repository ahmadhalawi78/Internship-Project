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

  // Fetch the actual profile data including full name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

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

  // Use actual full name from profile, fallback to email name
  const actualName =
    profile?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <UserProfile
      user={{
        id: user.id,
        email: user.email,
        user_metadata: {
          name: actualName,
          avatar_url: user.user_metadata?.avatar_url,
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
