"use client";

import { useState, useRef, useEffect } from "react";
import {
  Package,
  Utensils,
  Filter,
  MapPin,
  Heart,
  Grid3x3,
  List,
  ChevronDown,
  BookOpen,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Wrench,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Send,
  X,
  Loader2,
} from "lucide-react";
import type { FeedItem } from "@/frontend/components/feed/HomeFeed";
import { ChatService } from "@/lib/api/chatService";
import { ChatEvents } from "@/lib/events/chatEvents";
import type { ChatMessage } from "@/types/chat";

interface HomeShellProps {
  items?: FeedItem[];
}

type CategoryType =
  | "all"
  | "food"
  | "bartering"
  | "books"
  | "cars"
  | "electronics"
  | "furniture"
  | "clothing"
  | "tools";

const mockItems: FeedItem[] = [
  {
    id: "1",
    title: "Vintage Camera",
    category: "bartering",
    location: "Beirut",
  },
  { id: "2", title: "Fresh Vegetables", category: "food", location: "Baabda" },
  {
    id: "3",
    title: "Handmade Pottery",
    category: "bartering",
    location: "Jounieh",
  },
  { id: "4", title: "Homemade Bread", category: "food", location: "Tripoli" },
  { id: "5", title: "Vintage Books", category: "books", location: "Zahle" },
  { id: "6", title: "Organic Honey", category: "food", location: "Byblos" },
  { id: "7", title: "2010 Toyota Camry", category: "cars", location: "Beirut" },
  {
    id: "8",
    title: "MacBook Pro 2020",
    category: "electronics",
    location: "Jounieh",
  },
  {
    id: "9",
    title: "Wooden Dining Table",
    category: "furniture",
    location: "Tripoli",
  },
  {
    id: "10",
    title: "Designer Jacket",
    category: "clothing",
    location: "Beirut",
  },
  { id: "11", title: "Power Drill Set", category: "tools", location: "Baabda" },
];

const categoryConfig = {
  all: { label: "All Categories", icon: Filter, color: "slate" },
  food: { label: "Food", icon: Utensils, color: "orange" },
  bartering: { label: "Bartering", icon: Package, color: "blue" },
  books: { label: "Books", icon: BookOpen, color: "purple" },
  cars: { label: "Cars", icon: Car, color: "red" },
  electronics: { label: "Electronics", icon: Laptop, color: "indigo" },
  furniture: { label: "Furniture", icon: Sofa, color: "amber" },
  clothing: { label: "Clothing", icon: Shirt, color: "pink" },
  tools: { label: "Tools", icon: Wrench, color: "emerald" },
} as const;

// Define proper event data types
interface TypingEventData {
  isTyping: boolean;
}

interface MessageReceivedEventData {
  message: string;
  conversationId?: string;
  timestamp?: Date;
}

interface ChatErrorEventData {
  error: string;
  code?: string;
}

// Define the ChatEvent type based on ChatEvents enum
type ChatEvent = (typeof ChatEvents)[keyof typeof ChatEvents];

// Define a type for the event handler callback
type EventHandler<T> = (data: T) => void;

export default function HomeShell({ items }: HomeShellProps) {
  const [activeTab, setActiveTab] = useState<CategoryType>("all");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const displayItems = items && items.length > 0 ? items : mockItems;

  const filteredItems =
    activeTab === "all"
      ? displayItems
      : displayItems.filter((item) => item.category === activeTab);

  const toggleLike = (id: string) => {
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCategoryDropdown]);

  // Subscribe to chat events
  useEffect(() => {
    const unsubTypingStart = ChatService.subscribe(
      ChatEvents.TYPING_START as ChatEvent,
      () => {
        setIsTyping(true);
      }
    );

    const unsubTypingEnd = ChatService.subscribe(
      ChatEvents.TYPING_END as ChatEvent,
      () => {
        setIsTyping(false);
      }
    );

    const unsubMessageReceived = ChatService.subscribe(
      ChatEvents.MESSAGE_RECEIVED as ChatEvent,
      (data: unknown) => {
        const eventData = data as MessageReceivedEventData;
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: eventData.message,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, newMessage]);
      }
    );

    const unsubError = ChatService.subscribe(
      ChatEvents.CHAT_ERROR as ChatEvent,
      (data: unknown) => {
        const eventData = data as ChatErrorEventData;
        const errorMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "assistant",
          content: `Sorry, I encountered an error: ${eventData.error}`,
          timestamp: new Date(),
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      }
    );

    return () => {
      unsubTypingStart();
      unsubTypingEnd();
      unsubMessageReceived();
      unsubError();
    };
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      await ChatService.sendMessage([...chatMessages, userMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = (category: CategoryType) => {
    setActiveTab(category);
    setShowCategoryDropdown(false);
  };

  const getCategoryCount = (category: CategoryType) => {
    if (category === "all") return displayItems.length;
    return displayItems.filter((i) => i.category === category).length;
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

  return (
    <section className="relative bg-white py-8 md:py-12">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/50 shadow-lg">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-bold text-slate-700">
                Discover & Share
              </span>
            </div>
            <div className="mb-4">
              <h1
                className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight inline-block cursor-pointer"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                onMouseLeave={() => setHoveredLetter(null)}
              >
                {["C", "o", "m", "m", "u", "n", "i", "t", "y"].map(
                  (letter, index) => (
                    <span
                      key={index}
                      className="inline-block transition-all duration-300 ease-out"
                      style={{
                        transform:
                          hoveredLetter === index
                            ? "translateY(-4px) scale(1.2)"
                            : hoveredLetter !== null &&
                              Math.abs(hoveredLetter - index) <= 1
                            ? "translateY(-2px) scale(1.1)"
                            : "translateY(0) scale(1)",
                        color:
                          hoveredLetter === index
                            ? "#1e40af"
                            : hoveredLetter !== null &&
                              Math.abs(hoveredLetter - index) <= 1
                            ? "#3b82f6"
                            : "#0f172a",
                        transitionDelay: `${index * 20}ms`,
                      }}
                      onMouseEnter={() => setHoveredLetter(index)}
                    >
                      {letter}
                    </span>
                  )
                )}
                <span className="ml-2">Listings</span>
                <ChevronDown
                  className={`inline-block h-5 w-5 ml-2 text-slate-600 transition-all duration-300 ${
                    showCategoryDropdown ? "rotate-180" : ""
                  }`}
                />
              </h1>
            </div>
            <p className="text-base md:text-lg font-semibold text-slate-600 max-w-2xl mx-auto flex items-center justify-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Connect with your neighbors through bartering and food sharing
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm md:text-base text-slate-600 font-medium">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "listing" : "listings"} available
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div
            className="flex flex-wrap items-center gap-2 border-b border-slate-200"
            ref={dropdownRef}
          >
            {[
              { id: "all" as const },
              { id: "bartering" as const },
              { id: "food" as const },
            ].map((tab) => {
              const config = categoryConfig[tab.id];
              const Icon = config.icon;
              const isActive = activeTab === tab.id;
              const isAllTab = tab.id === "all";

              return (
                <div key={tab.id} className="relative">
                  <button
                    onClick={() => {
                      if (isAllTab) {
                        setShowCategoryDropdown(!showCategoryDropdown);
                      } else {
                        setActiveTab(tab.id);
                        setShowCategoryDropdown(false);
                      }
                    }}
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-200 border-b-2 ${
                      isActive
                        ? "text-slate-900 border-slate-900"
                        : "text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {config.label}
                    <span
                      className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                        isActive
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {getCategoryCount(tab.id)}
                    </span>
                    {isAllTab && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          showCategoryDropdown ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {isAllTab && showCategoryDropdown && (
                    <div className="absolute top-full left-0 mt-1 w-64 rounded-lg border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
                      <div className="p-2 max-h-96 overflow-y-auto">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 mb-1">
                          Browse Categories
                        </div>
                        {(Object.keys(categoryConfig) as CategoryType[]).map(
                          (category) => {
                            const catConfig = categoryConfig[category];
                            const CatIcon = catConfig.icon;
                            const count = getCategoryCount(category);
                            const isSelected = activeTab === category;

                            return (
                              <button
                                key={category}
                                onClick={() => handleCategorySelect(category)}
                                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                              >
                                <div className="flex items-center gap-2">
                                  <CatIcon
                                    className={`h-4 w-4 ${
                                      category === "food"
                                        ? "text-orange-600"
                                        : category === "books"
                                        ? "text-purple-600"
                                        : category === "cars"
                                        ? "text-red-600"
                                        : category === "electronics"
                                        ? "text-indigo-600"
                                        : category === "furniture"
                                        ? "text-amber-600"
                                        : category === "clothing"
                                        ? "text-pink-600"
                                        : category === "tools"
                                        ? "text-emerald-600"
                                        : "text-blue-600"
                                    }`}
                                  />
                                  <span>{catConfig.label}</span>
                                  <span className="text-xs text-slate-500">
                                    ({count})
                                  </span>
                                </div>
                                {isSelected && (
                                  <div className="h-2 w-2 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Listings Grid/List */}
        {filteredItems.length === 0 ? (
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
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => {
              const isLiked = likedItems.has(item.id);
              const categoryColor = getCategoryColor(item.category);
              const CategoryIcon = getCategoryIcon(item.category);

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 cursor-pointer"
                  style={{
                    animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <div
                    className={`relative h-48 w-full overflow-hidden bg-linear-to-br ${
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
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CategoryIcon
                        className={`h-16 w-16 transition-transform duration-300 group-hover:scale-110 ${
                          categoryColor === "orange"
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

                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold border ${
                          categoryColor === "orange"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : categoryColor === "purple"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : categoryColor === "red"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : categoryColor === "indigo"
                            ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                            : categoryColor === "amber"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : categoryColor === "pink"
                            ? "bg-pink-100 text-pink-700 border-pink-200"
                            : categoryColor === "emerald"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}
                      >
                        <CategoryIcon className="h-3 w-3" />
                        {categoryConfig[
                          item.category as keyof typeof categoryConfig
                        ]?.label || item.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-md bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200 transition-all duration-200 hover:scale-110 active:scale-95"
                    >
                      <Heart
                        className={`h-4 w-4 transition-all duration-200 ${
                          isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-slate-400"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-base font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium">{item.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => {
              const isLiked = likedItems.has(item.id);
              const categoryColor = getCategoryColor(item.category);
              const CategoryIcon = getCategoryIcon(item.category);

              return (
                <div
                  key={item.id}
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 cursor-pointer"
                  style={{
                    animation: `fadeIn 0.4s ease-out ${index * 0.05}s both`,
                  }}
                >
                  <div
                    className={`relative h-24 w-24 shrink-0 rounded-lg overflow-hidden bg-linear-to-br ${
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
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CategoryIcon
                        className={`h-10 w-10 ${
                          categoryColor === "orange"
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
                          className={`h-4 w-4 transition-all duration-200 ${
                            isLiked
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-medium">{item.location}</span>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                          categoryColor === "orange"
                            ? "bg-orange-100 text-orange-700"
                            : categoryColor === "purple"
                            ? "bg-purple-100 text-purple-700"
                            : categoryColor === "red"
                            ? "bg-red-100 text-red-700"
                            : categoryColor === "indigo"
                            ? "bg-indigo-100 text-indigo-700"
                            : categoryColor === "amber"
                            ? "bg-amber-100 text-amber-700"
                            : categoryColor === "pink"
                            ? "bg-pink-100 text-pink-700"
                            : categoryColor === "emerald"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <CategoryIcon className="h-3 w-3" />
                        {categoryConfig[
                          item.category as keyof typeof categoryConfig
                        ]?.label || item.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-110 group"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-linear-to-r from-blue-600 to-blue-700">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <h3 className="font-semibold text-white">Loop AI Assistant</h3>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-3">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Hi! I am your Loop AI assistant. Ask me anything about
                  listings or the marketplace!
                </p>
              </div>
            )}

            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
