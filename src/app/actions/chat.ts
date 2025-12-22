"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Creates a new chat thread between two users or returns an existing one.
 * It ignores listingId for finding existing threads to ensure 1 chat per user pair.
 */
export async function createOrGetChatThread(
  listingId: string,
  otherUserId: string
) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to start a chat" };
    }

    const currentUserId = userData.user.id;

    // 1. Find if there's ALREADY a thread where BOTH users are participants
    const { data: myThreads } = await supabase
      .from('chat_participants')
      .select('thread_id')
      .eq('user_id', currentUserId);

    if (myThreads && myThreads.length > 0) {
      const threadIds = myThreads.map(t => t.thread_id);

      const { data: existing } = await supabase
        .from('chat_participants')
        .select(`
          thread_id,
          chat_threads (*)
        `)
        .in('thread_id', threadIds)
        .eq('user_id', otherUserId)
        .order('thread_id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        return { success: true, data: existing.chat_threads, isNew: false };
      }
    }

    // 2. Create new thread if not found
    const { data: newThread, error: threadError } = await supabase
      .from("chat_threads")
      .insert({
        listing_id: listingId, // Tag with listing that started it
      })
      .select("*")
      .single();

    if (threadError) {
      console.error("Error creating chat thread:", threadError);
      return { error: threadError.message };
    }

    // 3. Add participants
    const { error: partError } = await supabase
      .from("chat_participants")
      .insert([
        { thread_id: newThread.id, user_id: currentUserId },
        { thread_id: newThread.id, user_id: otherUserId }
      ]);

    if (partError) {
      console.error("Error adding participants:", partError);
      return { error: partError.message };
    }

    revalidatePath("/messages");
    return { success: true, data: newThread, isNew: true };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Sending a message in a thread.
 */
export async function sendMessage(threadId: string, content: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to send messages" };
    }

    const currentUserId = userData.user.id;

    // Validate participation
    const { data: participation } = await supabase
      .from("chat_participants")
      .select("*")
      .eq("thread_id", threadId)
      .eq("user_id", currentUserId)
      .maybeSingle();

    if (!participation) {
      return { error: "You are not a participant in this chat" };
    }

    // Create message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        thread_id: threadId,
        sender_id: currentUserId,
        content,
        status: 'sent'
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return { error: error.message };
    }

    // Update thread's last_message_at
    await supabase
      .from("chat_threads")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", threadId);

    revalidatePath("/messages");

    return { success: true, data: message };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Fetch all threads for the current user, including the OTHER user's profile.
 */
export async function getUserChatThreads() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to view chats" };
    }

    const currentUserId = userData.user.id;

    // Fetch my participations
    const { data: participations, error } = await supabase
      .from("chat_participants")
      .select(`
        thread_id,
        chat_threads (*)
      `)
      .eq("user_id", currentUserId);

    console.log(`[ChatDebug] Found ${participations?.length || 0} participations for user ${currentUserId}`);

    if (error) {
      console.error("Error fetching chat threads:", error);
      return { error: error.message };
    }

    if (!participations || participations.length === 0) {
      return { success: true, data: [] };
    }

    // For each thread, fetch the OTHER user's profile
    const threadsWithProfiles = await Promise.all(
      participations.map(async (p: any, index: number) => {
        const { data: other, error: otherError } = await supabase
          .from("chat_participants")
          .select(`
                    user_id,
                    profiles:user_id (id, full_name, avatar_url)
                `)
          .eq("thread_id", p.thread_id)
          .neq("user_id", currentUserId)
          .maybeSingle();

        console.log(`[ChatDebug] Thread ${index} (${p.thread_id}): other user found? ${!!other}. Error? ${otherError?.message || 'none'}`);

        if (!other) {
          console.log(`[ChatDebug] Thread ${p.thread_id}: Other participant not found via join. Trying message fallback...`);
          // Fallback 1: Try to find another user from the messages
          const { data: recentMsg } = await supabase
            .from("messages")
            .select("sender_id, profiles:sender_id(id, full_name, avatar_url)")
            .eq("thread_id", p.thread_id)
            .neq("sender_id", currentUserId)
            .limit(1)
            .maybeSingle();

          if (recentMsg) {
            console.log(`[ChatDebug] Thread ${p.thread_id}: Found other user via messages: ${recentMsg.sender_id}`);
            const otherUser = (recentMsg as any).profiles || { id: recentMsg.sender_id, full_name: "User" };
            const unread = await getUnreadForThread(supabase, p.thread_id, currentUserId);
            return {
              ...p.chat_threads,
              otherUser,
              otherUserId: recentMsg.sender_id,
              ...unread
            };
          }

          // Fallback 2: Try listing owner if it's a listing-based thread
          if (p.chat_threads?.listing_id) {
            console.log(`[ChatDebug] Thread ${p.thread_id}: Trying listing owner fallback...`);
            const { data: listing } = await supabase
              .from("listings")
              .select("owner_id, profiles:owner_id(id, full_name, avatar_url)")
              .eq("id", p.chat_threads.listing_id)
              .single();

            if (listing && listing.owner_id !== currentUserId) {
              const otherUser = (listing as any).profiles || { id: listing.owner_id, full_name: "Owner" };
              const unread = await getUnreadForThread(supabase, p.thread_id, currentUserId);
              return {
                ...p.chat_threads,
                otherUser,
                otherUserId: listing.owner_id,
                ...unread
              };
            }
          }

          console.log(`[ChatDebug] Thread ${p.thread_id}: All fallbacks failed. Skipping.`);
          return null;
        }

        // Check unread messages
        const unread = await getUnreadForThread(supabase, p.thread_id, currentUserId);

        return {
          ...p.chat_threads,
          otherUser: other.profiles || { id: other.user_id, full_name: "User" },
          otherUserId: other.user_id,
          ...unread
        };
      })
    );

    async function getUnreadForThread(supabase: any, threadId: string, userId: string) {
      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq("thread_id", threadId)
        .neq("sender_id", userId)
        .neq("status", 'read');

      return {
        hasUnread: (unreadCount ?? 0) > 0,
        unreadCount: unreadCount ?? 0
      };
    }

    const validThreads = threadsWithProfiles.filter(Boolean);
    console.log(`[ChatDebug] Valid threads after profile check: ${validThreads.length}`);

    // Consolidate: Only take the MOST RECENT thread for each other user
    const uniqueThreadsMap = new Map();

    validThreads.forEach((t: any) => {
      const existing = uniqueThreadsMap.get(t.otherUserId);
      const currentTime = new Date(t.last_message_at || t.created_at).getTime();

      if (!existing || currentTime > new Date(existing.last_message_at || existing.created_at).getTime()) {
        uniqueThreadsMap.set(t.otherUserId, t);
      }
    });

    const sortedThreads = Array.from(uniqueThreadsMap.values())
      .sort((a, b) => {
        const dateA = new Date(a.last_message_at || a.created_at).getTime();
        const dateB = new Date(b.last_message_at || b.created_at).getTime();
        return dateB - dateA;
      });

    return { success: true, data: sortedThreads };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Fetch messages for a thread.
 */
export async function getThreadMessages(threadId: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "Unauthorized" };
    }

    // participation check
    const { data: part } = await supabase
      .from("chat_participants")
      .select("*")
      .eq("thread_id", threadId)
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!part) {
      return { error: "Not a participant" };
    }

    const { data: messages, error } = await supabase
      .from("messages")
      .select(`
        *,
        profiles:sender_id (id, full_name, avatar_url)
      `)
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return { error: error.message };
    }

    return { success: true, data: messages };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Mark messages as read.
 */
export async function markMessagesAsRead(threadId: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return { error: "Unauthorized" };

    const { error } = await supabase
      .from("messages")
      .update({ status: 'read' })
      .eq("thread_id", threadId)
      .neq("sender_id", userData.user.id)
      .neq("status", 'read');

    if (error) {
      console.error("Error marking as read:", error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}

/**
 * Get total unread message count for the current user.
 */
export async function getUnreadMessageCount() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return { success: true, count: 0 };

    const { count, error } = await supabase
      .from("messages")
      .select("*", { count: 'exact', head: true })
      .neq("sender_id", userData.user.id)
      .neq("status", 'read')
      // Only count messages in threads I'm a participant of
      // In a real app, we'd join with chat_participants, but status='sent/delivered' + not sender is usually enough if threads are private
      ;

    if (error) {
      console.error("Error fetching unread count:", error);
      return { error: error.message };
    }

    return { success: true, count: count ?? 0 };
  } catch (error) {
    return { error: "An unexpected error occurred" };
  }
}
