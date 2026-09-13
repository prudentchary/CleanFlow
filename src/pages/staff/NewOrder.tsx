import React, { useState, useRef } from "react";
import { Search, Plus, Sparkles, Shirt, Home as HomeIcon, CheckCircle, Camera, Image as ImageIcon, X } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useToast } from "@/context/ToastContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { OrderCartPanel, type CartItem, type Customer } from "@/components/orders/OrderCartPanel";

const MOCK_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Sarah Jenkins", phone: "+1 (555) 234-5678", email: "sarah.j@example.com" },
  { id: "cust-2", name: "David Chen", phone: "+1 (555) 876-5432", email: "d.chen@example.com" },
  { id: "cust-3", name: "Elena Rostova", phone: "+1 (555) 345-6789", email: "elena@example.com" },
];

export default function NewOrderPage() {
  const { services } = useServices();
  const { showToast } = useToast();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderType, setOrderType] = useState<"Pickup" | "Delivery">("Pickup");
  const [discount, setDiscount] = useState<number>(0);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [photoModalServiceId, setPhotoModalServiceId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const addToCart = (serviceId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.serviceId === serviceId);
      if (existing) {
        return prev.map((item) =>
          item.serviceId === serviceId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { serviceId, quantity: 1, photos: [] }];
    });
  };

  const updateQuantity = (serviceId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.serviceId === serviceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.serviceId !== serviceId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(0);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !photoModalServiceId) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCart((prev) =>
          prev.map((item) =>
            item.serviceId === photoModalServiceId
              ? { ...item, photos: [...item.photos, result] }
              : item
          )
        );
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removePhoto = (serviceId: string, photoIndex: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.serviceId === serviceId) {
          return { ...item, photos: item.photos.filter((_, idx) => idx !== photoIndex) };
        }
        return item;
      })
    );
  };

  const activeServices = services.filter((s) => s.isActive);

  const filteredServices = activeServices.filter((srv) => {
    const matchesCategory = selectedCategory === "All" || srv.category === selectedCategory;
    const matchesSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredCustomers = MOCK_CUSTOMERS.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch)
  );

  const activePhotoItem = cart.find((item) => item.serviceId === photoModalServiceId);
  const activePhotoService = services.find((s) => s.id === photoModalServiceId);

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Please add at least one item to the order", "error");
      return;
    }
    if (!selectedCustomer) {
      showToast("Please attach a customer to this order", "error");
      return;
    }

    const totalPhotos = cart.reduce((sum, item) => sum + item.photos.length, 0);
    showToast(`Order created for ${selectedCustomer.name}! (${totalPhotos} photos attached)`, "success");
    clearCart();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
      {/* CATALOG SECTION */}
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4 overflow-y-auto pr-1">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            {(["All", "Fabrics", "House Cleaning"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[var(--color-text-secondary)]" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center py-12 border border-dashed border-[var(--color-border)] rounded-xl">
              <p className="text-xs text-[var(--color-text-secondary)]">No active services found matching your filter.</p>
            </div>
          ) : (
            filteredServices.map((service) => {
              const inCart = cart.find((item) => item.serviceId === service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => addToCart(service.id)}
                  className={`group relative p-4 rounded-xl border bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col justify-between ${
                    inCart ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]" : "border-[var(--color-border)]"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[var(--color-text-secondary)]">
                        {service.category === "Fabrics" ? (
                          <Shirt className="w-3 h-3 text-blue-500" />
                        ) : (
                          <HomeIcon className="w-3 h-3 text-emerald-500" />
                        )}
                        {service.category}
                      </span>
                      {service.popular && (
                        <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[9px] font-bold uppercase flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Popular
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                      {service.name}
                    </h4>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
                    <div>
                      <span className="text-base font-bold text-[var(--color-primary)]">${service.price.toFixed(2)}</span>
                      <span className="text-[10px] text-[var(--color-text-secondary)] ml-1">/{service.unitLabel}</span>
                    </div>

                    {inCart ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[var(--color-primary)] text-white text-xs font-bold">
                        <CheckCircle className="w-3 h-3" /> {inCart.quantity}
                      </span>
                    ) : (
                      <button className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:border-[var(--color-primary)] transition-all">
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* REFACTORED CART PANEL */}
      <OrderCartPanel
        cart={cart}
        services={services}
        customers={filteredCustomers}
        selectedCustomer={selectedCustomer}
        orderType={orderType}
        discount={discount}
        customerSearch={customerSearch}
        showCustomerDropdown={showCustomerDropdown}
        onSelectCustomer={setSelectedCustomer}
        onCustomerSearchChange={setCustomerSearch}
        onToggleCustomerDropdown={setShowCustomerDropdown}
        onOrderTypeChange={setOrderType}
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={removeFromCart}
        onDiscountChange={setDiscount}
        onClearCart={clearCart}
        onOpenPhotoModal={setPhotoModalServiceId}
        onCheckout={handleCheckout}
      />

      {/* GARMENT PHOTO MODAL */}
      {photoModalServiceId && (
        <Modal
          isOpen={Boolean(photoModalServiceId)}
          onClose={() => setPhotoModalServiceId(null)}
          title={`Attach Garment Photos (${activePhotoService?.name || ""})`}
          description="Photograph stains, fabric defects, or individual items before processing."
          size="md"
        >
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()} leftIcon={<Camera className="w-4 h-4" />} className="w-full">
                Snap or Upload Photo
              </Button>
            </div>

            {activePhotoItem && activePhotoItem.photos.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                {activePhotoItem.photos.map((photo, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-[var(--color-border)] aspect-square">
                    <img src={photo} alt={`Garment photo ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(photoModalServiceId, index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-[var(--color-border)] rounded-xl">
                <ImageIcon className="w-8 h-8 text-[var(--color-text-secondary)] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[var(--color-text-secondary)]">No photos attached for this item yet.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}