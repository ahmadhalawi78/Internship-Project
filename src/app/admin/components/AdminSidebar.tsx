"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListFilter, ShieldAlert, LogOut } from "lucide-react";
import { useAuth } from "@/frontend/hooks/useAuth";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Listings", href: "/admin/listings", icon: ListFilter },
    { name: "Reviews", href: "/admin/reviews", icon: ShieldAlert },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 text-white">
            <div className="flex h-16 items-center px-6">
                <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            <item.icon
                                className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                                    }`}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => signOut()}
                    className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-white" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
