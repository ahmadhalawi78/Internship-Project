"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, Loader2, User } from "lucide-react";
import { createReview, getListingReviews } from "@/app/actions/reviews";

interface Review {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    profiles?: {
        full_name?: string;
        avatar_url?: string;
    };
}

export default function ListingReviews({ listingId, currentUserId }: { listingId: string, currentUserId?: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            const res = await getListingReviews(listingId);
            if (res.success) {
                setReviews(res.data || []);
            }
            setLoading(false);
        };
        fetchReviews();
    }, [listingId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) {
            setError("Please sign in to leave a review");
            return;
        }
        if (!comment.trim()) return;

        setSubmitting(true);
        setError(null);

        const res = await createReview(listingId, rating, comment);
        if (res.success) {
            setComment("");
            setRating(5);
            // Refresh reviews
            const fresh = await getListingReviews(listingId);
            if (fresh.success) setReviews(fresh.data || []);
        } else {
            setError(res.error || "Failed to submit review");
        }
        setSubmitting(false);
    };

    if (loading) return <div className="animate-pulse flex items-center gap-2 text-slate-400 py-8"><Loader2 className="animate-spin" size={18} /> Loading reviews...</div>;

    return (
        <div className="mt-12 pt-12 border-t border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <MessageSquare size={24} className="text-blue-600" />
                Reviews ({reviews.length})
            </h3>

            {/* Review Form */}
            {currentUserId ? (
                <form onSubmit={handleSubmit} className="mb-12 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-4">Leave a Review</h4>
                    <div className="flex items-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setRating(s)}
                                className={`transition-all hover:scale-110 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                            >
                                <Star size={24} />
                            </button>
                        ))}
                        <span className="ml-2 text-sm font-medium text-slate-600">{rating}/5 stars</span>
                    </div>
                    <div className="relative">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this listing..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-4 text-sm"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button
                        type="submit"
                        disabled={submitting || !comment.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-100"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Posting...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Post Review
                            </>
                        )}
                    </button>
                </form>
            ) : (
                <div className="mb-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <p className="text-slate-700">Want to leave a review? <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link></p>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-100 rounded-3xl">
                        <Star size={40} className="mx-auto mb-3 opacity-20" />
                        <p>Be the first to review this listing!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                                        {review.profiles?.avatar_url ? (
                                            <img src={review.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-slate-400" size={20} />
                                        )}
                                    </div>
                                    <div>
                                        <h5 className="font-semibold text-slate-900">{review.profiles?.full_name || "Community Member"}</h5>
                                        <p className="text-xs text-slate-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            size={14}
                                            className={s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

import Link from "next/link";
