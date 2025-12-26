"use client";

import { useState, useEffect } from "react";
import { Edit2, MapPin, Calendar, MessageSquare, Award } from "lucide-react";
import Image from "next/image";
import { getUserBadges } from "@/app/actions/auth";

interface ProfileUser {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
  };
}

interface Badge {
  badge_id: string;
  earned_at: string;
  badges: any; // Using 'any' to avoid type conflicts
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
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const avatarUrl = user.user_metadata?.avatar_url;
  const userName =
    user.user_metadata?.name || user.email?.split("@")[0] || "User";

  // Load user badges
  useEffect(() => {
    if (user.id) {
      setLoadingBadges(true);
      getUserBadges(user.id)
        .then((result) => {
          if (result.success && result.data) {
            setBadges(result.data as Badge[]);
          }
        })
        .catch((error) => {
          console.error("Error loading badges:", error);
        })
        .finally(() => {
          setLoadingBadges(false);
        });
    }
  }, [user.id]);

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
      {}
      <div className="h-24 xs:h-32 sm:h-40 bg-slate-900" />

      {}
      <div className="px-4 xs:px-6 sm:px-8 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6">
          {}
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

          {}
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

            {}
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

            {/* Badges Section */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Award className="h-5 w-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-700">
                  Achievements
                </h3>
                <span className="text-xs text-slate-500">
                  ({badges.length})
                </span>
              </div>

              {loadingBadges ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-transparent"></div>
                  <span className="text-xs">Loading badges...</span>
                </div>
              ) : badges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {badges.map((badgeData, index) => {
                    const badge = badgeData.badges;
                    return (
                      <div
                        key={badgeData.badge_id}
                        className="group relative inline-flex items-center gap-2 px-3 py-2 bg-linear-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg hover:from-amber-100 hover:to-yellow-100 transition-all duration-200"
                        style={{
                          animation: `fadeIn 0.3s ease-out ${
                            index * 0.1
                          }s both`,
                        }}
                      >
                        <span className="text-lg" title={badge.description}>
                          {badge.icon}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-amber-800">
                            {badge.name}
                          </span>
                          <span className="text-xs text-amber-600 truncate max-w-[120px]">
                            {badge.description}
                          </span>
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          <div className="font-semibold">{badge.name}</div>
                          <div className="text-slate-300">
                            {badge.description}
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Award className="h-4 w-4 opacity-50" />
                  <span>
                    No badges earned yet. Start trading to earn achievements!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {}
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
