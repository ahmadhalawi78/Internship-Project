import { Star } from "lucide-react";
import EmptyState, {
  ReviewsIllustration,
} from "@/components/reusable-components/EmptyState";

const reviews = [
  {
    id: 1,
    name: "Nadia",
    rating: 5,
    comment: "Great trade, super responsive!",
    date: "2025-11-02",
  },
  {
    id: 2,
    name: "Karim",
    rating: 4,
    comment: "Item as described. Recommended.",
    date: "2025-10-14",
  },
];

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < value ? "text-yellow-400" : "text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProfileReviewsPage() {
  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold">Reviews</h1>
        <p className="mt-1 text-sm text-slate-600">
          Feedback you received from other users.
        </p>
      </header>
      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="As you complete trades, people will leave reviews here."
          icon={<ReviewsIllustration />}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <article
              key={r.id}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-sm text-slate-500">
                    {new Date(r.date).toLocaleDateString()}
                  </p>
                </div>
                <Stars value={r.rating} />
              </div>

              <p className="mt-3 text-sm text-slate-700">{r.comment}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
