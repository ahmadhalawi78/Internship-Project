"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/frontend/lib/supabase/client";
import { ChatEventManager, ChatEvents } from "@/lib/events/chatEvents";

type MessageRow = {
  id: string;
  sender_id: string;
  thread_id: string;
  content: string;
  created_at: string;
};

type SupabaseRealtimePayload<T> = {
  new?: T;
  old?: T;
};

export function useChatSubscription(threadId?: string) {
  useEffect(() => {
    const supabase = supabaseBrowser();

    const baseOptions = {
      schema: "public",
      table: "chat_messages",
      ...(threadId ? { filter: `thread_id=eq.${threadId}` } : {}),
    } as const;

    const channel = supabase
      .channel(`chat:${threadId || "all"}`)
      .on("postgres_changes", { event: "INSERT", ...baseOptions }, (payload) => {
        try {
          const newRecord = (payload as unknown as SupabaseRealtimePayload<MessageRow>).new;
          if (newRecord) ChatEventManager.getInstance().emit(ChatEvents.MESSAGE_RECEIVED, newRecord);
        } catch (error) {
          ChatEventManager.getInstance().emit(ChatEvents.CHAT_ERROR, error);
          console.error("useChatSubscription INSERT handler error:", error);
        }
      })
      .on("postgres_changes", { event: "UPDATE", ...baseOptions }, (payload) => {
        try {
          const updated = (payload as unknown as SupabaseRealtimePayload<MessageRow>).new;
          if (updated) ChatEventManager.getInstance().emit(ChatEvents.MESSAGE_SENT, updated);
        } catch (error) {
          ChatEventManager.getInstance().emit(ChatEvents.CHAT_ERROR, error);
          console.error("useChatSubscription UPDATE handler error:", error);
        }
      })
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // best-effort cleanup
      }
    };
  }, [threadId]);
}
