"use client";

import { useState } from "react";
import { Edit2, MapPin, Calendar, MessageSquare } from "lucide-react";
import Image from "next/image";

interface ProfileUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

interface ProfileHeaderProps {
  user: ProfileUser;
  stats?: {
    listings: number;
    reviews: number;
    joined: string;
  };
  location?: string;
  onEditClick?: () => void;
}

export default function ProfileHeader({
  user,
  stats,
  location,
  onEditClick,
}: ProfileHeaderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const avatarUrl = user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
      { }
      <div className="h-24 xs:h-32 sm:h-40 bg-slate-900" />

      { }
      <div className="px-4 xs:px-6 sm:px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
          { }
          <div
            className="relative -mt-12 xs:-mt-16 sm:-mt-20 mb-4 sm:mb-0"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="relative h-24 w-24 xs:h-32 xs:w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600">
                  <span className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {isHovering && (
              <button
                onClick={onEditClick}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                aria-label="Edit avatar"
              >
                <Edit2 size={16} />
              </button>
            )}
          </div>

          { }
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900">
                  {userName}
                </h1>
                {location && (
                  <div className="flex items-center gap-1 text-slate-600 mt-1">
                    <MapPin size={16} />
                    <span className="text-sm xs:text-base">{location}</span>
                  </div>
                )}
              </div>
              <button
                onClick={onEditClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            </div>

            { }
            {stats && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-lg xs:text-xl font-bold text-gray-900">
                    {stats.listings}
                  </p>
                  <p className="text-xs xs:text-sm text-slate-600">Listings</p>
                </div>
                <div className="text-center">
                  <p className="text-lg xs:text-xl font-bold text-gray-900">
                    {stats.reviews}
                  </p>
                  <p className="text-xs xs:text-sm text-slate-600">Reviews</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar size={16} className="text-emerald-600" />
                    <span className="text-xs xs:text-sm text-slate-600">
                      {stats.joined}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        { }
        <div className="sm:hidden flex gap-2 mt-4">
          <button
            onClick={onEditClick}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-gray-900 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium">
            <MessageSquare size={14} />
            Message
          </button>
        </div>
      </div>
    </div>
  );
}
