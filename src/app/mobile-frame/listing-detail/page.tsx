"use client";

import { useState } from "react";
import { MobileFrame } from "@/components/ui/mobileframe";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  User,
  Clock,
  Shield,
  MessageCircle,
  Phone,
  ChevronDown,
} from "lucide-react";

export default function ListingDetailMobileFrame() {
  const [favorited, setFavorited] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  const listing = {
    id: "123",
    title: "Fresh Organic Vegetables from Local Farm",
    category: "Food",
    price: "Free",
    location: "Beirut, Hamra Street",
    description:
      "Fresh organic vegetables from our local farm. Includes tomatoes, cucumbers, lettuce, and herbs. Grown without pesticides. Perfect for families in need.",
    owner: {
      name: "Sarah M.",
      rating: 4.8,
      verified: true,
      memberSince: "2023",
    },
    urgency: "High",
    expiresIn: "3 hours",
    images: [
      { color: "bg-orange-100" },
      { color: "bg-green-100" },
      { color: "bg-yellow-100" },
      { color: "bg-red-100" },
    ],
    tags: ["Organic", "Fresh", "Local", "Healthy", "Vegetables"],
  };

  const handleContact = (method: "message" | "call") => {
    setShowContact(true);
    setTimeout(() => {
      setShowContact(false);
      alert(`Opening ${method === "message" ? "chat" : "phone call"}...`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <MobileFrame
        showBackButton={true}
        headerRight={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFavorited(!favorited)}
              className="p-2"
              aria-label={
                favorited ? "Remove from favorites" : "Add to favorites"
              }
              title={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                size={20}
                className={`${
                  favorited ? "fill-red-500 text-red-500" : "text-slate-600"
                }`}
              />
            </button>
            <button
              className="p-2"
              aria-label="Share listing"
              title="Share listing"
            >
              <Share2 size={20} className="text-slate-600" />
            </button>
          </div>
        }
      >
        {/* Images */}
        <div className="relative">
          <div
            className={`h-64 ${listing.images[activeImage].color} transition-colors`}
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            {listing.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`h-2 w-8 rounded-full transition-all ${
                  activeImage === index ? "bg-white" : "bg-white/50"
                }`}
                aria-label={`View image ${index + 1}`}
                title={`View image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Title and Price */}
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-xl font-bold text-slate-900">
                {listing.title}
              </h1>
              <div className="text-2xl font-bold text-emerald-600">
                {listing.price}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                {listing.category}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                {listing.urgency} URGENCY
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin size={16} />
            <span className="text-sm">{listing.location}</span>
          </div>

          {/* Owner */}
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">
                    {listing.owner.name}
                  </h3>
                  {listing.owner.verified && (
                    <Shield size={14} className="text-blue-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>⭐ {listing.owner.rating}</span>
                  <span>•</span>
                  <span>Member since {listing.owner.memberSince}</span>
                </div>
              </div>
              <button
                className="text-blue-600 text-sm font-medium"
                aria-label={`View profile of ${listing.owner.name}`}
                title={`View profile of ${listing.owner.name}`}
              >
                View Profile
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {listing.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Expiry */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock size={16} />
              <span className="font-bold">Expires in {listing.expiresIn}</span>
            </div>
            <p className="text-amber-700 text-sm mt-1">
              This listing will be automatically removed when it expires.
            </p>
          </div>

          {/* Safety Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Shield className="text-blue-600 mt-0.5" size={16} />
              <div>
                <p className="text-blue-800 text-sm font-medium">
                  Safety First
                </p>
                <p className="text-blue-700 text-xs mt-1">
                  • Meet in public places
                  <br />
                  • Bring a friend if possible
                  <br />• Trust your instincts
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-20 bg-white border-t border-slate-200 -mx-4 -mb-4 px-4 py-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleContact("message")}
                className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                aria-label={`Message ${listing.owner.name}`}
                title={`Message ${listing.owner.name}`}
              >
                <MessageCircle size={20} />
                Message
              </button>
              <button
                onClick={() => handleContact("call")}
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                aria-label={`Call ${listing.owner.name}`}
                title={`Call ${listing.owner.name}`}
              >
                <Phone size={20} />
                Call
              </button>
            </div>
            {showContact && (
              <div className="mt-3 text-center">
                <div className="text-xs text-slate-500 animate-pulse">
                  Connecting you with {listing.owner.name}...
                </div>
              </div>
            )}
          </div>
        </div>
      </MobileFrame>
    </div>
  );
}
