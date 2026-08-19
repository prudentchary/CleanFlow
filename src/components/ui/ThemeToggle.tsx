import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/cn";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);

    document.documentElement.classList.toggle("dark");
  };

return (
  <button
    type="button"
    onClick={toggleTheme}
    aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    className={cn(
      "inline-flex items-center justify-center",
      "h-10 w-10",
      "rounded-full",
      "border border-[var(--color-border)]",
      "bg-[var(--color-surface)]",
      "text-[var(--color-text)]",
      "transition-all duration-200",
      "hover:bg-[var(--color-background)]",
      "hover:text-[var(--color-primary)]",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-[var(--color-primary)]",
      "focus:ring-offset-2",
      "focus:ring-offset-[var(--color-background)]",
    )}
  >
    {isDark ? <Sun size={20} /> : <Moon size={20} />}
  </button>
);
};

export default ThemeToggle;