"use client";

import { MapPin, Package, Utensils } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Package, Utensils, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FavoriteToggle from "@/components/reusable-components/FavoriteToggle";
import MessageButton from "@/frontend/components/chat/MessageButton";

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
  onClickCard?: () => void;
  onFavorite?: () => void;
  listingOwnerId?: string;
  currentUserId?: string;
  showMessageButton?: boolean;
  price?: string | null;
  status?: "active" | "pending" | "sold" | "expired";
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
  onClickCard,
  onFavorite,
  listingOwnerId,
  currentUserId,
  showMessageButton = true,
  price,
  status = "active",
}: ListingCardProps) {
  const router = useRouter();

  const isFood = category === "Food";

  const handleCardClick = useCallback(() => {
    if (onClickCard) {
      onClickCard();
    } else {
      router.push(`/listing/${id}`);
    }
  }, [onClickCard, router, id]);

  const handleFavoriteChange = useCallback(() => {
    if (onFavorite) {
      onFavorite();
    }
  }, [onFavorite]);

  const shouldShowMessageButton = Boolean(
    showMessageButton &&
      currentUserId &&
      listingOwnerId &&
      currentUserId !== listingOwnerId
  );

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "sold":
        return "bg-blue-100 text-blue-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-emerald-100 text-emerald-700";
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-400 cursor-pointer"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`View listing: ${title}`}
      role="article"
    >
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
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
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
          className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          onClick={(e) => e.stopPropagation()}
          aria-label={isInitiallyFavorited ? "Remove from favorites" : "Add to favorites"}
          title={isInitiallyFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          <FavoriteToggle
            listingId={id}
            isInitiallyFavorited={isInitiallyFavorited}
            onFavoriteChange={handleFavoriteChange}
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-black text-slate-800 leading-tight line-clamp-2 transition-colors group-hover:text-blue-600 flex-1">
            {title}
          </h3>
          {price && (
            <span className="text-lg font-bold text-blue-600 whitespace-nowrap shrink-0">
              {price}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          <MapPin className="h-4 w-4 text-emerald-500 shrink-0" />
          <span className="truncate">{location}</span>
        </div>

        {shouldShowMessageButton && listingOwnerId && (
          <div className="mt-2 pt-3 border-t border-gray-100">
            <div onClick={(e) => e.stopPropagation()}>
              <MessageButton listingId={id} listingOwnerId={listingOwnerId} />
            </div>
          </div>
        )}

        {status && status !== "active" && (
          <div className="mt-auto">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor()}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )}
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
