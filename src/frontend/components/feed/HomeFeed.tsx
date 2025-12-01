"use client";

import { motion } from "framer-motion";

export type FeedItem = {
    id: string;
    title: string;
    category: "bartering" | "food";
    location: string;
};

type HomeFeedProps = {
    items: FeedItem[];
};

export const HomeFeed = ({ items }: HomeFeedProps) => {
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
                <motion.article
                    key={item.id}
                    tabIndex={0}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col overflow-hidden rounded-md border border-slate-300 bg-white text-sm text-slate-800 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
                >
                    {/* Grey top area */}
                    <div className="h-24 bg-slate-200" />

                    {/* Text area */}
                    <div className="px-4 py-3">
                        <h3 className="mb-1 font-semibold">{item.title}</h3>
                        <p className="text-xs text-slate-500">{item.location}</p>
                    </div>
                </motion.article>
            ))}
        </div>
    );
};
