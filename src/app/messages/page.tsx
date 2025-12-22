"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Send, Search, MoreVertical, ArrowLeft, Loader2 } from "lucide-react";
import { createOrGetChatThread, getUserChatThreads, markMessagesAsRead, sendMessage } from "@/app/actions/chat";
import type { Message, ChatThread } from "@/types/realtime-chat";
import type { User } from "@supabase/supabase-js";

export default function MessagesPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setLoading(false);
    };
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle URL params for direct messaging
  useEffect(() => {
    if (loading || !currentUser) return;

    const listingId = searchParams.get("listingId");
    const ownerId = searchParams.get("ownerId");

    if (listingId && ownerId && ownerId !== currentUser.id) {
      const initChat = async () => {
        // Clear params immediately to prevent loop
        router.replace("/messages");

        const result = await createOrGetChatThread(listingId, ownerId);

        if (result.success && result.data) {
          const thread = result.data as ChatThread;
          setThreads(prev => {
            if (prev.find(t => t.id === thread.id)) return prev;
            return [thread, ...prev];
          });
          setSelectedThread(thread.id);
        } else {
          console.error("Failed to init chat:", result.error);
        }
      };

      initChat();
    }
  }, [currentUser, loading, searchParams, router]);

  // Load threads using server action
  useEffect(() => {
    if (!currentUser) return;

    const loadThreads = async () => {
      const result = await getUserChatThreads();
      if (result.success && result.data) {
        setThreads(result.data as ChatThread[]);
      }
    };

    loadThreads();

    // Subscribe to thread updates (e.g. last_message_at)
    const channel = supabase
      .channel('chat_threads_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_threads',
        },
        () => {
          loadThreads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  // Load messages for selected thread
  useEffect(() => {
    if (!selectedThread) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', selectedThread)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
      }

      // Mark as read when opening
      await markMessagesAsRead(selectedThread);
      setThreads(prev => prev.map(t => t.id === selectedThread ? { ...t, hasUnread: false, unreadCount: 0 } : t));
    };

    loadMessages();

    // Subscribe to real-time messages
    const channel = supabase
      .channel(`messages:${selectedThread}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `thread_id=eq.${selectedThread}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThread]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !currentUser || sending) return;

    setSending(true);
    try {
      const result = await sendMessage(selectedThread, newMessage.trim());
      if (result.success) {
        setNewMessage("");
      } else {
        console.error("Failed to send message:", result.error);
        alert("Failed to send: " + result.error);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 mb-2">Please sign in</p>
          <p className="text-sm text-slate-600">You need to be signed in to use messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Threads Panel */}
      <div className={`${selectedThread ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white border-r border-slate-200`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Threads List */}
        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-600">No conversations yet</p>
            </div>
          ) : (
            threads.map((thread: any) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`w-full p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors text-left ${selectedThread === thread.id ? 'bg-blue-50' : ''
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {(thread.otherUser?.full_name?.[0] || thread.otherUser?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold truncate ${thread.hasUnread ? 'text-blue-600' : 'text-slate-900'}`}>
                        {thread.otherUser?.full_name || thread.otherUser?.email?.split('@')[0] || 'User'}
                      </h3>
                      <div className="flex items-center gap-2">
                        {thread.hasUnread && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                        )}
                        <span className="text-xs text-slate-500">
                          {new Date(thread.last_message_at || thread.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className={`text-sm truncate ${thread.hasUnread ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                      {thread.hasUnread ? 'New messages' : 'Click to view messages'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Panel */}
      <div className={`${selectedThread ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-3">
              <button
                onClick={() => setSelectedThread(null)}
                className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {((threads.find(t => t.id === selectedThread) as any)?.otherUser?.full_name?.[0] || (threads.find(t => t.id === selectedThread) as any)?.otherUser?.email?.[0] || 'U').toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-slate-900">
                  {(threads.find(t => t.id === selectedThread) as any)?.otherUser?.full_name || (threads.find(t => t.id === selectedThread) as any)?.otherUser?.email || "Conversation"}
                </h2>
                <p className="text-sm text-slate-600">Online</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <MoreVertical className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg) => {
                const isOwn = msg.sender_id === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-900 border border-slate-200'
                        }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <span className={`text-xs mt-1 block ${isOwn ? 'text-blue-100' : 'text-slate-500'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  disabled={sending}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                <Send className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a conversation</h3>
              <p className="text-sm text-slate-600">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}