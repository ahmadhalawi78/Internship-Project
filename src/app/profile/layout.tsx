import ProfileSidebar from "@/frontend/components/profile/ProfileSidebar";

export const metadata = {
  title: "Profile",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex w-full gap-8">
          <aside className="hidden w-64 shrink-0 md:block">
            <ProfileSidebar />
          </aside>

          <main className="min-w-0 flex-1 rounded-2xl bg-white p-6 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
