"use server";

import { supabaseServer } from "@/backend/lib/supabase/server";

export async function checkIsAdmin() {
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  // 1. Check Env Vars
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim());
  if (user.email && adminEmails.includes(user.email)) {
    return true;
  }

  // 2. Check DB
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return true;
    }
  } catch (error) {
    // ignore
  }

  return false;
}

// Badge definitions
const BADGES = {
  FIRST_TRADE: {
    id: "first_trade",
    name: "First Trade",
    description: "Completed your first trade",
    icon: "🎯",
    criteria: "complete_first_trade",
  },
  FIVE_TRADES: {
    id: "five_trades",
    name: "Rising Trader",
    description: "Completed 5 successful trades",
    icon: "⭐",
    criteria: "complete_five_trades",
  },
  TEN_TRADES: {
    id: "ten_trades",
    name: "Master Trader",
    description: "Completed 10 successful trades",
    icon: "🏆",
    criteria: "complete_ten_trades",
  },
  TRUSTED_USER: {
    id: "trusted_user",
    name: "Trusted User",
    description: "Received 5 positive reviews",
    icon: "✅",
    criteria: "receive_five_reviews",
  },
  ACTIVE_MEMBER: {
    id: "active_member",
    name: "Active Member",
    description: "Posted 10 listings",
    icon: "🔥",
    criteria: "post_ten_listings",
  },
  COMMUNITY_HELPER: {
    id: "community_helper",
    name: "Community Helper",
    description: "Helped 3 different users with trades",
    icon: "🤝",
    criteria: "help_three_users",
  },
} as const;

/**
 * Calculate and award badges for a user based on their activity
 */
export async function calculateAndAwardBadges(userId: string) {
  try {
    const supabase = await supabaseServer();

    // Get user's current stats
    const [listingsResult, reviewsResult, tradesResult] = await Promise.all([
      supabase.from("listings").select("id, status").eq("owner_id", userId),
      supabase.from("reviews").select("rating").eq("reviewee_id", userId),
      supabase
        .from("trades")
        .select("id, listing_id")
        .eq("status", "completed"),
    ]);

    const activeListings =
      listingsResult.data?.filter((l) => l.status === "active").length || 0;
    const totalListings = listingsResult.data?.length || 0;
    const positiveReviews =
      reviewsResult.data?.filter((r) => r.rating >= 4).length || 0;
    const totalTrades = tradesResult.data?.length || 0;

    // Get unique users helped through trades
    const uniqueUsersHelped = new Set(
      tradesResult.data?.map((t) => t.listing_id) || []
    ).size;

    const earnedBadges = [];

    // Check each badge criteria
    if (totalTrades >= 1) {
      earnedBadges.push("first_trade");
    }
    if (totalTrades >= 5) {
      earnedBadges.push("five_trades");
    }
    if (totalTrades >= 10) {
      earnedBadges.push("ten_trades");
    }
    if (positiveReviews >= 5) {
      earnedBadges.push("trusted_user");
    }
    if (activeListings >= 10) {
      earnedBadges.push("active_member");
    }
    if (uniqueUsersHelped >= 3) {
      earnedBadges.push("community_helper");
    }

    // Award badges to user
    for (const badgeId of earnedBadges) {
      await supabase.from("user_badges").upsert(
        {
          user_id: userId,
          badge_id: badgeId,
          earned_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,badge_id",
        }
      );
    }

    return { success: true, badges: earnedBadges };
  } catch (error) {
    console.error("Error calculating badges:", error);
    return { error: "Failed to calculate badges" };
  }
}

/**
 * Get user's earned badges
 */
export async function getUserBadges(userId: string) {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("user_badges")
      .select(
        `
        badge_id,
        earned_at,
        badges (
          id,
          name,
          description,
          icon,
          criteria
        )
      `
      )
      .eq("user_id", userId)
      .order("earned_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching user badges:", error);
    return { error: "Failed to fetch badges" };
  }
}
