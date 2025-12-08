import { Header } from "@/frontend/components/layout/Header";
import Footer from "@/frontend/components/layout/Footer";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationPreferences from "@/frontend/components/notifications/NotificationPreferences";
import { supabaseServer } from "@/backend/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../frontend/components/ui/Tabs";

export default async function NotificationsPage() {
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
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-600 mt-2">
              Manage your notifications and preferences
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <Tabs defaultValue="notifications" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="notifications" className="flex-1">
                  All Notifications
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1">
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="p-6">
                <NotificationList />
              </TabsContent>

              <TabsContent value="preferences" className="p-6">
                <NotificationPreferences />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
