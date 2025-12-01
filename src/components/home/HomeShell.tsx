"use client";

import { useState } from "react";
import { HomeFeed, type FeedItem } from "@/components/feed/HomeFeed";

type HomeShellProps = {
    items: FeedItem[];
};

type TabId = "bartering" | "food";

const TABS: { id: TabId; label: string }[] = [
    { id: "bartering", label: "Bartering" },
    { id: "food", label: "Food" },
];

export const HomeShell = ({ items }: HomeShellProps) => {
    const [activeTab, setActiveTab] = useState<TabId>("bartering");

    const filteredItems = items.filter((item) => item.category === activeTab);

    return (
        <section className="mx-auto mt-8 max-w-6xl px-6 pb-10">
            <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                {/* Header row */}
                <div className="mb-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">
                        {activeTab === "bartering" ? "Bartering Listings" : "Food Listings"}
                    </span>
                    <span className="text-slate-500">
                        Showing community posts in Lebanon
                    </span>
                </div>

                {/* Blue tabs */}
                <div className="mb-5 flex gap-4">
                    {TABS.map((tab) => {
                        const isActive = tab.id === activeTab;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={
                                    "flex-1 rounded-md py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
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
                <HomeFeed items={filteredItems} />
            </div>
        </section>
    );
};
