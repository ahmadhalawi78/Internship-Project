import { MapPin } from "lucide-react";
import React, { useCallback } from "react";
import FavoriteToggle from "@/components/reusable-components/FavoriteToggle";

interface RecCardProps {
  id: string;
  title: string;
  location: string;
  category: string;
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
  isInitiallyFavorited = false,
  onFavorite,
}: RecCardProps) => {
  const handleFavoriteChange = useCallback(() => {
    if (onFavorite) onFavorite();
  }, [onFavorite]);

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
      <div onClick={(e) => e.stopPropagation()} className="shrink-0 max-[199px]:self-end max-[199px]:mt-2">
        <FavoriteToggle
          listingId={id}
          isInitiallyFavorited={isInitiallyFavorited}
          onFavoriteChange={handleFavoriteChange}
          variant="icon"
          size={16}
        />
      </div>
    </div>


  );
};

export default RecCard;
