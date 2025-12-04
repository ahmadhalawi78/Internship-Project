import { Header } from "@/frontend/components/layout/Header";
import { Footer } from "@/frontend/components/layout/Footer";
import ChatThread from "../../../frontend/components/chat/ChatThread";
import { supabaseServer } from "@/backend/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

export async function generateStaticParams() {
  return [{ threadId: "example-1" }, { threadId: "example-2" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return {
    title: `Chat ${threadId} | LoopLebanon`,
  };
}

export default async function ChatThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  try {
    const { data: thread, error } = await supabase
      .from("chat_threads")
      .select(
        `
        *,
        listing:listings(id, title, user_id),
        user1:user1_id(id, email, username),
        user2:user2_id(id, email, username)
      `
      )
      .eq("id", threadId)
      .single();

    if (error || !thread) {
      console.error("Thread not found or error:", error);
      notFound();
    }

    const isParticipant =
      thread.user1_id === user.id || thread.user2_id === user.id;

    if (!isParticipant) {
      notFound();
    }

    const otherParticipant =
      thread.user1_id === user.id ? thread.user2 : thread.user1;

    return (
      <div className="flex min-h-screen flex-col bg-slate-100">
        <Header />
        <main className="flex-1">
          <div className="mx-auto max-w-4xl px-4 py-8">
            {/* Chat header */}
            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">
                    Chat with{" "}
                    {otherParticipant?.username ||
                      otherParticipant?.email?.split("@")[0] ||
                      "User"}
                  </h1>
                  <p className="text-slate-600 text-sm">
                    About:{" "}
                    <span className="font-medium">
                      {thread.listing?.title || "Listing"}
                    </span>
                  </p>
                </div>
                <div className="text-right text-sm text-slate-500">
                  <p>Thread ID: {threadId.slice(0, 8)}...</p>
                  <p>
                    Started: {new Date(thread.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat thread component */}
            <ChatThread
              threadId={threadId}
              currentUserId={user.id}
              otherUserId={otherParticipant?.id}
              listingTitle={thread.listing?.title}
              otherUserName={
                otherParticipant?.username ||
                otherParticipant?.email?.split("@")[0]
              }
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error("Error loading chat thread:", error);
    notFound();
  }
}
