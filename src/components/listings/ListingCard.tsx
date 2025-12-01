// src/components/listings/ListingCard.tsx
import { MapPin, Heart } from "lucide-react";

type ListingCardProps = {
    title: string;
    imageUrl: string;
    location: string;
    category: "Bartering" | "Food";
};

export const ListingCard = ({ title, imageUrl, location }: ListingCardProps) => {
    return (
        <div className="flex flex-col overflow-hidden rounded border border-slate-200 bg-white">
            <div className="h-32 w-full overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                    <button className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <Heart className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-auto flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    <span>{location}</span>
                </div>
            </div>
        </div>
    );
};
