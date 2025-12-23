"use client";

import { useEffect, useState } from "react";
import { Package, Clock, Users, AlertTriangle, Check, X, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { getPendingListings, updateListingStatus } from "@/app/actions/listings";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({
        totalListings: 0,
        activeListings: 0,
        pendingListings: 0,
        totalUsers: 0,
        totalReviews: 0,
        reportedItems: 0,
        userGrowth: [],
        listingActivity: []
    });
    const [pendingListings, setPendingListings] = useState<any[]>([]);
    const [range, setRange] = useState("all");
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const statsRes = await fetch(`/api/admin/stats?range=${range}`);
            const statsData = await statsRes.json();
            setStats(statsData);

            const pendingResult = await getPendingListings();
            if (pendingResult.success) {
                setPendingListings(pendingResult.data || []);
            }
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [range]);

    const handleUpdateStatus = async (id: string, status: "active" | "rejected") => {
        setActionLoading(id);
        const result = await updateListingStatus(id, status);
        if (result.success) {
            setPendingListings(prev => prev.filter(l => l.id !== id));
            // Refresh stats
            fetchData();
        }
        setActionLoading(null);
    };

    const cards = [
        {
            name: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "bg-blue-500",
            href: "#",
        },
        {
            name: "Active Listings",
            value: stats.activeListings,
            icon: Package,
            color: "bg-emerald-500",
            href: "/admin/listings",
        },
        {
            name: "Pending Listings",
            value: stats.pendingListings,
            icon: Clock,
            color: "bg-amber-500",
            href: "#pending-section",
        },
        {
            name: "Total Reviews",
            value: stats.totalReviews,
            icon: AlertTriangle,
            color: "bg-purple-500",
            href: "/admin/reviews",
        },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link
                            href="/"
                            className="p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                            title="Go to Home"
                        >
                            <Home size={20} />
                        </Link>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                            Admin Dashboard
                        </h2>
                    </div>
                    <p className="mt-2 text-slate-600">
                        Overview of platform activity and moderation tasks.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchData}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-slate-200 bg-white"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        {["7d", "30d", "all"].map((r) => (
                            <button
                                key={r}
                                onClick={() => setRange(r)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${range === r
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                {r === "all" ? "All Time" : `Last ${r.replace("d", " Days")}`}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card) => (
                        <Link
                            key={card.name}
                            href={card.href}
                            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md border border-slate-100"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{card.name}</p>
                                    <p className="mt-2 text-3xl font-bold text-slate-900">
                                        {card.value}
                                    </p>
                                </div>
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-lg ${card.color} text-white shadow-md`}
                                >
                                    <card.icon className="h-6 w-6" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Users size={18} className="text-blue-500" />
                        User Growth
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.userGrowth}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Package size={18} className="text-emerald-500" />
                        Listing Activity
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.listingActivity}>
                                <defs>
                                    <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorListings)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Pending Listings Section */}
            <div id="pending-section" className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock size={18} className="text-amber-500" />
                        Pending Approvals
                        <span className="ml-2 px-2 py-0.5 text-xs bg-amber-50 text-amber-600 rounded-full">
                            {pendingListings.length}
                        </span>
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    {pendingListings.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>No listings currently pending approval.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Listing</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pendingListings.map((listing) => (
                                    <tr key={listing.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
                                                    {listing.listing_images?.[0] ? (
                                                        <img
                                                            src={listing.listing_images[0].image_url}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-full h-full p-2 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900 line-clamp-1">{listing.title}</p>
                                                    <p className="text-xs text-slate-500">by {listing.owner_id.substring(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md capitalize">
                                                {listing.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {new Date(listing.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(listing.id, "active")}
                                                    disabled={actionLoading === listing.id}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(listing.id, "rejected")}
                                                    disabled={actionLoading === listing.id}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

