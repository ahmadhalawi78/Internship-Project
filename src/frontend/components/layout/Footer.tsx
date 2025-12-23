import { Heart, Info } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t-2 border-slate-200 bg-linear-to-br from-slate-900 via-blue-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{ left: `${i * 15}%`, top: `${i * 12}%` }}
          >
            <svg width="40" height="40" viewBox="0 0 100 100">
              <path
                d="M 50 20 L 65 45 L 75 65 L 25 65 L 35 45 Z"
                fill="white"
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-6xl px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <span className="text-lg font-black text-white">L</span>
            </div>
            <div className="text-left">
              <div className="text-base font-black text-white">LoopLebanon</div>
              <div className="text-xs font-semibold text-emerald-300">
                Community Trade
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="group flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white font-bold hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
            >
              <Info className="h-5 w-5" />
              <span>About Us</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-white/70 flex items-center gap-2">
            Made with <Heart className="h-4 w-4 text-red-400 fill-red-400" /> in
            Lebanon
          </p>
          <p className="text-xs font-bold text-white/50">
            © 2024 LoopLebanon. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
