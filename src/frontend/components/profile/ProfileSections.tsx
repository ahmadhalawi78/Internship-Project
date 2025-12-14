"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Heart,
  MessageSquare,
  Star,
  Trash2,
  Share2,
} from "lucide-react";
import FavoritesList from "@/frontend/components/favorites/FavoritesList";
import { supabaseBrowser } from "@/frontend/lib/supabase/client";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface ProfileSectionsProps {
  userId: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
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
      </div>

      {}
      <div className="p-4 xs:p-6 sm:p-8">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="relative aspect-square bg-linear-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">📦</span>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50"
                        aria-label="Edit"
                      >
                        <Share2 size={14} />
                      </button>
                      <button
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">
                      Listing Item {i}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Posted 2 days ago
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                        Active
                      </span>
                      <span className="text-xs text-gray-600">5 views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "favorites" && (
          <FavoritesList
            items={favorites}
            isLoading={favoritesLoading}
            onRemove={(itemId) => {
              setFavorites((prev) => prev.filter((item) => item.id !== itemId));
            }}
          />
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-blue-600">R</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          Reviewer Name {i}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= 4
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0">
                        1 week ago
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      Great seller! Fast delivery and excellent communication.
                      Would recommend to anyone.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "messages" && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-emerald-600">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      User {i} Name
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      Hi, are you still selling this item...
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-gray-600">2 hours ago</p>
                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
