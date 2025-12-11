"use client";

import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileSections from "./ProfileSections";
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
    reviews: number;
    joined: string;
  };
}

export default function UserProfile({
  user,
  location,
  stats,
}: UserProfileProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("listings");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 xs:py-8 sm:py-12">
        {}
        <div className="mb-8">
          <ProfileHeader
            user={user}
            stats={stats}
            location={location}
            onEditClick={() => setIsEditModalOpen(true)}
          />
        </div>

        {}
        <div>
          <ProfileSections
            userId={user.id}
            activeTab={activeSection}
            onTabChange={setActiveSection}
          />
        </div>
      </div>

      {}
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
