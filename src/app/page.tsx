import { Header } from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import HomeShell from "@/frontend/components/home/HomeShell";
import { FeedItem } from "@/frontend/components/feed/HomeFeed";
import { supabaseServer } from "@/backend/lib/supabase/server";
import Link from "next/link";

type ListingRow = {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
  owner_id: string;
};

export default async function HomePage() {
  const supabase = await supabaseServer();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, category, location, owner_id")
    .order("created_at", { ascending: false });

  let favoriteIds: string[] = [];
  if (user) {
    const { data: favorites } = await supabase
      .from("favorites")
      .select("listing_id")
      .eq("user_id", user.id);

    favoriteIds = favorites?.map((fav) => fav.listing_id) || [];
  }

  if (error) {
    console.error("Error fetching listings:", error.message);
  }

  const items =
    (listings as ListingRow[] | null)?.map((row) => {
      const cat = (row.category ?? "").toLowerCase();
      // Map category to valid FeedItem category
      const validCategories: FeedItem["category"][] = [
        "food",
        "bartering",
        "books",
        "cars",
        "electronics",
        "furniture",
        "clothing",
        "tools",
      ];
      const category: FeedItem["category"] = validCategories.includes(
        cat as FeedItem["category"]
      )
        ? (cat as FeedItem["category"])
        : "bartering"; // default to bartering if category doesn't match

      return {
        id: row.id,
        title: row.title,
        category,
        location: row.location ?? "Unknown",
        isFavorited: favoriteIds.includes(row.id),
        userId: row.owner_id,
      };
    }) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />

      <main className="flex-1">
        {/* Pass currentUserId to HomeShell */}
        <HomeShell items={items} currentUserId={user?.id} />
      </main>

      <Footer />
    </div>
  );
}
