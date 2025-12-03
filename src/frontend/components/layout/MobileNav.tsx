"use client";

import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/frontend/hooks/useAuth";

export const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const { user, loading, signOut } = useAuth();

    return (
        <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex items-center justify-between">
                {/* Logo + brand */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white">
                        L
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                        LoopLebanon
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-700"
                >
                    {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
            </div>

            {/* Search */}
            <form
                role="search"
                className="mt-3 flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
            >
                <input
                    type="search"
                    placeholder="Search listings..."
                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white"
                >
                    <Search className="h-3 w-3" />
                </button>
            </form>

            {open && (
                <nav className="mt-3 space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-3">
                        <Link href="#" className="hover:underline">
                            About
                        </Link>
                        {loading ? (
                            <span className="text-slate-500">Loading...</span>
                        ) : user ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white">
                                        {user.email?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                    <span className="text-slate-700">
                                        {user.email?.split("@")[0] || "User"}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={signOut}
                                    className="hover:underline"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/login" className="hover:underline">
                                Sign In
                            </Link>
                        )}
                    </div>
                    <button
                        type="button"
                        className="w-full rounded-md bg-blue-900 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                        Post Listing
                    </button>
                </nav>
            )}
        </div>
    );
};
