"use client";

import { MessageSquare, Star, Plus } from "lucide-react";
import ListingGrid from "@/frontend/components/listings/ListingGrid";
import ListingCard from "@/frontend/components/listings/ListingCard";
import Link from "next/link";
import EmptyState from "@/components/reusable-components/EmptyState";
import { markListingAsTraded } from "@/app/actions/listings";
import { useRouter } from "next/navigation";
import Button from "@/components/reusable-components/Button";
import { getUserReceivedReviews } from "@/app/actions/reviews";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Listing {
  id: string;
  title: string;
  category: string;
  location: string;
  rating?: number;
  listing_images?: { image_url: string }[];
  created_at: string;
  status?: string;
}

interface ProfileSectionsProps {
  userId: string;
  activeTab?: string;
  listings?: Listing[];
  favorites?: Listing[];
  favoriteIds?: string[];
}

export default function ProfileSections({
  userId,
  activeTab = "listings",
  listings = [],
  favorites = [],
  favoriteIds = [],
}: ProfileSectionsProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab]);

  const fetchReviews = async () => {
    setLoadingReviews(true);
    const result = await getUserReceivedReviews();
    if (result.success) {
      setReviews(result.data || []);
    }
    setLoadingReviews(false);
  };

  const handleMarkAsTraded = async (id: string) => {
    const result = await markListingAsTraded(id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to mark as traded");
    }
  };

  const activeListings = listings.filter(
    (l) => l.status === "active" || l.status === "pending"
  );
  const previousListings = listings.filter(
    (l) =>
      l.status === "traded" || l.status === "rejected" || l.status === "expired"
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 xs:p-6 sm:p-8">
      {activeTab === "listings" && (
        <div className="space-y-12">
          {/* Active Listings Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Active Listings
              </h3>
              <Link
                href="/create-listing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm hover:shadow-md"
              >
                <Plus size={18} />
                New Listing
              </Link>
            </div>
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeListings.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3">
                    <ListingCard
                      id={item.id}
                      title={item.title}
                      imageUrl={item.listing_images?.[0]?.image_url}
                      location={item.location}
                      category={item.category}
                      rating={item.rating}
                      href={`/listings/${item.id}`}
                      isInitiallyFavorited={favoriteIds.includes(item.id)}
                      currentUserId={userId}
                      listingOwnerId={userId}
                      status={item.status as any}
                    />
                    {item.status === "active" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsTraded(item.id)}
                        className="w-full text-xs font-bold py-2 rounded-xl border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                      >
                        Mark as Traded
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Plus}
                title="No active listings"
                description="You don't have any active listings at the moment."
                className="py-12 border-none shadow-none bg-transparent"
                action={{
                  label: "Create Listing",
                  href: "/create-listing",
                }}
              />
            )}
          </div>

          {/* Previous Listings Section */}
          {previousListings.length > 0 && (
            <div className="space-y-6 pt-12 border-t border-slate-100">
              <h3 className="text-xl font-bold text-gray-900">
                Previous Listings
              </h3>
              <ListingGrid
                items={previousListings}
                currentUserId={userId}
                favoriteIds={favoriteIds}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Favorites</h3>
          <ListingGrid
            items={favorites}
            emptyMessage="Start exploring and save your favorite listings!"
            currentUserId={userId}
            favoriteIds={favoriteIds}
            isFavoritesGrid={true}
          />
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Reviews Received</h3>
          {loadingReviews ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                        {review.reviewer?.avatar_url ? (
                          <Image
                            src={review.reviewer.avatar_url}
                            alt={review.reviewer.full_name || "User"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <span className="text-sm font-bold">
                              {(review.reviewer?.full_name || "U").charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {review.reviewer?.full_name || "Anonymous"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-100">
                    <p className="text-sm font-semibold text-blue-600 mb-1">
                      On: {review.listing?.title || "Deleted Listing"}
                    </p>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Star}
              title="No reviews yet"
              description="When other users review your trades, they will appear here."
              className="border-none shadow-none bg-transparent py-12"
            />
          )}
        </div>
      )}
    </div>
  );
}
