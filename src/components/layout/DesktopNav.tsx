"use client";

import Link from "next/link";
import { Search } from "lucide-react";

export const DesktopNav = () => {
    return (
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
                    L
                </div>
                <span className="text-sm font-semibold text-slate-900">
                    LoopLebanon
                </span>
            </div>

            {/* search */}
            <form
                role="search"
                className="flex w-[420px] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 shadow-sm"
            >
                <input
                    type="search"
                    placeholder="Search listings..."
                    className="flex-1 bg-transparent text-xs outline-none placeholder:text-slate-400"
                />
                <button
                    type="submit"
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                    <Search className="h-3 w-3" />
                </button>
            </form>

            {/* Right: nav */}
            <nav className="flex items-center gap-4 text-xs">
                <Link
                    href="#"
                    className="text-slate-700 hover:text-slate-900 hover:underline"
                >
                    About
                </Link>
                <Link
                    href="#"
                    className="text-slate-700 hover:text-slate-900 hover:underline"
                >
                    Sign In
                </Link>
                <button
                    type="button"
                    className="rounded-md bg-blue-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                    Post Listing
                </button>
            </nav>
        </div>
    );
};
