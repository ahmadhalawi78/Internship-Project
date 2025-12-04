"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { createOrGetChatThread } from "@/app/actions/chat";
import { useRouter } from "next/navigation";

interface MessageButtonProps {
  listingId: string;
  listingOwnerId: string;
  listingTitle: string;
}

export default function MessageButton({
  listingId,
  listingOwnerId,
  listingTitle,
}: MessageButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStartChat = async () => {
    setLoading(true);
    setError(null);

    const result = await createOrGetChatThread(listingId, listingOwnerId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success && result.data) {
      // Navigate to the chat thread
      router.push(`/chat/${result.data.id}`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleStartChat}
        disabled={loading}
        className="flex items-center gap-2 rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
      >
        <MessageSquare size={16} />
        {loading ? "Starting chat..." : "Message"}
      </button>

      {error && (
        <div className="absolute top-full mt-2 rounded-md bg-red-50 p-2 text-xs text-red-800 shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
