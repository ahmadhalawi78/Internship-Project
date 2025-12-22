"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, X, MapPin } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function ListingsModerationPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchListings = () => {
        setLoading(true);
        fetch("/api/admin/listings?status=pending")
            .then((res) => res.json())
            .then((data) => {
                // ensure listings is an array
                setListings(Array.isArray(data.listings) ? data.listings : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching listings:", err);
                setListings([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setProcessingId(id);
        const status = action === "approve" ? "active" : "rejected";

        try {
            const res = await fetch("/api/admin/listings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });

            if (res.ok) {
                setListings((prev) => prev.filter((l) => l.id !== id));
            }
        } catch (error) {
            console.error("Error updating listing:", error);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) return <div>Loading listings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Pending Listings
                </h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                    {listings.length} Pending
                </span>
            </div>

            {listings.length === 0 ? (
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
                    <p className="text-slate-500">No pending listings to review</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {listings.map((listing) => (
                        <div
                            key={listing.id}
                            className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 flex flex-col"
                        >
                            <div className="relative aspect-video w-full bg-slate-100">
                                {listing.listing_images?.[0]?.image_url ? (
                                    <Image
                                        src={listing.listing_images[0].image_url}
                                        alt={listing.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-slate-400">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 rounded bg-slate-900/70 px-2 py-1 text-xs text-white">
                                    {listing.category}
                                </div>
                            </div>

                            <div className="flex flex-1 flex-col p-5">
                                <div className="mb-4 flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                                        {listing.title}
                                    </h3>
                                    <div className="mt-1 flex items-center text-sm text-slate-500">
                                        <MapPin className="mr-1 h-3.5 w-3.5" />
                                        {listing.location}
                                    </div>
                                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                                        {listing.description}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-400">
                                        Posted {formatDistanceToNow(new Date(listing.created_at))} ago
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => handleAction(listing.id, "reject")}
                                        disabled={processingId === listing.id}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                                    >
                                        <X className="h-4 w-4" />
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleAction(listing.id, "approve")}
                                        disabled={processingId === listing.id}
                                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        <Check className="h-4 w-4" />
                                        Approve
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
