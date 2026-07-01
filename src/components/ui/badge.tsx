import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
        variant === "default" && "bg-brand-100 text-brand-700",
        variant === "accent" && "bg-accent-100 text-accent-600",
        variant === "success" && "bg-green-100 text-green-700",
        variant === "muted" && "bg-gray-100 text-gray-600",
        className
      )}
    >
      {children}
    </span>
  );
}
