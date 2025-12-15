"use client";

import Link from "next/link";
import { Search, Menu, X, User, Plus, Info, LogOut, Package, Utensils, MessageCircle } from "lucide-react";
import { useState, useMemo } from "react";
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
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Fixed floating elements (no random during render)
  const floatingElements = useMemo(() => {
    const positions = [
      { width: '6px', height: '7px', left: '15%', top: '20%', duration: '7s', delay: '0s' },
      { width: '8px', height: '9px', left: '65%', top: '45%', duration: '9s', delay: '1.2s' },
      { width: '5px', height: '6px', left: '85%', top: '70%', duration: '8s', delay: '2.4s' },
      { width: '7px', height: '8px', left: '25%', top: '80%', duration: '10s', delay: '3.6s' },
      { width: '9px', height: '10px', left: '45%', top: '30%', duration: '7.5s', delay: '4.8s' },
      { width: '6px', height: '7px', left: '75%', top: '55%', duration: '8.5s', delay: '6s' },
      { width: '8px', height: '9px', left: '55%', top: '15%', duration: '9.5s', delay: '7.2s' },
      { width: '7px', height: '8px', left: '35%', top: '65%', duration: '8s', delay: '8.4s' },
    ];

    return positions.map((pos, i) => ({
      ...pos,
      background: i % 2 === 0 ? '#10b981' : '#1e40af',
      opacity: 0.3
    }));
  }, []);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setIsSearching(true);
    setShowResults(false);

    setTimeout(() => {
      const mockResults = [
        { id: 1, title: "Vintage Camera", category: "bartering", location: "Beirut", icon: Package },
        { id: 2, title: "Fresh Vegetables", category: "food", location: "Baabda", icon: Utensils },
        { id: 3, title: "Handmade Pottery", category: "bartering", location: "Jounieh", icon: Package },
        { id: 4, title: "Homemade Bread", category: "food", location: "Tripoli", icon: Utensils },
        { id: 5, title: "Old Books Collection", category: "bartering", location: "Zahle", icon: Package },
      ].filter(item =>
        item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.location.toLowerCase().includes(searchValue.toLowerCase())
      );

      setSearchResults(mockResults.length > 0 ? mockResults : [
        { id: 99, title: `No results for "${searchValue}"`, category: "none", location: "Try different keywords", icon: Search }
      ]);
      setIsSearching(false);
      setShowResults(true);
    }, 1200);
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
    <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-sm animate-float"
            style={{
              width: style.width,
              height: style.height,
              background: style.background,
              left: style.left,
              top: style.top,
              animationDelay: style.delay,
              animationDuration: style.duration,
              opacity: style.opacity
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(15px, -15px) scale(1.1); }
          50% { transform: translate(-10px, -30px) scale(0.9); }
          75% { transform: translate(20px, -20px) scale(1.05); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.6s ease-in-out; }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-4 py-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                <svg width="40" height="40" viewBox="0 0 120 120" className="absolute">
                  <path
                    d="M 28 18 L 52 18 L 52 78 L 92 78 L 92 102 L 28 102 Z"
                    fill="white"
                    className="transition-all duration-500"
                  />
                  <g transform="translate(62, 28) scale(0.8)">
                    <rect x="6" y="42" width="6" height="20" fill="#78350f" />
                    <path d="M 9 10 L 21 30 L 18 30 L 27 44 L 24 44 L 33 60 L -15 60 L -6 44 L -9 44 L 0 30 L -3 30 Z"
                      fill="#047857" />
                    <path d="M 9 13 L 19 28 L 16 28 L 24 40 L 21 40 L 28 52 L -10 52 L -3 40 L -6 40 L 2 28 L -1 28 Z"
                      fill="#059669"
                      opacity="0.85" />
                    <path d="M 9 17 L 17 24 L 14 24 L 20 34 L 17 34 L 23 46 L -5 46 L 1 34 L -2 34 L 4 24 L 1 24 Z"
                      fill="#10b981"
                      opacity="0.7" />
                  </g>
                </svg>
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">LoopLebanon</div>
              <div className="text-xs font-semibold text-emerald-600">Community</div>
            </div>
          </Link>

          {/* Menu Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="relative flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-xl hover:scale-110 active:scale-95"
          >
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br transition-all duration-300 ${open ? 'from-blue-400/20 to-emerald-400/20' : 'from-transparent to-transparent'}`} />
            {open ? (
              <X className="h-5 w-5 text-blue-600 relative z-10 transition-transform duration-300 rotate-90" />
            ) : (
              <Menu className="h-5 w-5 text-slate-700 relative z-10 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
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
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
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

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden z-50 max-h-64 overflow-y-auto">
              {searchResults.map((result) => {
                const Icon = result.icon;
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      if (result.category !== 'none') {
                        alert(`Selected: ${result.title} in ${result.location}`);
                      }
                      setShowResults(false);
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-all duration-150 text-left"
                  >
                    <div className={`h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center ${result.category === 'food'
                      ? 'bg-gradient-to-br from-orange-100 to-rose-100'
                      : result.category === 'bartering'
                        ? 'bg-gradient-to-br from-blue-100 to-emerald-100'
                        : 'bg-slate-100'
                      }`}>
                      <Icon className={`h-4 w-4 ${result.category === 'food'
                        ? 'text-orange-600'
                        : result.category === 'bartering'
                          ? 'text-blue-600'
                          : 'text-slate-600'
                        }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-sm truncate">{result.title}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <span>{result.location}</span>
                        {result.category !== 'none' && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{result.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
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
                            {user.email?.split("@")[0] || "User"}
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
                          <div className="text-sm font-black text-slate-800">Messages</div>
                          <div className="text-xs font-medium text-slate-500">Chat with users</div>
                        </div>
                      </Link>

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
    </div>
  );
};