import { Heart, MapPin } from 'lucide-react';
import React from 'react'
interface RecCardProps {
  title: string;
  location: string;
  category: string;
  categoryColor: string;
  onFavorite?: () => void; //on the heart
  onClickCard?: () => void; 
  renderMedia?: () => React.ReactNode;
}
const RecCard = ({title,location,onClickCard,renderMedia,category,categoryColor,onFavorite}:RecCardProps) => {
    return (
        <div
            onClick={onClickCard}
            className="w-full flex items-center gap-4 rounded-xl shadow-sm p-4 hover:shadow-md transition cursor-pointer"
        >
            {/* Render either the image or the icon */}
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
                onClick={(e: { stopPropagation: () => void; }) => {
                    e.stopPropagation(); // Prevent card click
                    onFavorite?.();
                } }
                className="bg-white p-2 rounded-full shadow hover:bg-gray-100 active:bg-gray-200 transition"
            >
                <Heart size={20} className="text-gray-700" />
            </button>
        </div>
    );
}

export default RecCard