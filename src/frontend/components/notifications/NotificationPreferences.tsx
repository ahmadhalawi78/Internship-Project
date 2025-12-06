"use client";

import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone, Globe, Volume2, VolumeX } from "lucide-react";
import {
  getUserNotificationPreferences,
  updateNotificationPreferences,
} from "../../../app/actions/notificatons";

type NotificationPreference = {
  user_id: string;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  email_frequency: string;
  muted_until: string | null;
  preferences: Record<string, boolean>;
  created_at: string;
  updated_at: string;
};

type NotificationType =
  | "new_message"
  | "new_listing_nearby"
  | "system"
  | "transaction_update"
  | "review"
  | "listing_created"
  | "listing_updated"
  | "message_received"
  | "favorite_added"
  | "chat_message"
  | "system_alert"
  | "listing_expired"
  | "new_follower"
  | "mention"
  | "admin_announcement";

const notificationTypes: Array<{
  id: NotificationType;
  label: string;
  description: string;
  category: "messages" | "listings" | "social" | "system";
}> = [
  {
    id: "new_message",
    label: "New Messages",
    description: "When someone sends you a message",
    category: "messages",
  },
  {
    id: "new_listing_nearby",
    label: "New Listings Nearby",
    description: "When new listings are posted near you",
    category: "listings",
  },
  {
    id: "system",
    label: "System Updates",
    description: "Important system announcements",
    category: "system",
  },
  {
    id: "transaction_update",
    label: "Transaction Updates",
    description: "Updates on your transactions",
    category: "system",
  },
  {
    id: "review",
    label: "Reviews",
    description: "When someone reviews your listing or profile",
    category: "social",
  },

  {
    id: "listing_created",
    label: "Listing Created",
    description: "When you create a new listing",
    category: "listings",
  },
  {
    id: "listing_updated",
    label: "Listing Updated",
    description: "When your listing is updated",
    category: "listings",
  },
  {
    id: "message_received",
    label: "Message Received",
    description: "When you receive a new message",
    category: "messages",
  },
  {
    id: "favorite_added",
    label: "Favorite Added",
    description: "When someone favorites your listing",
    category: "social",
  },
  {
    id: "chat_message",
    label: "Chat Messages",
    description: "New messages in chat threads",
    category: "messages",
  },
  {
    id: "system_alert",
    label: "System Alerts",
    description: "Important system alerts",
    category: "system",
  },
  {
    id: "listing_expired",
    label: "Listing Expired",
    description: "When your listing expires",
    category: "listings",
  },
  {
    id: "new_follower",
    label: "New Follower",
    description: "When someone follows you",
    category: "social",
  },
  {
    id: "mention",
    label: "Mentions",
    description: "When someone mentions you",
    category: "social",
  },
  {
    id: "admin_announcement",
    label: "Admin Announcements",
    description: "Announcements from administrators",
    category: "system",
  },
];

const categories = [
  {
    id: "messages",
    label: "Messages",
    icon: Mail,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "listings",
    label: "Listings",
    icon: Globe,
    color: "bg-green-100 text-green-600",
  },
  {
    id: "social",
    label: "Social",
    icon: Bell,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "system",
    label: "System",
    icon: Smartphone,
    color: "bg-yellow-100 text-yellow-600",
  },
];

const emailFrequencies = [
  {
    id: "immediate",
    label: "Immediate",
    description: "Receive emails as soon as notifications arrive",
  },
  {
    id: "daily",
    label: "Daily Digest",
    description: "Receive one email per day with all notifications",
  },
  {
    id: "weekly",
    label: "Weekly Digest",
    description: "Receive one email per week with all notifications",
  },
  {
    id: "never",
    label: "Never",
    description: "Never receive email notifications",
  },
];

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setLoading(true);
    setError(null);

    const result = await getUserNotificationPreferences();

    if (result.error) {
      setError(result.error);
    } else if (result.success && result.data) {
      setPreferences(result.data);
    }

    setLoading(false);
  };

  const handleTogglePreference = async (
    type: NotificationType,
    enabled: boolean
  ) => {
    if (!preferences) return;

    const updatedPreferences = {
      ...preferences.preferences,
      [type]: enabled,
    };

    await savePreferences({ preferences: updatedPreferences });
  };

  const handleToggleChannel = async (
    channel: "email" | "push" | "in_app",
    enabled: boolean
  ) => {
    if (!preferences) return;

    const update: any = {};
    if (channel === "email") update.email_enabled = enabled;
    if (channel === "push") update.push_enabled = enabled;
    if (channel === "in_app") update.in_app_enabled = enabled;

    await savePreferences(update);
  };

  const handleEmailFrequencyChange = async (frequency: string) => {
    await savePreferences({ email_frequency: frequency });
  };

  const handleMuteToggle = async (muted: boolean) => {
    await savePreferences({
      muted_until: muted
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        : null,
    });
  };

  const savePreferences = async (updates: any) => {
    if (!preferences) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const result = await updateNotificationPreferences(updates);

    if (result.error) {
      setError(result.error);
    } else if (result.success && result.data) {
      setPreferences(result.data);
      setSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  };

  const isMuted = preferences?.muted_until
    ? new Date(preferences.muted_until) > new Date()
    : false;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Loading preferences...</div>
      </div>
    );
  }

  if (error && !preferences) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          Error loading preferences: {error}
        </div>
        <button
          onClick={loadPreferences}
          className="mt-2 text-sm font-medium text-red-900 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!preferences) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Success message */}
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="text-sm text-green-800">
            Preferences saved successfully!
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-800">Error: {error}</div>
        </div>
      )}

      {/* Global Controls */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Notification Channels
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Email Notifications */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Email</h4>
                    <p className="text-sm text-slate-500">
                      {preferences.email_enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleChannel("email", !preferences.email_enabled)
                  }
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.email_enabled ? "bg-blue-900" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.email_enabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {preferences.email_enabled && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Email Frequency
                  </label>
                  <select
                    value={preferences.email_frequency}
                    onChange={(e) => handleEmailFrequencyChange(e.target.value)}
                    disabled={saving}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    {emailFrequencies.map((freq) => (
                      <option key={freq.id} value={freq.id}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">
                    {
                      emailFrequencies.find(
                        (f) => f.id === preferences.email_frequency
                      )?.description
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Push Notifications */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">Push</h4>
                    <p className="text-sm text-slate-500">
                      {preferences.push_enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleChannel("push", !preferences.push_enabled)
                  }
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.push_enabled ? "bg-blue-900" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.push_enabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-slate-600">
                Receive notifications in your browser
              </p>
            </div>

            {/* In-App Notifications */}
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900">In-App</h4>
                    <p className="text-sm text-slate-500">
                      {preferences.in_app_enabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleToggleChannel("in_app", !preferences.in_app_enabled)
                  }
                  disabled={saving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.in_app_enabled ? "bg-blue-900" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.in_app_enabled
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <p className="text-sm text-slate-600">
                Show notifications within the app
              </p>
            </div>
          </div>
        </div>

        {/* Mute All Notifications */}
        <div className="rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  isMuted ? "bg-red-100" : "bg-slate-100"
                }`}
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5 text-red-600" />
                ) : (
                  <Volume2 className="h-5 w-5 text-slate-600" />
                )}
              </div>
              <div>
                <h4 className="font-medium text-slate-900">
                  {isMuted ? "Notifications Muted" : "Mute All Notifications"}
                </h4>
                <p className="text-sm text-slate-500">
                  {isMuted
                    ? `Muted until ${new Date(
                        preferences.muted_until!
                      ).toLocaleDateString()}`
                    : "Temporarily pause all notifications"}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleMuteToggle(!isMuted)}
              disabled={saving}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                isMuted
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {isMuted ? "Unmute" : "Mute for 24h"}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Types by Category */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-6">
          Notification Types
        </h3>

        <div className="space-y-8">
          {categories.map((category) => {
            const categoryNotifications = notificationTypes.filter(
              (nt) => nt.category === category.id
            );

            if (categoryNotifications.length === 0) return null;

            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${category.color}`}>
                    <CategoryIcon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-slate-900">
                    {category.label}
                  </h4>
                </div>

                <div className="space-y-3">
                  {categoryNotifications.map((notificationType) => (
                    <div
                      key={notificationType.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                    >
                      <div>
                        <h5 className="font-medium text-slate-900">
                          {notificationType.label}
                        </h5>
                        <p className="text-sm text-slate-600">
                          {notificationType.description}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleTogglePreference(
                            notificationType.id,
                            !preferences.preferences[notificationType.id]
                          )
                        }
                        disabled={saving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.preferences[notificationType.id] !== false
                            ? "bg-blue-900"
                            : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            preferences.preferences[notificationType.id] !==
                            false
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex justify-end">
          <button
            onClick={loadPreferences}
            disabled={saving}
            className="mr-4 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 disabled:opacity-50"
          >
            Reset Changes
          </button>
          <button
            onClick={() => savePreferences({})} // Save current state
            disabled={saving}
            className="rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
}
