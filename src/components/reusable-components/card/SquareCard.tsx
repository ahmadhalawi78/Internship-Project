import { MapPin } from "lucide-react";
import React, { useCallback } from "react";
import MessageButton from "@/frontend/components/chat/MessageButton";
import FavoriteToggle from "@/components/reusable-components/FavoriteToggle";

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
}: SquareCardProps) => {
  const handleFavoriteChange = useCallback(() => {
    if (onFavorite) onFavorite();
  }, [onFavorite]);

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
      {}
      <div
        className="
          relative aspect-square xs:aspect-[4/3] sm:aspect-5/4 md:aspect-4/3 
          bg-gray-50 overflow-hidden border-b border-gray-100
        "
      >
        {renderMedia && renderMedia()}
        <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent"></div>

        {}
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

        {}
        <div className="absolute top-1.5 right-1.5 xs:top-2 xs:right-2 sm:top-3 sm:right-3 pointer-events-auto">
          <FavoriteToggle
            listingId={id}
            isInitiallyFavorited={isInitiallyFavorited}
            onFavoriteChange={handleFavoriteChange}
            variant="icon"
            size={16}
          />
        </div>
      </div>

      {}
      <div className="p-2 xs:p-2.5 sm:p-4 space-y-1 xs:space-y-1.5 sm:space-y-2
        transition-all duration-300 ease-out">
        {}
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

        {}
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

        {}
        {shouldShowMessageButton && listingOwnerId && (
          <div className="pt-1 xs:pt-2 sm:pt-3 mt-1 xs:mt-2 sm:mt-3 border-t border-gray-100
            transition-all duration-300 ease-out">
            <MessageButton
              listingId={id}
              listingOwnerId={listingOwnerId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SquareCard;