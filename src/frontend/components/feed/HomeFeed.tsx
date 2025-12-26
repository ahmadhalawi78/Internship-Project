import React from "react";
import Link from "next/link";
import {
  Package,
  Utensils,
  MapPin,
  Heart,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Wrench,
  BookOpen,
} from "lucide-react";
import ListingCard from "@/frontend/components/listings/ListingCard";
import EmptyState from "@/components/reusable-components/EmptyState";

export type FeedItem = {
  id: string;
  title: string;
  category:
    | "food"
    | "bartering"
    | "books"
    | "cars"
    | "electronics"
    | "furniture"
    | "clothing"
    | "tools";
  location: string;
  isFavorited?: boolean;
  userId?: string;
  imageUrl?: string | null;
  type?: string;
  createdAt?: string;
};

type HomeFeedProps = {
  items: FeedItem[];
  currentUserId?: string;
  viewMode?: "grid" | "list";
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "food":
      return Utensils;
    case "books":
      return BookOpen;
    case "cars":
      return Car;
    case "electronics":
      return Laptop;
    case "furniture":
      return Sofa;
    case "clothing":
      return Shirt;
    case "tools":
      return Wrench;
    default:
      return Package;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "food":
      return "orange";
    case "books":
      return "purple";
    case "cars":
      return "red";
    case "electronics":
      return "indigo";
    case "furniture":
      return "amber";
    case "clothing":
      return "pink";
    case "tools":
      return "emerald";
    default:
      return "blue";
  }
};

const formatLabel = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1);

export default function HomeFeed({
  items,
  currentUserId,
  viewMode = "grid",
}: HomeFeedProps) {
  // Initialize from server-provided favorites
  const [likedItems, setLikedItems] = React.useState<Set<string>>(() => {
    const initialFavorites = new Set<string>();
    items.forEach((item) => {
      if (item.isFavorited) {
        initialFavorites.add(item.id);
      }
    });
    return initialFavorites;
  });

  // Update likedItems when items change (e.g., after refetch)
  React.useEffect(() => {
    const newFavorites = new Set<string>();
    items.forEach((item) => {
      if (item.isFavorited) {
        newFavorites.add(item.id);
      }
    });
    setLikedItems(newFavorites);
  }, [items]);

  const toggleLike = (id: string) => {
    if (!currentUserId) {
      console.log("Please log in to like items");
      return;
    }

    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No listings found"
        description="Try adjusting your filters or check back later to see what's new in your community."
      />
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
        {items.map((item, index) => {
          const isLiked = currentUserId ? likedItems.has(item.id) : false;
          const badge =
            item.type === "offer"
              ? "Offer"
              : item.type === "request"
              ? "Request"
              : undefined;

          return (
            <div
              key={item.id}
              style={{
                animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
              }}
            >
              <ListingCard
                id={item.id}
                title={item.title}
                imageUrl={item.imageUrl}
                location={item.location}
                category={formatLabel(item.category)}
                badges={badge ? [badge] : []}
                isInitiallyFavorited={isLiked}
                href={`/listings/${item.id}`}
                currentUserId={currentUserId}
                createdAt={item.createdAt}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isFavoritedFromServer = item.isFavorited ?? false;
        const isLikedLocally = likedItems.has(item.id);
        const isLiked = currentUserId
          ? item.userId === currentUserId
            ? isFavoritedFromServer
            : isLikedLocally
          : false;
        const categoryColor = getCategoryColor(item.category);
        const CategoryIcon = getCategoryIcon(item.category);

        // Determine listing type badge
        const listingBadge =
          item.type === "offer"
            ? "Offer"
            : item.type === "request"
            ? "Request"
            : null;

        return (
          <Link
            key={item.id}
            href={`/listings/${item.id}`}
            className="group relative flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-blue-200 hover:bg-blue-50/20 cursor-pointer overflow-hidden"
            style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` }}
          >
            {/* Subtle background gradient on hover */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-50/0 via-blue-50/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Status indicators */}
            {listingBadge && (
              <div
                className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                  listingBadge === "Offer"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                {listingBadge}
              </div>
            )}

            <div className="relative h-28 w-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group/image shadow-sm">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-full w-full object-cover transition-all duration-300 group-hover/image:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling?.classList.remove("hidden");
                  }}
                />
              ) : null}

              {/* Fallback icon when no image */}
              <div
                className={`absolute inset-0 flex items-center justify-center bg-linear-to-br ${
                  categoryColor === "orange"
                    ? "from-orange-50 to-amber-50"
                    : categoryColor === "purple"
                    ? "from-purple-50 to-violet-50"
                    : categoryColor === "red"
                    ? "from-red-50 to-rose-50"
                    : categoryColor === "indigo"
                    ? "from-indigo-50 to-blue-50"
                    : categoryColor === "amber"
                    ? "from-amber-50 to-yellow-50"
                    : categoryColor === "pink"
                    ? "from-pink-50 to-rose-50"
                    : categoryColor === "emerald"
                    ? "from-emerald-50 to-teal-50"
                    : "from-blue-50 to-indigo-50"
                } ${item.imageUrl ? "hidden" : ""}`}
              >
                <CategoryIcon
                  className={`h-10 w-10 ${
                    categoryColor === "orange"
                      ? "text-orange-400"
                      : categoryColor === "purple"
                      ? "text-purple-400"
                      : categoryColor === "red"
                      ? "text-red-400"
                      : categoryColor === "indigo"
                      ? "text-indigo-400"
                      : categoryColor === "amber"
                      ? "text-amber-400"
                      : categoryColor === "pink"
                      ? "text-pink-400"
                      : categoryColor === "emerald"
                      ? "text-emerald-400"
                      : "text-blue-400"
                  }`}
                />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight pr-8">
                  {item.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                  className="shrink-0 p-2 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-110 active:scale-95 -mr-2 mt-3"
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${
                      isLiked
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-slate-400 hover:text-red-400"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-600 mb-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-sm">{item.location}</span>
              </div>

              {/* Additional metadata */}
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {item.createdAt && (
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">•</span>
                    <span>
                      Posted {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">•</span>
                  <span className="capitalize font-medium">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
