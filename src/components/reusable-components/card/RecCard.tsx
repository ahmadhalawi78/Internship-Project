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
      className="
    w-full 
    flex max-[199px]:flex-col max-[199px]:items-start 
    items-center 
    gap-2 sm:gap-3 
    rounded-xl shadow-sm p-3 hover:shadow-md 
    transition cursor-pointer
    min-h-[88px]
  "
    >
      {/* Image */}
      <div
        className="
      relative 
      h-16 w-24 
      xs:h-20 xs:w-28 
      sm:h-24 sm:w-36 
      shrink-0 
      border rounded-lg overflow-hidden bg-gray-100
      max-[199px]:w-full max-[199px]:h-28
    "
      >
        {renderMedia && renderMedia()}
      </div>

      {/* Content */}
      <div
        className="
      flex flex-col flex-1 min-w-0 
      max-[199px]:w-full max-[199px]:mt-2
  "
      >
        <span
          className={`
        text-[11px] sm:text-xs px-2 py-1 rounded-full font-medium w-fit 
        bg-white text-black truncate
      `}
        >
          {category}
        </span>

        <h3 className="font-semibold text-sm sm:text-base mt-1 leading-tight line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center text-gray-500 text-xs sm:text-sm mt-1">
          <MapPin size={12} className="mr-1" />
          <span className="truncate">{location}</span>
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        disabled={isLoading}
        className="
      bg-white p-1.5 sm:p-2 rounded-full shadow 
      hover:bg-gray-100 active:bg-gray-200 transition 
      shrink-0 
      max-[199px]:self-end max-[199px]:mt-2
    "
      >
        <Heart
          size={16}
          className={`${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-700"
          }`}
        />
      </button>
    </div>
  );
};

export default RecCard;
