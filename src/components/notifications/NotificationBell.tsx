"use client";

import { Bell, Check } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getNotificationCounts,
  markAllNotificationsAsRead,
} from "../../app/actions/notificatons";
import { useRouter } from "next/navigation";
import { useAuth } from "@/frontend/hooks/useAuth";

export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCounts();
    }
  }, [user]);

  const fetchCounts = async () => {
    if (!user) return;

    setLoading(true);
    const result = await getNotificationCounts();
    if (result.success && result.data) {
      setUnreadCount(result.data.unread);
    }
    setLoading(false);
  };

  const handleMarkAllAsRead = async () => {
    if (!user || unreadCount === 0) return;

    setLoading(true);
    const result = await markAllNotificationsAsRead();
    if (result.success) {
      setUnreadCount(0);
    }
    setLoading(false);
  };

  const handleBellClick = () => {
    router.push("/notifications");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-slate-700 hover:text-slate-900 focus:outline-none"
        aria-label={`Notifications ${
          unreadCount > 0 ? `(${unreadCount} unread)` : ""
        }`}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md border border-slate-200 bg-white shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="flex items-center gap-1 text-xs text-blue-900 hover:text-blue-800 disabled:opacity-50"
                >
                  <Check size={12} />
                  Mark all read
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                Loading...
              </div>
            ) : unreadCount === 0 ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                No new notifications
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-slate-700">
                  {unreadCount} unread notification
                  {unreadCount !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={handleBellClick}
                  className="mt-2 text-sm font-medium text-blue-900 hover:text-blue-800"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
