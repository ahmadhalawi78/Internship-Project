"use client";

import Link from "next/link";
import { Search, Menu, X, User, Plus, Info, LogOut, Package, Utensils, MessageCircle } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/frontend/hooks/useAuth";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number;
  title: string;
  category: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const MobileNav = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [logoutHesitate, setLogoutHesitate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [hasCheckedUnread, setHasCheckedUnread] = useState(false);

  const fetchUnreadCount = async () => {
    const { getUnreadMessageCount } = await import("@/app/actions/chat");
    const res = await getUnreadMessageCount();
    if (res.success && typeof res.count === 'number') {
      setUnreadCount(res.count);
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
        .channel('unread_count_watcher_mobile')
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

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);



  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/?query=${encodeURIComponent(searchValue.trim())}`);
  };

  const handleLogout = () => {
    if (!logoutHesitate) {
      setLogoutHesitate(true);
      setTimeout(() => setLogoutHesitate(false), 3000);
      return;
    }
    signOut();
    setOpen(false);
    setLogoutHesitate(false);
  };

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-3">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-9 w-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center shadow-md">
            <svg width="24" height="24" viewBox="0 0 120 120">
              <path d="M 28 18 L 52 18 L 52 78 L 92 78 L 92 102 L 28 102 Z" fill="white" />
              <g transform="translate(62, 28) scale(0.8)">
                <rect x="6" y="42" width="6" height="20" fill="#78350f" />
                <path d="M 9 10 L 21 30 L 18 30 L 27 44 L 24 44 L 33 60 L -15 60 L -6 44 L -9 44 L 0 30 L -3 30 Z" fill="#047857" />
                <path d="M 9 13 L 19 28 L 16 28 L 24 40 L 21 40 L 28 52 L -10 52 L -3 40 L -6 40 L 2 28 L -1 28 Z" fill="#059669" opacity="0.85" />
                <path d="M 9 17 L 17 24 L 14 24 L 20 34 L 17 34 L 23 46 L -5 46 L 1 34 L -2 34 L 4 24 L 1 24 Z" fill="#10b981" opacity="0.7" />
              </g>
            </svg>
          </div>
          <span className="text-lg font-black text-slate-900">Loop<span className="text-blue-600">Lebanon</span></span>
        </Link>

        {/* Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm transition-all active:scale-95"
        >
          {open ? (
            <X className="h-5 w-5 text-slate-600" />
          ) : (
            <Menu className="h-5 w-5 text-slate-700" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3 z-50">
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-emerald-400 blur-lg transition-all duration-300 ${searchValue ? 'opacity-20' : 'opacity-0'}`} />
        <div className="relative flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 shadow-lg">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (!e.target.value) setShowResults(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search listings..."
            className="flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchValue.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="h-3 w-3" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>


      </div>

      {/* User Menu */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-20 pr-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-80 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-2xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden">
              {loading ? (
                <div className="p-6 text-center">
                  <div className="h-4 w-4 rounded-full bg-blue-600 animate-bounce mx-auto" />
                </div>
              ) : user ? (
                <>
                  {/* User Header */}
                  <div className="relative p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="absolute animate-float" style={{ left: `${i * 33}%`, top: `${i * 25}%`, animationDelay: `${i * 0.5}s` }}>
                          <svg width="20" height="20" viewBox="0 0 100 100">
                            <path d="M 50 20 L 65 45 L 75 65 L 25 65 L 35 45 Z" fill="white" />
                          </svg>
                        </div>
                      ))}
                    </div>

                    <div className="relative flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-white shadow-xl flex items-center justify-center ring-2 ring-emerald-400/30">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-base font-black text-white">
                          {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
                        </div>
                        <div className="text-xs font-bold text-emerald-300 truncate max-w-[200px]">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-3 space-y-2">
                    <button
                      onClick={() => {
                        router.push("/profile");
                        setOpen(false);
                      }}
                      className="group w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 hover:scale-105 active:scale-100"
                    >
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-100 to-blue-100 flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:rotate-12 shadow-md">
                        <User className="h-5 w-5 text-slate-700" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-black text-slate-800">View Profile</div>
                        <div className="text-xs font-medium text-slate-500">Manage your account</div>
                      </div>
                    </button>

                    <Link
                      href="/create-listing"
                      onClick={() => setOpen(false)}
                      className="group w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 hover:scale-105 active:scale-100"
                    >
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:rotate-12 shadow-md">
                        <Plus className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-black text-slate-800">Post Listing</div>
                        <div className="text-xs font-medium text-slate-500">Share with community</div>
                      </div>
                    </Link>

                    <Link
                      href="/messages"
                      onClick={() => setOpen(false)}
                      className="group w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:scale-105 active:scale-100"
                    >
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:rotate-12 shadow-md">
                        <MessageCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-black text-slate-800">Messages</div>
                          {unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-500">Chat with users</div>
                      </div>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className="group w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-gradient-to-r hover:from-slate-800 hover:to-slate-900 hover:scale-105 active:scale-100"
                      >
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:rotate-12 shadow-md">
                          <Search className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-black text-slate-800">Admin Panel</div>
                          <div className="text-xs font-medium text-slate-500">Manage Platform</div>
                        </div>
                      </Link>
                    )}

                    <Link
                      href="/about"
                      onClick={() => setOpen(false)}
                      className="group w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-slate-50 hover:scale-105 active:scale-100"
                    >
                      <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:rotate-12 shadow-md">
                        <Info className="h-5 w-5 text-slate-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-black text-slate-800">About</div>
                        <div className="text-xs font-medium text-slate-500">Learn our story</div>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className={`group w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-150 hover:bg-red-50 hover:scale-105 active:scale-100 ${logoutHesitate ? 'animate-shake bg-red-100 border-2 border-red-300' : ''}`}
                    >
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:-rotate-12 shadow-md ${logoutHesitate ? 'bg-red-200' : 'bg-red-100'}`}>
                        <LogOut className={`h-5 w-5 transition-colors ${logoutHesitate ? 'text-red-700' : 'text-red-600'}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-black transition-colors ${logoutHesitate ? 'text-red-700' : 'text-slate-800 group-hover:text-red-600'}`}>
                          {logoutHesitate ? 'Click Again' : 'Logout'}
                        </div>
                        <div className="text-xs font-medium text-slate-500">
                          {logoutHesitate ? 'Are you sure?' : 'Until next time'}
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-5">
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-5 py-3.5 text-center text-sm font-black text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};