"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
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
  currentUserId?: string | null;
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
  currentUserId,
}: FavoriteToggleProps) {
  const [isFavorited, setIsFavorited] = useState(isInitiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsFavorited(isInitiallyFavorited);
  }, [isInitiallyFavorited]);

  const handleToggleFavorite = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Client-side auth check
      if (currentUserId === undefined) {
        // If prop not passed, rely on server (fallback), but we try to always pass it.
      } else if (!currentUserId) {
        router.push("/auth/login");
        return;
      }

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
            router.push("/auth/login");
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
    [listingId, isLoading, onFavoriteChange, router]
  );

  if (variant === "button") {
    return (
      <button
        onClick={handleToggleFavorite}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${isFavorited
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
        className={`p-2 rounded-full shadow-sm backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${isFavorited
          ? "bg-white/90 text-red-500 hover:bg-white hover:text-red-600"
          : "bg-white/90 text-slate-400 hover:bg-white hover:text-red-500"
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
