import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import { useStaff } from "@/context/StaffContext";
import {
  CheckCircle2,
  Clock,
  Check,
  Sparkles,
  ListTodo,
  Tag,
  ArrowLeft,
  ChevronRight,
  Camera,
} from "lucide-react";

export type ServiceType = "wash" | "iron" | "starch";

export interface GarmentItemDetail {
  id: string;
  category: string;
  quantity: number;
  services: ServiceType[];
  color: string;
  brand?: string;
  photoUrl?: string;
  itemNotes?: string;
  isCompleted: boolean;
}

export interface TaskItem {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  priority: "normal" | "express" | "urgent";
  status: "pending" | "in_progress" | "completed";
  dueTime: string;
  specialInstructions?: string;
  assignedStaffId: string;
  assignedStaffName: string;
  isFlagged?: boolean;
  items: GarmentItemDetail[];
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-01",
    orderId: "ORD-8821",
    customerName: "Sarah Jenkins",
    customerPhone: "+234 801 234 5678",
    priority: "express",
    status: "in_progress",
    dueTime: "11:30 AM Today",
    assignedStaffId: "stf-01",
    assignedStaffName: "Sarah J.",
    specialInstructions: "Customer requested extra attention on collar stains.",
    items: [
      {
        id: "g-101",
        category: "White Dress Shirt",
        quantity: 3,
        services: ["wash", "iron", "starch"],
        color: "Pure White",
        brand: "TM Lewin",
        photoUrl: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=400",
        itemNotes: "Heavy starch on collar and cuffs only",
        isCompleted: true,
      },
      {
        id: "g-102",
        category: "Trousers",
        quantity: 2,
        services: ["wash", "iron"],
        color: "Dark Navy",
        brand: "Zara",
        photoUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400",
        itemNotes: "Sharp crease on trouser front",
        isCompleted: false,
      },
    ],
  },
  {
    id: "task-02",
    orderId: "ORD-8824",
    customerName: "David Miller",
    customerPhone: "+234 802 345 6789",
    priority: "normal",
    status: "pending",
    dueTime: "02:00 PM Today",
    assignedStaffId: "stf-01",
    assignedStaffName: "Sarah J.",
    items: [
      {
        id: "g-201",
        category: "Casual T-Shirts",
        quantity: 10,
        services: ["wash"],
        color: "Assorted Colors",
        isCompleted: false,
      },
    ],
  },
  {
    id: "task-03",
    orderId: "ORD-8819",
    customerName: "Marcus Vance",
    customerPhone: "+234 804 567 8901",
    priority: "normal",
    status: "completed",
    dueTime: "10:00 AM Today",
    assignedStaffId: "stf-03",
    assignedStaffName: "David C.",
    items: [
      {
        id: "g-401",
        category: "Wool Sweaters",
        quantity: 5,
        services: ["wash", "iron"],
        color: "Grey & Maroon",
        isCompleted: true,
      },
    ],
  },
];

export function TaskPage() {
  const { activeStaff } = useStaff();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");
  const [scanQuery, setScanQuery] = useState("");
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<TaskItem | null>(null);

  // Directly update order status
  const handleUpdateStatus = (taskId: string, newStatus: TaskItem["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    if (selectedTaskDetail?.id === taskId) {
      setSelectedTaskDetail((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Toggle itemized garment completion state inside detail view
  const handleToggleGarmentComplete = (taskId: string, itemId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;

        const updatedItems = task.items.map((item) =>
          item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
        );

        const allItemsDone = updatedItems.every((item) => item.isCompleted);
        const newStatus: TaskItem["status"] = allItemsDone ? "completed" : "in_progress";

        const updatedTask: TaskItem = {
          ...task,
          items: updatedItems,
          status: newStatus,
        };

        if (selectedTaskDetail?.id === taskId) {
          setSelectedTaskDetail(updatedTask);
        }

        return updatedTask;
      })
    );
  };

  const myTasks = tasks.filter((task) => {
    const isAssigned = activeStaff?.role === "Manager" || task.assignedStaffId === activeStaff?.id;
    if (!isAssigned) return false;
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (scanQuery) {
      return (
        task.orderId.toLowerCase().includes(scanQuery.toLowerCase()) ||
        task.customerName.toLowerCase().includes(scanQuery.toLowerCase())
      );
    }
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  // ==========================================
  // VIEW: DEDICATED ITEMIZED ORDER DETAIL VIEW
  // ==========================================
  if (selectedTaskDetail) {
    const task = selectedTaskDetail;
    const completedGarments = task.items.filter((i) => i.isCompleted).length;
    const progressPercent = Math.round((completedGarments / task.items.length) * 100);

    return (
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto bg-[var(--color-background)] min-h-screen text-[var(--color-text)] transition-colors">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setSelectedTaskDetail(null)}
            className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Queue
          </button>

          {/* Direct Status Actions */}
          <div className="flex items-center gap-2">
            {task.status !== "completed" && (
              <Button
                variant="solid"
                size="sm"
                onClick={() => handleUpdateStatus(task.id, "completed")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>

        {/* Header Summary Banner */}
        <div className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] dark:border-slate-800 bg-[var(--color-surface)] dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-md border border-[var(--color-primary)]/20">
                  {task.orderId}
                </span>
                {task.priority === "express" && <Badge variant="danger" size="sm">Express</Badge>}
                <Badge variant={task.status === "completed" ? "success" : "primary"} size="sm">
                  {task.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text)] dark:text-white pt-1">
                {task.customerName}
              </h1>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Phone: <strong className="text-[var(--color-text)]">{task.customerPhone}</strong>
              </p>
            </div>

            <div className="flex flex-col md:items-end gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-amber-500 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20">
                <Clock className="w-4 h-4" />
                <span>Due: {task.dueTime}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-[var(--color-text-secondary)]">Processing Progress</span>
              <span className="text-[var(--color-primary)]">{completedGarments} of {task.items.length} Checked ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Items Checklist */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--color-text)] dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[var(--color-primary)]" />
            Itemized Garment Checklist ({task.items.length} Items)
          </h2>

          <div className="space-y-4">
            {task.items.map((item) => (
              <Card key={item.id} className="p-5 bg-[var(--color-surface)] dark:bg-slate-900 border-[var(--color-border)] dark:border-slate-800">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center shrink-0">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt={item.category} className="w-full h-full object-cover" />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-500" />
                      )}
                      <span className="absolute top-1 left-1 bg-black/80 text-white font-mono text-[10px] font-bold px-1 rounded">
                        {item.quantity}×
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[var(--color-text)] dark:text-white">{item.category}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)]">Color: <strong>{item.color}</strong></p>
                      <div className="flex items-center gap-1.5 pt-1">
                        {item.services.map((svc) => (
                          <span key={svc} className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleGarmentComplete(task.id, item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-colors ${
                      item.isCompleted ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    }`}
                  >
                    {item.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Check className="w-4 h-4 text-slate-400" />}
                    {item.isCompleted ? "Item Processed" : "Mark Processed"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN QUEUE & GRID VIEW
  // ==========================================
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[var(--color-background)] min-h-screen text-[var(--color-text)]">
      {/* Header Bar */}
      <div className="p-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] dark:border-slate-800 bg-[var(--color-surface)] dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-[var(--radius-md)] text-blue-500">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Active Processing Queue</h1>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Track and manage active garment orders in real time.
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800">
            {(["all", "pending", "in_progress", "completed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all capitalize ${
                  statusFilter === filter
                    ? "bg-slate-800 text-[var(--color-primary)] shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {filter.replace("_", " ")}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={scanQuery}
            onChange={(e) => setScanQuery(e.target.value)}
            placeholder="Search Order..."
            className="pl-3 pr-3 py-1.5 text-xs rounded-md bg-slate-950 border border-slate-800 text-slate-200"
          />
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Pending Jobs"
          value={pendingCount}
          icon={Clock}
          description="Waiting in queue"
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          icon={Sparkles}
          isPositive={true}
          description="Currently processing"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={CheckCircle2}
          isPositive={true}
          description="Ready for customer"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myTasks.map((task) => (
          <Card key={task.id} className="p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <button
                  onClick={() => setSelectedTaskDetail(task)}
                  className="text-xs font-bold text-[var(--color-primary)] font-mono flex items-center gap-1"
                >
                  {task.orderId} <ChevronRight className="w-3 h-3" />
                </button>
                <h3 onClick={() => setSelectedTaskDetail(task)} className="font-bold text-sm cursor-pointer hover:underline">
                  {task.customerName}
                </h3>
              </div>

              <Badge variant={task.status === "completed" ? "success" : task.status === "in_progress" ? "primary" : "warning"} size="sm">
                {task.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>

            {/* Quick Garment Summary */}
            <div onClick={() => setSelectedTaskDetail(task)} className="cursor-pointer space-y-1 bg-slate-950 p-2.5 rounded-md border border-slate-800">
              {task.items.map((item) => (
                <div key={item.id} className="text-xs flex justify-between">
                  <span>{item.quantity}× {item.category}</span>
                  <span className="text-slate-400 uppercase text-[10px]">{item.services.join(" + ")}</span>
                </div>
              ))}
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Due: {task.dueTime}</span>

              {task.status === "pending" && (
                <Button
                  size="sm"
                  variant="solid"
                  onClick={() => handleUpdateStatus(task.id, "in_progress")}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
                >
                  Start Processing
                </Button>
              )}

              {task.status === "in_progress" && (
                <Button
                  size="sm"
                  variant="solid"
                  onClick={() => handleUpdateStatus(task.id, "completed")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
                >
                  Mark Complete
                </Button>
              )}

              {task.status === "completed" && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TaskPage;