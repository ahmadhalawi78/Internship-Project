import { Heart, MapPin } from "lucide-react";
import React, { useState } from "react";
import { toggleFavorite } from "@/app/actions/listings";

interface SquareCardProps {
  id: string;
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  isInitiallyFavorited?: boolean;
  onFavorite?: () => void;
  onClickCard?: () => void;
  renderMedia?: () => React.ReactNode;
}

const SquareCard = ({
  id,
  title,
  location,
  onClickCard,
  renderMedia,
  category,
  categoryColor,
  isInitiallyFavorited = false,
  onFavorite,
}: SquareCardProps) => {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await toggleFavorite(id);

      if (result.success) {
        setIsFavorite(result.favorited);

        onFavorite?.();
      } else if (result.error) {
        console.error("Failed to toggle favorite:", result.error);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onClickCard}
      className="rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
    >
      <div className="h-40 w-full border-b shadow-sm flex items-center justify-center relative">
        {renderMedia && renderMedia()}

        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 text-xs px-3 py-1 rounded-full font-medium bg-${categoryColor}-100 text-${categoryColor}-600`}
        >
          {category}
        </span>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isLoading}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart
            size={16}
            className={
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
            }
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin size={14} className="mr-1" />
          {location}
        </div>
      </div>
    </div>
  );
};

export default SquareCard;
