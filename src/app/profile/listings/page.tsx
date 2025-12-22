import ListingCard from "@/frontend/components/listings/ListingCard";
import EmptyState, {
  ListingsIllustration,
} from "@/components/reusable-components/EmptyState";

const sample = [
  {
    title: "Vintage Camera for Trade",
    imageUrl:
      "https://images.unsplash.com/photo-1606215457740-27b951fc0304?w=800&h=600&fit=crop",
    location: "Beirut",
    category: "Bartering",
    price: "Free",
    rating: 4.6,
  },
  {
    title: "Fresh Organic Vegetables",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop",
    location: "Baabda",
    category: "Food",
    price: "$10",
    rating: 4.9,
  },
  {
    title: "Handmade Pottery Set",
    imageUrl: "",
    location: "Jounieh",
    category: "Bartering",
    price: "$45",
    rating: 4.2,
  },
];

export default function ProfileListingsPage() {
  return (
    <section>
      <header className="mb-6">
        <h1 className="text-2xl font-extrabold">My Listings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your active and past listings.
        </p>
      </header>

      {sample.length === 0 ? (
        <EmptyState
          title="You haven't posted any listings"
          description="Create a listing to share items with your community."
          icon={<ListingsIllustration />}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sample.map((l, i) => (
            <ListingCard key={i} {...l} href={`/listings/${i}`} />
          ))}
        </div>
      )}
    </section>
  );
}
