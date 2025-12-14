"use client";

import { useEffect, useState } from "react";
import { Heart, Grid3x3, List } from "lucide-react";
import Image from "next/image";
import FavoriteToggle from "@/components/reusable-components/FavoriteToggle";

interface FavoriteItem {
  id: string;
  title: string;
  location: string;
  category: string;
  imageUrl?: string;
  isFavorited: boolean;
}

interface FavoritesListProps {
  items: FavoriteItem[];
  isLoading?: boolean;
  onRemove?: (itemId: string) => void;
}

export default function FavoritesList({
  items,
  isLoading = false,
  onRemove,
}: FavoritesListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [displayItems, setDisplayItems] = useState<FavoriteItem[]>(items);

  useEffect(() => {
    setDisplayItems(items);
  }, [items]);

  const handleRemoveFavorite = (itemId: string) => {
    setDisplayItems((prev) => prev.filter((item) => item.id !== itemId));
    onRemove?.(itemId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <p className="mt-2 text-gray-600">Loading favorites...</p>
        </div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No favorites yet
        </h3>
        <p className="text-gray-600">
          Start exploring and save your favorite listings to view them later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <Heart size={20} className="text-red-500" />
          <h2 className="font-semibold text-gray-900">
            {displayItems.length} Favorite{displayItems.length !== 1 ? "s" : ""}
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Grid view"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded transition-colors ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              {}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-slate-100">
                    <span className="text-4xl">📦</span>
                  </div>
                )}

                {}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <FavoriteToggle
                    listingId={item.id}
                    isInitiallyFavorited={true}
                    onFavoriteChange={(isFavorited) => {
                      if (!isFavorited) {
                        handleRemoveFavorite(item.id);
                      }
                    }}
                    size={24}
                    variant="icon"
                  />
                </div>

                {}
                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                  {item.category}
                </div>
              </div>

              {}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {}
      {viewMode === "list" && (
        <div className="space-y-3">
          {displayItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow group"
            >
              {}
              <div className="relative h-20 w-20 shrink-0 rounded overflow-hidden bg-gray-100">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-100 to-slate-100">
                    <span className="text-lg">📦</span>
                  </div>
                )}
              </div>

              {}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {item.location}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  {item.category}
                </span>
              </div>

              {}
              <div className="flex items-center gap-2">
                <FavoriteToggle
                  listingId={item.id}
                  isInitiallyFavorited={true}
                  onFavoriteChange={(isFavorited) => {
                    if (!isFavorited) {
                      handleRemoveFavorite(item.id);
                    }
                  }}
                  size={20}
                  variant="icon"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
