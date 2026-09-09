export const ROUTES = {
  HOME: "/",
  CREATE_ACCOUNT: "/create-account",
  VERIFY_OTP: "/verify-otp",
  LOGIN: "/Login",
  FORGOT_PASSWORD: "/forgot-password",
  USER_DASHBOARD: "/dashboard", 
  PROFILE: "/profile", 
  
  DASHBOARD: "/dashboard",
  

 // Add Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_STAFF_ONBOARDING: "/admin/staff",
  ADMIN_BOOKINGS: "/admin/bookings",
ADMIN_CUSTOMERS: "/admin/customers",
  SERVICES_STORE: "/services",
  FINANCIALS: "/admin/financials",
  INVENTORY_SERVICES: "/admin/inventory",

  // Add Staff routes
  STAFF_DASHBOARD: "/staff/dashboard",
  STAFF_PICKUPS: "/staff/pickups",
  STAFF_ORDERS: "/staff/orders",
  STAFF_REFERRALS: "/staff/referrals",
  STAFF_REGISTERS: "/staff/registers",
  STAFF_TASKS: "/staff/tasks",
  STAFF_NEW_ORDER: "/staff/new-order",
  STAFF_PROCESSING_QUEUE: "/staff/processing-queue",
  
  

  //add customer routes
  CUSTOMER_DASHBOARD: "/customer/dashboard",
  

  // Add shared routes
  RESET_PASSWORD: "/reset-password",
} as const;