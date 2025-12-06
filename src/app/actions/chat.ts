"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createChatNotification } from "../actions/notificatons";

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

    const { data: existingThread } = await supabase
      .from("chat_threads")
      .select("*")
      .or(
        `and(listing_id.eq.${listingId},user1_id.eq.${currentUserId},user2_id.eq.${otherUserId}),and(listing_id.eq.${listingId},user1_id.eq.${otherUserId},user2_id.eq.${currentUserId})`
      )
      .single();

    if (existingThread) {
      return { success: true, data: existingThread, isNew: false };
    }

    const { data: newThread, error } = await supabase
      .from("chat_threads")
      .insert({
        listing_id: listingId,
        user1_id: currentUserId,
        user2_id: otherUserId,
      })
      .select(
        `
        *,
        listing:listings(id, title, user_id),
        user1:user1_id(id, email),
        user2:user2_id(id, email)
      `
      )
      .single();

    if (error) {
      console.error("Error creating chat thread:", error);
      return { error: error.message };
    }

    revalidatePath("/chat");
    return { success: true, data: newThread, isNew: true };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function sendMessage(threadId: string, content: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to send messages" };
    }

    // Validate thread exists and user is participant
    const { data: thread } = await supabase
      .from("chat_threads")
      .select("user1_id, user2_id")
      .eq("id", threadId)
      .single();

    if (!thread) {
      return { error: "Chat thread not found" };
    }

    if (
      thread.user1_id !== userData.user.id &&
      thread.user2_id !== userData.user.id
    ) {
      return { error: "You are not a participant in this chat" };
    }

    // Create message
    const { data: message, error } = await supabase
      .from("chat_messages")
      .insert({
        thread_id: threadId,
        sender_id: userData.user.id,
        content,
      })
      .select(
        `
        *,
        sender:sender_id(id, email)
      `
      )
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

    // Get the other participant (thread variable is available here)
    const recipientId =
      thread.user1_id === userData.user.id ? thread.user2_id : thread.user1_id;

    // Get sender name
    const senderName = userData.user.email?.split("@")[0] || "User";

    // Create notification
    await createChatNotification(threadId, senderName, content, recipientId);

    revalidatePath(`/chat/${threadId}`);
    revalidatePath("/chat");

    return { success: true, data: message };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getUserChatThreads() {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to view chats" };
    }

    const { data: threads, error } = await supabase
      .from("chat_threads")
      .select(
        `
        *,
        listing:listings(id, title, user_id),
        user1:user1_id(id, email),
        user2:user2_id(id, email),
        last_message:chat_messages!inner(
          content,
          created_at,
          sender:sender_id(id, email)
        )
      `
      )
      .or(`user1_id.eq.${userData.user.id},user2_id.eq.${userData.user.id}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching chat threads:", error);
      return { error: error.message };
    }

    return { success: true, data: threads };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function getThreadMessages(threadId: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in to view messages" };
    }

    const { data: thread } = await supabase
      .from("chat_threads")
      .select("user1_id, user2_id")
      .eq("id", threadId)
      .single();

    if (!thread) {
      return { error: "Chat thread not found" };
    }

    if (
      thread.user1_id !== userData.user.id &&
      thread.user2_id !== userData.user.id
    ) {
      return { error: "You are not a participant in this chat" };
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select(
        `
        *,
        sender:sender_id(id, email)
      `
      )
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return { error: error.message };
    }

    await supabase
      .from("chat_messages")
      .update({ read: true })
      .eq("thread_id", threadId)
      .eq("read", false)
      .neq("sender_id", userData.user.id);

    return { success: true, data: messages };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}

export async function markMessagesAsRead(threadId: string) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return { error: "You must be logged in" };
    }

    const { error } = await supabase
      .from("chat_messages")
      .update({ read: true })
      .eq("thread_id", threadId)
      .eq("read", false)
      .neq("sender_id", userData.user.id);

    if (error) {
      console.error("Error marking messages as read:", error);
      return { error: error.message };
    }

    revalidatePath(`/chat/${threadId}`);
    return { success: true };
  } catch (error) {
    console.error("Server error:", error);
    return { error: "An unexpected error occurred" };
  }
}
