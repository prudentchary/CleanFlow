import { useState } from "react";
import { Search, Eye, UserCheck, Calendar } from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Custom UI Components
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type BookingStatus = "Pending" | "In Progress" | "Completed" | "Cancelled";

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  service: string;
  amount: string;
  date: string;
  assignedStaff: string;
  status: BookingStatus;
  address: string;
}

const AVAILABLE_STAFF = [
  "Unassigned",
  "Michael Reed",
  "Elena Rostova",
  "David Chen",
  "Sarah Jenkins",
];

export default function AdminBookings() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | BookingStatus>("All");
  
  // Selected booking state for view/edit modal
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Edit form state
  const [newStaff, setNewStaff] = useState("");
  const [newStatus, setNewStatus] = useState<BookingStatus>("Pending");

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "BK-1092",
      customerName: "Sarah Jenkins",
      customerPhone: "+1 555-0198",
      service: "Deep House Cleaning",
      amount: "$180",
      date: "2026-08-24",
      assignedStaff: "Michael Reed",
      status: "In Progress",
      address: "742 Evergreen Terrace, Springfield",
    },
    {
      id: "BK-1093",
      customerName: "Alex Rivera",
      customerPhone: "+1 555-0812",
      service: "Express Dry Cleaning",
      amount: "$65",
      date: "2026-08-25",
      assignedStaff: "Elena Rostova",
      status: "Pending",
      address: "1042 Ocean Drive, Bayville",
    },
    {
      id: "BK-1094",
      customerName: "David Miller",
      customerPhone: "+1 555-0341",
      service: "Commercial Carpet Wash",
      amount: "$320",
      date: "2026-08-23",
      assignedStaff: "David Chen",
      status: "Completed",
      address: "500 Corporate Pkwy, Suite 4",
    },
  ]);

  const openManageModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStaff(booking.assignedStaff);
    setNewStatus(booking.status);
    setIsModalOpen(true);
  };

  const handleUpdateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setIsUpdating(true);

    setTimeout(() => {
      setBookings((prev) =>
        prev.map((item) =>
          item.id === selectedBooking.id
            ? { ...item, assignedStaff: newStaff, status: newStatus }
            : item
        )
      );
      setIsUpdating(false);
      setIsModalOpen(false);
      showToast(`Updated booking ${selectedBooking.id}`, "success");
    }, 500);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "All" || b.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "In Progress":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Bookings & Orders</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage live customer orders, reassign staff members, and track fulfillment status.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-x-auto">
          {(["All", "Pending", "In Progress", "Completed", "Cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="w-full md:w-72">
          <Input
            type="text"
            placeholder="Search booking ID, customer, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[var(--color-text-secondary)]" />}
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Service Details</th>
                <th className="p-4 font-medium">Assigned Staff</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                  <td className="p-4 font-semibold text-[var(--color-text)]">
                    {booking.id}
                    <div className="text-xs text-[var(--color-text-secondary)] font-normal flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {booking.date}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[var(--color-text)]">{booking.customerName}</div>
                    <div className="text-xs text-[var(--color-text-secondary)]">{booking.customerPhone}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[var(--color-text)]">{booking.service}</div>
                    <div className="text-xs text-[var(--color-primary)] font-semibold">{booking.amount}</div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                      {booking.assignedStaff}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openManageModal(booking)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Reassign Booking Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isUpdating && setIsModalOpen(false)}
        title={`Manage Booking: ${selectedBooking?.id}`}
        description="Reassign staff member or update fulfillment status."
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="manage-booking-form"
              isLoading={isUpdating}
              loadingText="Saving Changes..."
            >
              Save Changes
            </Button>
          </>
        }
      >
        {selectedBooking && (
          <form id="manage-booking-form" onSubmit={handleUpdateBooking} className="space-y-4">
            {/* Customer Summary Box */}
            <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1 text-xs">
              <p>
                <strong className="text-[var(--color-text)]">Customer:</strong>{" "}
                {selectedBooking.customerName} ({selectedBooking.customerPhone})
              </p>
              <p>
                <strong className="text-[var(--color-text)]">Address:</strong> {selectedBooking.address}
              </p>
              <p>
                <strong className="text-[var(--color-text)]">Service & Price:</strong>{" "}
                {selectedBooking.service} —{" "}
                <span className="text-[var(--color-primary)] font-bold">{selectedBooking.amount}</span>
              </p>
            </div>

            {/* Reassign Staff */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--color-text)]">
                Assign Staff Member
              </label>
              <select
                value={newStaff}
                onChange={(e) => setNewStaff(e.target.value)}
                className="w-full h-10 px-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                {AVAILABLE_STAFF.map((staff) => (
                  <option key={staff} value={staff}>
                    {staff}
                  </option>
                ))}
              </select>
            </div>

            {/* Change Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[var(--color-text)]">
                Fulfillment Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                className="w-full h-10 px-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}