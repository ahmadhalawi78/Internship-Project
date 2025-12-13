"use client";

export type { FeedItem } from "@/frontend/components/feed/HomeFeed";

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
import { ChatService } from "@/lib/api/chatService";
import { ChatEvents } from "@/lib/events/chatEvents";
import type { ChatMessage } from "@/types/chat";

// Import the FeedItem type from HomeFeed
import type { FeedItem } from "@/frontend/components/feed/HomeFeed";
import HomeFeed from "@/frontend/components/feed/HomeFeed";

interface HomeShellProps {
  items?: FeedItem[];
  currentUserId?: string;
}

interface MessageReceivedEventData {
  message: string;
}

interface ChatErrorEventData {
  error: string;
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
    isFavorited: false,
    userId: "user-1",
  },
  {
    id: "2",
    title: "Fresh Vegetables",
    category: "food",
    location: "Baabda",
    isFavorited: false,
    userId: "user-2",
  },
  {
    id: "3",
    title: "Handmade Pottery",
    category: "bartering",
    location: "Jounieh",
    isFavorited: false,
    userId: "user-3",
  },
  {
    id: "4",
    title: "Homemade Bread",
    category: "food",
    location: "Tripoli",
    isFavorited: false,
    userId: "user-4",
  },
  {
    id: "5",
    title: "Vintage Books",
    category: "books",
    location: "Zahle",
    isFavorited: false,
    userId: "user-5",
  },
  {
    id: "6",
    title: "Organic Honey",
    category: "food",
    location: "Byblos",
    isFavorited: false,
    userId: "user-6",
  },
  {
    id: "7",
    title: "2010 Toyota Camry",
    category: "cars",
    location: "Beirut",
    isFavorited: false,
    userId: "user-7",
  },
  {
    id: "8",
    title: "MacBook Pro 2020",
    category: "electronics",
    location: "Jounieh",
    isFavorited: false,
    userId: "user-8",
  },
  {
    id: "9",
    title: "Wooden Dining Table",
    category: "furniture",
    location: "Tripoli",
    isFavorited: false,
    userId: "user-9",
  },
  {
    id: "10",
    title: "Designer Jacket",
    category: "clothing",
    location: "Beirut",
    isFavorited: false,
    userId: "user-10",
  },
  {
    id: "11",
    title: "Power Drill Set",
    category: "tools",
    location: "Baabda",
    isFavorited: false,
    userId: "user-11",
  },
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

// Define the ChatEvent type based on ChatEvents enum
type ChatEvent = (typeof ChatEvents)[keyof typeof ChatEvents];

export default function HomeShell({ items, currentUserId }: HomeShellProps) {
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

  // Process items with default values for optional properties
  const displayItems = (items && items.length > 0 ? items : mockItems).map(
    (item) => ({
      ...item,
      isFavorited: item.isFavorited ?? false,
      userId: item.userId ?? "unknown",
    })
  );

  const filteredItems =
    activeTab === "all"
      ? displayItems
      : displayItems.filter((item) => item.category === activeTab);

  const toggleLike = (id: string) => {
    if (!currentUserId) {
      // Optionally show a login prompt or toast notification
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
          // Use a unique ID
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
          // Use a unique ID
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

    // Use a more unique ID (timestamp + random string)
    const userMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
          </div>
        </div>
        <HomeFeed
          items={filteredItems}
          currentUserId={currentUserId}
          viewMode={viewMode}
        />
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
