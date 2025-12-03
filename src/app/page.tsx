import { Header } from "@/frontend/components/layout/Header";
import { Footer } from "@/frontend/components/layout/Footer";
import { HomeShell } from "@/frontend/components/home/HomeShell";
import { supabaseServer } from "@/backend/lib/supabase/server";
import type { FeedItem } from "@/frontend/components/feed/HomeFeed";

type ListingRow = {
  id: string;
  title: string;
  category: string | null;
  location: string | null;
};

export default async function HomePage() {
  const supabase = await supabaseServer();

  const { data, error } = await supabase
    .from("listings")
    .select("id, title, category, location")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching listings:", error.message);
  }

  const items: FeedItem[] =
    (data as ListingRow[] | null)?.map((row) => {
      const cat = (row.category ?? "").toLowerCase();
      const category: FeedItem["category"] =
        cat === "food" ? "food" : "bartering"; // default to bartering if weird

      return {
        id: row.id,
        title: row.title,
        category,
        location: row.location ?? "Unknown",
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
