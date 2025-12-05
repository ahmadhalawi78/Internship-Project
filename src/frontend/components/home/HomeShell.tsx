"use client";

import { useState } from "react";
import { HomeFeed, type FeedItem } from "@/frontend/components/feed/HomeFeed";

type HomeShellProps = {
  items: (FeedItem & { isFavorited?: boolean; userId?: string })[];
  currentUserId?: string;
};

type TabId = "bartering" | "food";

const TABS: { id: TabId; label: string }[] = [
  { id: "bartering", label: "Bartering" },
  { id: "food", label: "Food" },
];

export const HomeShell = ({ items, currentUserId }: HomeShellProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("bartering");

  const filteredItems = items.filter((item) => item.category === activeTab);

  return (
    <section className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6 pb-10">
      <div className="rounded-md border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        {/* Header row */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-900">
            {activeTab === "bartering" ? "Bartering Listings" : "Food Listings"}
          </span>
          <span className="text-slate-500 text-xs">
            Showing community posts in Lebanon
          </span>
        </div>

        {/* Blue tabs */}
        <div className="mb-5 flex flex-col sm:flex-row gap-2 sm:gap-4">
          {TABS.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={
                  "flex-1 rounded-md py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white transition-colors " +
                  (isActive
                    ? "bg-blue-900 text-white"
                    : "bg-blue-900/80 text-white hover:bg-blue-900")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Feed for current tab */}
        <HomeFeed items={filteredItems} currentUserId={currentUserId} />
      </div>
    </section>
  );
};