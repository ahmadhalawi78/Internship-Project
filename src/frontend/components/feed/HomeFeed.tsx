"use client";

import { motion } from "framer-motion";
import Card from "../../../components/reusable-components/card/Card";

export type FeedItem = {
  id: string;
  title: string;
  category: "bartering" | "food";
  location: string;
  isFavorited?: boolean;
  userId?: string;
};

type HomeFeedProps = {
  items: FeedItem[];
  currentUserId?: string;
};

export const HomeFeed = ({ items, currentUserId }: HomeFeedProps) => {
  if (!items || items.length === 0) {
    return (
      <div className="flex min-h-[160px] items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-500">
        No listings yet in this category.
      </div>
    );
  }

  return (
    <div className="mt-3">
      {/* FINAL: 2 columns starting at 500px (not 520px) */}
      <div className="mt-3 grid grid-cols-1 min-[500px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="w-full"
          >
            <Card
              id={item.id}
              title={item.title}
              location={item.location}
              category={item.category}
              categoryColor={item.category === "food" ? "green" : "blue"}
              isInitiallyFavorited={item.isFavorited}
              variant="square"
              onClickCard={() => {
                console.log("Navigate to listing:", item.id);
              }}
              onFavorite={() => {
                console.log("Favorite toggled for:", item.id);
              }}
              listingOwnerId={item.userId}
              currentUserId={currentUserId}
              showMessageButton={true}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};