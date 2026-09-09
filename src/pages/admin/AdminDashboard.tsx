
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/paths";
import StatCard from "@/components/ui/StatCard";

import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import {
  DollarSign,
  Users,
  CalendarCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Plus,
} from "lucide-react";

export default function AdminDashboard() {
  const { showToast } = useToast();
  const navigate = useNavigate()
  

  // Mock Overview Metrics
  const stats = [
  {
    label: "Total Revenue",
    value: "$24,580",
    change: "+14.2%",
    isPositive: true, // <-- Add this property here
    icon: DollarSign,
  },
  {
    label: "Active Bookings",
    value: "42",
    change: "+8.5%",
    isPositive: true,
    icon: CalendarCheck,
  },
  {
    label: "Active Customers",
    value: "1,240",
    change: "+5.1%",
    isPositive: true,
    icon: Users,
  },
  {
    label: "On-Duty Staff",
    value: "18 / 24",
    change: "75% active",
    isPositive: true,
    icon: TrendingUp,
  },

];

  // Mock Recent Bookings Data
  const [recentBookings] = useState([
    {
      id: "BK-1092",
      customer: "Sarah Jenkins",
      service: "Deep House Cleaning",
      staff: "Michael Reed",
      date: "Today, 2:00 PM",
      status: "In Progress",
      amount: "$180",
    },
    {
      id: "BK-1091",
      customer: "David Chen",
      service: "Standard Apartment Clean",
      staff: "Elena Rostova",
      date: "Today, 11:30 AM",
      status: "Completed",
      amount: "$120",
    },
    {
      id: "BK-1090",
      customer: "Emily Watson",
      service: "Move-in / Move-out",
      staff: "Unassigned",
      date: "Tomorrow, 9:00 AM",
      status: "Pending",
      amount: "$250",
    },
    {
      id: "BK-1089",
      customer: "Marcus Vance",
      service: "Office Disinfection",
      staff: "James Wilson",
      date: "Aug 20, 4:00 PM",
      status: "Cancelled",
      amount: "$310",
    },
  ]);
  

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Admin Overview
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            System performance, live bookings, and team operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => showToast("Exporting report...", "info")}
          >
            Export Data
          </Button>
          <Button
            variant="solid"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.SERVICES_STORE)}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="space-y-8">
        {/* Overview Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              isPositive={stat.isPositive ?? true}
              icon={stat.icon}
            />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">
                Recent Bookings
              </h2>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Live updates across all service orders
              </p>
            </div>
            <Button
  variant="outline"
  size="sm"
  onClick={() => navigate(ROUTES.ADMIN_BOOKINGS)}
>
  View All
</Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-xs text-[var(--color-text-secondary)] uppercase">
                  <th className="py-3 px-2">ID & Customer</th>
                  <th className="py-3 px-2">Service</th>
                  <th className="py-3 px-2">Assigned Staff</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {recentBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-[var(--color-bg)]/50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <p className="font-semibold text-[var(--color-text)]">
                        {booking.customer}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {booking.id}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-[var(--color-text-secondary)]">
                      {booking.service}
                    </td>
                    <td className="py-3 px-2 text-[var(--color-text)] font-medium">
                      {booking.staff}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          booking.status === "Completed"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : booking.status === "In Progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : booking.status === "Pending"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {booking.status === "Completed" && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {booking.status === "In Progress" && (
                          <Clock className="w-3 h-3 animate-spin" />
                        )}
                        {booking.status === "Pending" && (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-[var(--color-text)]">
                      {booking.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Activity Sidebar */}
        <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h2 className="text-lg font-bold text-[var(--color-text)]">
              Live Activity
            </h2>
            <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  Job BK-1091 Completed
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Elena Rostova uploaded 4 before/after photos.
                </p>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  12 mins ago
                </span>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  Staff Checked In
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Michael Reed arrived at location for BK-1092.
                </p>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  28 mins ago
                </span>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0" />
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  New Customer Signup
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Emily Watson registered via web portal.
                </p>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  1 hour ago
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
