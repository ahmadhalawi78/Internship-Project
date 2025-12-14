import { MapPin, Package, Utensils, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FavoriteToggle from "@/components/reusable-components/FavoriteToggle";

interface ListingCardProps {
  id: string;
  title: string;
  imageUrl?: string | null;
  location: string;
  category: string;
  rating?: number; // 0-5
  href?: string;
  badges?: string[];
  isInitiallyFavorited?: boolean;
}

export default function ListingCard({
  id,
  title,
  imageUrl,
  location,
  category,
  rating,
  href,
  badges = [],
  isInitiallyFavorited = false,
}: ListingCardProps) {

  const isFood = category === "Food";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-300 cursor-pointer">
      {/* Card Image */}
      <div
        className={`relative h-48 w-full overflow-hidden transition-all duration-300 ${isFood
          ? "bg-gradient-to-br from-orange-100 via-rose-100 to-pink-100"
          : "bg-gradient-to-br from-blue-100 via-emerald-100 to-teal-100"
          }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
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

        {/* Like Button */}
        <div className="absolute top-3 right-3 z-20">
          <FavoriteToggle
            listingId={id}
            isInitiallyFavorited={isInitiallyFavorited}
            variant="icon"
            size={20}
            className="h-10 w-10 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 active:scale-95 !rounded-xl"
          />
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span
            className={`rounded-xl px-3 py-1.5 text-xs font-black shadow-lg backdrop-blur-sm ${isFood
              ? "bg-orange-500/90 text-white"
              : "bg-blue-500/90 text-white"
              }`}
            aria-label={`Category: ${category}`}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="text-lg font-black text-slate-800 leading-tight line-clamp-2 transition-colors group-hover:text-blue-600"
            aria-label={`Listing title: ${title}`}
          >
            {title}
          </h3>

          <div className="flex flex-col items-end">
            {rating !== undefined && (
              <div
                className="mt-1 flex items-center gap-1 text-sm text-slate-500"
                aria-label={`Rating: ${rating.toFixed(1)} out of 5`}
              >
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="font-semibold">
                  {Number(rating).toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div
            className="flex flex-wrap gap-2"
            aria-label={`Badges: ${badges.join(", ")}`}
          >
            {badges.map((b, idx) => (
              <span
                key={idx}
                className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        {/* Location & Action */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 text-sm font-semibold text-slate-500"
            aria-label={`Location: ${location}`}
          >
            <MapPin className="h-4 w-4 text-emerald-500" />
            <span>{location}</span>
          </div>

          {href ? (
            <Link
              href={href}
              className="z-20 rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-label={`View ${title}`}
            >
              View
            </Link>
          ) : (
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              View
            </button>
          )}
        </div>
      </div>

      {/* Hover Gradient Bar */}
      <div className="h-1 w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />

      {/* Full card link for screen readers */}
      {href && (
        <Link
          href={href}
          className="absolute inset-0 z-10"
          aria-label={`Open ${title} listing`}
        />
      )}
    </div>
  );
}
