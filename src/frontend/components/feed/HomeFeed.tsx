import { Package, Utensils, MapPin } from "lucide-react";

export type FeedItem = {
  id: string;
  title: string;
  category: "food" | "bartering" | "books" | "cars" | "electronics" | "furniture" | "clothing" | "tools";
  location: string;
};

interface HomeFeedProps {
  items: FeedItem[];
}

export default function HomeFeed({ items }: HomeFeedProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="text-7xl mb-4 animate-bounce">🌱</div>
          <p className="text-xl font-black text-slate-700">No listings yet</p>
          <p className="text-sm font-semibold text-slate-500 mt-2">Start sharing with your community!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item: FeedItem, index: number) => (
        <article
          key={item.id}
          className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-400 cursor-pointer"
          style={{
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
          }}
        >
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>

          <div className={`relative h-48 w-full overflow-hidden transition-all duration-300 ${
            item.category === "food" 
              ? "bg-gradient-to-br from-orange-100 via-rose-100 to-pink-100" 
              : "bg-gradient-to-br from-blue-100 via-emerald-100 to-teal-100"
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              {item.category === "food" ? (
                <Utensils className="h-24 w-24 text-orange-300 opacity-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              ) : (
                <Package className="h-24 w-24 text-blue-300 opacity-50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              )}
            </div>
            
            <div className="absolute top-3 right-3">
              <span className={`rounded-xl px-3 py-1.5 text-xs font-black shadow-lg backdrop-blur-sm ${
                item.category === "food"
                  ? "bg-orange-500/90 text-white"
                  : "bg-blue-500/90 text-white"
              }`}>
                {item.category === "food" ? "Food" : "Bartering"}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3 p-5">
            <h3 className="text-lg font-black text-slate-800 leading-tight transition-colors group-hover:text-blue-600">
              {item.title}
            </h3>
            
            <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-slate-500">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span>{item.location}</span>
            </div>
          </div>

          <div className="h-1 w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 group-hover:w-full" />
        </article>
      ))}
    </div>
  );
}

function Demo() {
  const mockItems: FeedItem[] = [
    { id: "1", title: "Vintage Camera", category: "bartering", location: "Beirut" },
    { id: "2", title: "Fresh Vegetables", category: "food", location: "Baabda" },
    { id: "3", title: "Handmade Pottery", category: "bartering", location: "Jounieh" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-black bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
          Home Feed
        </h1>
        <HomeFeed items={mockItems} />
      </div>
    </div>
  );
}