"use client";

import { MessageSquare, Star, Plus } from "lucide-react";
import ListingGrid from "@/frontend/components/listings/ListingGrid";
import Link from "next/link";

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
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 xs:p-6 sm:p-8">
      {activeTab === "listings" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">
              Your Listings
            </h3>
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow-sm hover:shadow-md"
            >
              <Plus size={18} />
              New Listing
            </Link>
          </div>
          <ListingGrid
            items={listings}
            emptyMessage="You haven't posted any listings yet."
            currentUserId={userId}
            favoriteIds={favoriteIds}
          />
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
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Star size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-slate-500 max-w-sm">
            Reviews from other users will appear here once they review your listings.
          </p>
        </div>
      )}

      {activeTab === "messages" && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages</h3>
          <p className="text-slate-500 max-w-sm">
            Your conversations with other users will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
