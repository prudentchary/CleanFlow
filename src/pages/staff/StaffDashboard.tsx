import React, { useState } from "react";
import {
  Clock,
  ShoppingCart,
  CheckSquare,
  AlertTriangle,
  Boxes,
  Search,
  DollarSign,
  Activity,
  LogOut,
  LogIn,
  QrCode,
  Flame,
  ArrowRight,
  Shirt,
  Tag,
  AlertCircle,
  Play,
  CheckCircle,
  Award,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Reusable UI Components
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface ProcessingOrder {
  id: string;
  customer: string;
  itemsCount: number;
  stage: "Intake Tagging" | "Washing" | "Pressing" | "Assembly & Rack";
  isExpress: boolean;
  dueTime: string;
  rackLocation?: string;
  hasSpecialCare?: boolean;
}

const INITIAL_QUEUE: ProcessingOrder[] = [
  {
    id: "ORD-9021",
    customer: "Sarah Jenkins",
    itemsCount: 4,
    stage: "Intake Tagging",
    isExpress: true,
    dueTime: "11:00 AM (In 30m)",
    hasSpecialCare: true,
  },
  {
    id: "ORD-9018",
    customer: "David Miller",
    itemsCount: 2,
    stage: "Washing",
    isExpress: false,
    dueTime: "01:30 PM",
  },
  {
    id: "ORD-9015",
    customer: "Elena Rostova",
    itemsCount: 5,
    stage: "Pressing",
    isExpress: true,
    dueTime: "12:00 PM",
  },
  {
    id: "ORD-9012",
    customer: "Marcus Vance",
    itemsCount: 3,
    stage: "Assembly & Rack",
    isExpress: false,
    dueTime: "03:00 PM",
    rackLocation: "Rack B-04",
  },
];

export default function StaffDashboard() {
  const { showToast } = useToast();

  // Shift & Clock State
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [, setClockInTime] = useState<string | null>("08:00 AM");
  const [isClockModalOpen, setIsClockModalOpen] = useState(false);

  // Live Order Queue
  const [ordersQueue, setOrdersQueue] = useState<ProcessingOrder[]>(INITIAL_QUEUE);

  // Search Input
  const [quickSearch, setQuickSearch] = useState("");

  // Modals & Forms
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState(false);
  const [supplyCategory, setSupplyCategory] = useState("detergent");
  const [supplyNote, setSupplyNote] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Staff Referral Performance Metrics (This Month)
  const [monthlyReferrals] = useState({
    count: 14,
    revenueSpent: 1280.50,
    commissionEarned: 64.00,
  });

  // Shift Toggle Action
  const handleConfirmShiftToggle = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (isClockedIn) {
      setIsClockedIn(false);
      setClockInTime(null);
      showToast(`Clocked OUT at ${now}. Shift ended. Register locked.`, "info");
    } else {
      setIsClockedIn(true);
      setClockInTime(now);
      showToast(`Clocked IN at ${now}. Welcome to your shift!`, "success");
    }
    setIsClockModalOpen(false);
  };

  const handleQuickLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;
    showToast(`Searching ticket/barcode/phone: "${quickSearch}"...`, "info");
  };

  // Move Order to Next Garment Stage
  const handleAdvanceStage = (orderId: string) => {
    setOrdersQueue((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let nextStage = ord.stage;
          if (ord.stage === "Intake Tagging") nextStage = "Washing";
          else if (ord.stage === "Washing") nextStage = "Pressing";
          else if (ord.stage === "Pressing") nextStage = "Assembly & Rack";
          else if (ord.stage === "Assembly & Rack") {
            showToast(`Order ${ord.id} completed & placed on customer rack!`, "success");
            return ord;
          }
          showToast(`Order ${ord.id} updated to ${nextStage}`, "info");
          return { ...ord, stage: nextStage };
        }
        return ord;
      })
    );
  };

  // Handle Inventory & Chemical Supplies Request
  const handleRequestSupplies = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyNote.trim()) {
      showToast("Please enter item description and quantity needed.", "error");
      return;
    }
    setIsSupplyModalOpen(false);
    setSupplyNote("");
    showToast("Requisition sent! Inventory Manager notified.", "success");
  };

  const urgentExpressCount = ordersQueue.filter((o) => o.isExpress).length;

  return (
    <div className="space-y-6">
      {/* EXPRESS ACTION BANNER */}
      {urgentExpressCount > 0 && isClockedIn && (
        <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-red-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 shrink-0">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                Priority Notice: {urgentExpressCount} Express Garment Batches Pending
              </h4>
              <p className="text-xs opacity-90">
                Express items require immediate washing & steam finishing to meet promised pickup times.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white border-none font-bold shrink-0"
            onClick={() => showToast("Filtering queue by Express Orders...", "info")}
          >
            Process Express Queue
          </Button>
        </div>
      )}

      {/* SHIFT INACTIVE BANNER */}
      {!isClockedIn && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Shift Inactive: Till & Floor Actions Locked</h4>
              <p className="text-xs opacity-90">
                Please clock in to begin intake, advance garment stages, or collect customer payments.
              </p>
            </div>
          </div>
          <Button
            className="bg-amber-500 hover:bg-amber-600 text-black border-none font-bold shrink-0"
            onClick={() => setIsClockModalOpen(true)}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Clock In Now
          </Button>
        </div>
      )}

      {/* HEADER & TOP CONTROL BAR */}
      <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-full ${
                isClockedIn
                  ? "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
                  : "bg-red-500/10 text-red-500 dark:bg-red-500/20"
              }`}
            >
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                  Floor Operations & Work Hub
                </h2>
                <span
                  className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                    isClockedIn
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  {isClockedIn ? "Active Shift" : "Inactive"}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Logged in as Floor Operator • Shift ID: #SH-9042
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              onClick={() => setIsQrModalOpen(true)}
              leftIcon={<QrCode className="w-4 h-4 text-purple-500" />}
            >
              Referral Program
            </Button>

            <Button
              variant="ghost"
              onClick={() => setIsSupplyModalOpen(true)}
              leftIcon={<Boxes className="w-4 h-4 text-amber-500" />}
            >
              Request Supplies
            </Button>

            {isClockedIn && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsClockModalOpen(true)}
                leftIcon={<LogOut className="w-4 h-4" />}
              >
                Clock Out
              </Button>
            )}
          </div>
        </div>

        {/* WORK TRIGGER ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            disabled={!isClockedIn}
            onClick={() => showToast("Opening Walk-in POS Intake...", "info")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isClockedIn
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-500 shadow-sm"
                : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-5 h-5" />
              <div className="text-left">
                <span className="text-xs font-bold block">New Customer Drop-off</span>
                <span className="text-[10px] opacity-80">Start walk-in POS intake</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            disabled={!isClockedIn}
            onClick={() => showToast("Opening Barcode & Rack Tagging...", "info")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isClockedIn
                ? "bg-[var(--color-bg)] hover:border-[var(--color-primary)] text-[var(--color-text)] border-[var(--color-border)]"
                : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-5 h-5 text-purple-500" />
              <div className="text-left">
                <span className="text-xs font-bold block">Tag & Assign Rack</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  Print tags & assign slots
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>

          <button
            disabled={!isClockedIn}
            onClick={() => showToast("Opening Counter Cash Collection...", "info")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isClockedIn
                ? "bg-[var(--color-bg)] hover:border-[var(--color-primary)] text-[var(--color-text)] border-[var(--color-border)]"
                : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <div className="text-left">
                <span className="text-xs font-bold block">Collect Balance / Pickup</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  Settle customer invoices
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </div>

      {/* QUICK LOOKUP SEARCH BAR */}
      <form
        onSubmit={handleQuickLookup}
        className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-3 shadow-sm"
      >
        <Search className="w-5 h-5 text-[var(--color-text-secondary)] shrink-0" />
        <input
          type="text"
          placeholder="Instant Search: Enter Order ID, Customer Phone, Barcode, or Rack Slot..."
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none"
        />
        <Button type="submit" size="sm">
          Find Order
        </Button>
      </form>

      {/* OPERATIONAL & REFERRAL STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Floor Orders"
          value={ordersQueue.length.toString()}
          change="In processing pipeline"
          isPositive={true}
          icon={Shirt}
        />

        <StatCard
          label="Pending Tagging / Intake"
          value={ordersQueue.filter((o) => o.stage === "Intake Tagging").length.toString()}
          change="Awaiting garment tags"
          isPositive={false}
          icon={Tag}
        />

        <StatCard
          label="My Referrals (This Month)"
          value={`${monthlyReferrals.count} Customers`}
          change={`Generated $${monthlyReferrals.revenueSpent.toFixed(2)}`}
          isPositive={true}
          icon={Award}
        />

        <StatCard
          label="Unpaid Balance Pickup"
          value="3 Tickets"
          change="$85.00 Outstanding"
          isPositive={false}
          icon={DollarSign}
        />
      </div>

      {/* LIVE MACHINE & CHEMICAL INVENTORY STATUS */}
      <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Machine Bay & Floor Stock Status
          </h3>
          <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
            Live Sensors
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-between">
            <div>
              <span className="font-bold block">Washer #1 (Main Cycle)</span>
              <span className="text-[10px] opacity-80">Heavy Wash</span>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-sm block">12m</span>
              <span className="text-[9px] uppercase font-bold">Running</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-between">
            <div>
              <span className="font-bold block">Washer #2 (Delicates)</span>
              <span className="text-[10px] opacity-80">Cycle Finished</span>
            </div>
            <Button
              size="sm"
              className="bg-amber-500 text-black border-none font-bold text-[10px] h-7 px-2"
              onClick={() => showToast("Recorded: Washer #2 unloaded to Dryer #2.", "success")}
            >
              Unload
            </Button>
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-between">
            <div>
              <span className="font-bold block">Dryer #1</span>
              <span className="text-[10px] opacity-80">Clean Lint Trap</span>
            </div>
            <Flame className="w-4 h-4 text-red-500" />
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] flex items-center justify-between">
            <div>
              <span className="font-bold text-[var(--color-text)] block">Detergent Tank A</span>
              <span className="text-[10px]">Level: 18% (Low)</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="text-amber-500 hover:text-amber-600 text-[10px] h-7 px-1.5"
              onClick={() => {
                setSupplyCategory("detergent");
                setIsSupplyModalOpen(true);
              }}
            >
              Refill
            </Button>
          </div>
        </div>
      </div>

      {/* GARMENT PROCESSING QUEUE (STAGE ADVANCER) */}
      <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[var(--color-primary)]" />
              Active Garment Processing Queue
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Advance garments through stages as physical work is completed on the floor.
            </p>
          </div>
          <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-md">
            {ordersQueue.length} Active Batches
          </span>
        </div>

        <div className="space-y-3">
          {ordersQueue.map((order) => {
            const isCompleted = order.stage === "Assembly & Rack";

            return (
              <div
                key={order.id}
                className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-primary)]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[var(--color-text)]">
                      {order.id}
                    </span>
                    <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                      • {order.customer} ({order.itemsCount} Items)
                    </span>

                    {order.isExpress && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-red-500/10 text-red-500 border border-red-500/20">
                        EXPRESS
                      </span>
                    )}

                    {order.hasSpecialCare && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        Spot Chemical Care
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] pt-1">
                    <span>
                      Current Stage:{" "}
                      <strong className="text-[var(--color-primary)]">{order.stage}</strong>
                    </span>
                    <span>• Target Due: {order.dueTime}</span>
                    {order.rackLocation && (
                      <span className="text-emerald-500 font-bold">• {order.rackLocation}</span>
                    )}
                  </div>
                </div>

                {/* STAGE ADVANCEMENT ACTION */}
                <button
                  disabled={!isClockedIn}
                  onClick={() => handleAdvanceStage(order.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    !isClockedIn
                      ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                      : isCompleted
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white shadow-sm"
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Placed on Rack
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" /> Move to Next Stage
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* STAFF REFERRAL SUMMARY MODAL */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="Personal Referral Performance & QR"
        description="Share your referral link or show your QR code to new customers during walk-in intake."
        size="md"
        footer={
          <Button variant="ghost" onClick={() => setIsQrModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
          <div className="p-4 rounded-2xl bg-white border-2 border-[var(--color-primary)] shadow-sm">
            <QrCode className="w-32 h-32 text-gray-900" />
          </div>

          <div>
            <span className="text-xs text-[var(--color-text-secondary)] block font-medium">Your Staff Promo Code</span>
            <span className="text-xl font-mono font-extrabold text-[var(--color-primary)] tracking-widest">
              STAFF-JOHN2026
            </span>
          </div>

          <div className="w-full grid grid-cols-3 gap-2 pt-2 border-t border-[var(--color-border)] text-xs">
            <div className="p-2 rounded-lg bg-[var(--color-bg)]">
              <span className="text-[10px] text-[var(--color-text-secondary)] block">Monthly Referrals</span>
              <span className="font-bold text-base">{monthlyReferrals.count}</span>
            </div>
            <div className="p-2 rounded-lg bg-[var(--color-bg)]">
              <span className="text-[10px] text-[var(--color-text-secondary)] block">Total Customer Spend</span>
              <span className="font-bold text-base text-emerald-500">${monthlyReferrals.revenueSpent.toFixed(0)}</span>
            </div>
            <div className="p-2 rounded-lg bg-[var(--color-bg)]">
              <span className="text-[10px] text-[var(--color-text-secondary)] block">Bonus Earned</span>
              <span className="font-bold text-base text-purple-500">${monthlyReferrals.commissionEarned.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* CLOCK IN / OUT CONFIRMATION MODAL */}
      <Modal
        isOpen={isClockModalOpen}
        onClose={() => setIsClockModalOpen(false)}
        title={isClockedIn ? "Confirm Clock-Out & Cash Tally" : "Confirm Clock-In"}
        description={
          isClockedIn
            ? "Ending your shift locks till transactions and tallies total walk-in orders."
            : "Clocking in enables POS transactions and assigns active floor tasks to your profile."
        }
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsClockModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={isClockedIn ? "outline" : "solid"}
              onClick={handleConfirmShiftToggle}
            >
              {isClockedIn ? "Confirm Clock Out" : "Confirm Clock In"}
            </Button>
          </>
        }
      >
        <div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs space-y-2">
          <p className="font-bold text-[var(--color-text)]">Active Shift Summary:</p>
          <ul className="list-disc list-inside space-y-1 text-[var(--color-text-secondary)]">
            <li>Operator: Floor Staff #1</li>
            <li>Walk-in Orders Handled Today: 12</li>
            <li>Register Status: Open</li>
          </ul>
        </div>
      </Modal>

      {/* REQUEST CHEMICALS & INVENTORY MODAL */}
      <Modal
        isOpen={isSupplyModalOpen}
        onClose={() => setIsSupplyModalOpen(false)}
        title="Request Floor Supplies & Chemicals"
        description="Notify store management when detergents, chemical spotters, or packaging stock run low."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsSupplyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="request-supply-form">
              Submit Requisition
            </Button>
          </>
        }
      >
        <form id="request-supply-form" onSubmit={handleRequestSupplies} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[var(--color-text)] mb-1">
              Select Supply Category
            </label>
            <select
              value={supplyCategory}
              onChange={(e) => setSupplyCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] font-medium"
            >
              <option value="detergent">Detergent & Fabric Softener</option>
              <option value="spotting_chemicals">Spotting Chemicals / Stain Removers</option>
              <option value="packaging">Poly-Tubing Covers & Hangers</option>
              <option value="barcodes">Thermal Printing Paper & Garment Tags</option>
              <option value="maintenance">Machine Maintenance / Repair Request</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[var(--color-text)] mb-1">
              Specific Item & Quantity Details
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Need 2 barrels of Commercial Liquid Detergent and 1 box of Stain Spotter Chem V-2..."
              value={supplyNote}
              onChange={(e) => setSupplyNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}