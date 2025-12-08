import { MapPin, Heart, Package, Utensils } from "lucide-react";
import { useState } from "react";

interface ListingCardProps {
  title: string;
  imageUrl?: string | null;
  location: string;
  category: string;
}

export default function ListingCard({
  title,
  imageUrl,
  location,
  category,
}: ListingCardProps) {
  const [isLiked, setIsLiked] = useState(false);

  const isFood = category === "Food";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-400 cursor-pointer">
      <div
        className={`relative h-48 w-full overflow-hidden transition-all duration-300 ${
          isFood
            ? "bg-linear-to-br from-orange-100 via-rose-100 to-pink-100"
            : "bg-linear-to-br from-blue-100 via-emerald-100 to-teal-100"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isFood ? (
              <Utensils className="h-24 w-24 text-orange-300 opacity-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            ) : (
              <Package className="h-24 w-24 text-blue-300 opacity-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            )}
          </div>
        )}

        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 ${
              isLiked ? "fill-red-500 text-red-500" : "text-slate-600"
            }`}
          />
        </button>

        <div className="absolute top-3 left-3">
          <span
            className={`rounded-xl px-3 py-1.5 text-xs font-black shadow-lg backdrop-blur-sm ${
              isFood
                ? "bg-orange-500/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-black text-slate-800 leading-tight line-clamp-2 transition-colors group-hover:text-blue-600">
          {title}
        </h3>

        <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-slate-500">
          <MapPin className="h-4 w-4 text-emerald-500" />
          <span>{location}</span>
        </div>
      </div>

      <div className="h-1 w-0 bg-linear-to-r from-blue-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />
    </div>
  );
}

function Demo() {
  const listings = [
    {
      title: "Vintage Camera for Trade",
      imageUrl:
        "https://images.unsplash.com/photo-1606215457740-27b951fc0304?w=400&h=300&fit=crop",
      location: "Beirut",
      category: "Bartering",
    },
    {
      title: "Fresh Organic Vegetables",
      imageUrl:
        "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
      location: "Baabda",
      category: "Food",
    },
    {
      title: "Handmade Pottery Set",
      imageUrl: "",
      location: "Jounieh",
      category: "Bartering",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-emerald-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-black bg-linear-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
          Listing Cards
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => (
            <ListingCard key={i} {...listing} />
          ))}
        </div>
      </div>
    </div>
  );
}
