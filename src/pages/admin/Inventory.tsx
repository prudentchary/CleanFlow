import React, { useState } from "react";
import {
  Boxes,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  PackageX,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Reusable UI Components
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatCard from "@/components/ui/StatCard";

interface InventoryItem {
  id: string;
  name: string;
  category: "Chemicals & Detergents" | "Packaging & Covers" | "Tags & Labels" | "Hangers & Accessories";
  quantity: number;
  unit: string;
  minThreshold: number;
  lastRestocked: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "INV-101",
    name: "Commercial Grade Liquid Detergent",
    category: "Chemicals & Detergents",
    quantity: 45,
    unit: "Liters",
    minThreshold: 15,
    lastRestocked: "Sep 02, 2026",
  },
  {
    id: "INV-102",
    name: "Garment Poly-Tubing Covers (Clear)",
    category: "Packaging & Covers",
    quantity: 8,
    unit: "Rolls",
    minThreshold: 10, // Low stock flag
    lastRestocked: "Aug 20, 2026",
  },
  {
    id: "INV-103",
    name: "Waterproof Garment Identification Tags",
    category: "Tags & Labels",
    quantity: 1200,
    unit: "Tags",
    minThreshold: 300,
    lastRestocked: "Aug 28, 2026",
  },
  {
    id: "INV-104",
    name: "Wire Coat Hangers (Standard)",
    category: "Hangers & Accessories",
    quantity: 4,
    unit: "Boxes (500ct)",
    minThreshold: 5, // Low stock flag
    lastRestocked: "Aug 15, 2026",
  },
  {
    id: "INV-105",
    name: "Fabric Softener & Conditioner",
    category: "Chemicals & Detergents",
    quantity: 30,
    unit: "Liters",
    minThreshold: 10,
    lastRestocked: "Sep 05, 2026",
  },
];

export default function AdminInventory() {
  const { showToast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Modal State
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [restockAmount, setRestockAmount] = useState<string>("");

  // Metrics Calculations
  const totalItems = items.length;
  const lowStockItems = items.filter((item) => item.quantity <= item.minThreshold);
  const outOfStockItems = items.filter((item) => item.quantity === 0);

  const handleOpenRestock = (itemId: string) => {
    setSelectedItemId(itemId);
    setRestockAmount("");
    setIsRestockModalOpen(true);
  };

  const handleSaveRestock = (e: React.FormEvent) => {
    e.preventDefault();
    const addedQty = parseInt(restockAmount, 10);

    if (isNaN(addedQty) || addedQty <= 0) {
      showToast("Please enter a valid restock quantity.", "error");
      return;
    }

    const today = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              quantity: item.quantity + addedQty,
              lastRestocked: today,
            }
          : item
      )
    );

    setIsRestockModalOpen(false);
    showToast("Inventory quantity updated successfully!", "success");
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Inventory & Stock Management
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Monitor essential store supplies, chemical stock levels, and packaging materials.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tracked Items"
          value={totalItems}
          change="Active store supplies"
          isPositive={true}
          icon={Boxes}
        />

        <StatCard
          label="Optimal Stock"
          value={totalItems - lowStockItems.length}
          change="Sufficient supply"
          isPositive={true}
          icon={CheckCircle2}
        />

        <StatCard
          label="Low Stock Warnings"
          value={lowStockItems.length}
          change={lowStockItems.length > 0 ? "Requires restock" : "All clear"}
          isPositive={lowStockItems.length === 0}
          icon={AlertTriangle}
        />

        <StatCard
          label="Out of Stock"
          value={outOfStockItems.length}
          change={outOfStockItems.length > 0 ? "Critical deficit" : "Zero depleted"}
          isPositive={outOfStockItems.length === 0}
          icon={PackageX}
        />
      </div>

      {/* Main Stock Table Container */}
      <div className="p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search supply name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[var(--color-text-secondary)]" />}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-[var(--color-text-secondary)] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-3 text-xs font-bold rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="All">All Categories</option>
              <option value="Chemicals & Detergents">Chemicals & Detergents</option>
              <option value="Packaging & Covers">Packaging & Covers</option>
              <option value="Tags & Labels">Tags & Labels</option>
              <option value="Hangers & Accessories">Hangers & Accessories</option>
            </select>
          </div>
        </div>

        {/* Stock Ledger Table */}
        <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg">
          <table className="w-full text-left text-xs text-[var(--color-text)]">
            <thead className="bg-[var(--color-bg)] text-[var(--color-text-secondary)] uppercase font-bold border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3">Item ID</th>
                <th className="px-4 py-3">Supply Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Current Quantity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Restocked</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[var(--color-text-secondary)]">
                    No inventory records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.quantity <= item.minThreshold;
                  const isDepleted = item.quantity === 0;

                  return (
                    <tr key={item.id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-secondary)]">
                        {item.id}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[var(--color-text)]">
                        {item.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3">
                        {isDepleted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Low Stock (&le; {item.minThreshold})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            Healthy Stock
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                        {item.lastRestocked}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          onClick={() => handleOpenRestock(item.id)}
                          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                        >
                          Add Stock
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Quantity Modal */}
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        title="Update Supply Stock"
        description="Add newly received units to the store inventory count."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRestockModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="restock-inventory-form">
              Confirm Restock
            </Button>
          </>
        }
      >
        <form id="restock-inventory-form" onSubmit={handleSaveRestock} className="space-y-4">
          <Input
            label="Additional Quantity Received *"
            required
            type="number"
            min="1"
            placeholder="e.g. 20"
            value={restockAmount}
            onChange={(e) => setRestockAmount(e.target.value)}
            leftIcon={<Plus className="w-4 h-4 text-[var(--color-text-secondary)]" />}
          />
        </form>
      </Modal>
    </div>
  );
}