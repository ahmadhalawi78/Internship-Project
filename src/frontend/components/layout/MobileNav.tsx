"use client";

import Link from "next/link";
import { Search, Menu, X, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/frontend/hooks/useAuth";

export const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const { user, loading, signOut } = useAuth();

    return (
        <div className="w-full min-w-[280px] bg-white"> {/* CHANGED: Added min-width */}
            {/* Top Bar - Always Visible */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 px-3 py-3 xs:px-4 md:max-w-2xl md:mx-auto md:px-6">
                {/* Logo Row */}
                <div className="flex items-center justify-between xs:justify-start w-full xs:w-auto">
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white xs:h-9 xs:text-sm">
                            L
                        </div>
                        <span className="text-base font-bold text-slate-900 xs:text-lg md:text-base">
                            LoopLebanon
                        </span>
                    </Link>

                    {/* Mobile Menu Button - Moved to logo row on ultra-mobile */}
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="xs:hidden inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-700"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                    >
                        {open ? (
                            <X className="h-4 w-4" />
                        ) : (
                            <Menu className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {/* Search Bar - Adapts to all screen sizes */}
                <div className="flex-1 w-full xs:w-auto min-w-0"> {/* CHANGED: Better width control */}
                    <form className="flex items-center w-full">
                        <div className="relative flex-1 min-w-0">
                            <input
                                type="search"
                                placeholder="Search..."
                                className="w-full rounded-l-md border border-r-0 border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 xs:placeholder-shown:text-xs xs:placeholder:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-r-md bg-blue-900 px-3 py-2 text-white flex-shrink-0 xs:px-4"
                            aria-label="Search"
                        >
                            <Search className="h-4 w-4" />
                        </button>
                    </form>
                </div>

                {/* Right Side Actions - Hidden on ultra-mobile */}
                <div className="hidden xs:flex items-center gap-2 flex-shrink-0">
                    {/* Post Listing Button */}
                    <div className="hidden sm:block">
                        <Link
                            href="#"
                            className="flex items-center gap-1.5 rounded-md bg-blue-900 px-3 py-2 text-xs font-semibold text-white"
                        >
                            <Plus className="h-3 w-3" />
                            <span className="hidden md:inline">Post</span>
                        </Link>
                    </div>

                    {/* User Avatar */}
                    {!loading && user && (
                        <div className="hidden sm:flex sm:items-center">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white">
                                {user.email?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </div>
                    )}

                    {/* Menu Button - Tablet only */}
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="hidden xs:inline-flex items-center justify-center rounded-md border border-slate-200 bg-white p-1.5 text-slate-700 md:p-1.5"
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                    >
                        {open ? (
                            <X className="h-4 w-4 md:h-4 md:w-4" />
                        ) : (
                            <Menu className="h-4 w-4 md:h-4 md:w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {open && (
                <div className="border-t border-slate-100 bg-white px-3 py-4 xs:px-4 md:hidden">
                    <nav className="space-y-4 text-sm text-slate-700">
                        {/* Navigation Links */}
                        <div className="flex flex-col gap-3">
                            <Link href="#" className="hover:text-blue-900 hover:underline py-1">
                                About
                            </Link>
                            <Link href="#" className="hover:text-blue-900 hover:underline py-1">
                                Categories
                            </Link>
                            <Link href="#" className="hover:text-blue-900 hover:underline py-1">
                                How It Works
                            </Link>
                            <Link href="#" className="hover:text-blue-900 hover:underline py-1">
                                Help
                            </Link>
                        </div>

                        {/* Auth Section */}
                        <div className="border-t border-slate-100 pt-4">
                            {loading ? (
                                <div className="text-slate-500">Loading...</div>
                            ) : user ? (
                                <div className="space-y-3">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
                                            {user.email?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">
                                                {user.email?.split("@")[0] || "User"}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* User Actions */}
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                                        <Link
                                            href="/profile"
                                            className="rounded-md border border-slate-200 px-3 py-2 text-center text-sm hover:bg-slate-50"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            href="/listings"
                                            className="rounded-md border border-slate-200 px-3 py-2 text-center text-sm hover:bg-slate-50"
                                        >
                                            My Listings
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={signOut}
                                            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 xs:col-span-2"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-slate-600 text-sm xs:text-base">Sign in to access all features</p>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                                        <Link
                                            href="/auth/login"
                                            className="rounded-md border border-blue-900 bg-blue-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-800"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/auth/signup"
                                            className="rounded-md border border-slate-200 px-3 py-2 text-center text-sm hover:bg-slate-50"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Post Listing Button (Mobile only) */}
                        <div className="sm:hidden pt-2">
                            <button
                                type="button"
                                className="w-full rounded-md bg-blue-900 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                            >
                                <Plus className="mr-2 inline h-4 w-4" />
                                Post a Listing
                            </button>
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
};