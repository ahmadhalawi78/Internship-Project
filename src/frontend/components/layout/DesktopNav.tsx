"use client";

import { Search, Menu, User, Plus, LogOut, X, MessageCircle, Heart, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/frontend/hooks/useAuth";

export default function DesktopNav() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { getUnreadMessageCount } = await import("@/app/actions/chat");
      const res = await getUnreadMessageCount();
      if (res.success && typeof res.count === 'number') {
        setUnreadCount(res.count);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  useEffect(() => {
    if (user) {
      import("@/app/actions/auth").then(({ checkIsAdmin }) => {
        checkIsAdmin().then(setIsAdmin);
      });

      fetchUnreadCount();

      // Refresh count when window gains focus
      const handleFocus = () => {
        fetchUnreadCount();
      };
      window.addEventListener('focus', handleFocus);

      // Listen for custom event from messages page
      const handleUnreadCountChanged = (event: any) => {
        if (event.detail && typeof event.detail.count === 'number') {
          setUnreadCount(event.detail.count);
        }
      };
      window.addEventListener('unreadCountChanged', handleUnreadCountChanged);

      // Real-time subscription for unread count
      const { createClient } = require("@/lib/supabase/client");
      const supabase = createClient();
      const channel = supabase
        .channel('unread_count_watcher_header')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          () => {
            fetchUnreadCount();
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'messages' },
          () => {
            fetchUnreadCount();
          }
        )
        .subscribe();

      return () => {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('unreadCountChanged', handleUnreadCountChanged);
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchValue.trim()) return;
    router.push(`/?query=${encodeURIComponent(searchValue.trim())}`);
  };

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo (Left) */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-10 w-10 flex-shrink-0 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm transition-all group-hover:scale-105">
                <svg width="28" height="28" viewBox="0 0 120 120">
                  <path
                    d="M 28 18 L 52 18 L 52 78 L 92 78 L 92 102 L 28 102 Z"
                    fill="white"
                  />
                  <g transform="translate(62, 28) scale(0.8)">
                    <rect x="6" y="42" width="6" height="20" fill="#78350f" />
                    <path d="M 9 10 L 21 30 L 18 30 L 27 44 L 24 44 L 33 60 L -15 60 L -6 44 L -9 44 L 0 30 L -3 30 Z" fill="#047857" />
                    <path d="M 9 13 L 19 28 L 16 28 L 24 40 L 21 40 L 28 52 L -10 52 L -3 40 L -6 40 L 2 28 L -1 28 Z" fill="#059669" opacity="0.85" />
                    <path d="M 9 17 L 17 24 L 14 24 L 20 34 L 17 34 L 23 46 L -5 46 L 1 34 L -2 34 L 4 24 L 1 24 Z" fill="#10b981" opacity="0.7" />
                  </g>
                </svg>
              </div>
              <div className="hidden lg:block">
                <span className="text-xl font-black text-slate-900">Loop<span className="text-blue-600">Lebanon</span></span>
              </div>
            </Link>
          </div>

          {/* Search Bar (Center) */}
          <div className="flex flex-1 items-center justify-center max-w-lg">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search items, users, locations..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 pl-10 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </form>
          </div>
>>>>>>> d3ddc602b7202071245e8e9fef5209a0982f7ed7

          {/* Actions (Right) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/create-listing"
                      className="hidden sm:flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-100"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Post</span>
                    </Link>

                    <Link
                      href="/messages"
                      className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                      title="Messages"
                    >
                      <MessageCircle className="h-6 w-6" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Link>

                    <div className="relative">
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-blue-400 hover:shadow-md overflow-hidden"
                      >
                        {user.user_metadata?.avatar_url ? (
                          <img src={user.user_metadata.avatar_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-5 w-5 text-slate-600" />
                        )}
>>>>>>> d3ddc602b7202071245e8e9fef5209a0982f7ed7
                      </button>

                      {menuOpen && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-20 animate-in fade-in zoom-in-95 duration-100">
                            <div className="px-3 py-2 border-b border-slate-100 mb-1">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                              <p className="text-sm font-black text-slate-900 truncate">{user.user_metadata?.full_name || user.email}</p>
                            </div>

                            <Link
                              href="/profile"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
                            >
                              <User className="h-5 w-5" />
                              Profile
                            </Link>

                            {isAdmin && (
                              <Link
                                href="/admin"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-all"
                              >
                                <Bell className="h-5 w-5" />
                                Admin Panel
                              </Link>
                            )}

                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 rounded-xl p-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                            >
                              <LogOut className="h-5 w-5" />
                              Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/auth/login"
                      className="text-sm font-bold text-slate-700 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-slate-800 transition-all shadow-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Toggle (only visible on small screens to replace full nav) */}
            <div className="lg:hidden">
              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}