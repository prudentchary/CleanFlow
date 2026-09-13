import React from "react";
import {
  ShoppingBag,
  User,
  X,
  Minus,
  Plus,
  Trash2,
  Camera,
  Tag,
  CreditCard,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import  { type ServiceItem } from "@/context/ServiceContext";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export interface CartItem {
  serviceId: string;
  quantity: number;
  photos: string[];
}

interface OrderCartPanelProps {
  cart: CartItem[];
  services: ServiceItem[];
  customers: Customer[];
  selectedCustomer: Customer | null;
  orderType: "Pickup" | "Delivery";
  discount: number;
  customerSearch: string;
  showCustomerDropdown: boolean;
  onSelectCustomer: (customer: Customer | null) => void;
  onCustomerSearchChange: (value: string) => void;
  onToggleCustomerDropdown: (show: boolean) => void;
  onOrderTypeChange: (type: "Pickup" | "Delivery") => void;
  onUpdateQuantity: (serviceId: string, delta: number) => void;
  onRemoveFromCart: (serviceId: string) => void;
  onDiscountChange: (discount: number) => void;
  onClearCart: () => void;
  onOpenPhotoModal: (serviceId: string) => void;
  onCheckout: () => void;
}

export const OrderCartPanel: React.FC<OrderCartPanelProps> = ({
  cart,
  services,
  customers,
  selectedCustomer,
  orderType,
  discount,
  customerSearch,
  showCustomerDropdown,
  onSelectCustomer,
  onCustomerSearchChange,
  onToggleCustomerDropdown,
  onOrderTypeChange,
  onUpdateQuantity,
  onRemoveFromCart,
  onDiscountChange,
  onClearCart,
  onOpenPhotoModal,
  onCheckout,
}) => {
  const taxRate = 0.075;

  const subtotal = cart.reduce((sum, item) => {
    const srv = services.find((s) => s.id === item.serviceId);
    return sum + (srv ? srv.price * item.quantity : 0);
  }, 0);

  const tax = Math.max(0, subtotal - discount) * taxRate;
  const total = Math.max(0, subtotal - discount + tax);

  return (
    <div className="lg:col-span-5 xl:col-span-4 flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl h-full overflow-hidden shadow-sm">
      {/* Header & Customer Picker */}
      <div className="p-4 border-b border-[var(--color-border)] space-y-3 bg-[var(--color-background)]/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[var(--color-text)] flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" /> Current Ticket
          </h3>
          <div className="flex gap-1 p-0.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-xs font-medium">
            {(["Pickup", "Delivery"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onOrderTypeChange(type)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  orderType === type
                    ? "bg-[var(--color-primary)] text-white font-semibold"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {selectedCustomer ? (
            <div className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-primary)]/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-xs font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--color-text)]">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">{selectedCustomer.phone}</p>
                </div>
              </div>
              <button
                onClick={() => onSelectCustomer(null)}
                className="p-1 rounded text-[var(--color-text-secondary)] hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <Input
                placeholder="Attach customer name or phone..."
                value={customerSearch}
                onFocus={() => onToggleCustomerDropdown(true)}
                onChange={(e) => {
                  onCustomerSearchChange(e.target.value);
                  onToggleCustomerDropdown(true);
                }}
                leftIcon={<User className="w-4 h-4 text-[var(--color-text-secondary)]" />}
              />
              {showCustomerDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto divide-y divide-[var(--color-border)]">
                  {customers.map((cust) => (
                    <div
                      key={cust.id}
                      onClick={() => {
                        onSelectCustomer(cust);
                        onToggleCustomerDropdown(false);
                        onCustomerSearchChange("");
                      }}
                      className="p-2.5 hover:bg-[var(--color-background)] cursor-pointer transition-colors"
                    >
                      <p className="text-xs font-bold text-[var(--color-text)]">{cust.name}</p>
                      <p className="text-[10px] text-[var(--color-text-secondary)]">{cust.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[var(--color-border)]/50">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 text-[var(--color-text-secondary)]">
            <ShoppingBag className="w-10 h-10 stroke-[1.25] mb-2 text-[var(--color-border)]" />
            <p className="text-xs font-medium">Ticket is empty</p>
            <p className="text-[10px] mt-0.5">Click any service from catalog to add</p>
          </div>
        ) : (
          cart.map((item) => {
            const srv = services.find((s) => s.id === item.serviceId);
            if (!srv) return null;

            return (
              <div key={srv.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-[var(--color-text)] truncate">{srv.name}</h5>
                    <p className="text-[10px] text-[var(--color-text-secondary)]">
                      ${srv.price.toFixed(2)} {srv.unitLabel}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 border border-[var(--color-border)] rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(srv.id, -1)}
                      className="p-1 rounded hover:bg-[var(--color-background)] text-[var(--color-text)]"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1.5 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(srv.id, 1)}
                      className="p-1 rounded hover:bg-[var(--color-background)] text-[var(--color-text)]"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[55px]">
                    <p className="text-xs font-bold text-[var(--color-primary)]">
                      ${(srv.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemoveFromCart(srv.id)}
                    className="p-1 text-[var(--color-text-secondary)] hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-[var(--color-background)]/80 p-2 rounded-lg border border-[var(--color-border)]/60">
                  <button
                    type="button"
                    onClick={() => onOpenPhotoModal(srv.id)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    {item.photos.length > 0
                      ? `Photos (${item.photos.length})`
                      : "Take/Attach Item Photo"}
                  </button>

                  {item.photos.length > 0 && (
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {item.photos.slice(0, 3).map((imgUrl, i) => (
                        <img
                          key={i}
                          src={imgUrl}
                          alt="Item preview"
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-[var(--color-surface)]"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pricing Summary & Checkout */}
      <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-background)]/50 space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Subtotal</span>
            <span className="font-semibold text-[var(--color-text)]">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-[var(--color-primary)]" /> Discount ($)
            </span>
            <input
              type="number"
              min="0"
              value={discount || ""}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-16 p-1 text-right text-xs rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            />
          </div>

          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Tax (7.5%)</span>
            <span className="font-semibold text-[var(--color-text)]">${tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-sm font-bold text-[var(--color-text)] pt-2 border-t border-[var(--color-border)]">
            <span>Total Due</span>
            <span className="text-[var(--color-primary)] text-base">${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button variant="ghost" onClick={onClearCart} disabled={cart.length === 0}>
            Clear
          </Button>
          <Button
            onClick={onCheckout}
            disabled={cart.length === 0}
            leftIcon={<CreditCard className="w-4 h-4" />}
          >
            Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};