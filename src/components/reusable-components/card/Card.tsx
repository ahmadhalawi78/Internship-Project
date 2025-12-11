"use client";
import React from "react";
import RecCard from "./RecCard";
import SquareCard from "./SquareCard";

interface CardProps {
  id: string;
  title: string;
  location: string;
  category: string;
  categoryColor?: string;
  img?: string;
  icon?: React.ElementType;
  isInitiallyFavorited?: boolean;
  onFavorite?: () => void;
  variant?: "square" | "wide";
  onClickCard?: () => void;
  // New props for chat functionality
  listingOwnerId?: string;
  currentUserId?: string;
  showMessageButton?: boolean;
}

export default function Card({
  id,
  title,
  location,
  category,
  categoryColor = "blue",
  img,
  icon: Icon,
  isInitiallyFavorited = false,
  onFavorite,
  variant = "square",
  onClickCard,
  // New props
  listingOwnerId,
  currentUserId,
  showMessageButton = true,
}: CardProps) {
  const renderMedia = () => {
    if (img) {
      return (
        <div className="relative w-full h-full overflow-hidden bg-gray-50">
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>
      );
    }
    if (Icon) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-gray-50 to-gray-100">
          <Icon size={48} className="text-gray-400" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-gray-50 to-gray-100">
        <span className="text-gray-400 text-sm">No media</span>
      </div>
    );
  };

  const shouldShowMessageButton = Boolean(
    showMessageButton &&
      currentUserId &&
      listingOwnerId &&
      currentUserId !== listingOwnerId
  );

  if (variant === "wide") {
    return (
      <RecCard
        id={id}
        title={title}
        location={location}
        onClickCard={onClickCard}
        renderMedia={renderMedia}
        category={category}
        categoryColor={categoryColor}
        isInitiallyFavorited={isInitiallyFavorited}
        onFavorite={onFavorite}
      />
    );
  }

  return (
    <SquareCard
      id={id}
      title={title}
      location={location}
      onClickCard={onClickCard}
      renderMedia={renderMedia}
      category={category}
      categoryColor={categoryColor}
      isInitiallyFavorited={isInitiallyFavorited}
      onFavorite={onFavorite}
      shouldShowMessageButton={shouldShowMessageButton}
      listingOwnerId={listingOwnerId}
      listingTitle={title}
    />
  );
}
