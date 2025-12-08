"use client";

import { useState } from "react";
import HomeMobileFrame from "./home/page";
import ListingDetailMobileFrame from "./listing-detail/page";
import AuthMobileFrame from "./auth/page";

export default function MobileFramesPage() {
  const [activeFrame, setActiveFrame] = useState<"home" | "listing" | "auth">(
    "home"
  );

  const frames = [
    { id: "home", label: "Home", component: <HomeMobileFrame /> },
    {
      id: "listing",
      label: "Listing Detail",
      component: <ListingDetailMobileFrame />,
    },
    { id: "auth", label: "Auth", component: <AuthMobileFrame /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            LoopLebanon Mobile Frames
          </h1>
          <p className="text-slate-300">
            Responsive mobile designs for key app screens
          </p>
        </div>

        {/* Frame Selection */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {frames.map((frame) => (
            <button
              key={frame.id}
              onClick={() => setActiveFrame(frame.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all ${
                activeFrame === frame.id
                  ? "bg-white text-slate-900 shadow-lg"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {frame.label}
            </button>
          ))}
        </div>

        {/* Frame Display */}
        <div className="relative">
          {/* Device Frame */}
          <div className="relative mx-auto max-w-md">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-full">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-white text-sm ml-2">
                    {frames.find((f) => f.id === activeFrame)?.label}
                  </span>
                </div>
              </div>

              {/* Render Active Frame */}
              <div className="overflow-hidden rounded-2xl border-4 border-slate-700">
                {frames.find((f) => f.id === activeFrame)?.component}
              </div>
            </div>
          </div>

          {/* Frame Info */}
          <div className="mt-8 text-center text-white/80">
            <p className="text-sm">
              Currently viewing:{" "}
              <span className="font-bold text-white">
                {frames.find((f) => f.id === activeFrame)?.label}
              </span>
            </p>
            <p className="text-xs mt-2">
              These are responsive mobile frames optimized for 375px width
              (iPhone 12/13)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
