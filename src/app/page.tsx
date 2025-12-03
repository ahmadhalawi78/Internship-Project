// src/app/page.tsx
import { Header } from "@/frontend/components/layout/Header";
import { Footer } from "@/frontend/components/layout/Footer";
import { HomeShell } from "@/frontend/components/home/HomeShell";
import { supabaseServer } from "@/backend/lib/supabase/server";

type ListingRow = {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
};

export default async function HomePage() {
  const supabase = await supabaseServer();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("id, title, category, location")
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
      const category =
        cat === "food" ? ("food" as const) : ("bartering" as const);

      return {
        id: row.id,
        title: row.title,
        category,
        location: row.location ?? "Unknown",
        isFavorited: favoriteIds.includes(row.id),
      };
    }) ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />

      <main className="flex-1">
        <HomeShell items={items} />
      </main>

      <Footer />
    </div>
  );
}
