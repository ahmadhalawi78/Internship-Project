"use client";

import {
  Search,
  Menu,
  User,
  Plus,
  Info,
  LogOut,
  X,
  Package,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/frontend/hooks/useAuth";

interface FloatingElementStyle {
  width: string;
  height: string;
  background: string;
  left: string;
  top: string;
  animationDelay: string;
  animationDuration: string;
  opacity: number;
}

interface SearchResult {
  id: number;
  title: string;
  category: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function DesktopNav() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [logoutHesitate, setLogoutHesitate] = useState(false);
  const [floatingElements, setFloatingElements] = useState<
    FloatingElementStyle[]
  >([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const elements = [...Array(12)].map((_, i) => ({
      width: `${4 + Math.random() * 8}px`,
      height: `${4 + Math.random() * 8}px`,
      background: i % 2 === 0 ? "#10b981" : "#1e40af",
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${i * 1.2}s`,
      animationDuration: `${6 + Math.random() * 4}s`,
      opacity: 0.4,
    }));
    const t = setTimeout(() => setFloatingElements(elements), 0);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    setIsSearching(true);
    setShowResults(false);

    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "Vintage Camera",
          category: "bartering",
          location: "Beirut",
          icon: Package,
        },
        {
          id: 2,
          title: "Fresh Vegetables",
          category: "food",
          location: "Baabda",
          icon: Utensils,
        },
        {
          id: 3,
          title: "Handmade Pottery",
          category: "bartering",
          location: "Jounieh",
          icon: Package,
        },
        {
          id: 4,
          title: "Homemade Bread",
          category: "food",
          location: "Tripoli",
          icon: Utensils,
        },
        {
          id: 5,
          title: "Old Books Collection",
          category: "bartering",
          location: "Zahle",
          icon: Package,
        },
      ].filter(
        (item) =>
          item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.location.toLowerCase().includes(searchValue.toLowerCase())
      );

      setSearchResults(
        mockResults.length > 0
          ? mockResults
          : [
            {
              id: 99,
              title: `No results for "${searchValue}"`,
              category: "none",
              location: "Try different keywords",
              icon: Search,
            },
          ]
      );
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
    setMenuOpen(false);
    setLogoutHesitate(false);
    alert("Logged out successfully!");
  };

  const handlePostListing = () => {
    router.push("/create-listing");
    setMenuOpen(false);
  };

  const handleAbout = () => {
    router.push("/about");
    setMenuOpen(false);
  };

  return (
    <div className="relative bg-linear-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((style, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-sm animate-float"
            style={style}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-15px, -40px) scale(0.9); }
          75% { transform: translate(30px, -25px) scale(1.05); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-wave { animation: wave 2s ease-in-out infinite; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.6s ease-in-out; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.8); }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
      `}</style>

      <div className="relative mx-auto max-w-7xl px-8 py-8">
        <div className="flex justify-center mb-8">
          <Link
            href="/"
            className="group relative"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <div
              className={`absolute -inset-12 rounded-full bg-linear-to-r from-blue-400 via-emerald-400 to-blue-400 blur-3xl transition-all duration-700 ${logoHovered ? "opacity-50" : "opacity-0"
                }`}
            />

            <div className="relative flex flex-col items-center gap-4">
              <div className="relative">
                <div
                  className={`absolute inset-0 rounded-3xl transition-all duration-500 ${logoHovered
                      ? "bg-linear-to-br from-blue-500 to-emerald-500 blur-2xl opacity-70"
                      : "bg-linear-to-br from-slate-400 to-blue-400 blur-xl opacity-30"
                    }`}
                />

                <div
                  className={`relative h-32 w-32 rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-500 ${logoHovered
                      ? "bg-linear-to-br from-blue-600 via-slate-800 to-emerald-600 scale-110 rotate-3"
                      : "bg-linear-to-br from-slate-900 via-blue-900 to-slate-900"
                    }`}
                >
                  <svg
                    width="110"
                    height="110"
                    viewBox="0 0 120 120"
                    className="drop-shadow-2xl"
                  >
                    <path
                      d="M 28 18 L 52 18 L 52 78 L 92 78 L 92 102 L 28 102 Z"
                      fill="white"
                      className={`transition-all duration-500 ${logoHovered ? "fill-blue-50" : "fill-white"
                        }`}
                    />

                    <g transform="translate(62, 28)">
                      <rect x="6" y="42" width="6" height="20" fill="#78350f" />

                      <path
                        d="M 9 10 L 21 30 L 18 30 L 27 44 L 24 44 L 33 60 L -15 60 L -6 44 L -9 44 L 0 30 L -3 30 Z"
                        fill="#047857"
                        className={`transition-all duration-300 ${logoHovered ? "fill-emerald-600" : "fill-emerald-700"
                          }`}
                      />

                      <path
                        d="M 9 13 L 19 28 L 16 28 L 24 40 L 21 40 L 28 52 L -10 52 L -3 40 L -6 40 L 2 28 L -1 28 Z"
                        fill="#059669"
                        opacity="0.85"
                        className={`transition-all duration-300 ${logoHovered ? "fill-emerald-500" : "fill-emerald-600"
                          }`}
                      />

                      <path
                        d="M 9 17 L 17 24 L 14 24 L 20 34 L 17 34 L 23 46 L -5 46 L 1 34 L -2 34 L 4 24 L 1 24 Z"
                        fill="#10b981"
                        opacity="0.7"
                        className={`transition-all duration-300 ${logoHovered ? "fill-emerald-400" : "fill-emerald-500"
                          }`}
                      />
                    </g>
                  </svg>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center">
                  {["L", "o", "o", "p"].map((letter, i) => (
                    <span
                      key={i}
                      className="text-4xl font-black transition-all duration-300 cursor-pointer select-none"
                      style={{
                        color: "#0f172a",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                        transitionDelay: `${i * 50}ms`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-12px) scale(1.4) rotate(-10deg)";
                        e.currentTarget.style.color =
                          i === 0 ? "#10b981" : "#1e40af";
                        e.currentTarget.style.textShadow =
                          "0 0 20px rgba(16, 185, 129, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1) rotate(0)";
                        e.currentTarget.style.color = "#0f172a";
                        e.currentTarget.style.textShadow =
                          "2px 2px 4px rgba(0,0,0,0.1)";
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                  {["L", "e", "b", "a", "n", "o", "n"].map((letter, i) => (
                    <span
                      key={i + 4}
                      className="text-4xl font-black transition-all duration-300 cursor-pointer select-none"
                      style={{
                        color: "#0f172a",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                        transitionDelay: `${(i + 4) * 50}ms`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-12px) scale(1.4) rotate(10deg)";
                        e.currentTarget.style.color = "#1e40af";
                        e.currentTarget.style.textShadow =
                          "0 0 20px rgba(30, 64, 175, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(0) scale(1) rotate(0)";
                        e.currentTarget.style.color = "#0f172a";
                        e.currentTarget.style.textShadow =
                          "2px 2px 4px rgba(0,0,0,0.1)";
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1.5 items-center px-5 py-2 rounded-full bg-white border-2 border-slate-200 shadow-lg">
                  {[
                    "C",
                    "o",
                    "m",
                    "m",
                    "u",
                    "n",
                    "i",
                    "t",
                    "y",
                    " ",
                    "T",
                    "r",
                    "a",
                    "d",
                    "e",
                  ].map((letter, i) => (
                    <span
                      key={i}
                      className="text-sm font-black tracking-wide uppercase bg-linear-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent inline-block animate-wave"
                      style={{
                        animationDelay: `${i * 0.1}s`,
                      }}
                    >
                      {letter === " " ? "\u00A0" : letter}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <div
              className={`absolute inset-0 rounded-2xl bg-linear-to-r from-blue-400 to-emerald-400 blur-xl transition-all duration-300 ${searchValue ? "opacity-30" : "opacity-0"
                }`}
            />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                if (!e.target.value) setShowResults(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Search listings..."
              className="relative w-full rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 pr-36 text-sm font-semibold text-slate-800 shadow-lg outline-none placeholder:text-slate-400 transition-all duration-300 focus:border-blue-400 focus:shadow-2xl hover:border-slate-300"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:shadow-2xl hover:scale-110 hover:-translate-y-[calc(50%+2px)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:-translate-y-1/2 animate-pulse-glow"
            >
              {isSearching ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </>
              )}
            </button>

            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="p-2 max-h-96 overflow-y-auto">
                  {searchResults.map((result) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        onClick={() => {
                          if (result.category !== "none") {
                            alert(
                              `Selected: ${result.title} in ${result.location}`
                            );
                          }
                          setShowResults(false);
                        }}
                        className="w-full flex items-start gap-3 p-4 rounded-xl hover:bg-linear-to-r hover:from-blue-50 hover:to-emerald-50 transition-all duration-150 text-left group hover:scale-105 active:scale-100"
                      >
                        <div
                          className={`h-12 w-12 rounded-lg shrink-0 flex items-center justify-center transition-all duration-150 group-hover:scale-110 group-hover:rotate-6 ${result.category === "food"
                              ? "bg-linear-to-br from-orange-100 to-rose-100"
                              : result.category === "bartering"
                                ? "bg-linear-to-br from-blue-100 to-emerald-100"
                                : "bg-slate-100"
                            }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${result.category === "food"
                                ? "text-orange-600"
                                : result.category === "bartering"
                                  ? "text-blue-600"
                                  : "text-slate-600"
                              }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-800 text-sm truncate">
                            {result.title}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>{result.location}</span>
                            {result.category !== "none" && (
                              <>
                                <span>•</span>
                                <span className="capitalize">
                                  {result.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="w-full p-3 text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-t-2 border-slate-100 transition-all duration-150"
                >
                  Close Results
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="group/btn relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-2xl hover:scale-110 active:scale-95"
            >
              <div
                className={`absolute inset-0 rounded-2xl bg-linear-to-br transition-all duration-300 ${menuOpen
                    ? "from-blue-400/20 to-emerald-400/20"
                    : "from-blue-400/0 to-emerald-400/0 group-hover/btn:from-blue-400/10 group-hover/btn:to-emerald-400/10"
                  }`}
              />
              <div className="relative">
                {menuOpen ? (
                  <X className="h-7 w-7 text-blue-600 transition-all duration-300 rotate-90" />
                ) : (
                  <Menu className="h-7 w-7 text-slate-700 transition-all duration-300 group-hover/btn:text-blue-600 group-hover/btn:scale-110" />
                )}
              </div>
            </button>

            {menuOpen && (
              <div className="fixed inset-0 z-50 flex items-start justify-end pt-24 pr-8">
                <div
                  className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setMenuOpen(false)}
                />

                <div className="relative w-96 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="rounded-3xl border-2 border-slate-200 bg-white shadow-2xl overflow-hidden">
                    {loading ? (
                      <div className="p-8 text-center">
                        <div className="h-4 w-4 rounded-full bg-blue-600 animate-bounce mx-auto" />
                      </div>
                    ) : user ? (
                      <>
                        <div className="relative p-6 bg-linear-to-br from-slate-900 via-blue-900 to-emerald-900 overflow-hidden">
                          <div className="absolute inset-0 opacity-10">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="absolute animate-float"
                                style={{
                                  left: `${i * 25}%`,
                                  top: `${i * 20}%`,
                                  animationDelay: `${i * 0.5}s`,
                                }}
                              >
                                <svg
                                  width="30"
                                  height="30"
                                  viewBox="0 0 100 100"
                                >
                                  <path
                                    d="M 50 20 L 65 45 L 75 65 L 25 65 L 35 45 Z"
                                    fill="white"
                                  />
                                </svg>
                              </div>
                            ))}
                          </div>

                          <div className="relative flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center ring-4 ring-emerald-400/30">
                              <User className="h-8 w-8 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-lg font-black text-white drop-shadow-lg">
                                {user.email?.split("@")[0] || "User"}
                              </div>
                              <div className="text-xs font-bold text-emerald-300">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-2">
                          <button
                            onClick={() => {
                              router.push("/profile");
                              setMenuOpen(false);
                            }}
                            className="group w-full flex items-center gap-4 rounded-2xl p-4 transition-all duration-150 hover:bg-linear-to-r hover:from-blue-50 hover:to-emerald-50 hover:scale-105 hover:shadow-lg active:scale-100"
                          >
                            <div className="h-14 w-14 rounded-xl bg-linear-to-br from-blue-100 to-emerald-100 flex items-center justify-center transition-all duration-150 group-hover:scale-125 group-hover:rotate-12 shadow-lg group-hover:shadow-2xl">
                              <User className="h-7 w-7 text-blue-600" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-base font-black text-slate-800 transition-colors group-hover:text-blue-600">
                                View Profile
                              </div>
                              <div className="text-xs font-medium text-slate-500">
                                Manage your account
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={handlePostListing}
                            className="group w-full flex items-center gap-4 rounded-2xl p-4 transition-all duration-150 hover:bg-linear-to-r hover:from-blue-50 hover:to-emerald-50 hover:scale-105 hover:shadow-lg active:scale-100"
                          >
                            <div className="h-14 w-14 rounded-xl bg-linear-to-br from-blue-100 to-emerald-100 flex items-center justify-center transition-all duration-150 group-hover:scale-125 group-hover:rotate-12 shadow-lg group-hover:shadow-2xl">
                              <Plus className="h-7 w-7 text-blue-600" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-base font-black text-slate-800 transition-colors group-hover:text-blue-600">
                                Post Listing
                              </div>
                              <div className="text-xs font-medium text-slate-500">
                                Share with community
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={handleAbout}
                            className="group w-full flex items-center gap-4 rounded-2xl p-4 transition-all duration-150 hover:bg-slate-50 hover:scale-105 hover:shadow-lg active:scale-100"
                          >
                            <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center transition-all duration-150 group-hover:scale-125 group-hover:rotate-12 shadow-lg group-hover:shadow-2xl">
                              <Info className="h-7 w-7 text-slate-600" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-base font-black text-slate-800 transition-colors group-hover:text-slate-900">
                                About
                              </div>
                              <div className="text-xs font-medium text-slate-500">
                                Learn our story
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={handleLogout}
                            className={`group w-full flex items-center gap-4 rounded-2xl p-4 transition-all duration-150 hover:bg-red-50 hover:scale-105 hover:shadow-lg active:scale-100 ${logoutHesitate
                                ? "animate-shake bg-red-100 border-2 border-red-300"
                                : ""
                              }`}
                          >
                            <div
                              className={`h-14 w-14 rounded-xl flex items-center justify-center transition-all duration-150 group-hover:scale-125 group-hover:-rotate-12 shadow-lg group-hover:shadow-2xl ${logoutHesitate ? "bg-red-200" : "bg-red-100"
                                }`}
                            >
                              <LogOut
                                className={`h-7 w-7 transition-colors ${logoutHesitate
                                    ? "text-red-700"
                                    : "text-red-600"
                                  }`}
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <div
                                className={`text-base font-black transition-colors ${logoutHesitate
                                    ? "text-red-700"
                                    : "text-slate-800 group-hover:text-red-600"
                                  }`}
                              >
                                {logoutHesitate
                                  ? "Click Again to Confirm"
                                  : "Logout"}
                              </div>
                              <div className="text-xs font-medium text-slate-500">
                                {logoutHesitate
                                  ? "Are you sure?"
                                  : "Until next time"}
                              </div>
                            </div>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="p-6">
                        <Link
                          href="/auth/login"
                          onClick={() => setMenuOpen(false)}
                          className="block w-full rounded-2xl bg-linear-to-r from-blue-600 to-emerald-600 px-6 py-4 text-center text-base font-black text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 active:scale-95"
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
      </div>
    </div>
  );
}
