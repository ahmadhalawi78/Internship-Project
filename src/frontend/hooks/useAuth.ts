"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/frontend/lib/supabase/client";
import type {
  User as SupabaseUser,
  Session as SupabaseSession,
  AuthChangeEvent as SupabaseAuthChangeEvent,
  AuthError as SupabaseAuthError,
} from "@supabase/auth-js";

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = supabaseBrowser();

    // Get initial session
    supabase.auth
      .getSession()
      .then(({ data, error: sessionError }) => {
        if (sessionError) {
          setError(new Error(sessionError.message || "Failed to get session"));
          setLoading(false);
          return;
        }
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: SupabaseAuthChangeEvent, session: SupabaseSession | null) => {
        setUser(session?.user ?? null);
        setLoading(false);
        setError(null);

        // Refresh the page on sign in/out to update server-side state
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signOut = async () => {
    try {
      setLoading(true);
      const supabase = supabaseBrowser();
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError(new Error(signOutError.message || "Failed to sign out"));
        setLoading(false);
        return;
      }

      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setLoading(false);
    }
  };

  return { user, loading, error, signOut };
}
