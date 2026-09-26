import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/30",
  secondary:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/30",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30",
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30",
  danger:
    "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 dark:border-red-500/30",
  neutral:
    "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20 dark:border-slate-500/30",
};

const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider",
  md: "text-xs px-2.5 py-1 font-semibold",
};

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

export default Badge;