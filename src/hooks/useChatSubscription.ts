"use client";

import { useEffect } from "react";
import { supabaseBrowser } from "@/frontend/lib/supabase/client";
import { useRouter } from "next/navigation";

export function useChatSubscription(threadId?: string) {
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();

    const channel = supabase
      .channel(`chat:${threadId || "all"}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          ...(threadId ? { filter: `thread_id=eq.${threadId}` } : {}),
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [threadId, router]);
}
