import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import AppLayout from "@/layout/AppLayout";

// Public Pages
import LandingPage from "@/pages/landing/LandingPage";
import SignIn from "@/pages/auth/Login";
import CreateAccount from "@/pages/auth/CreateAccount";
import VerifyOtp from "@/pages/auth/VerifyOtp";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ChangePassword from "@/pages/auth/ResetPassword";

// Protected Role Dashboards for Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import StaffOnboarding from "@/pages/admin/StaffOnboarding";
import AdminBookings from "@/pages/admin/AdminBookings";
import ServiceStore from "@/pages/admin/ServiceStore";
import AdminCustomersManagement from "@/pages/admin/Customers";
import AdminFinancials from "@/pages/admin/Financials";
import AdminInventoryServices from "@/pages/admin/Inventory";

// Protected Role Dashboards for Staff
import StaffDashboard from "@/pages/staff/StaffDashboard";
import NewOrder from "@/pages/staff/NewOrder";
import ProcessingQueue from "@/pages/staff/ProcessingQeue";
import Pickups from "@/pages/staff/Pickups";
import Orders from "@/pages/staff/Orders";
import Referrals from "@/pages/staff/Referrals";
import Registers from "@/pages/staff/Registers";
import Tasks from "@/pages/staff/Tasks";

import CustomerDashboard from "@/pages/customer/CustomerDashboard";
export default function AppRouter() {
  // Mock user role (replace with Auth Context later, e.g., const { role } = useAuth();)
  const currentUserRole = "admin"; // "admin" | "staff" | "customer"

  // Helper function to pick the correct landing page
  const getDefaultDashboard = (role: string) => {
    switch (role) {
      case "admin":
        return ROUTES.ADMIN_DASHBOARD;
      case "staff":
        return ROUTES.STAFF_DASHBOARD;
      case "customer":
        return ROUTES.CUSTOMER_DASHBOARD;
      default:
        return ROUTES.LOGIN;
    }
  };

  return (
    <Routes>
      {/* Public Unprotected Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path={ROUTES.LOGIN} element={<SignIn />} />
      <Route path={ROUTES.CREATE_ACCOUNT} element={<CreateAccount />} />
      <Route path={ROUTES.VERIFY_OTP} element={<VerifyOtp />} />
      <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />

      {/* Authenticated Layout Wrapper */}
      <Route element={<AppLayout />}>
        {/* Redirect /dashboard to the specific role dashboard */}
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <Navigate to={getDefaultDashboard(currentUserRole)} replace />
          }
        />

        {/* Role Views */}
        {/* Admin */}
        <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />

        <Route
          path={ROUTES.ADMIN_STAFF_ONBOARDING}
          element={<StaffOnboarding />}
        />
        <Route path={ROUTES.ADMIN_BOOKINGS} element={<AdminBookings />} />
        <Route path={ROUTES.SERVICES_STORE} element={<ServiceStore />} />
        <Route
          path={ROUTES.ADMIN_CUSTOMERS}
          element={<AdminCustomersManagement />}
        />
        <Route path={ROUTES.FINANCIALS} element={<AdminFinancials />} />
        <Route
          path={ROUTES.INVENTORY_SERVICES}
          element={<AdminInventoryServices />}
        />

        <Route
          path={ROUTES.CUSTOMER_DASHBOARD}
          element={<CustomerDashboard />}
        />

        {/* Staff */}
        <Route path={ROUTES.STAFF_DASHBOARD} element={<StaffDashboard />} />
        <Route path={ROUTES.STAFF_NEW_ORDER} element={<NewOrder />} />
        <Route
          path={ROUTES.STAFF_PROCESSING_QUEUE}
          element={<ProcessingQueue />}
        />
        <Route path={ROUTES.STAFF_PICKUPS} element={<Pickups />} />
        <Route path={ROUTES.STAFF_ORDERS} element={<Orders />} />
        <Route path={ROUTES.STAFF_REFERRALS} element={<Referrals />} />
        <Route path={ROUTES.STAFF_REGISTERS} element={<Registers />} />
        <Route path={ROUTES.STAFF_TASKS} element={<Tasks />} />

        {/* Shared App Views */}
        <Route path={ROUTES.RESET_PASSWORD} element={<ChangePassword />} />
      </Route>

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
