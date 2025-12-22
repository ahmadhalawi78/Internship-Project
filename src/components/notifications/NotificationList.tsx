"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Heart,
  Check,
  X,
  Clock,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
  type Notification,
} from "../../app/actions/notificatons";
// lightweight local replacement for `formatDistanceToNow` to avoid a missing dependency
function formatDistanceToNow(date: Date, _opts?: { addSuffix?: boolean }) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
import EmptyState, {
  NotificationsIllustration,
} from "../reusable-components/EmptyState";
import Button from "@/components/reusable-components/Button";
import Link from "next/link";

const notificationIcons = {
  listing_created: ExternalLink,
  listing_updated: ExternalLink,
  message_received: MessageSquare,
  favorite_added: Heart,
  chat_message: MessageSquare,
  system_alert: AlertCircle,
  listing_expired: Clock,
  new_follower: Heart,
  mention: MessageSquare,
  admin_announcement: AlertCircle,
};

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = 20;

  async function loadNotifications(loadMore = false) {
    const currentPage = loadMore ? page + 1 : 0;

    setLoading(true);
    const result = await getUserNotifications({
      limit,
      offset: currentPage * limit,
      includeRead: true,
    });

    if (result.success && result.data) {
      if (loadMore) {
        setNotifications((prev) => [...prev, ...result.data]);
        setPage(currentPage);
      } else {
        setNotifications(result.data);
        setPage(0);
      }
      setHasMore(result.hasMore || false);
    }
    setLoading(false);
  }

  useEffect(() => {
    const t = setTimeout(() => {
      loadNotifications();
    }, 0);

    return () => clearTimeout(t);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id);
    if (result.success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true, read_at: new Date().toISOString() }
            : n
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteNotification(id);
    if (result.success) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const getNotificationIcon = (type: string) => {
    const IconComponent =
      notificationIcons[type as keyof typeof notificationIcons] || AlertCircle;
    return <IconComponent size={16} />;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      listing_created: "bg-blue-100 text-blue-600",
      listing_updated: "bg-blue-100 text-blue-600",
      message_received: "bg-green-100 text-green-600",
      favorite_added: "bg-pink-100 text-pink-600",
      chat_message: "bg-green-100 text-green-600",
      system_alert: "bg-yellow-100 text-yellow-600",
      listing_expired: "bg-red-100 text-red-600",
      new_follower: "bg-purple-100 text-purple-600",
      mention: "bg-blue-100 text-blue-600",
      admin_announcement: "bg-gray-100 text-gray-600",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-600";
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Loading notifications...</div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        title="No notifications yet"
        description="When you receive notifications, they'll appear here."
        icon={<NotificationsIllustration />}
        action={
          <Link href="/notifications?tab=preferences">
            <Button variant="secondary">Manage preferences</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`rounded-lg border p-4 transition-colors ${
            notification.is_read
              ? "bg-white border-slate-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={`p-2 rounded-full ${getNotificationColor(
                  notification.type
                )}`}
              >
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900">
                    {notification.title}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {formatDistanceToNow(new Date(notification.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 mt-1">
                  {notification.message}
                </p>

                {notification.data &&
                  Object.keys(notification.data).length > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                      {Object.entries(notification.data).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span>{" "}
                          {String(value)}
                        </div>
                      ))}
                    </div>
                  )}

                <div className="flex items-center gap-4 mt-3">
                  {notification.action_url && (
                    <a
                      href={notification.action_url}
                      className="text-xs font-medium text-blue-900 hover:text-blue-800"
                    >
                      View details →
                    </a>
                  )}

                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-slate-600 hover:text-slate-900"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              {!notification.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="p-1 text-green-600 hover:text-green-800"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
              <button
                onClick={() => handleDelete(notification.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Delete"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => loadNotifications(true)}
            disabled={loading}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
