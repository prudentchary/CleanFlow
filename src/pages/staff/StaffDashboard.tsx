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
  Sparkles,
  Shirt,
  Tag,
  AlertCircle,
  Play,
  CheckCircle,
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

  // Modals
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [supplyNote, setSupplyNote] = useState("");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Shift Toggle Action
  const handleConfirmShiftToggle = () => {
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (isClockedIn) {
      setIsClockedIn(false);
      setClockInTime(null);
      showToast(`Clocked OUT at ${now}. Shift ended. Cash drawer locked.`, "info");
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
    showToast(`Searching ticket/phone: "${quickSearch}"...`, "info");
  };

  // Move Order to Next Stage Trigger
  const handleAdvanceStage = (orderId: string) => {
    setOrdersQueue((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          let nextStage = ord.stage;
          if (ord.stage === "Intake Tagging") nextStage = "Washing";
          else if (ord.stage === "Washing") nextStage = "Pressing";
          else if (ord.stage === "Pressing") nextStage = "Assembly & Rack";
          else if (ord.stage === "Assembly & Rack") {
            showToast(`Order ${ord.id} completed & assigned to rack!`, "success");
            return ord;
          }
          showToast(`Order ${ord.id} moved to ${nextStage}`, "info");
          return { ...ord, stage: nextStage };
        }
        return ord;
      })
    );
  };

  const handleReportSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplyNote.trim()) {
      showToast("Please enter issue details.", "error");
      return;
    }
    setIsReportModalOpen(false);
    setSupplyNote("");
    showToast("Issue alert dispatched to Store Manager!", "success");
  };

  const urgentExpressCount = ordersQueue.filter((o) => o.isExpress).length;

  return (
    <div className="space-y-6">
      {/* ACTION PROMPT BANNER: Express & Urgent Items */}
      {urgentExpressCount > 0 && isClockedIn && (
        <div className="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-red-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 shrink-0">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-2">
                Action Required: {urgentExpressCount} Express Priority Orders Pending
              </h4>
              <p className="text-xs opacity-90">
                Express orders need immediate processing to meet target drop-off / pickup deadlines.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white border-none font-bold shrink-0"
            onClick={() => showToast("Filtering queue by Express Orders...", "info")}
          >
            Work Express Queue First
          </Button>
        </div>
      )}

      {/* SHIFT STATUS ALERT BANNER */}
      {!isClockedIn && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Shift Inactive: Register is Locked</h4>
              <p className="text-xs opacity-90">
                You are currently clocked out. Please clock in to start processing orders or collecting payments.
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

      {/* TOP HEADER & REGISTER SUMMARY */}
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

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setIsQrModalOpen(true)}
              leftIcon={<QrCode className="w-4 h-4 text-purple-500" />}
            >
              Referral QR
            </Button>

            <Button
              variant="ghost"
              onClick={() => setIsReportModalOpen(true)}
              leftIcon={<Boxes className="w-4 h-4 text-amber-500" />}
            >
              Report Issue
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

        {/* WORK TRIGGER ACTION BAR */}
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
                <span className="text-xs font-bold block">New Order Drop-off</span>
                <span className="text-[10px] opacity-80">Start walk-in customer intake</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            disabled={!isClockedIn}
            onClick={() => showToast("Opening Rack Assembly Search...", "info")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isClockedIn
                ? "bg-[var(--color-bg)] hover:border-[var(--color-primary)] text-[var(--color-text)] border-[var(--color-border)]"
                : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag className="w-5 h-5 text-purple-500" />
              <div className="text-left">
                <span className="text-xs font-bold block">Tag & Bag Garments</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  Assign barcode tags & rack slots
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>

          <button
            disabled={!isClockedIn}
            onClick={() => showToast("Opening Quick Cash Collection...", "info")}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isClockedIn
                ? "bg-[var(--color-bg)] hover:border-[var(--color-primary)] text-[var(--color-text)] border-[var(--color-border)]"
                : "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              <div className="text-left">
                <span className="text-xs font-bold block">Collect Payment</span>
                <span className="text-[10px] text-[var(--color-text-secondary)]">
                  Settle unpaid pickup balances
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
          </button>
        </div>
      </div>

      {/* QUICK TICKET LOOKUP SEARCH */}
      <form
        onSubmit={handleQuickLookup}
        className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center gap-3 shadow-sm"
      >
        <Search className="w-5 h-5 text-[var(--color-text-secondary)] shrink-0" />
        <input
          type="text"
          placeholder="Instant Work Lookup: Scan Tag Barcode or Enter Phone / Tag ID / Rack Slot..."
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-text-secondary)] focus:outline-none"
        />
        <Button type="submit" size="sm">
          Find Ticket
        </Button>
      </form>

      {/* ACTIONABLE WORKFLOW METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Intake & Tagging Needed"
          value={ordersQueue.filter((o) => o.stage === "Intake Tagging").length}
          change="Awaiting garment tags"
          isPositive={false}
          icon={Tag}
        />

        <StatCard
          label="In Wash / Dry Cycle"
          value={ordersQueue.filter((o) => o.stage === "Washing").length}
          change="2 Machines running"
          isPositive={true}
          icon={Shirt}
        />

        <StatCard
          label="Pressing & Steam Stage"
          value={ordersQueue.filter((o) => o.stage === "Pressing").length}
          change="Ready for iron station"
          isPositive={true}
          icon={Sparkles}
        />

        <StatCard
          label="Unpaid Balance Orders"
          value="3 Orders"
          change="$85.00 Pending Collection"
          isPositive={false}
          icon={DollarSign}
        />
      </div>

      {/* INTERACTIVE MACHINE BAY PROMPTS */}
      <div className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> Active Machine Floor Status & Prompts
          </h3>
          <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
            Live Timers
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-between">
            <div>
              <span className="font-bold block">Washer #1 (Commercial)</span>
              <span className="text-[10px] opacity-80">Heavy Wash Cycle</span>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-sm block">12m</span>
              <span className="text-[9px] uppercase font-bold">Running</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-between">
            <div>
              <span className="font-bold block">Washer #2 (Delicates)</span>
              <span className="text-[10px] opacity-80">Cycle Finished!</span>
            </div>
            <Button
              size="sm"
              className="bg-amber-500 text-black border-none font-bold text-[10px] h-7 px-2"
              onClick={() => showToast("Unload prompt recorded. Move to Dryer #2.", "success")}
            >
              Unload Now
            </Button>
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-between">
            <div>
              <span className="font-bold block">Dryer #1</span>
              <span className="text-[10px] opacity-80">Lint Filter Warning</span>
            </div>
            <Flame className="w-4 h-4 text-red-500" />
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] flex items-center justify-between">
            <div>
              <span className="font-bold text-[var(--color-text)] block">Dryer #2</span>
              <span className="text-[10px]">Idle & Empty</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
              Ready
            </span>
          </div>
        </div>
      </div>

      {/* LIVE WORK QUEUE (Prompt to Advance Work) */}
      <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[var(--color-primary)]" />
              Active Garment Processing Queue
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Advance garments through stages as work is physically performed on the floor.
            </p>
          </div>
          <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-md">
            {ordersQueue.length} Active Tickets
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
                        Pre-Stain Care
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

                {/* WORK PROMPT ACTION BUTTON */}
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
                      <CheckCircle className="w-4 h-4" /> Ready on Rack
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

      {/* MY REFERRAL QR MODAL */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="My Referral Code & QR"
        description="Share your personal referral link or show this QR code to new customers to earn bonus points!"
        size="md"
        footer={
          <Button variant="ghost" onClick={() => setIsQrModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
          <div className="p-4 rounded-2xl bg-white border-2 border-[var(--color-primary)] shadow-sm">
            <QrCode className="w-32 h-32 text-gray-900" />
          </div>
          <div>
            <span className="text-xs text-[var(--color-text-secondary)] block font-medium">Your Staff Code</span>
            <span className="text-xl font-mono font-extrabold text-[var(--color-primary)] tracking-widest">
              STAFF-JOHN2026
            </span>
          </div>
        </div>
      </Modal>

      {/* CLOCK IN / OUT CONFIRMATION MODAL */}
      <Modal
        isOpen={isClockModalOpen}
        onClose={() => setIsClockModalOpen(false)}
        title={isClockedIn ? "Confirm Shift Clock-Out & Reconcile Cash" : "Confirm Shift Clock-In"}
        description={
          isClockedIn
            ? "Ending your shift locks the register. Please confirm cash drawer tally before proceeding."
            : "Clocking in unlocks POS operations and assigns shift duties to your profile."
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
          <p className="font-bold text-[var(--color-text)]">Shift Summary:</p>
          <ul className="list-disc list-inside space-y-1 text-[var(--color-text-secondary)]">
            <li>User: Floor Operator</li>
            <li>Status: Active Shift</li>
          </ul>
        </div>
      </Modal>

      {/* REPORT ISSUE MODAL */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Store Issue or Low Supply"
        description="Notify managers immediately about low chemicals or machine maintenance needs."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="report-supply-form">
              Send Alert
            </Button>
          </>
        }
      >
        <form id="report-supply-form" onSubmit={handleReportSupply} className="space-y-4">
          <input
            required
            type="text"
            placeholder="e.g. Out of poly-tubing covers at Station #1"
            value={supplyNote}
            onChange={(e) => setSupplyNote(e.target.value)}
            className="w-full p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-text)]"
          />
        </form>
      </Modal>
    </div>
  );
}