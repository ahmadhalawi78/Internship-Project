"use client";

import React from "react";

interface MobileFrameProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  showHeader?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export function MobileFrame({
  children,
  title = "",
  showBackButton = false,
  showHeader = true,
  headerLeft,
  headerRight,
}: MobileFrameProps) {
  return (
    <div className="relative mx-auto max-w-md min-h-screen bg-white shadow-xl overflow-hidden rounded-3xl border-8 border-slate-900">
      {/* Status Bar */}
      <div className="h-12 bg-slate-900 px-6 flex items-center justify-between">
        <div className="text-white text-xs font-medium">9:41</div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-4 bg-white rounded-full" />
          <div className="h-2 w-4 bg-white rounded-full" />
          <div className="h-2 w-4 bg-white rounded-full" />
        </div>
      </div>

      {/* Header */}
      {showHeader && (
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showBackButton && (
                <button type="button" className="p-2" aria-label="Go back">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}
              {headerLeft || (
                <h1 className="text-lg font-bold text-slate-900">{title}</h1>
              )}
            </div>
            <div>{headerRight}</div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">{children}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-4 py-3">
        <div className="grid grid-cols-5 gap-2">
          <button
            type="button"
            className="flex flex-col items-center p-2 text-blue-600"
            aria-label="Home"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center p-2 text-slate-500"
            aria-label="Listings"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs mt-1">Listings</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center p-2 text-slate-500"
            aria-label="Post new listing"
          >
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-600" />
            </div>
            <span className="text-xs mt-1">Post</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center p-2 text-slate-500"
            aria-label="Chats"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-xs mt-1">Chats</span>
          </button>
          <button
            type="button"
            className="flex flex-col items-center p-2 text-slate-500"
            aria-label="Profile"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
