"use client";
import React from "react";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
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
}: CardProps) {
  const renderMedia = () => {
    if (img) {
      return (
        <Image
          src={img}
          alt={title}
          fill
          className="object-contain rounded-lg"
        />
      );
    }
    if (Icon) {
      return (
        <div className="flex items-center justify-center w-full h-full">
          <Icon size={48} className="text-gray-400" />
        </div>
      );
    }
    return null;
  };

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
    />
  );
}
