import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Sun, Moon, ChevronDown, LogOut } from "lucide-react";
import { ROUTES } from "@/routes/paths";
import { useToast } from "@/context/ToastContext";
import { NAV_ITEMS, type UserRole } from "@/constant/navigation";

interface HeaderProps {
  setIsMobileMenuOpen: (open: boolean) => void;
  userRole: UserRole;
}

export default function Header({ setIsMobileMenuOpen, userRole }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    setIsDarkMode(isDark);
  };

  const handleLogout = () => {
    setIsProfileDropdownOpen(false);
    showToast("Logged out successfully.", "info");
    navigate(ROUTES.LOGIN);
  };

  // Find header title dynamically from NAV_ITEMS
  const currentHeaderTitle =
    NAV_ITEMS.find((item) => item.path === location.pathname)?.name || "CleanFlow";

  return (
    <header className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold text-[var(--color-text)]">
          {currentHeaderTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[var(--color-bg)] transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-medium text-xs">
              {userRole.slice(0, 2).toUpperCase()}
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)] hidden sm:block" />
          </button>

          {isProfileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl z-50 p-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}