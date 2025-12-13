"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Check current session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      if (!data.session) {
        router.replace("/signin");
      }
    };

    getSession();

    // 2. Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.replace("/signin");
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [router]);

  if (loading) return <div>Loading...</div>;

  // Only render children if session exists
  if (!session) return null;

  return <>{children}</>;
}
