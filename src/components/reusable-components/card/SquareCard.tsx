import { Heart, MapPin } from "lucide-react";
import React, { useState } from "react";
import { toggleFavorite } from "@/app/actions/listings";
import MessageButton from "@/frontend/components/chat/MessageButton";

interface SquareCardProps {
  id: string;
  title: string;
  location: string;
  category: string;
  isInitiallyFavorited?: boolean;
  onFavorite?: () => void;
  onClickCard?: () => void;
  renderMedia?: () => React.ReactNode;
  shouldShowMessageButton?: boolean;
  listingOwnerId?: string;
  listingTitle?: string;
}

const SquareCard = ({
  id,
  title,
  location,
  onClickCard,
  renderMedia,
  category,
  isInitiallyFavorited = false,
  onFavorite,
  shouldShowMessageButton = false,
  listingOwnerId,
  listingTitle = title,
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
      className="group rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden
        hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.98]
        w-full max-w-[480px] min-w-[300px]
        xs:max-w-[340px] xs:min-w-[260px]
        sm:max-w-none sm:min-w-[200px]
        mx-auto"
    >
      {/* Image/Media Container */}
      <div
        className="
          relative aspect-square xs:aspect-[4/3] sm:aspect-5/4 md:aspect-4/3 
          bg-gray-50 overflow-hidden border-b border-gray-100
        "
      >
        {renderMedia && renderMedia()}
        <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent"></div>

        {/* Category Badge */}
        <span
          className="
            absolute top-1.5 left-1.5 xs:top-2 xs:left-2 
            text-[11px] xs:text-xs px-1.5 xs:px-2 py-0.5
            rounded-full font-medium backdrop-blur-sm bg-white/90 
            text-gray-700 border border-white/50 truncate
            max-w-[calc(100%-3rem)] xs:max-w-[calc(100%-3.5rem)]
            transition-all duration-300 ease-out
          "
          title={category}
        >
          {category}
        </span>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          disabled={isLoading}
          className="
            absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 
            bg-white/90 backdrop-blur-sm p-1 xs:p-1.5 sm:p-2 
            rounded-full shadow-sm hover:shadow-md 
            transition-all duration-200 hover:scale-110 active:scale-95
            disabled:opacity-50 disabled:cursor-not-allowed 
            border border-white/50
            h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8
            flex items-center justify-center
          "
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`
              h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4
              transition-all duration-300 ease-out
              ${
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 group-hover:text-red-400"
              }
            `}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-2 xs:p-2.5 sm:p-4 space-y-1 xs:space-y-1.5 sm:space-y-2
        transition-all duration-300 ease-out">
        {/* Title */}
        <h3
          className="
            font-semibold text-sm xs:text-base sm:text-base 
            line-clamp-1 xs:line-clamp-2
            leading-tight xs:leading-snug
            text-gray-900 group-hover:text-blue-700 transition-colors
          "
          title={title}
        >
          {title}
        </h3>

        {/* Location */}
        <div
          className="
            flex items-center text-gray-500 text-xs xs:text-sm sm:text-sm 
            gap-0.5 xs:gap-1 sm:gap-1.5
            transition-all duration-300 ease-out
          "
        >
          <MapPin className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-3.5 sm:w-3.5 shrink-0
            transition-all duration-300 ease-out" />
          <span className="truncate leading-tight" title={location}>
            {location}
          </span>
        </div>

        {/* Message Button */}
        {shouldShowMessageButton && listingOwnerId && (
          <div className="pt-1 xs:pt-2 sm:pt-3 mt-1 xs:mt-2 sm:mt-3 border-t border-gray-100
            transition-all duration-300 ease-out">
            <MessageButton
              listingId={id}
              listingOwnerId={listingOwnerId}
              listingTitle={listingTitle}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCard;