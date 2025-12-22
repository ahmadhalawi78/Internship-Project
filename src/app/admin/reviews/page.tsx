"use client";

import { useEffect, useState } from "react";
import { Trash2, AlertCircle, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Review = {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    listing_id: string;
    reviewer_id: string;
};

export default function ReviewsModerationPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/reviews")
            .then((res) => res.json())
            .then((data) => {
                setReviews(Array.isArray(data.reviews) ? data.reviews : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching reviews:", err);
                setReviews([]);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/admin/reviews?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setReviews((prev) => prev.filter((r) => r.id !== id));
            }
        } catch (error) {
            console.error("Error deleting review:", error);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <div>Loading reviews...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Reviews and Moderation
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                    {reviews.length} total
                </span>
            </div>

            {reviews.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="rounded-full bg-slate-100 p-3 mb-4">
                        <MessageSquare className="h-6 w-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-medium text-slate-900">No reviews found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        No reviews have been posted yet or the table is empty.
                    </p>
                </div>
            ) : (
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                                >
                                    Review
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                                >
                                    Date
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                                >
                                    Rating
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {reviews.map((review) => (
                                <tr key={review.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-900 line-clamp-2">
                                            {review.comment || (
                                                <span className="text-slate-400 italic">No comment provided</span>
                                            )}
                                        </div>
                                        <div className="mt-1 text-xs text-slate-500">
                                            ID: {review.id}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {review.created_at ? formatDistanceToNow(new Date(review.created_at)) + " ago" : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm font-medium text-slate-900">
                                                {review.rating}
                                            </span>
                                            <span className="text-gray-400 text-xs ml-1">/ 5</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            disabled={deletingId === review.id}
                                            className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                                            title="Delete Review"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
