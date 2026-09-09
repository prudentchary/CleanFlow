import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/common/SideBar";
import Header from "@/components/common/Header";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentUserRole = "admin"; // Mock user role (replace with Auth Context later, e.g., const { role } = useAuth();)

  

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text)]">
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        userRole={currentUserRole}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          userRole={currentUserRole}
        />

        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}