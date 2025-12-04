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
    <div className="mt-3 grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
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
            // Pass the new props
            listingOwnerId={item.userId}
            currentUserId={currentUserId}
            showMessageButton={true}
          />
        </motion.div>
      ))}
    </div>
  );
};
