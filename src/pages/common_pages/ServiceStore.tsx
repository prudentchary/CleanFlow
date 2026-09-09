import React, { useState, useRef, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Sparkles,
  Store,
  Shirt,
  Home as HomeIcon,
  Search,
  User,
  Camera,
  X,
  ImageIcon,
  Printer,
  Phone,
  Mail,
  Check,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Reusable UI Components
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// --- TYPES & INTERFACES ---
type ServiceCategory = "All" | "Fabrics" | "House Cleaning";
type PaymentMethod = "Cash" | "Card / POS" | "Transfer" | "Unpaid";

interface ServiceItem {
  id: string;
  name: string;
  category: "Fabrics" | "House Cleaning";
  price: number;
  unitLabel: string;
  description: string;
  turnaround: string;
  popular?: boolean;
}

// 1. Service Item Interface
interface ServiceItem {
  id: string;
  name: string;
  category: "Fabrics" | "House Cleaning";
  price: number;
  unitLabel: string;
  description: string;
  turnaround: string;
  popular?: boolean;
}

// 2. Cart Item Interface (Must come BEFORE CompletedOrder)
interface CartItem {
  service: ServiceItem;
  quantity: number;
  note?: string;
  images: File[];
}

// 3. Completed Order Interface
interface CompletedOrder {
  ticketId: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  };
  cart: CartItem[];
  paymentMethod: PaymentMethod;
  total: number;
  totalItems: number;
}
interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

// --- MOCK DATA ---
const CLEAN_FLOW_SERVICES: ServiceItem[] = [
  // FABRICS
  {
    id: "srv-fb-1",
    name: "T-Shirt / Polo",
    category: "Fabrics",
    price: 3.5,
    unitLabel: "per piece",
    description: "Wash, press, and fold or hanger placement.",
    turnaround: "24-48 hrs",
    popular: true,
  },
  {
    id: "srv-fb-2",
    name: "Joggers / Sweatpants",
    category: "Fabrics",
    price: 4.5,
    unitLabel: "per pair",
    description: "Gentle wash with fabric softening and neat fold.",
    turnaround: "24-48 hrs",
  },
  {
    id: "srv-fb-3",
    name: "Corporate Shirt / Blouse",
    category: "Fabrics",
    price: 4.0,
    unitLabel: "per piece",
    description: "Starch treatment option, precise collar pressing, and hanger.",
    turnaround: "24-48 hrs",
    popular: true,
  },
  {
    id: "srv-fb-4",
    name: "2-Piece Corporate Suit",
    category: "Fabrics",
    price: 18.0,
    unitLabel: "per set",
    description: "Eco dry cleaning, delicate hand pressing, suit cover included.",
    turnaround: "48 hrs",
  },
  {
    id: "srv-fb-5",
    name: "2-Piece Native Set (Kaftan / Senator)",
    category: "Fabrics",
    price: 12.0,
    unitLabel: "per set",
    description: "Special hand wash / dry clean for delicate embroidery and crisp finish.",
    turnaround: "48 hrs",
    popular: true,
  },
  {
    id: "srv-fb-6",
    name: "Agbada (3-Piece Complete Set)",
    category: "Fabrics",
    price: 22.0,
    unitLabel: "per set",
    description: "Delicate embroidery care, specialized pressing, and garment bag packaging.",
    turnaround: "48-72 hrs",
  },
  // HOUSE CLEANING
  {
    id: "srv-hc-1",
    name: "Deep Carpet Steam Refresh",
    category: "House Cleaning",
    price: 75.0,
    unitLabel: "per room",
    description: "On-site deep extraction steam cleaning and deodorizing.",
    turnaround: "Same day",
  },
  {
    id: "srv-hc-2",
    name: "Full Home Turnover Cleaning",
    category: "House Cleaning",
    price: 150.0,
    unitLabel: "base rate",
    description: "Complete surface sanitization, dusting, vacuuming, and trash removal.",
    turnaround: "Scheduled day",
  },
  {
    id: "srv-hc-3",
    name: "Upholstery & Sofa Deep Clean",
    category: "House Cleaning",
    price: 45.0,
    unitLabel: "per seat",
    description: "Fabric extraction cleaning, stain treatment, and odor removal.",
    turnaround: "Same day",
  },
];

const MOCK_CUSTOMERS: MockCustomer[] = [
  { id: "c1", name: "John Doe", phone: "+1 555-0199", email: "john.doe@example.com", address: "123 Main St" },
  { id: "c2", name: "Sarah Connor", phone: "+1 555-0144", email: "sarah.c@example.com", address: "456 Oak Ave" },
  { id: "c3", name: "David Miller", phone: "+1 555-0188", email: "david.m@example.com", address: "789 Pine Rd" },
];

export default function ServiceStore() {
  const { showToast } = useToast();

  // Mode & Filters
  const [mode, setMode] = useState<"pos" | "online">("pos");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Cart & Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
 const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  // Separate File Input Refs for Camera vs. Gallery
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadServiceId, setActiveUploadServiceId] = useState<string | null>(null);

  // Walk-In Form State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // Customer Autocomplete Suggestions
  const [customerSuggestions, setCustomerSuggestions] = useState<MockCustomer[]>([]);

  // Cleanup Object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      cart.forEach((item) => {
        item.images.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
      });
    };
  }, [cart]);

  // Handle Customer Phone Search
  const handlePhoneChange = (phoneInput: string) => {
    setCustomerInfo((prev) => ({ ...prev, phone: phoneInput }));
    if (phoneInput.length >= 3) {
      const matches = MOCK_CUSTOMERS.filter((c) =>
        c.phone.toLowerCase().includes(phoneInput.toLowerCase())
      );
      setCustomerSuggestions(matches);
    } else {
      setCustomerSuggestions([]);
    }
  };

  const selectCustomer = (customer: MockCustomer) => {
    setCustomerInfo({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || "",
      address: customer.address || "",
      notes: customerInfo.notes,
    });
    setCustomerSuggestions([]);
  };

  // Cart Actions
  const addToCart = (service: ServiceItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.service.id === service.id);
      if (existing) {
        return prev.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { service, quantity: 1, images: [] }];
    });
    showToast(`Added ${service.name} to ticket`, "success");
  };

  const updateQuantity = (serviceId: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.service.id === serviceId) {
            return { ...item, quantity: Math.max(0, amount) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const updateItemNote = (serviceId: string, note: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.service.id === serviceId ? { ...item, note } : item
      )
    );
  };

  // Trigger explicit Camera or Gallery file inputs
  const triggerPhotoCapture = (serviceId: string, source: "camera" | "gallery") => {
    setActiveUploadServiceId(serviceId);
    if (source === "camera" && cameraInputRef.current) {
      cameraInputRef.current.click();
    } else if (source === "gallery" && galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeUploadServiceId) return;

    const file = files[0];
    setCart((prev) =>
      prev.map((item) => {
        if (item.service.id === activeUploadServiceId) {
          return { ...item, images: [...item.images, file] };
        }
        return item;
      })
    );
    showToast("Garment photo attached!", "success");
    e.target.value = "";
  };

  const removeImage = (serviceId: string, imageIndex: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.service.id === serviceId) {
          const updatedImages = item.images.filter((_, idx) => idx !== imageIndex);
          return { ...item, images: updatedImages };
        }
        return item;
      })
    );
  };

  // Calculations
  const calculateItemTotal = (item: CartItem) => item.service.price * item.quantity;
  const cartTotal = cart.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Order Submission
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      showToast("Customer name and phone number are required.", "error");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const generatedOrder = {
        ticketId: `CF-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleString(),
        customer: customerInfo,
        cart: [...cart],
        paymentMethod,
        total: cartTotal,
        totalItems,
      };

      setIsProcessing(false);
      setIsCheckoutOpen(false);
      setCompletedOrder(generatedOrder);

      // Reset state
      setCart([]);
      setCustomerInfo({ name: "", phone: "", email: "", address: "", notes: "" });
      showToast("Walk-in order processed successfully!", "success");
    }, 800);
  };

  const filteredServices = CLEAN_FLOW_SERVICES.filter((service) => {
    const matchesCategory =
      selectedCategory === "All" || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Dedicated Camera Input */}
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleImageChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* 2. Dedicated Phone / Gallery Input */}
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            Clean Flow Service POS
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Counter Point-of-Sale for walk-in customer registration & service ticketing.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
          <button
            onClick={() => setMode("pos")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "pos"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Counter POS
          </button>
          <button
            onClick={() => setMode("online")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === "online"
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Customer Preview
          </button>
        </div>
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
            placeholder="Search service name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-[var(--color-text-secondary)]" />}
          />
        </div>
      </div>

      {/* Grid Layout: Left Services, Right Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Selection Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredServices.map((srv) => (
            <div
              key={srv.id}
              className="relative p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col justify-between shadow-sm hover:border-[var(--color-primary)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
                    {srv.category === "Fabrics" ? (
                      <Shirt className="w-3 h-3 text-blue-500" />
                    ) : (
                      <HomeIcon className="w-3 h-3 text-emerald-500" />
                    )}
                    {srv.category}
                  </span>
                  {srv.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold uppercase">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[var(--color-text)]">{srv.name}</h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                  {srv.description}
                </p>
                <div className="mt-2 text-[10px] text-[var(--color-text-secondary)] font-medium">
                  Turnaround: <span className="text-[var(--color-text)] font-semibold">{srv.turnaround}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-[var(--color-primary)]">
                    ${srv.price.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-secondary)] ml-1 font-medium">
                    {srv.unitLabel}
                  </span>
                </div>

                <Button
                  size="sm"
                  onClick={() => addToCart(srv)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Counter Order Ticket Sidebar */}
        <div className="p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] h-fit space-y-4 shadow-sm sticky top-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
            <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
              {mode === "pos" ? "Counter Order Ticket" : "My Order Cart"}
            </h3>
            {cart.length > 0 && (
              <button
                onClick={() => setCart([])}
                className="text-xs text-red-500 hover:underline font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <ShoppingBag className="w-8 h-8 text-[var(--color-text-secondary)] mx-auto opacity-40" />
              <p className="text-xs text-[var(--color-text-secondary)]">
                No items on ticket. Click &quot;Add&quot; on any service to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.service.id}
                    className="p-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] space-y-2.5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-[var(--color-text)]">
                          {item.service.name}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          ${item.service.price.toFixed(2)} {item.service.unitLabel}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[var(--color-primary)]">
                        ${calculateItemTotal(item).toFixed(2)}
                      </span>
                    </div>

                    {/* Garment Note Input */}
                    {mode === "pos" && (
                      <input
                        type="text"
                        placeholder="Add garment detail (e.g., stain on collar)..."
                        value={item.note || ""}
                        onChange={(e) => updateItemNote(item.service.id, e.target.value)}
                        className="w-full text-[11px] px-2 py-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    )}

                    {/* Photo Attachments (Camera & Phone Options) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-secondary)] flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Garment Photos ({item.images.length})
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => triggerPhotoCapture(item.service.id, "camera")}
                            className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary)] hover:underline"
                            title="Take photo with camera"
                          >
                            <Camera className="w-3 h-3" /> Camera
                          </button>

                          <span className="text-[10px] text-[var(--color-text-secondary)]">|</span>

                          <button
                            type="button"
                            onClick={() => triggerPhotoCapture(item.service.id, "gallery")}
                            className="flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary)] hover:underline"
                            title="Upload from device photo library"
                          >
                            <ImageIcon className="w-3 h-3" /> Gallery
                          </button>
                        </div>
                      </div>

                      {item.images.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.images.map((file, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative group w-12 h-12 rounded-lg border border-[var(--color-border)] overflow-hidden"
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Attachment ${imgIdx}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(item.service.id, imgIdx)}
                                className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quantity Adjustment */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]/60">
                      <span className="text-[11px] font-semibold text-[var(--color-text-secondary)]">
                        Quantity:
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                          className="p-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-border)]"
                        >
                          {item.quantity <= 1 ? (
                            <Trash2 className="w-3 h-3 text-red-500" />
                          ) : (
                            <Minus className="w-3 h-3 text-[var(--color-text)]" />
                          )}
                        </button>

                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.service.id, parseInt(e.target.value, 10) || 0)
                          }
                          className="w-12 h-7 text-center text-xs font-bold bg-[var(--color-surface)] border border-[var(--color-border)] rounded-md focus:outline-none"
                        />

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                          className="p-1 rounded bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-border)] text-[var(--color-text)]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Breakdown */}
              <div className="pt-2 space-y-1 text-xs border-t border-[var(--color-border)]">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Total Garments / Services</span>
                  <span className="font-semibold text-[var(--color-text)]">{totalItems}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-[var(--color-text)] pt-1">
                  <span>Total Amount</span>
                  <span className="text-[var(--color-primary)]">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-2"
                onClick={() => setIsCheckoutOpen(true)}
                leftIcon={
                  mode === "pos" ? (
                    <CreditCard className="w-4 h-4" />
                  ) : (
                    <ShoppingBag className="w-4 h-4" />
                  )
                }
              >
                {mode === "pos" ? "Register Walk-in Order" : "Checkout Order"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Counter POS Order Registration Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => !isProcessing && setIsCheckoutOpen(false)}
        title={mode === "pos" ? "Walk-In Counter Ticket Registration" : "Complete Order"}
        description={`Creating ticket for ${totalItems} selected item(s).`}
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsCheckoutOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-order-form"
              isLoading={isProcessing}
              loadingText="Creating Ticket..."
            >
              Confirm Ticket (${cartTotal.toFixed(2)})
            </Button>
          </>
        }
      >
        <form id="create-order-form" onSubmit={handleCreateOrder} className="space-y-4">
          {/* Customer Phone Search with Autocomplete */}
          <div className="relative space-y-1">
            <Input
              label="Customer Phone *"
              required
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Search phone number..."
              leftIcon={<Phone className="w-4 h-4 text-[var(--color-text-secondary)]" />}
            />

            {/* Suggestions dropdown */}
            {customerSuggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 top-[100%] mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {customerSuggestions.map((cust) => (
                  <button
                    key={cust.id}
                    type="button"
                    onClick={() => selectCustomer(cust)}
                    className="w-full text-left p-2 hover:bg-[var(--color-bg)] transition-colors border-b last:border-0 border-[var(--color-border)] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-[var(--color-text)]">{cust.name}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">{cust.phone}</p>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                      Existing Customer
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Input
            label="Customer Name *"
            required
            type="text"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            placeholder="Full Name"
            leftIcon={<User className="w-4 h-4 text-[var(--color-text-secondary)]" />}
          />

          <Input
            label="Customer Email"
            type="email"
            value={customerInfo.email}
            onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
            placeholder="name@example.com (for digital receipt)"
            leftIcon={<Mail className="w-4 h-4 text-[var(--color-text-secondary)]" />}
          />

          <Input
            label="Delivery / Pickup Address (Optional)"
            type="text"
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
            placeholder="Leave empty for counter drop-off & store pick-up"
          />

          {/* Payment Method Toggle for Counter Staff */}
          {mode === "pos" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--color-text)]">
                Payment Received *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["Cash", "Card / POS", "Transfer", "Unpaid"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-lg border transition-all ${
                      paymentMethod === method
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm"
                        : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-secondary)]"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Counter Staff Notes */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--color-text)]">
              General Order / Stain Instructions
            </label>
            <textarea
              value={customerInfo.notes}
              onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
              placeholder="e.g., Special instructions, express request, client requested light starch..."
              className="w-full p-2.5 text-xs rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)]"
              rows={2}
            />
          </div>
        </form>
      </Modal>

      {/* Ticket Printable Confirmation Modal */}
      {completedOrder && (
        <Modal
          isOpen={!!completedOrder}
          onClose={() => setCompletedOrder(null)}
          title="Order Ticket Generated"
          size="sm"
          footer={
            <div className="flex w-full gap-2">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setCompletedOrder(null)}
              >
                Close
              </Button>
              <Button
                className="w-full"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print Garment Tags
              </Button>
            </div>
          }
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-[var(--color-text)]">
                Ticket #{completedOrder.ticketId}
              </h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                {completedOrder.date}
              </p>
            </div>

            <div className="p-3 bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Customer:</span>
                <span className="font-bold">{completedOrder.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Phone:</span>
                <span className="font-bold">{completedOrder.customer.phone}</span>
              </div>
              {completedOrder.customer.email && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Email:</span>
                  <span className="font-bold">{completedOrder.customer.email}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Items Count:</span>
                <span className="font-bold">{completedOrder.totalItems} Items</span>
              </div>
              <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
                <span className="text-[var(--color-text-secondary)]">Payment Status:</span>
                <span className="font-bold text-[var(--color-primary)]">
                  {completedOrder.paymentMethod} (${completedOrder.total.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}