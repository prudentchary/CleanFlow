import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--color-border)] dark:border-slate-800 bg-[var(--color-surface)] dark:bg-slate-900 text-[var(--color-text)] dark:text-slate-100 transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`p-4 border-b border-[var(--color-border)] dark:border-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`p-4 border-t border-[var(--color-border)] dark:border-slate-800 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}