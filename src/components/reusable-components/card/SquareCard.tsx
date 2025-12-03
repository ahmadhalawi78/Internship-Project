import { Heart, MapPin } from 'lucide-react';
import React from 'react'
interface SquareCardProps {
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  onFavorite?: () => void; // when click on the heart
  onClickCard?: () => void; 
  renderMedia?: () => React.ReactNode;
}
const SquareCard = ({title,location,onClickCard,renderMedia,category,categoryColor,onFavorite}:SquareCardProps) => {
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
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click
            onFavorite?.();
          }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
        >
          <Heart size={16} className="text-gray-700" />
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
}
export default SquareCard