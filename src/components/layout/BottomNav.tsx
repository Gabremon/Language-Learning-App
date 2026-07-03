"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, RotateCcw, User, Library, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Learn", icon: Home, glyph: "学" },
  { href: "/course", label: "Path", icon: BookOpen, glyph: "径" },
  { href: "/practice", label: "Practice", icon: Dumbbell, glyph: "练" },
  { href: "/review", label: "Review", icon: RotateCcw, glyph: "复" },
  { href: "/vocabulary", label: "Words", icon: Library, glyph: "词" },
  { href: "/profile", label: "Profile", icon: User, glyph: "我" },
];

export function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/lesson/") || pathname.startsWith("/auth")) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200/80 bg-[#faf8f5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
        {navItems.map(({ href, label, icon: Icon, glyph }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition",
                active ? "text-brand-700" : "text-stone-400 hover:text-brand-600"
              )}
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg border transition",
                  active
                    ? "border-brand-300/60 bg-white text-brand-700 shadow-sm ink-trail-shadow"
                    : "border-transparent bg-transparent"
                )}
              >
                {active ? (
                  <span className="text-sm font-bold">{glyph}</span>
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
