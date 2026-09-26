import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  Droplets,
  Flame,
  Printer,
  Tag,
  Camera,
  MapPin,
  Check,
//   RotateCcw,
//   User,
  ShieldAlert,
} from "lucide-react";

export type ServiceType = "wash" | "iron" | "starch";

export interface GarmentItemDetail {
  id: string;
  category: string; // e.g., "Native Dress (Buba)", "Dress Shirt"
  quantity: number;
  services: ServiceType[];
  color: string;
  brand?: string;
  photoUrl: string; // URL or placeholder to garment image
  itemNotes?: string;
  isCompleted: boolean;
}

export interface OrderProcessingDetail {
  orderId: string;
  customerName: string;
  customerPhone: string;
  priority: "normal" | "express" | "urgent";
  status: "pending" | "in_progress" | "completed";
  dueTime: string;
  generalInstructions?: string;
  rackLocation?: string;
  assignedStaff: string;
  items: GarmentItemDetail[];
}

// Mock initial data reflecting realistic mixed dry-cleaning items
const MOCK_ORDER_DETAIL: OrderProcessingDetail = {
  orderId: "ORD-8821",
  customerName: "Sarah Jenkins",
  customerPhone: "+234 801 234 5678",
  priority: "express",
  status: "in_progress",
  dueTime: "11:30 AM Today",
  generalInstructions: "Customer requested extra attention on collar stains.",
  rackLocation: "RACK-A-12",
  assignedStaff: "Sarah J. (Station 2)",
  items: [
    {
      id: "garment-101",
      category: "White Dress Shirt",
      quantity: 2,
      services: ["wash", "iron", "starch"],
      color: "Pure White",
      brand: "TM Lewin",
      photoUrl: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&q=80&w=400",
      itemNotes: "Heavy starch on collar and cuffs only",
      isCompleted: true,
    },
    {
      id: "garment-102",
      category: "Native Wear (Buba & Sokoto)",
      quantity: 1,
      services: ["iron", "starch"], // Starch & Iron Only (No Washing)
      color: "Royal Blue / Gold Trim",
      brand: "Bespoke",
      photoUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=400",
      itemNotes: "DO NOT WASH. Iron & starch spray only as requested.",
      isCompleted: false,
    },
    {
      id: "garment-103",
      category: "Silk Evening Gown",
      quantity: 1,
      services: ["iron"], // Ironing / Steam Press Only
      color: "Emerald Green",
      brand: "Zara",
      photoUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=400",
      itemNotes: "Delicate silk steam press only. No starch spray.",
      isCompleted: false,
    },
    {
      id: "garment-104",
      category: "Casual Denim Jeans",
      quantity: 2,
      services: ["wash"], // Wash Only
      color: "Dark Blue Denim",
      brand: "Levi's",
      photoUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=400",
      itemNotes: "Wash and tumble dry only. Do not iron or starch.",
      isCompleted: false,
    },
  ],
};

export function OrderItemizedPage() {
  const [order, setOrder] = useState<OrderProcessingDetail>(MOCK_ORDER_DETAIL);

  // Toggle individual garment item completion state
  const handleToggleGarmentComplete = (itemId: string) => {
    setOrder((prev) => {
      const updatedItems = prev.items.map((item) =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      );

      // Automatically update overall order status if all items are completed
      const allDone = updatedItems.every((i) => i.isCompleted);
      return {
        ...prev,
        items: updatedItems,
        status: allDone ? "completed" : "in_progress",
      };
    });
  };

  // Printable tag summary for physical garment attachments
  const handlePrintGarmentTags = () => {
    const printContent = order.items
      .map(
        (item, idx) =>
          `[TAG #${idx + 1}] ${order.orderId} - ${order.customerName}\nItem: ${item.quantity}x ${item.category} (${item.color})\nServices: ${item.services.join(" + ").toUpperCase()}\nNote: ${item.itemNotes || "None"}\n`
      )
      .join("\n----------------------------------------\n");

    alert(`Printing Individual Garment Tags:\n\n${printContent}`);
  };

  const completedCount = order.items.filter((i) => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / order.items.length) * 100);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto bg-[var(--color-background)] min-h-screen text-[var(--color-text)] transition-colors">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Actionable Tasks
        </button>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrintGarmentTags}
          >
            Print Garment Tags
          </Button>
        </div>
      </div>

      {/* Main Order Header Banner */}
      <div className="p-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] dark:border-slate-800 bg-[var(--color-surface)] dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2.5 py-1 rounded-md border border-[var(--color-primary)]/20">
                {order.orderId}
              </span>
              {order.priority === "express" && <Badge variant="danger" size="sm">Express Priority</Badge>}
              {order.priority === "urgent" && <Badge variant="warning" size="sm">Urgent Priority</Badge>}
              <Badge
                variant={order.status === "completed" ? "success" : "primary"}
                size="sm"
              >
                {order.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] dark:text-white flex items-center gap-2 pt-1">
              {order.customerName}
            </h1>
            <p className="text-xs text-[var(--color-text-secondary)] flex items-center gap-4">
              <span>Contact: <strong className="text-[var(--color-text)]">{order.customerPhone}</strong></span>
              <span>•</span>
              <span>Assigned: <strong className="text-[var(--color-primary)]">{order.assignedStaff}</strong></span>
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-500 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-md border border-amber-500/20">
              <Clock className="w-4 h-4" />
              <span>Due: {order.dueTime}</span>
            </div>
            {order.rackLocation && (
              <div className="flex items-center gap-1.5 text-emerald-500 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
                <MapPin className="w-4 h-4" />
                <span>Target Rack: {order.rackLocation}</span>
              </div>
            )}
          </div>
        </div>

        {/* Processing Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-[var(--color-text-secondary)]">Garment Station Completion</span>
            <span className="text-[var(--color-primary)]">{completedCount} of {order.items.length} Checked ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Global Special Order Notes */}
        {order.generalInstructions && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-[var(--radius-md)] text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">General Order Requirement:</strong>
              <span>{order.generalInstructions}</span>
            </div>
          </div>
        )}
      </div>

      {/* Garments List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--color-text)] dark:text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-[var(--color-primary)]" />
            Itemized Garment Checklist ({order.items.length} Line Items)
          </h2>
          <span className="text-xs text-[var(--color-text-secondary)]">
            Click garment status button when item processing is finished at your station.
          </span>
        </div>

        {/* Garments Grid / List Cards */}
        <div className="space-y-4">
          {order.items.map((item) => {
            const hasWash = item.services.includes("wash");
            const hasIron = item.services.includes("iron");
            const hasStarch = item.services.includes("starch");

            return (
              <Card
                key={item.id}
                className={`p-5 transition-all ${
                  item.isCompleted
                    ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/30"
                    : "bg-[var(--color-surface)] dark:bg-slate-900 border-[var(--color-border)] dark:border-slate-800"
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  
                  {/* Garment Image & Basic Info */}
                  <div className="flex items-start gap-4">
                    {/* Picture Preview */}
                    <div className="relative group w-24 h-24 rounded-lg overflow-hidden border border-slate-700 shrink-0 bg-slate-950 flex items-center justify-center">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.category}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Camera className="w-8 h-8 text-slate-500" />
                      )}
                      <span className="absolute top-1 left-1 bg-black/75 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {item.quantity}×
                      </span>
                    </div>

                    {/* Garment Title & Identifiers */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[var(--color-text)] dark:text-white">
                          {item.category}
                        </h3>
                        {item.brand && (
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                            {item.brand}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--color-text-secondary)]">
                        Color / Pattern: <strong className="text-[var(--color-text)]">{item.color}</strong>
                      </p>

                      {/* Required Treatment Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {hasWash && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400">
                            <Droplets className="w-3.5 h-3.5" /> Wash
                          </span>
                        )}
                        {hasIron && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                            <Flame className="w-3.5 h-3.5" /> Iron / Press
                          </span>
                        )}
                        {hasStarch && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400">
                            <Sparkles className="w-3.5 h-3.5" /> Starch Spray
                          </span>
                        )}

                        {/* Summary badge pill */}
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                          (
                          {hasWash && hasIron && hasStarch && "Full Wash, Iron & Starch"}
                          {hasWash && hasStarch && !hasIron && "Wash & Starch Only"}
                          {hasWash && hasIron && !hasStarch && "Wash & Iron"}
                          {hasWash && !hasIron && !hasStarch && "Wash Only"}
                          {!hasWash && hasIron && hasStarch && "Starch & Iron Only"}
                          {!hasWash && hasIron && !hasStarch && "Ironing Only"}
                          )
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specific Instructions & Action Toggle */}
                  <div className="flex flex-col md:items-end justify-between gap-3 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                    
                    {/* Item specific notes */}
                    {item.itemNotes ? (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-[var(--radius-md)] text-amber-600 dark:text-amber-400 text-xs max-w-sm flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{item.itemNotes}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No special garment note</span>
                    )}

                    {/* Garment Completion Button */}
                    <button
                      onClick={() => handleToggleGarmentComplete(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] text-xs font-bold transition-all shadow-sm ${
                        item.isCompleted
                          ? "bg-emerald-600 text-white hover:bg-emerald-500"
                          : "bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      {item.isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-white" /> Item Processed
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-slate-400" /> Mark as Processed
                        </>
                      )}
                    </button>

                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default OrderItemizedPage;