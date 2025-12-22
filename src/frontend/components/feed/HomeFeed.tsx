import React from "react";
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
  const [likedItems, setLikedItems] = React.useState<Set<string>>(new Set());

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

  React.useEffect(() => {
    if (!currentUserId) {
      setLikedItems(new Set());
    }
  }, [currentUserId]);

  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50/50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-1">
            No listings found
          </p>
          <p className="text-sm text-slate-600">
            Try adjusting your filters or check back later
          </p>
        </div>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const isFavoritedFromServer = item.isFavorited ?? false;
          const isLikedLocally = likedItems.has(item.id);
          const isLiked = currentUserId
            ? item.userId === currentUserId
              ? isFavoritedFromServer
              : isLikedLocally
            : false;
          const badge = item.type === "offer" ? "Offer" : item.type === "request" ? "Request" : undefined;

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

        return (
          <div
            key={item.id}
            className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 cursor-pointer"
            style={{ animation: `fadeIn 0.4s ease-out ${index * 0.05}s both` }}
          >
            <div
              className={`relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-linear-to-br ${categoryColor === "orange"
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
                }`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <CategoryIcon
                  className={`h-10 w-10 ${categoryColor === "orange"
                    ? "text-orange-300"
                    : categoryColor === "purple"
                      ? "text-purple-300"
                      : categoryColor === "red"
                        ? "text-red-300"
                        : categoryColor === "indigo"
                          ? "text-indigo-300"
                          : categoryColor === "amber"
                            ? "text-amber-300"
                            : categoryColor === "pink"
                              ? "text-pink-300"
                              : categoryColor === "emerald"
                                ? "text-emerald-300"
                                : "text-blue-300"
                    }`}
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(item.id);
                  }}
                  className="shrink-0 p-1.5 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-200 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-400"
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-medium">{item.location}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
