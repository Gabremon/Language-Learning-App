"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, RotateCcw, User, Library } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Learn", icon: Home },
  { href: "/course", label: "Path", icon: BookOpen },
  { href: "/review", label: "Review", icon: RotateCcw },
  { href: "/vocabulary", label: "Words", icon: Library },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/lesson/")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 text-xs font-medium transition",
                active ? "text-brand-600" : "text-gray-400 hover:text-brand-500"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
