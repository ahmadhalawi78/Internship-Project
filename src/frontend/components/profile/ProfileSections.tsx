"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Star,
  Trash2,
  Share2,
} from "lucide-react";
import FavoritesList from "@/frontend/components/favorites/FavoritesList";
import { supabaseBrowser } from "@/frontend/lib/supabase/client";

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
  onTabChange?: (tabId: string) => void;
  listings?: Listing[];
  favorites?: Listing[];
}

interface FavoriteItem {
  id: string;
  title: string;
  location: string;
  category: string;
  imageUrl?: string;
  isFavorited: boolean;
}

interface ListingRow {
  id: string;
  title: string;
  location: string | null;
  category: string | null;
  images: Array<{ url: string }> | null;
}

export default function ProfileSections({
  userId,
  activeTab: initialTab = "listings",
  onTabChange,
}: ProfileSectionsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeTab !== "favorites") return;

      setFavoritesLoading(true);
      try {
        const supabase = supabaseBrowser();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setFavorites([]);
          setFavoritesLoading(false);
          return;
        }

        const { data: favoritesData, error: favoritesError } = await supabase
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
          setFavorites([]);
        } else {
          const favoriteItems: FavoriteItem[] = (favoritesData || [])
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
          setFavorites(favoriteItems);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setFavorites([]);
      } finally {
        setFavoritesLoading(false);
      }
    };

    fetchFavorites();
  }, [activeTab, userId]);

  const tabs: Tab[] = [
    {
      id: "listings",
      label: "Listings",
      icon: <Briefcase size={18} />,
      badge: 8,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: <Heart size={18} />,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <Star size={18} />,
      badge: 5,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare size={18} />,
      badge: 3,
    },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 xs:px-6 py-4 font-medium text-sm xs:text-base border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )
    }
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group bg-white"
          >
            <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
              {item.listing_images?.[0]?.image_url ? (
                <img src={item.listing_images[0].image_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-400">📦</span>
              )}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50" aria-label="View">
                  <Share2 size={14} />
                </button>
              </div>
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h4>
              <p className="text-sm text-slate-500 mt-1 capitalize">{item.category} • {item.location}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs px-2 py-1 rounded font-medium ${item.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                  {item.status || 'Active'}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

        {activeTab === "favorites" && (
          <FavoritesList
            items={favorites}
            isLoading={favoritesLoading}
            onRemove={(itemId) => {
              setFavorites((prev) => prev.filter((item) => item.id !== itemId));
            }}
          />
        )}
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-100 p-4 xs:p-6 sm:p-8">
      {activeTab === "listings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Your Listings
            </h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              + New Listing
            </button>
          </div>
          <ListingGrid items={listings} emptyMessage="You haven't posted any listings yet." />
        </div>
      )}

      {activeTab === "favorites" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
          <ListingGrid items={favorites} emptyMessage="Start exploring and save your favorite listings!" />
        </div>
      )}

      {activeTab === "reviews" && (
        // Placeholder for Reviews
        <div className="text-center py-12">
          <Star size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">Reviews from other users will appear here.</p>
        </div>
      )}

      {activeTab === "messages" && (
        // Placeholder for Messages
        <div className="text-center py-12">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages</h3>
          <p className="text-gray-600">Your conversations will appear here.</p>
        </div>
      )}
    </div>
  );
}
