import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import logo from "@/assets/cleanFlow-logo.png";
import darklogo from "@/assets/cleanflowlogodarkMode.png";
import { NAV_ITEMS, type UserRole } from "@/constant/navigation";

// 1. Declare userRole in the interface
interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  userRole: UserRole; // <-- Add this property
}

// 2. Receive userRole in the component parameters
export default function Sidebar({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  userRole,
}: SidebarProps) {
  const location = useLocation();

  // Filter dynamic navigation items based on the active role
  const visibleNavItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Layout */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-300 lg:translate-x-0 flex flex-col ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--color-border)]">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="CleanFlow" className="h-8 w-auto [.dark_&]:hidden" />
            <img src={darklogo} alt="CleanFlow" className="h-8 w-auto hidden [.dark_&]:block" />
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}