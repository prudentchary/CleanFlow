import React, { useState } from "react";
import {
  Search,
  Plus,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  Sliders,
  ChevronRight,
  Shirt,
  Package,
  Wallet,
  MessageSquare,
  ShoppingBag,
  Award,
  AlertTriangle,
  DollarSign,
  Send,
  Megaphone,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Reusable UI Components
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type StarchLevel = "None" | "Light" | "Medium" | "Heavy";
type PackagingPreference = "Hanger" | "Folded" | "Bagged";
type CustomerTag = "VIP" | "Commercial" | "Regular" | "New";
type LoyaltyTier = "Platinum" | "Gold" | "Silver" | "Standard";
type BroadcastTarget = "all" | "vip" | "commercial";

interface OrderSummary {
  id: string;
  date: string;
  itemsCount: number;
  totalAmount: number;
  status: "Completed" | "In Progress" | "Pending Pickup";
  daysOnRack?: number;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gateInstructions?: string;
  tag: CustomerTag;
  loyaltyTier: LoyaltyTier;
  walletBalance: number;
  totalSpent: number;
  totalOrders: number;
  outstandingBalance: number;
  preferences: {
    starch: StarchLevel;
    packaging: PackagingPreference;
    detergent: string;
    specialNotes: string;
  };
  recentOrders: OrderSummary[];
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "CUST-1001",
    name: "Sarah Jenkins",
    phone: "+234 802 345 6789",
    email: "sarah.j@example.com",
    address: "14 Victoria Island Road, Lagos",
    gateInstructions: "Leave with front desk security if unavailable.",
    tag: "VIP",
    loyaltyTier: "Gold",
    walletBalance: 45.0,
    totalSpent: 1420.0,
    totalOrders: 28,
    outstandingBalance: 0,
    preferences: {
      starch: "Medium",
      packaging: "Hanger",
      detergent: "Hypoallergenic / Fragrance Free",
      specialNotes:
        "Handle native attire with extra care. Sensitive to harsh bleaches.",
    },
    recentOrders: [
      {
        id: "BK-1092",
        date: "Sep 05, 2026",
        itemsCount: 6,
        totalAmount: 45.0,
        status: "In Progress",
      },
      {
        id: "BK-1044",
        date: "Aug 22, 2026",
        itemsCount: 4,
        totalAmount: 32.0,
        status: "Completed",
      },
    ],
  },
  {
    id: "CUST-1002",
    name: "David Chen",
    phone: "+234 803 987 6543",
    email: "david.chen@example.com",
    address: "7 Ikeja GRA, Lagos",
    gateInstructions: "Call upon arrival at the main gate.",
    tag: "Regular",
    loyaltyTier: "Silver",
    walletBalance: 0,
    totalSpent: 385.5,
    totalOrders: 11,
    outstandingBalance: 15.0,
    preferences: {
      starch: "Heavy",
      packaging: "Folded",
      detergent: "Standard Scented",
      specialNotes: "Prefers sharp creases on all formal trousers.",
    },
    recentOrders: [
      {
        id: "BK-1091",
        date: "Aug 15, 2026",
        itemsCount: 3,
        totalAmount: 25.0,
        status: "Pending Pickup",
        daysOnRack: 14,
      },
    ],
  },
  {
    id: "CUST-1003",
    name: "Marcus Vance (Apex Hubs)",
    phone: "+234 801 111 2222",
    email: "marcus@apexhubs.com",
    address: "Plot 8 Lekki Phase 1, Lagos",
    gateInstructions: "Corporate delivery loading bay.",
    tag: "Commercial",
    loyaltyTier: "Platinum",
    walletBalance: 250.0,
    totalSpent: 4250.0,
    totalOrders: 64,
    outstandingBalance: 120.0,
    preferences: {
      starch: "None",
      packaging: "Bagged",
      detergent: "Eco-Organic Wash",
      specialNotes:
        "Corporate weekly dry cleaning account. Invoice billed monthly.",
    },
    recentOrders: [
      {
        id: "BK-1089",
        date: "Sep 07, 2026",
        itemsCount: 15,
        totalAmount: 180.0,
        status: "Pending Pickup",
        daysOnRack: 1,
      },
    ],
  },
];

export default function AdminCustomers() {
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    MOCK_CUSTOMERS[2].id,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "preferences" | "orders" | "addresses"
  >("addresses");

  // Modal Visibility States
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  // Single Customer Message States
  const [topUpAmount, setTopUpAmount] = useState("");
  const [notificationType, setNotificationType] = useState<
    "whatsapp" | "gmail"
  >("whatsapp");
  const [notificationTemplate, setNotificationTemplate] = useState("pickup");
  const [customMessage, setCustomMessage] = useState("");

  // Mass Broadcast States
  const [broadcastChannel, setBroadcastChannel] = useState<
    "whatsapp" | "email" | "sms"
  >("whatsapp");
  const [broadcastTarget, setBroadcastTarget] = useState<
    "all" | "vip" | "commercial"
  >("all");
  const [broadcastTemplate, setBroadcastTemplate] = useState("new_month");
  const [broadcastCustomMessage, setBroadcastCustomMessage] = useState("");

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gateInstructions: "",
    tag: "Regular" as CustomerTag,
    starch: "Medium" as StarchLevel,
    packaging: "Hanger" as PackagingPreference,
    specialNotes: "",
  });

  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) {
      showToast("Customer name and phone number are required.", "error");
      return;
    }

    const created: Customer = {
      id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email || "N/A",
      address: newCustomer.address || "N/A",
      gateInstructions: newCustomer.gateInstructions || "None",
      tag: newCustomer.tag,
      loyaltyTier: "Standard",
      walletBalance: 0,
      totalSpent: 0,
      totalOrders: 0,
      outstandingBalance: 0,
      preferences: {
        starch: newCustomer.starch,
        packaging: newCustomer.packaging,
        detergent: "Standard Scented",
        specialNotes: newCustomer.specialNotes || "None",
      },
      recentOrders: [],
    };

    setCustomers([created, ...customers]);
    setSelectedCustomerId(created.id);
    setIsNewModalOpen(false);
    setNewCustomer({
      name: "",
      phone: "",
      email: "",
      address: "",
      gateInstructions: "",
      tag: "Regular",
      starch: "Medium",
      packaging: "Hanger",
      specialNotes: "",
    });
    showToast("Customer profile created successfully!", "success");
  };

  const handleTopUpWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast("Please enter a valid credit amount.", "error");
      return;
    }

    setCustomers((prev) =>
      prev.map((cust) =>
        cust.id === selectedCustomer.id
          ? { ...cust, walletBalance: cust.walletBalance + amount }
          : cust,
      ),
    );

    setIsWalletModalOpen(false);
    setTopUpAmount("");
    showToast(
      `Added $${amount.toFixed(2)} to ${selectedCustomer.name}'s wallet!`,
      "success",
    );
  };

  const getTemplateMessage = () => {
    if (notificationTemplate === "pickup") {
      return `Hello ${selectedCustomer.name}, your dry cleaning order at Laundry Hub is ready for pickup! Thank you for choosing us.`;
    }
    if (notificationTemplate === "balance") {
      return `Hello ${selectedCustomer.name}, this is a gentle reminder that you have an outstanding balance of $${selectedCustomer.outstandingBalance.toFixed(2)} on your Laundry Hub account.`;
    }
    return (
      customMessage ||
      `Hello ${selectedCustomer.name}, we have an update regarding your laundry profile at Laundry Hub.`
    );
  };

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMsg = getTemplateMessage();

    if (notificationType === "whatsapp") {
      const cleanPhone = selectedCustomer.phone.replace(/[^0-9]/g, "");
      const encodedMsg = encodeURIComponent(finalMsg);
      window.open(`https://wa.me/${cleanPhone}?text=${encodedMsg}`, "_blank");
      showToast("Opening WhatsApp Web...", "info");
    } else {
      if (!selectedCustomer.email || selectedCustomer.email === "N/A") {
        showToast(
          "This customer does not have a valid email address.",
          "error",
        );
        return;
      }
      const subject = encodeURIComponent("Update from Laundry Hub");
      const body = encodeURIComponent(finalMsg);
      window.open(
        `mailto:${selectedCustomer.email}?subject=${subject}&body=${body}`,
        "_blank",
      );
      showToast("Opening email client...", "info");
    }

    setIsNotifyModalOpen(false);
    setCustomMessage("");
  };

  // Prepares Preview for Mass Broadcast
  const getBroadcastPreview = () => {
    if (broadcastTemplate === "new_month") {
      return "Happy New Month from Laundry Hub! 🌟 Wishing you a fresh start and a productive month ahead. Enjoy 10% off your dry cleaning orders this week!";
    }
    if (broadcastTemplate === "new_week") {
      return "Happy New Week! 👔 Ready to take on the week? Let us handle your laundry and corporate wear while you focus on your goals.";
    }
    return (
      broadcastCustomMessage || "Enter your custom broadcast message above..."
    );
  };

  // Handles Mass Broadcast Delivery
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();

    const targetCustomers = customers.filter((c) => {
      if (broadcastTarget === "vip") return c.tag === "VIP";
      if (broadcastTarget === "commercial") return c.tag === "Commercial";
      return true;
    });

    if (targetCustomers.length === 0) {
      showToast("No customers found for the selected target group.", "error");
      return;
    }

    showToast(
      `Broadcast queued for ${targetCustomers.length} recipients via ${broadcastChannel.toUpperCase()}!`,
      "success",
    );
    setIsBroadcastModalOpen(false);
    setBroadcastCustomMessage("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Customer Directory & Profiles
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage customer credit wallets, care preferences, and mass
            greetings.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setIsBroadcastModalOpen(true)}
            leftIcon={
              <Megaphone className="w-4 h-4 text-[var(--color-primary)]" />
            }
          >
            Mass Broadcast / Greeting
          </Button>

          <Button
            onClick={() => setIsNewModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Customer
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Customer List Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Input
            type="text"
            placeholder="Search phone, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={
              <Search className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredCustomers.map((cust) => {
              const isSelected = cust.id === selectedCustomerId;
              const hasOverdueItems = cust.recentOrders.some(
                (o) => o.status === "Pending Pickup" && (o.daysOnRack || 0) > 7,
              );

              return (
                <div
                  key={cust.id}
                  onClick={() => setSelectedCustomerId(cust.id)}
                  className={`p-4 rounded-[var(--radius-md)] border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-sm"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-secondary)]"
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[var(--color-text)] truncate">
                        {cust.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                          cust.tag === "VIP"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : cust.tag === "Commercial"
                              ? "bg-purple-500/10 text-purple-500 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        }`}
                      >
                        {cust.tag}
                      </span>

                      {hasOverdueItems && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-0.5 shrink-0">
                          <AlertTriangle className="w-3 h-3" /> Overdue
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1 shrink-0">
                        <Phone className="w-3 h-3" /> {cust.phone}
                      </span>
                      {cust.walletBalance > 0 && (
                        <span className="text-emerald-500 font-semibold truncate">
                          • Wallet: ${cust.walletBalance.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 ${
                      isSelected
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Details */}
        {selectedCustomer && (
          <div className="lg:col-span-8 space-y-5">
            <div className="p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold text-lg flex items-center justify-center shrink-0">
                    {selectedCustomer.name.charAt(0)}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg md:text-xl font-bold text-[var(--color-text)] truncate">
                        {selectedCustomer.name}
                      </h3>
                      <span className="text-xs text-[var(--color-text-secondary)] font-mono whitespace-nowrap shrink-0">
                        ({selectedCustomer.id})
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center gap-1 whitespace-nowrap shrink-0">
                        <Award className="w-3 h-3" />{" "}
                        {selectedCustomer.loyaltyTier} Tier
                      </span>
                    </div>

                    <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-[var(--color-text-secondary)]" />
                      <span className="truncate">
                        {selectedCustomer.address}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNotificationType("whatsapp");
                      setIsNotifyModalOpen(true);
                    }}
                    className="whitespace-nowrap h-9 px-3 text-xs shrink-0"
                    leftIcon={
                      <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                    }
                  >
                    WhatsApp
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setNotificationType("gmail");
                      setIsNotifyModalOpen(true);
                    }}
                    className="whitespace-nowrap h-9 px-3 text-xs shrink-0"
                    leftIcon={
                      <Mail className="w-4 h-4 text-red-500 shrink-0" />
                    }
                  >
                    Gmail
                  </Button>

                  <Button
                    onClick={() =>
                      showToast(
                        `Creating ticket for ${selectedCustomer.name}`,
                        "info",
                      )
                    }
                    className="whitespace-nowrap h-9 px-3 text-xs shrink-0"
                    leftIcon={<ShoppingBag className="w-4 h-4 shrink-0" />}
                  >
                    New Order
                  </Button>
                </div>
              </div>

              {selectedCustomer.outstandingBalance > 0 && (
                <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Unpaid Outstanding Balance: $
                    {selectedCustomer.outstandingBalance.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 text-emerald-500" /> Store
                    Wallet
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-base font-bold text-emerald-500">
                      ${selectedCustomer.walletBalance.toFixed(2)}
                    </span>
                    <button
                      onClick={() => setIsWalletModalOpen(true)}
                      className="text-[11px] font-bold text-[var(--color-primary)] hover:underline"
                    >
                      + Top Up
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Total Revenue
                  </span>
                  <span className="text-base font-bold text-[var(--color-text)] mt-1 block">
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)]">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Total Jobs
                  </span>
                  <span className="text-base font-bold text-[var(--color-text)] mt-1 block">
                    {selectedCustomer.totalOrders} Orders
                  </span>
                </div>

                <div className="p-3.5 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] min-w-0">
                  <span className="text-[11px] text-[var(--color-text-secondary)] font-medium block">
                    Email Contact
                  </span>
                  <span
                    title={selectedCustomer.email}
                    className="text-xs font-bold text-[var(--color-text)] mt-1 block truncate"
                  >
                    {selectedCustomer.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-5">
              <div className="flex border-b border-[var(--color-border)] gap-6 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === "preferences"
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4" /> Garment Care Preferences
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === "orders"
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Order History (
                    {selectedCustomer.recentOrders.length})
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("addresses")}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    activeTab === "addresses"
                      ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                      : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> Logistics & Delivery
                  </span>
                </button>
              </div>

              {activeTab === "preferences" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                      <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-2">
                        Starch Requirement
                      </span>
                      <span className="text-sm font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-md inline-block">
                        {selectedCustomer.preferences.starch} Starch
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)]">
                      <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block mb-2">
                        Packaging Method
                      </span>
                      <span className="text-sm font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md inline-block">
                        On {selectedCustomer.preferences.packaging}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1">
                    <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                      Detergent & Wash Formula
                    </span>
                    <p className="text-xs text-[var(--color-text)] font-medium">
                      {selectedCustomer.preferences.detergent}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1">
                    <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                      Permanent Counter Notes
                    </span>
                    <p className="text-xs text-[var(--color-text)] font-medium leading-relaxed">
                      {selectedCustomer.preferences.specialNotes}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="space-y-3">
                  {selectedCustomer.recentOrders.length === 0 ? (
                    <p className="text-xs text-[var(--color-text-secondary)] text-center py-6">
                      No past tickets recorded for this customer yet.
                    </p>
                  ) : (
                    selectedCustomer.recentOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--color-text)]">
                              {ord.id}
                            </span>
                            <span className="text-[11px] text-[var(--color-text-secondary)]">
                              • {ord.date}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-[var(--color-text-secondary)]">
                              {ord.itemsCount} Garment Items
                            </span>
                          </div>
                        </div>

                        <div className="text-right space-y-1">
                          <span className="text-xs font-bold text-[var(--color-primary)] block">
                            ${ord.totalAmount.toFixed(2)}
                          </span>
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                              ord.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : ord.status === "Pending Pickup"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-blue-500/10 text-blue-500"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2">
                    <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                      Primary Pickup / Delivery Address
                    </span>
                    <p className="text-xs text-[var(--color-text)] font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-primary)] shrink-0" />
                      {selectedCustomer.address}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-1">
                    <span className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider block">
                      Driver & Gate Access Notes
                    </span>
                    <p className="text-xs text-[var(--color-text)] font-medium leading-relaxed">
                      {selectedCustomer.gateInstructions ||
                        "No gate instructions provided."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add New Customer Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add New Customer Profile"
        description="Save contact details and care preferences for quick counter retrieval."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="new-customer-form">
              Save Customer
            </Button>
          </>
        }
      >
        <form
          id="new-customer-form"
          onSubmit={handleAddCustomer}
          className="space-y-4"
        >
          <Input
            label="Full Name *"
            required
            type="text"
            placeholder="e.g. Alex Rivera"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            leftIcon={
              <User className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />

          <Input
            label="Phone Number *"
            required
            type="tel"
            placeholder="+234 800 000 0000"
            value={newCustomer.phone}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, phone: e.target.value })
            }
            leftIcon={
              <Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            value={newCustomer.email}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, email: e.target.value })
            }
            leftIcon={
              <Mail className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />

          <Input
            label="Address"
            type="text"
            placeholder="14 Victoria Island Road, Lagos"
            value={newCustomer.address}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, address: e.target.value })
            }
            leftIcon={
              <MapPin className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />

          <Input
            label="Gate / Driver Notes"
            type="text"
            placeholder="e.g. Call upon arrival at estate gate 2"
            value={newCustomer.gateInstructions}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                gateInstructions: e.target.value,
              })
            }
            leftIcon={
              <MapPin className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Starch Preference"
              type="text"
              placeholder="None / Light / Medium / Heavy"
              value={newCustomer.starch}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  starch: e.target.value as StarchLevel,
                })
              }
              leftIcon={
                <Shirt className="w-4 h-4 text-[var(--color-text-secondary)]" />
              }
            />

            <Input
              label="Packaging Preference"
              type="text"
              placeholder="Hanger / Folded / Bagged"
              value={newCustomer.packaging}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  packaging: e.target.value as PackagingPreference,
                })
              }
              leftIcon={
                <Package className="w-4 h-4 text-[var(--color-text-secondary)]" />
              }
            />
          </div>

          <Input
            label="Special Garment Notes"
            type="text"
            placeholder="e.g. Sensitive skin, double check suit buttons"
            value={newCustomer.specialNotes}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, specialNotes: e.target.value })
            }
            leftIcon={
              <Sliders className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />
        </form>
      </Modal>

      {/* Single Customer WhatsApp / Gmail Modal */}
      <Modal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        title={
          notificationType === "whatsapp"
            ? "Send WhatsApp Notification"
            : "Send Gmail Notification"
        }
        description={`Directly contact ${selectedCustomer?.name} via ${
          notificationType === "whatsapp" ? "WhatsApp" : "Gmail"
        }.`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsNotifyModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="notify-customer-form"
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send via {notificationType === "whatsapp" ? "WhatsApp" : "Gmail"}
            </Button>
          </>
        }
      >
        <form
          id="notify-customer-form"
          onSubmit={handleSendNotification}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Notification Preset
            </label>
            <select
              value={notificationTemplate}
              onChange={(e) => setNotificationTemplate(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="pickup">Garment Pickup Alert</option>
              <option value="balance">
                Outstanding Balance Payment Reminder
              </option>
              <option value="custom">Custom Message</option>
            </select>
          </div>

          {notificationTemplate === "custom" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
                Custom Message Body
              </label>
              <textarea
                rows={3}
                placeholder="Type your message here..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full p-3 text-xs rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Message Preview
            </label>
            <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-medium leading-relaxed">
              {getTemplateMessage()}
            </div>
          </div>
        </form>
      </Modal>

      {/* Mass Broadcast / Greetings Modal */}
      <Modal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        title="Send Bulk Broadcast / Greeting"
        description="Send festive greetings, weekly updates, or bulk announcements to your customers."
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsBroadcastModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="broadcast-form"
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Broadcast
            </Button>
          </>
        }
      >
        <form
          id="broadcast-form"
          onSubmit={handleSendBroadcast}
          className="space-y-4"
        >
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Target Audience
            </label>
            <select
              value={broadcastTarget}
              onChange={(e) =>
                setBroadcastTarget(e.target.value as BroadcastTarget)
              }
              className="w-full h-10 px-3 text-xs rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="all">
                All Registered Customers ({customers.length})
              </option>
              <option value="vip">VIP Customers Only</option>
              <option value="commercial">Commercial Accounts Only</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Delivery Channel
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBroadcastChannel("whatsapp")}
                className={`py-2 text-xs font-bold rounded-md border transition-all ${
                  broadcastChannel === "whatsapp"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setBroadcastChannel("email")}
                className={`py-2 text-xs font-bold rounded-md border transition-all ${
                  broadcastChannel === "email"
                    ? "border-red-500 bg-red-500/10 text-red-500"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                }`}
              >
                Email / Gmail
              </button>
              <button
                type="button"
                onClick={() => setBroadcastChannel("sms")}
                className={`py-2 text-xs font-bold rounded-md border transition-all ${
                  broadcastChannel === "sms"
                    ? "border-blue-500 bg-blue-500/10 text-blue-500"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)]"
                }`}
              >
                SMS
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Greeting Preset
            </label>
            <select
              value={broadcastTemplate}
              onChange={(e) => setBroadcastTemplate(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="new_month">Happy New Month</option>
              <option value="new_week">Happy New Week</option>
              <option value="custom">Custom Announcement</option>
            </select>
          </div>

          {broadcastTemplate === "custom" && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
                Custom Message Body
              </label>
              <textarea
                rows={3}
                placeholder="Type your message here..."
                value={broadcastCustomMessage}
                onChange={(e) => setBroadcastCustomMessage(e.target.value)}
                className="w-full p-3 text-xs rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Message Preview
            </label>
            <div className="p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text)] font-medium leading-relaxed">
              {getBroadcastPreview()}
            </div>
          </div>
        </form>
      </Modal>

      {/* Wallet Top-Up Modal */}
      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        title="Top Up Store Credit Wallet"
        description={`Add prepaid funds to ${selectedCustomer?.name}'s account balance.`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsWalletModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="topup-wallet-form">
              Credit Account
            </Button>
          </>
        }
      >
        <form
          id="topup-wallet-form"
          onSubmit={handleTopUpWallet}
          className="space-y-4"
        >
          <Input
            label="Credit Amount ($) *"
            required
            type="number"
            step="0.01"
            placeholder="e.g. 50.00"
            value={topUpAmount}
            onChange={(e) => setTopUpAmount(e.target.value)}
            leftIcon={
              <DollarSign className="w-4 h-4 text-[var(--color-text-secondary)]" />
            }
          />
        </form>
      </Modal>
    </div>
  );
}
