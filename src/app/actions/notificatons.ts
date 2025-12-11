"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type NotificationType =
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

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  expiresAt?: Date;
};

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  read_at?: string;
  expires_at?: string;
};
export async function mapNotificationType(
  type: string
): Promise<NotificationType> {
  const typeMap: Record<string, NotificationType> = {
    message_received: "new_message",
    system_alert: "system",
    chat_message: "new_message",
    favorite_added: "review",
  };

  return (typeMap[type] || type) as NotificationType;
}

export async function createNotification(input: CreateNotificationInput) {
  try {
    const supabase = await supabaseServer();
    const mappedType = await mapNotificationType(input.type);


    const { data: preferences } = await supabase
      .from("notification_preferences")
      .select("preferences, in_app_enabled")
      .eq("user_id", input.userId)
      .single();
    if (preferences) {
      const isEnabled = preferences.preferences?.[mappedType] !== false;
      const inAppEnabled = preferences.in_app_enabled !== false;

      if (!isEnabled || !inAppEnabled) {
        return {
          success: true,
          skipped: true,
          reason: "User disabled this notification type",
        };
      }
    }

    const { data, error } = await supabase
      .from("notifications")
      .insert({
        user_id: input.userId,
        type: mappedType,
        title: input.title,
        message: input.message,
        data: input.data || {},
        action_url: input.actionUrl,
        expires_at: input.expiresAt?.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating notification:", error);
      return { error: error.message };
    }
    await supabase.channel(`notifications:${input.userId}`).send({
      type: "broadcast",
      event: "new_notification",
      payload: data,
    });

    revalidatePath("/notifications");
    return { success: true, data };
  } catch (error) {
    console.error("Server error creating notification:", error);
    return { error: "An unexpected error occurred" };
  }
}
export async function getUserNotifications(options?: {
  limit?: number;
  offset?: number;
  includeRead?: boolean;
  type?: NotificationType;
}) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to view notifications" };
    }

    const { limit = 20, offset = 0, includeRead = false, type } = options || {};

    let query = supabase
      .from("notifications")
      .select("*", { count: "exact" })
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeRead) {
      query = query.eq("is_read", false);
    }

    if (type) {
      const mappedType = await mapNotificationType(type);
      query = query.eq("type", mappedType);
    }
    query = query.or(
      `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`
    );

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching notifications:", error);
      return { error: error.message };
    }

    return {
      success: true,
      data: data as Notification[],
      count,
      hasMore: count ? count > offset + limit : false,
    };
  } catch (error) {
    console.error("Server error fetching notifications:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in" };
    }
    const { data: notification } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", notificationId)
      .single();

    if (!notification || notification.user_id !== userData.user.id) {
      return { error: "Notification not found or access denied" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      return { error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Server error marking notification as read:", error);
    return { error: "An unexpected error occurred" };
  }
}
export async function markAllNotificationsAsRead() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("user_id", userData.user.id)
      .eq("is_read", false);

    if (error) {
      console.error("Error marking all notifications as read:", error);
      return { error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Server error marking all notifications as read:", error);
    return { error: "An unexpected error occurred" };
  }
}
export async function deleteNotification(notificationId: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in" };
    }
    const { data: notification } = await supabase
      .from("notifications")
      .select("user_id")
      .eq("id", notificationId)
      .single();

    if (!notification || notification.user_id !== userData.user.id) {
      return { error: "Notification not found or access denied" };
    }

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Error deleting notification:", error);
      return { error: error.message };
    }

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Server error deleting notification:", error);
    return { error: "An unexpected error occurred" };
  }
}
export async function getNotificationCounts() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in" };
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("type, is_read", { count: "exact", head: true })
      .eq("user_id", userData.user.id)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (error) {
      console.error("Error getting notification counts:", error);
      return { error: error.message };
    }

    const total = data?.length || 0;
    const unread = data?.filter((n) => !n.is_read).length || 0;

    return {
      success: true,
      data: { total, unread },
    };
  } catch (error) {
    console.error("Server error getting notification counts:", error);
    return { error: "An unexpected error occurred" };
  }
}
export async function getUserNotificationPreferences() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in" };
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .select("*")
      .eq("user_id", userData.user.id)
      .single();

    if (error && error.code === "PGRST116") {
      const defaultPreferences = {
        user_id: userData.user.id,
        email_enabled: true,
        push_enabled: true,
        in_app_enabled: true,
        email_frequency: "immediate",
        preferences: {
          new_message: true,
          new_listing_nearby: true,
          system: true,
          transaction_update: true,
          review: true,
          listing_created: true,
          listing_updated: true,
          message_received: true,
          favorite_added: true,
          chat_message: true,
          system_alert: true,
          listing_expired: true,
          new_follower: true,
          mention: true,
          admin_announcement: false,
        },
      };

      const { data: newData, error: createError } = await supabase
        .from("notification_preferences")
        .insert(defaultPreferences)
        .select()
        .single();

      if (createError) {
        console.error("Error creating notification preferences:", createError);
        return { error: createError.message };
      }

      return { success: true, data: newData };
    }

    if (error) {
      console.error("Error fetching notification preferences:", error);
      return { error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Server error getting notification preferences:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function updateNotificationPreferences(
  updates: Partial<{
    email_enabled: boolean;
    push_enabled: boolean;
    in_app_enabled: boolean;
    email_frequency: string;
    muted_until: Date;
    preferences: Record<string, boolean>;
  }>
) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in" };
    }

    const { data, error } = await supabase
      .from("notification_preferences")
      .update(updates)
      .eq("user_id", userData.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating notification preferences:", error);
      return { error: error.message };
    }

    revalidatePath("/settings/notifications");
    return { success: true, data };
  } catch (error) {
    console.error("Server error updating notification preferences:", error);
    return { error: "An unexpected error occurred" };
  }
}
export async function createListingNotification(
  listingId: string,
  listingTitle: string,
  type: "listing_created" | "listing_updated" | "listing_expired",
  userId: string
) {
  const notification = await createNotification({
    userId,
    type,
    title: `Listing ${
      type === "listing_created"
        ? "Created"
        : type === "listing_updated"
        ? "Updated"
        : "Expired"
    }`,
    message: `Your listing "${listingTitle}" has been ${
      type === "listing_created"
        ? "created"
        : type === "listing_updated"
        ? "updated"
        : "expired"
    }.`,
    data: { listingId, listingTitle },
    actionUrl: `/listings/${listingId}`,
  });

  return notification;
}

export async function createChatNotification(
  threadId: string,
  senderName: string,
  messagePreview: string,
  recipientId: string
) {
  const notification = await createNotification({
    userId: recipientId,
    type: "new_message",
    title: `New message from ${senderName}`,
    message:
      messagePreview.length > 100
        ? `${messagePreview.substring(0, 100)}...`
        : messagePreview,
    data: { threadId, senderName },
    actionUrl: `/chat/${threadId}`,
  });

  return notification;
}

export async function createFavoriteNotification(
  listingId: string,
  listingTitle: string,
  favoritedById: string,
  listingOwnerId: string
) {
  const supabase = await supabaseServer();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return { error: "User not found" };
  }

  const notification = await createNotification({
    userId: listingOwnerId,
    type: "review",
    title: "Someone favorited your listing",
    message: `Your listing "${listingTitle}" was favorited.`,
    data: { listingId, listingTitle, favoritedById },
    actionUrl: `/listings/${listingId}`,
  });

  return notification;
}

export async function createListingNearbyNotification(
  listingId: string,
  listingTitle: string,
  location: string,
  userId: string
) {
  const notification = await createNotification({
    userId,
    type: "new_listing_nearby",
    title: "New listing near you",
    message: `"${listingTitle}" was posted in ${location}`,
    data: { listingId, listingTitle, location },
    actionUrl: `/listings/${listingId}`,
  });

  return notification;
}
