// import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon,
  className = "",
  description
}: StatCardProps) {
  return (
    <div
      className={`p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-3 ${className}`}
    >
      {/* Top Row: Label & Circular Icon */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--color-text-secondary)]">
          {label}
        </span>
        <div className="p-2.5 rounded-full bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {/* Bottom Row: Main Metric & Growth Tag */}
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-bold text-[var(--color-text)]">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-semibold ${
              isPositive
                ? "text-emerald-500 dark:text-emerald-400"
                : "text-red-500 dark:text-red-400"
            }`}
          >
            {change}
          </span>

          
        )}

       
      </div>
       <div className="block">
          {description && (
            <p className="text-xs text-[var(--color-text-secondary)]">
              {description}
            </p>
          )}
        </div>
    </div>
  );
}