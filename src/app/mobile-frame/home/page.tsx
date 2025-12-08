"use client";

import { useState } from "react";
import { MobileFrame } from "@/components/ui/mobileframe";
import {
  Search,
  Filter,
  MapPin,
  Package,
  Utensils,
  Heart,
  MessageCircle,
  ChevronRight,
} from "lucide-react";

export default function HomeMobileFrame() {
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const listings = [
    {
      id: "1",
      title: "Fresh Organic Vegetables",
      category: "food",
      location: "Beirut, Hamra",
      price: "Free",
      imageColor: "bg-orange-100",
      isUrgent: true,
    },
    {
      id: "2",
      title: "Vintage Camera for Trade",
      category: "bartering",
      location: "Jounieh",
      price: "Trade for books",
      imageColor: "bg-blue-100",
      isUrgent: false,
    },
    {
      id: "3",
      title: "Handmade Pottery Set",
      category: "crafts",
      location: "Byblos",
      price: "$25",
      imageColor: "bg-emerald-100",
      isUrgent: false,
    },
    {
      id: "4",
      title: "Baby Clothes (0-6 months)",
      category: "clothing",
      location: "Baabda",
      price: "Free",
      imageColor: "bg-pink-100",
      isUrgent: true,
    },
    {
      id: "5",
      title: "Wooden Dining Table",
      category: "furniture",
      location: "Tripoli",
      price: "$150",
      imageColor: "bg-amber-100",
      isUrgent: false,
    },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-8 flex items-center justify-center">
      <MobileFrame title="LoopLebanon" showBackButton={false}>
        {/* Search Bar */}
        <div className="px-4 py-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={20} aria-hidden="true" />
            </div>
            <input
              type="text"
              placeholder="Search listings, categories..."
              className="w-full pl-10 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label="Search listings"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
              aria-label="Open filters"
              title="Open filters"
            >
              <Filter size={20} className="text-slate-400" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              "All",
              "Food",
              "Barter",
              "Furniture",
              "Clothes",
              "Books",
              "Tools",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat.toLowerCase())}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === cat.toLowerCase()
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-700"
                }`}
                aria-label={`Show ${cat} listings`}
                title={`Filter by ${cat}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Urgent Banner */}
        <div className="mx-4 my-3 p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Urgent: Food needed in Baabda</p>
              <p className="text-xs opacity-90">Expires in 2 hours</p>
            </div>
            <button
              className="px-3 py-1 bg-white text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors"
              aria-label="Help with urgent food request"
              title="Help with urgent food request"
            >
              HELP NOW
            </button>
          </div>
        </div>

        {/* Listings */}
        <div className="space-y-3 px-4 py-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900">
              Latest Listings
            </h2>
            <button
              className="text-blue-600 text-sm font-medium flex items-center"
              aria-label="View all listings"
              title="View all listings"
            >
              See all <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-3">
            {listings.map((item) => {
              const isFavorited = favorites.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
                >
                  <div className="flex">
                    {/* Image */}
                    <div
                      className={`w-24 h-24 ${item.imageColor} flex items-center justify-center`}
                      aria-hidden="true"
                    >
                      {item.category === "food" ? (
                        <Utensils className="h-10 w-10 text-orange-400" />
                      ) : (
                        <Package className="h-10 w-10 text-blue-400" />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={12} className="text-slate-400" />
                            <span className="text-xs text-slate-600">
                              {item.location}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-sm font-bold text-blue-600">
                              {item.price}
                            </span>
                            {item.isUrgent && (
                              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                URGENT
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className="p-1 hover:bg-slate-100 rounded transition-colors"
                          aria-label={
                            isFavorited
                              ? `Remove ${item.title} from favorites`
                              : `Add ${item.title} to favorites`
                          }
                          title={
                            isFavorited
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >
                          <Heart
                            size={20}
                            className={`${
                              isFavorited
                                ? "fill-red-500 text-red-500"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex gap-2 mt-3">
                        <button
                          className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          aria-label={`Message about ${item.title}`}
                          title={`Message about ${item.title}`}
                        >
                          Message
                        </button>
                        <button
                          className="px-3 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                          aria-label={`View details for ${item.title}`}
                          title={`View details for ${item.title}`}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Assistant Float */}
        <div className="fixed bottom-24 right-4 z-10">
          <button
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Open AI assistant chat"
            title="AI Assistant Chat"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </MobileFrame>
    </div>
  );
}
