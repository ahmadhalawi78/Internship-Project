"use client";
import React from "react";
import { Heart, MapPin } from "lucide-react";
import Image from "next/image";
import RecCard from "./RecCard";
import SquareCard from "./SquareCard";


interface CardProps {
  title: string;
  location: string;
  category: string;
  categoryColor?: string;
  img?: string;
  icon?: React.ElementType;
  onFavorite?: () => void; // when click on the heart
  variant?: "square" | "wide";
  onClickCard?: () => void; //when click on the card
}

export default function Card({
  title,
  location,
  category,
  categoryColor = "blue",
  img,
  icon: Icon,
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
          <Icon size={48} className="text-gray-400"
/>
        </div>
      );
    }
    return null;
  };
{/* Rectangle card*/} 
  if (variant === "wide") {
    return (
      <RecCard title={title} location={location} onClickCard={onClickCard} renderMedia={renderMedia} category={category} categoryColor={categoryColor} onFavorite={onFavorite} />
    );
  }
{/*square card*/}
return(
  <SquareCard title={title} location={location} onClickCard={onClickCard} renderMedia={renderMedia} category={category} categoryColor={categoryColor} onFavorite={onFavorite}/>
);
}