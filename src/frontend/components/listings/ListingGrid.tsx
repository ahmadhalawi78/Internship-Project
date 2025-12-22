import ListingCard from "./ListingCard";
import { Package } from "lucide-react";

interface Listing {
    id: string;
    title: string;
    category: string;
    location: string;
    rating?: number;
    listing_images?: { image_url: string }[];
    created_at?: string;
    status?: string;
    user_id?: string;
}

interface ListingGridProps {
    items?: Listing[];
    emptyMessage?: string;
    currentUserId?: string;
    isFavoritesGrid?: boolean;
    favoriteIds?: string[];
}

export default function ListingGrid({
    items = [],
    emptyMessage = "No listings found.",
    currentUserId,
    isFavoritesGrid = false,
    favoriteIds = [],
}: ListingGridProps) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 rounded-lg border border-slate-100">
                <Package size={48} className="text-slate-300 mb-4" />
                <p className="text-slate-600 font-medium">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
                <ListingCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    category={item.category || "General"}
                    location={item.location || "Unknown"}
                    imageUrl={
                        item.listing_images && item.listing_images.length > 0
                            ? item.listing_images[0].image_url
                            : null
                    }
                    rating={item.rating}
                    href={`/listings/${item.id}`}
                    currentUserId={currentUserId}
                    isInitiallyFavorited={isFavoritesGrid || favoriteIds.includes(item.id)}
                    listingOwnerId={(item as any).owner_id}
                />
            ))}
        </div>
    );
}
