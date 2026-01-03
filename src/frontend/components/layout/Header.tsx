"use client";
import DesktopNav from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { Suspense } from "react";

export const Header = () => {
  return (
    <header className="relative z-40 border-b border-slate-200 bg-white">
      <div className="hidden md:block">
        <Suspense fallback={<div className="h-16 w-full bg-white/80" />}>
          <DesktopNav />
        </Suspense>
      </div>
      <div className="block md:hidden">
        <MobileNav />
      </div>
    </header>
  );
};
