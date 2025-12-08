import { Header } from "@/frontend/components/layout/Header";
import { Footer } from "@/frontend/components/layout/Footer";
import ChatThreadList from "../../frontend/components/chat/ChatThreadList";
import { supabaseServer } from "@/backend/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
            <p className="text-slate-600 mt-2">
              Connect with other users about listings
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <ChatThreadList />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
