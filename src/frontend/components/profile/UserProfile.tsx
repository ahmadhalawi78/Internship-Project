"use client";

import { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileSections from "./ProfileSections";
import ProfileSidebar from "./ProfileSidebar";
import EditProfileModal from "./EditProfileModal";
import { getUserReceivedReviews } from "@/app/actions/reviews";
import Link from "next/link";
import { Home } from "lucide-react";

interface ProfileUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

interface UserProfileProps {
  user: ProfileUser;
  location?: string;
  stats?: {
    listings: number;
    favorites: number;
    joined: string;
  };
  listings?: {
    id: string;
    title: string;
    category: string;
    location: string;
    status?: string;
    listing_images?: { image_url: string }[];
    created_at: string;
  }[];
  favorites?: {
    id: string;
    title: string;
    category: string;
    location: string;
    status?: string;
    listing_images?: { image_url: string }[];
    created_at: string;
  }[];
  favoriteIds?: string[];
}

export default function UserProfile({
  user,
  location,
  stats,
  listings = [],
  favorites = [],
  favoriteIds = [],
}: UserProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("listings");
  const [reviewsCount, setReviewsCount] = useState(0);

  useEffect(() => {
    getUserReceivedReviews().then(res => {
      if (res.success) {
        setReviewsCount(res.data?.length || 0);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Navigation */}
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Home size={20} />
            <span className="font-semibold">Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <ProfileHeader
            user={user}
            stats={{
              listings: listings.length,
              reviews: reviewsCount,
              joined: stats?.joined || 'Recently'
            }}
            location={location}
            onEditClick={() => setIsEditModalOpen(true)}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              activeTab={activeSection}
              onTabChange={setActiveSection}
              stats={{
                listings: listings.length,
                favorites: favorites.length,
                reviews: reviewsCount
              }}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <ProfileSections
              userId={user.id}
              activeTab={activeSection}
              listings={listings}
              favorites={favorites}
              favoriteIds={favoriteIds}
            />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(data) => {
          console.log("Profile updated:", data);
        }}
      />
    </div>
  );
}
