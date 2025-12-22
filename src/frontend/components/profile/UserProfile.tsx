"use client";

import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileSections from "./ProfileSections";
import ProfileSidebar from "./ProfileSidebar";
import EditProfileModal from "./EditProfileModal";

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
  listings?: any[];
  favorites?: any[];
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <ProfileHeader
            user={user}
            stats={{
              listings: listings.length,
              reviews: 0, // Placeholder
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
                listings: stats?.listings || 0,
                favorites: stats?.favorites || 0,
                reviews: 0,
                messages: 0
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
