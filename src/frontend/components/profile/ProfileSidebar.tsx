"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/profile", label: "Overview" },
  { href: "/profile/listings", label: "Listings" },
  { href: "/profile/reviews", label: "Reviews" },
  { href: "/profile/settings", label: "Settings" },
  { href: "/profile/security", label: "Security" },
];

export default function ProfileSidebar() {
  const pathname = usePathname() || "/profile";

  return (
    <nav aria-label="Profile navigation" className="sticky top-6">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  active ? "bg-blue-50 text-blue-700" : "text-slate-700"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
