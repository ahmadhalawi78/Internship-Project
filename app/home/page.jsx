"use client";
import ProtectedRoute from "../context/ProtectedRoute";

import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/signin");
  };

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome!</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </ProtectedRoute>
  );
}
