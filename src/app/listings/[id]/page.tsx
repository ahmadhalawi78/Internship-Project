import { getListingById } from "@/app/actions/listings";
import { Header } from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, User, Tag, Phone } from "lucide-react";
import FavoriteToggle from "@/components/reusable-components/FavoriteToggle";
import { supabaseServer } from "@/backend/lib/supabase/server";
import ContactOwnerButton from "@/frontend/components/listings/ContactOwnerButton";
import ListingReviews from "@/frontend/components/listings/ListingReviews";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Listing Page
export default async function ListingPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getListingById(id);
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (result.error || !result.data) {
    notFound();
  }

  const listing = result.data;

  // Check if listing is favorited by current user
  let isFavorited = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("listing_id", listing.id)
      .maybeSingle();

    isFavorited = !!fav;
  }

  const mainImage = listing.listing_images?.[0]?.image_url || null;

  // Fetch owner email and details
  const { data: owner } = await supabase
    .from("profiles")
    .select("full_name, phone, created_at")
    .eq("id", listing.owner_id)
    .single();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-200 shadow-md">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <span className="text-lg font-medium">
                    No Image Available
                  </span>
                </div>
              )}

              <div className="absolute top-4 right-4 z-10">
                <FavoriteToggle
                  listingId={listing.id}
                  isInitiallyFavorited={isFavorited}
                  className="bg-white/90 backdrop-blur-sm shadow-md p-2 rounded-xl hover:scale-110 active:scale-95 transition-all"
                  currentUserId={user?.id}
                />
              </div>
            </div>

            {/* Gallery thumbnails could go here */}
            {listing.listing_images && listing.listing_images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.listing_images.slice(1).map((img: any) => (
                  <div
                    key={img.id}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200"
                  >
                    <Image
                      src={img.image_url}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 mb-3 uppercase tracking-wide">
                    {listing.category}
                  </span>
                  <h1 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                    {listing.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-500 mt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {listing.area || "Area not specified"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Posted {new Date(listing.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Description
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>

            {listing.trade_requirements && (
              <div className="bg-amber-50 rounded-2xl p-6 shadow-sm border border-amber-200">
                <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  What they're looking for
                </h2>
                <p className="text-amber-800 leading-relaxed whitespace-pre-wrap">
                  {listing.trade_requirements}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 font-bold uppercase">
                    Type
                  </span>
                  <span className="font-semibold text-slate-700 capitalize">
                    {listing.type}
                  </span>
                </div>
                {listing.quantity && (
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase">
                      Quantity
                    </span>
                    <span className="font-semibold text-slate-700">
                      {listing.quantity}
                    </span>
                  </div>
                )}
                {listing.status && (
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-bold uppercase">
                      Status
                    </span>
                    <span
                      className={`font-semibold capitalize ${
                        listing.status === "available"
                          ? "text-emerald-600"
                          : "text-slate-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Owner / Contact Action */}
            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {owner?.full_name || "Community Member"}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs text-slate-500">
                        Member since{" "}
                        {owner?.created_at
                          ? new Date(owner.created_at).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" }
                            )
                          : "Unknown"}
                      </p>
                      {owner?.phone && (
                        <div className="flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs font-bold text-emerald-700">
                            {owner.phone}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <ContactOwnerButton
                  ownerEmail={null}
                  listingTitle={listing.title}
                  ownerId={listing.owner_id}
                  listingId={listing.id}
                />
              </div>

              {/* Review Section */}
              <ListingReviews listingId={listing.id} currentUserId={user?.id} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
