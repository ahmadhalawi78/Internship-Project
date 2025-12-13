"use client";

import { Heart } from "lucide-react";
import { useState, useCallback } from "react";
import { toggleFavorite } from "@/app/actions/listings";

interface FavoriteToggleProps {
  listingId: string;
  isInitiallyFavorited?: boolean;
  onFavoriteChange?: (isFavorited: boolean) => void;
  size?: number;
  showLabel?: boolean;
  className?: string;
  variant?: "icon" | "button";
  position?: "absolute" | "relative" | "static";
}

export default function FavoriteToggle({
  listingId,
  isInitiallyFavorited = false,
  onFavoriteChange,
  size = 20,
  showLabel = false,
  className = "",
  variant = "icon",
  position = "relative",
}: FavoriteToggleProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const result = await toggleFavorite(listingId);

        if (result.success) {
          setIsFavorited(result.favorited);
          onFavoriteChange?.(result.favorited);
        } else if (result.error) {
          if (result.error.includes("must be logged in")) {
            window.alert("You must be logged in to favorite a listing.");
          } else {
            setError(result.error);
            console.error("Failed to toggle favorite:", result.error);
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("Error toggling favorite:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [listingId, isLoading, onFavoriteChange]
  );

  if (variant === "button") {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${isFavorited
          ? "bg-red-100 text-red-700 hover:bg-red-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={size}
          className={`transition-all duration-200 ${isFavorited ? "fill-current" : ""
            }`}
        />
        {showLabel && (
          <span>{isFavorited ? "Favorited" : "Add to Favorites"}</span>
        )}
      </button>
    );
  }
  return (
    <div className={position}>
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`p-2 rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 ${isFavorited
          ? "bg-red-500/90 text-white hover:bg-red-600"
          : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
          } disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md ${className}`}
        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        title={isFavorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          size={size}
          className={`transition-all duration-200 ${isFavorited ? "fill-current" : ""
            }`}
        />
      </button>
      {error && (
        <div className="absolute top-full mt-1 text-xs text-red-600 whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
}
