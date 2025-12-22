"use client";

import React, { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={"text-center py-12 " + (className || "")}>
      <div className="mx-auto mb-4 h-36 w-36 flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>

      {description && (
        <p className="text-slate-600 max-w-xl mx-auto">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ChatIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="h-36 w-36 text-blue-400">
      <rect
        x="6"
        y="10"
        width="52"
        height="36"
        rx="6"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="12"
        y="16"
        width="40"
        height="6"
        rx="2"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="12"
        y="26"
        width="28"
        height="6"
        rx="2"
        fill="currentColor"
        opacity="0.18"
      />
      <circle cx="18" cy="44" r="4" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

export function NotificationsIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="h-36 w-36 text-yellow-400">
      <path
        d="M32 8c6 0 10 5 10 11v7l3 5H19l3-5v-7c0-6 4-11 10-11z"
        fill="currentColor"
        opacity="0.16"
      />
      <circle cx="46" cy="18" r="4" fill="currentColor" opacity="0.22" />
      <rect
        x="14"
        y="44"
        width="36"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.12"
      />
    </svg>
  );
}

export function ListingsIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="h-36 w-36 text-emerald-400">
      <rect
        x="8"
        y="18"
        width="48"
        height="34"
        rx="4"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="14"
        y="24"
        width="18"
        height="8"
        rx="2"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="36"
        y="24"
        width="12"
        height="8"
        rx="2"
        fill="currentColor"
        opacity="0.18"
      />
      <circle cx="22" cy="42" r="3" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

export function ReviewsIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="h-36 w-36 text-pink-400">
      <circle cx="32" cy="22" r="10" fill="currentColor" opacity="0.14" />
      <path
        d="M16 44c4-6 12-8 16-8s12 2 16 8"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="14"
        y="48"
        width="36"
        height="6"
        rx="3"
        fill="currentColor"
        opacity="0.1"
      />
    </svg>
  );
}

export function HomeIllustration() {
  return (
    <svg viewBox="0 0 64 64" className="h-36 w-36 text-sky-400">
      <path
        d="M6 28 L32 8 L58 28 V52 H38 V36 H26 V52 H6 Z"
        fill="currentColor"
        opacity="0.12"
      />
      <rect
        x="22"
        y="34"
        width="8"
        height="10"
        rx="1"
        fill="currentColor"
        opacity="0.18"
      />
      <rect
        x="40"
        y="34"
        width="8"
        height="6"
        rx="1"
        fill="currentColor"
        opacity="0.18"
      />
    </svg>
  );
}
