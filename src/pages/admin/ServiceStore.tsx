import React, { useState } from "react";
import {
  Plus,
  Search,
  Shirt,
  Home as HomeIcon,
  Sparkles,
  Edit2,
  Trash2,
  Power,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useServices } from "@/hooks/useServices"; // 1. IMPORT HOOK

// UI Components
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";

// --- TYPES & INTERFACES ---
type ServiceCategory = "Fabrics" | "House Cleaning";

interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  unitLabel: string;
  description: string;
  turnaround: string;
  popular: boolean;
  isActive: boolean;
}

export default function ServiceAndPricing() {
  const { showToast } = useToast();

  // 2. USE SHARED CONTEXT INSTEAD OF LOCAL STATE
  const {
    services,
    addService,
    updateService,
    toggleServiceActive,
    deleteService,
  } = useServices();

  // Local UI State (Filters & Modal inputs stay local to this page)
  const [selectedCategory, setSelectedCategory] = useState<"All" | ServiceCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    name: string;
    category: ServiceCategory;
    price: string;
    unitLabel: string;
    description: string;
    turnaround: string;
    popular: boolean;
  }>({
    name: "",
    category: "Fabrics",
    price: "",
    unitLabel: "per piece",
    description: "",
    turnaround: "24-48 hrs",
    popular: false,
  });

  // Open Modal for Create or Edit
  const handleOpenModal = (service?: ServiceItem) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price.toString(),
        unitLabel: service.unitLabel,
        description: service.description,
        turnaround: service.turnaround,
        popular: service.popular,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: "",
        category: "Fabrics",
        price: "",
        unitLabel: "per piece",
        description: "",
        turnaround: "24-48 hrs",
        popular: false,
      });
    }
    setIsModalOpen(true);
  };

  // Save (Create or Update) Service
  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(formData.price);

    if (!formData.name.trim() || isNaN(parsedPrice)) {
      showToast("Please provide a valid service name and price.", "error");
      return;
    }

    if (editingService) {
      // 3. CALL CONTEXT UPDATE METHOD
      updateService(editingService.id, {
        ...formData,
        price: parsedPrice,
      });
      showToast(`Updated "${formData.name}" successfully!`, "success");
    } else {
      // 4. CALL CONTEXT ADD METHOD
      addService({
        name: formData.name,
        category: formData.category,
        price: parsedPrice,
        unitLabel: formData.unitLabel,
        description: formData.description,
        turnaround: formData.turnaround,
        popular: formData.popular,
      });
      showToast(`Added "${formData.name}" to price list!`, "success");
    }

    setIsModalOpen(false);
  };

  // Toggle Active Status
  const handleToggleActive = (id: string, currentState: boolean) => {
    // 5. CALL CONTEXT TOGGLE METHOD
    toggleServiceActive(id);
    showToast(
      `Service ${!currentState ? "enabled" : "disabled"}`,
      !currentState ? "success" : "info"
    );
  };

  // Delete Service
  const handleDeleteService = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      // 6. CALL CONTEXT DELETE METHOD
      deleteService(id);
      showToast(`Deleted "${name}"`, "success");
    }
  };

  // Filter Logic
  const filteredServices = services.filter((srv) => {
    const matchesCategory =
      selectedCategory === "All" || srv.category === selectedCategory;
    const matchesSearch =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Service & Pricing Management
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Configure offered services, base rates, turnaround times, and availability.
          </p>
        </div>

        <Button
          onClick={() => handleOpenModal()}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Service
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-x-auto">
          {(["All", "Fabrics", "House Cleaning"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[var(--color-primary)] text-white shadow-sm"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <Input
            type="text"
            placeholder="Search price list..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[var(--color-text-secondary)]" />}
          />
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className={`relative p-5 rounded-[var(--radius-md)] border bg-[var(--color-surface)] flex flex-col justify-between shadow-sm transition-all ${
              srv.isActive
                ? "border-[var(--color-border)] hover:border-[var(--color-primary)]"
                : "border-red-900/30 opacity-60 bg-red-950/5"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {srv.category === "Fabrics" ? (
                    <Shirt className="w-3.5 h-3.5 text-blue-500" />
                  ) : (
                    <HomeIcon className="w-3.5 h-3.5 text-emerald-500" />
                  )}
                  {srv.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {srv.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleActive(srv.id, srv.isActive)}
                    title={srv.isActive ? "Disable Service" : "Enable Service"}
                    className={`p-1 rounded-md transition-colors ${
                      srv.isActive
                        ? "text-emerald-400 hover:bg-emerald-500/10"
                        : "text-red-400 hover:bg-red-500/10"
                    }`}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-bold text-[var(--color-text)]">{srv.name}</h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                {srv.description || "No description provided."}
              </p>

              <div className="mt-3 text-[11px] text-[var(--color-text-secondary)] font-medium">
                Est. Turnaround: <span className="text-[var(--color-text)] font-semibold">{srv.turnaround}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-[var(--color-primary)]">
                  ${srv.price.toFixed(2)}
                </span>
                <span className="text-[11px] text-[var(--color-text-secondary)] ml-1 font-medium">
                  {srv.unitLabel}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenModal(srv)}
                  className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all"
                  title="Edit Service"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteService(srv.id, srv.name)}
                  className="p-1.5 rounded-lg border border-[var(--color-border)] text-red-400 hover:text-red-300 hover:border-red-500 transition-all"
                  title="Delete Service"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? "Edit Service Item" : "Create New Service"}
        description="Update your catalog rates and turnaround terms."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="service-form">
              {editingService ? "Save Changes" : "Create Service"}
            </Button>
          </>
        }
      >
        <form id="service-form" onSubmit={handleSaveService} className="space-y-4">
          <Input
            label="Service / Garment Name *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. 2-Piece Suit, Luxury Silk Dress"
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--color-text)]">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ServiceCategory })
                }
                className="w-full p-2.5 text-xs rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="Fabrics">Fabrics</option>
                <option value="House Cleaning">House Cleaning</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[var(--color-text)]">
                Unit Label *
              </label>
              <select
                value={formData.unitLabel}
                onChange={(e) => setFormData({ ...formData, unitLabel: e.target.value })}
                className="w-full p-2.5 text-xs rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="per piece">per piece</option>
                <option value="per pair">per pair</option>
                <option value="per set">per set</option>
                <option value="per room">per room</option>
                <option value="per kg">per kg</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($) *"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
            />

            <Input
              label="Turnaround Time"
              value={formData.turnaround}
              onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
              placeholder="e.g. 24-48 hrs, Same day"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--color-text)]">
              Service Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe standard treatments included in this price..."
              className="w-full p-2.5 text-xs rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] text-[var(--color-text)]"
              rows={3}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={formData.popular}
              onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
              className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-0"
            />
            <span className="text-xs font-medium text-[var(--color-text)]">
              Mark as &quot;Popular&quot; item on POS menus
            </span>
          </label>
        </form>
      </Modal>
    </div>
  );
}