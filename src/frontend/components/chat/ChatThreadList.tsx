"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User, Calendar } from "lucide-react";
import Link from "next/link";
import { getUserChatThreads } from "@/app/actions/chat";

interface ChatThread {
  id: string;
  listing: {
    id: string;
    title: string;
  } | null;
  user1: {
    id: string;
    email: string;
    username?: string;
  };
  user2: {
    id: string;
    email: string;
    username?: string;
  };
  last_message_at: string;
  last_message?: {
    content: string;
    created_at: string;
    sender: {
      id: string;
      email: string;
    };
  };
}

export default function ChatThreadList() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    setLoading(true);
    setError(null);

    const result = await getUserChatThreads();

    if (result.error) {
      setError(result.error);
    } else if (result.success && result.data) {
      setThreads(result.data as ChatThread[]);
    }

    setLoading(false);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (thread: ChatThread, currentUserId?: string) => {
    return thread.user2;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-500">Loading conversations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-800">
          Error loading conversations: {error}
        </div>
        <button
          onClick={loadThreads}
          className="mt-2 text-sm font-medium text-red-900 hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          No conversations yet
        </h3>
        <p className="text-slate-600 max-w-md mx-auto">
          When you message someone about a listing, your conversations will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Your Conversations ({threads.length})
        </h2>
        <button
          onClick={loadThreads}
          className="text-sm text-blue-900 hover:text-blue-800 font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-3">
        {threads.map((thread) => {
          const otherParticipant = getOtherParticipant(thread);
          const lastMessage = thread.last_message;

          return (
            <Link
              key={thread.id}
              href={`/chat/${thread.id}`}
              className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <User className="h-5 w-5 text-blue-900" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {otherParticipant.username ||
                          otherParticipant.email?.split("@")[0] ||
                          "User"}
                      </h3>
                      <p className="text-sm text-slate-500">
                        About: {thread.listing?.title || "Listing"}
                      </p>
                    </div>
                  </div>

                  {lastMessage && (
                    <div className="ml-13">
                      <p className="text-sm text-slate-700 truncate">
                        {lastMessage.content}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar size={12} />
                        <span>{formatTime(lastMessage.created_at)}</span>
                        {lastMessage.sender && (
                          <span className="text-slate-400">
                            • From {lastMessage.sender.email?.split("@")[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">
                    {formatTime(thread.last_message_at)}
                  </div>
                  {thread.last_message && (
                    <div className="mt-2 inline-block rounded-full bg-blue-900 px-2 py-1 text-xs font-medium text-white">
                      New
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
