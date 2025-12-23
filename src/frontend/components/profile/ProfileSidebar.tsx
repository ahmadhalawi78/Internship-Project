"use client";

import { Briefcase, Heart, MessageSquare, Star } from "lucide-react";

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
    stats?: {
        listings?: number;
        favorites?: number;
        reviews?: number;
        messages?: number;
    };
}

export default function ProfileSidebar({
    activeTab,
    onTabChange,
    stats = { listings: 0, favorites: 0, reviews: 0, messages: 0 },
}: ProfileSidebarProps) {
    const items: SidebarItem[] = [
        {
            id: "listings",
            label: "Listings",
            icon: <Briefcase size={18} />,
            badge: stats.listings || 0,
        },
        {
            id: "favorites",
            label: "Favorites",
            icon: <Heart size={18} />,
            badge: stats.favorites || 0,
        },
        {
            id: "reviews",
            label: "Reviews",
            icon: <Star size={18} />,
            badge: stats.reviews || 0,
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Menu</h3>
            </div>
            <nav className="flex flex-col p-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === item.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`${activeTab === item.id ? "text-blue-600" : "text-slate-400"
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </div>
                        {item.badge && (
                            <span
                                className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === item.id
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-600"
                                    }`}
                            >
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}
