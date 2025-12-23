import ListingCard from "./ListingCard";
import { Package, Heart } from "lucide-react";
import EmptyState from "@/components/reusable-components/EmptyState";

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
            <EmptyState
                icon={isFavoritesGrid ? Heart : Package}
                title={isFavoritesGrid ? "No favorites yet" : "No listings found"}
                description={emptyMessage}
                action={isFavoritesGrid ? {
                    label: "Explore Listings",
                    href: "/",
                } : undefined}
                className="py-12 border-none shadow-none bg-transparent"
            />
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
                    status={item.status as any}
                />
            ))}
        </div>
    );
}
