import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import type { QueueItem, ProcessingStatus } from "@/types/queue";
import { useStaff } from "@/context/StaffContext";
import {
  WashingMachine,
  Wind,
  Shirt,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  MapPin,
  Flag,
} from "lucide-react";

const INITIAL_QUEUE: QueueItem[] = [
  {
    id: "q-101",
    orderId: "ORD-8821",
    customerName: "Sarah Jenkins",
    itemsSummary: "3 Shirts, 2 Trousers",
    specialInstructions: "Light starch on dress shirts",
    isExpress: true,
    promisedTime: "5:00 PM Today",
    status: "washing",
    assignments: {
      washAndStarch: {
        staffId: "stf-01",
        staffName: "Sarah J.",
        assignedAt: "09:00 AM",
      },
      pressAndPackage: {
        staffId: "stf-03",
        staffName: "David C.",
        assignedAt: "09:00 AM",
      },
    },
  },
  {
    id: "q-102",
    orderId: "ORD-8822",
    customerName: "Michael Brown",
    itemsSummary: "1 Suit (2-piece), 1 Tie",
    isExpress: false,
    promisedTime: "Tomorrow 12:00 PM",
    status: "received",
    assignments: {
      washAndStarch: {
        staffId: "stf-02",
        staffName: "Alex R.",
        assignedAt: "09:30 AM",
      },
      pressAndPackage: {
        staffId: "stf-04",
        staffName: "Emma W.",
        assignedAt: "09:30 AM",
      },
    },
  },
  {
    id: "q-103",
    orderId: "ORD-8823",
    customerName: "Elena Rostova",
    itemsSummary: "1 Silk Dress",
    specialInstructions: "Delicate steam only",
    isExpress: false,
    promisedTime: "Tomorrow 3:00 PM",
    status: "quality_check",
    hasIssue: true,
    issueNote: "Minor stubborn stain on hem",
    assignments: {
      washAndStarch: {
        staffId: "stf-01",
        staffName: "Sarah J.",
        assignedAt: "08:00 AM",
      },
      pressAndPackage: {
        staffId: "stf-03",
        staffName: "David C.",
        assignedAt: "08:00 AM",
      },
    },
  },
];

const COLUMNS: {
  id: ProcessingStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "received", title: "Received", icon: Clock },
  { id: "washing", title: "Wash & Starch", icon: WashingMachine },
  { id: "drying", title: "Drying / Steam", icon: Wind },
  { id: "quality_check", title: "Quality Check", icon: Shirt },
  { id: "ready", title: "Ready for Pickup", icon: CheckCircle2 },
];

const STAGE_ORDER: ProcessingStatus[] = [
  "received",
  "washing",
  "drying",
  "quality_check",
  "ready",
];

export function ProcessingQueuePage() {
  const { activeStaff } = useStaff();
  const [items, setItems] = useState<QueueItem[]>(INITIAL_QUEUE);
  const [filterExpress, setFilterExpress] = useState(false);

  // Modal States
  const [rackModalItem, setRackModalItem] = useState<{
    id: string;
    orderId: string;
  } | null>(null);
  const [rackInput, setRackInput] = useState("");

  const [issueModalItem, setIssueModalItem] = useState<{
    id: string;
    orderId: string;
  } | null>(null);
  const [issueNoteInput, setIssueNoteInput] = useState("");

  // Step advancement handler
  const handleAdvance = (itemId: string, currentStatus: ProcessingStatus) => {
    const currentIndex = STAGE_ORDER.indexOf(currentStatus);
    if (currentIndex < STAGE_ORDER.length - 1) {
      const nextStatus = STAGE_ORDER[currentIndex + 1];

      // If moving to 'ready', prompt for Rack Location Modal
      if (nextStatus === "ready") {
        const itemToAdvance = items.find((i) => i.id === itemId);
        if (itemToAdvance) {
          setRackModalItem({
            id: itemToAdvance.id,
            orderId: itemToAdvance.orderId,
          });
          setRackInput("");
          return;
        }
      }

      // Otherwise, advance normally
      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, status: nextStatus } : item,
        ),
      );
    }
  };

  // Submit Rack Location
  const handleConfirmRack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rackModalItem || !rackInput.trim()) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === rackModalItem.id
          ? {
              ...item,
              status: "ready",
              rackLocation: rackInput.trim().toUpperCase(),
            }
          : item,
      ),
    );
    setRackModalItem(null);
    setRackInput("");
  };

  // Flag an Issue / Stain
  const handleFlagIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueModalItem || !issueNoteInput.trim()) return;

    setItems((prev) =>
      prev.map((item) =>
        item.id === issueModalItem.id
          ? { ...item, hasIssue: true, issueNote: issueNoteInput.trim() }
          : item,
      ),
    );
    setIssueModalItem(null);
    setIssueNoteInput("");
  };

  // Filter items based on active staff role
  const visibleItems = items.filter((item) => {
    if (filterExpress && !item.isExpress) return false;
    if (!activeStaff) return true;

    if (activeStaff.role === "Manager" || activeStaff.role === "Cashier")
      return true;

    const isAssignedWash =
      item.assignments.washAndStarch.staffId === activeStaff.id;
    const isAssignedPress =
      item.assignments.pressAndPackage.staffId === activeStaff.id;

    if (
      isAssignedWash &&
      (item.status === "received" || item.status === "washing")
    )
      return true;
    if (
      isAssignedPress &&
      (item.status === "drying" ||
        item.status === "quality_check" ||
        item.status === "ready")
    )
      return true;

    return false;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Info & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Processing Queue</h1>
            <p className="text-xs text-slate-400">
              Logged in as{" "}
              <span className="text-blue-400 font-semibold">
                {activeStaff?.name || "Staff Member"}
              </span>
              {activeStaff?.role && (
                <span className="text-slate-500"> ({activeStaff.role})</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={filterExpress ? "solid" : "outline"}
            onClick={() => setFilterExpress(!filterExpress)}
            className={`text-xs ${
              filterExpress
                ? "bg-rose-600 hover:bg-rose-700 text-white border-none"
                : "text-slate-300 border-slate-700 hover:bg-slate-800"
            }`}
          >
            ⚡ {filterExpress ? "Showing Express Only" : "Filter Express"}
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colItems = visibleItems.filter(
            (item) => item.status === col.id,
          );
          const Icon = col.icon;

          return (
            <div
              key={col.id}
              className="bg-slate-900/40 p-3 rounded-2xl flex flex-col min-h-[550px] border border-slate-800"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <h2 className="font-semibold text-sm text-slate-200">
                    {col.title}
                  </h2>
                </div>
                <Badge variant="neutral" size="sm">
                  {colItems.length}
                </Badge>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colItems.map((item) => {
                  const isCurrentStaffWash =
                    item.assignments.washAndStarch.staffId === activeStaff?.id;
                  const isCurrentStaffPress =
                    item.assignments.pressAndPackage.staffId ===
                    activeStaff?.id;

                  return (
                    <Card
                      key={item.id}
                      className={`p-4 space-y-3 bg-slate-800/90 border-slate-700/60 shadow-sm relative ${
                        item.hasIssue ? "border-l-4 border-l-red-500" : ""
                      }`}
                    >
                      {/* Customer & Express Priority Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                              {item.orderId}
                            </span>
                            {/* Time-in-Stage Badge */}
                            <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700/60 flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> 45m in stage
                            </span>
                          </div>
                          <h3 className="font-semibold text-sm text-white">
                            {item.customerName}
                          </h3>
                        </div>
                        {item.isExpress && (
                          <Badge variant="danger" size="sm">
                            Express
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 font-medium">
                        {item.itemsSummary}
                      </p>

                      {item.specialInstructions && (
                        <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-900/50">
                          ⚠️ {item.specialInstructions}
                        </p>
                      )}

                      {/* Issue Display */}
                      {item.hasIssue && (
                        <div className="flex items-center gap-1.5 text-[11px] text-red-400 bg-red-950/40 p-2 rounded border border-red-900/50">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.issueNote}</span>
                        </div>
                      )}

                      {/* Rack Location Badge (If assigned) */}
                      {item.rackLocation && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-900/50 font-semibold">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Rack: {item.rackLocation}</span>
                        </div>
                      )}

                      {/* Staff Station Breakdown */}
                      <div className="pt-2 border-t border-slate-700/60 space-y-1 text-[11px]">
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1">
                            <WashingMachine className="w-3 h-3 text-blue-400" />{" "}
                            Wash:
                          </span>
                          <span
                            className={
                              isCurrentStaffWash
                                ? "text-blue-400 font-bold"
                                : "text-slate-300"
                            }
                          >
                            {item.assignments.washAndStarch.staffName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="flex items-center gap-1">
                            <Shirt className="w-3 h-3 text-emerald-400" />{" "}
                            Press:
                          </span>
                          <span
                            className={
                              isCurrentStaffPress
                                ? "text-emerald-400 font-bold"
                                : "text-slate-300"
                            }
                          >
                            {item.assignments.pressAndPackage.staffName}
                          </span>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-2 flex items-center gap-2">
                        {item.status !== "ready" && (
                          <Button
                            variant="solid"
                            size="sm"
                            className="flex-1 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleAdvance(item.id, item.status)}
                          >
                            Advance ➔
                          </Button>
                        )}

                        {/* Report Issue Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setIssueModalItem({
                              id: item.id,
                              orderId: item.orderId,
                            });
                            setIssueNoteInput(item.issueNote || "");
                          }}
                          className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-red-400 transition-colors"
                          title="Report Issue / Stain"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  );
                })}

                {colItems.length === 0 && (
                  <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
                    <p className="text-xs text-slate-500">
                      No active tasks at this station
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- RACK LOCATION ASSIGNMENT MODAL --- */}
      {rackModalItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <MapPin className="w-5 h-5" /> Assign Rack Location
            </div>
            <p className="text-xs text-slate-400">
              Assign a storage rack slot for{" "}
              <span className="text-white font-medium">
                {rackModalItem.orderId}
              </span>{" "}
              before sending to pickup queue.
            </p>
            <form onSubmit={handleConfirmRack} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. RACK-A-12"
                value={rackInput}
                onChange={(e) => setRackInput(e.target.value)}
                autoFocus
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white uppercase focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRackModalItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Confirm & Complete
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- FLAG ISSUE / STAIN MODAL --- */}
      {issueModalItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 font-bold text-lg">
              <AlertTriangle className="w-5 h-5" /> Flag Garment Issue
            </div>
            <p className="text-xs text-slate-400">
              Report a stain, damage, or re-wash requirement for{" "}
              <span className="text-white font-medium">
                {issueModalItem.orderId}
              </span>
              .
            </p>
            <form onSubmit={handleFlagIssue} className="space-y-4">
              <textarea
                placeholder="Describe the stain or issue..."
                value={issueNoteInput}
                onChange={(e) => setIssueNoteInput(e.target.value)}
                rows={3}
                autoFocus
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIssueModalItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Save Issue Flag
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcessingQueuePage;
