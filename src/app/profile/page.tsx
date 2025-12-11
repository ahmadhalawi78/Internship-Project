import UserProfile from "@/frontend/components/profile/UserProfile";
import { supabaseServer } from "@/backend/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await supabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  const stats = {
    listings: 8,
    reviews: 5,
    joined: "2 years",
  };

  return (
    <UserProfile
      user={{
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata as {
          name?: string;
          avatar_url?: string;
        },
      }}
      location="Beirut, Lebanon"
      stats={stats}
    />
  );
}
