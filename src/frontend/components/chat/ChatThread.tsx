"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { getThreadMessages, sendMessage } from "@/app/actions/chat";

interface ChatThreadProps {
  threadId: string;
  currentUserId: string;
  otherUserId?: string;
  listingTitle?: string;
  otherUserName?: string;
}

export default function ChatThread({
  threadId,
  currentUserId,
  otherUserId,
  listingTitle,
  otherUserName,
}: ChatThreadProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
  }, [threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    const result = await getThreadMessages(threadId);

    if (result.success && result.data) {
      setMessages(result.data);
    }
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const result = await sendMessage(threadId, newMessage.trim());

    if (result.success) {
      setNewMessage("");
      loadMessages();
    }
    setSending(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[600px] rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-slate-500 py-8">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                  message.sender_id === currentUserId
                    ? "bg-blue-900 text-white"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender_id === currentUserId
                      ? "text-blue-200"
                      : "text-slate-500"
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Message ${otherUserName || "user"}...`}
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
