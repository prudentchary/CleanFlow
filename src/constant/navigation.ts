import {
  LayoutDashboard,
  Shield,
  UserPlus,
  DollarSign,
  ClipboardList,
  Box,
  Kanban,
  ShoppingCart,
  Shirt,
  Users,
  CheckSquare,
  Search,
  PackageCheck,
  Gift,
  Clock,
} from "lucide-react";
import { ROUTES } from "@/routes/paths";

export type UserRole = "admin" | "staff" | "customer";

export interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  // --- ADMIN ONLY ---
  {
    name: "Admin Dashboard",
    path: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    name: "Staff Onboarding",
    path: ROUTES.ADMIN_STAFF_ONBOARDING,
    icon: UserPlus,
    roles: ["admin"],

  },
   {
  name: "Service & Pricing",
  path: ROUTES.SERVICES_STORE,
  icon: Shirt, 
  roles: ["admin", "staff"], 
},
  {
    name: "Bookings & Orders",
    path: ROUTES.ADMIN_BOOKINGS,
    icon: ClipboardList,
    roles: ["admin"],
  },
  {
    name: "Financials",
    path: ROUTES.FINANCIALS,
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    name: "Inventory & Services",
    path: ROUTES.INVENTORY_SERVICES,
    icon: Box,
    roles: ["admin"],
  },
  {

    name: "Customer Directory",
    path: ROUTES.ADMIN_CUSTOMERS,
    icon: Users,
    roles: ["admin"],
  },

 

  // --- STAFF ONLY ---
  {
    name: "Staff Dashboard",
    path: ROUTES.STAFF_DASHBOARD,
    icon: LayoutDashboard,
    roles: ["staff"],
  },
  {
    name: "New Order",
    path: ROUTES.STAFF_NEW_ORDER,
    icon: ShoppingCart,
    roles: ["staff"],
  },
  {
    name: "Processing Queue",
    path: ROUTES.STAFF_PROCESSING_QUEUE,
    icon: Kanban,
    roles: ["staff"],
  },
  {
    name: "Pickups",
    path: ROUTES.STAFF_PICKUPS,
    icon: PackageCheck,
    roles: ["staff"],
  },
  {
    name: "Orders",
    path: ROUTES.STAFF_ORDERS,
    icon: Search,
    roles: ["staff"],
  },
  {
    name: "Referrals",
    path: ROUTES.STAFF_REFERRALS,
    icon: Gift,
    roles: ["staff"],
  },
  {
    name: "Registers",
    path: ROUTES.STAFF_REGISTERS,
    icon: Clock,
    roles: ["staff"],
  },
  {
    name: "Tasks",
    path: ROUTES.STAFF_TASKS,
    icon: CheckSquare,
    roles: ["staff"],
  },

  // --- CUSTOMER ONLY ---
  {
    name: "Customer Dashboard",
    path: ROUTES.CUSTOMER_DASHBOARD,
    icon: LayoutDashboard,
    roles: ["customer"],
  },

  

  
  // --- SHARED ACCROSS ALL ROLES ---
 
  {
    name: "Security & Password",
    path: ROUTES.RESET_PASSWORD,
    icon: Shield,
    roles: ["admin", "staff", "customer"],
  },
];