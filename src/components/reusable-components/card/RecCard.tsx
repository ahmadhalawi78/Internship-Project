import { Heart, MapPin } from "lucide-react";
import React, { useState } from "react";
import { toggleFavorite } from "@/app/actions/listings";

interface RecCardProps {
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

const RecCard = ({
  id,
  title,
  location,
  onClickCard,
  renderMedia,
  category,
  categoryColor,
  isInitiallyFavorited = false,
  onFavorite,
}: RecCardProps) => {
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
      className="w-full flex items-center gap-4 rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer"
    >
      <div className="relative h-32 w-32 shrink-0 border rounded-lg overflow-hidden">
        {renderMedia && renderMedia()}
      </div>

      <div className="flex flex-col justify-between grow">
        <span
          className={`text-xs mb-1 px-3 py-1 rounded-full font-medium w-fit bg-${categoryColor}-200 text-${categoryColor}-600`}
        >
          {category}
        </span>

        <h3 className="font-semibold text-lg">{title}</h3>

        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin size={14} className="mr-1" />
          {location}
        </div>
      </div>

      <button
        onClick={handleFavorite}
        disabled={isLoading}
        className="bg-white p-2 rounded-full shadow hover:bg-gray-100 active:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Heart
          size={20}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"}
        />
      </button>
    </div>
  );
};

export default RecCard;
