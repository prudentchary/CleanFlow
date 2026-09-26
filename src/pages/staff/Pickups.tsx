import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import  Button  from '@/components/ui/Button';
import { useStaff } from '@/context/StaffContext';
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  DollarSign, 
  Shirt, 
  AlertTriangle,
  ReceiptText,
  CreditCard,
  Banknote,
  Smartphone,
  UserCheck
} from 'lucide-react';

export interface PickupOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  itemsSummary: string;
  itemCount: number;
  rackLocation: string;
  totalAmount: number;
  paidAmount: number;
  isPaid: boolean;
  hasIssue?: boolean;
  issueNote?: string;
  readySince: string;
}

type PaymentMethod = 'cash' | 'card' | 'transfer';

const MOCK_READY_ORDERS: PickupOrder[] = [
  {
    id: 'p-201',
    orderId: 'ORD-8819',
    customerName: 'Marcus Miller',
    customerPhone: '+1 (555) 019-2834',
    itemsSummary: '2 Suits, 3 Dress Shirts',
    itemCount: 5,
    rackLocation: 'RACK-A-04',
    totalAmount: 48.00,
    paidAmount: 48.00,
    isPaid: true,
    readySince: 'Today, 10:30 AM',
  },
  {
    id: 'p-202',
    orderId: 'ORD-8820',
    customerName: 'Chloe Bennett',
    customerPhone: '+1 (555) 012-9988',
    itemsSummary: '1 Evening Gown, 1 Silk Scarf',
    itemCount: 2,
    rackLocation: 'RACK-C-12',
    totalAmount: 65.50,
    paidAmount: 0.00,
    isPaid: false,
    hasIssue: true,
    issueNote: 'Minor color transfer on inner hem - client informed',
    readySince: 'Yesterday, 4:15 PM',
  },
  {
    id: 'p-203',
    orderId: 'ORD-8823',
    customerName: 'Elena Rostova',
    customerPhone: '+1 (555) 017-4411',
    itemsSummary: '1 Silk Dress',
    itemCount: 1,
    rackLocation: 'RACK-A-12',
    totalAmount: 22.00,
    paidAmount: 22.00,
    isPaid: true,
    readySince: 'Just now',
  },
];

export function PickupPage() {
  const { activeStaff } = useStaff();
  const [orders, setOrders] = useState<PickupOrder[]>(MOCK_READY_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);

  // Payment Settlement State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cashTendered, setCashTendered] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Filter orders by search query
  const filteredOrders = orders.filter((order: PickupOrder) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      order.orderId.toLowerCase().includes(query) ||
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query) ||
      order.rackLocation.toLowerCase().includes(query)
    );
  });

  const selectedOrder = orders.find((o: PickupOrder) => o.id === selectedOrderId);
  const balanceDue = selectedOrder ? selectedOrder.totalAmount - selectedOrder.paidAmount : 0;
  const cashChange = paymentMethod === 'cash' && parseFloat(cashTendered) > balanceDue
    ? parseFloat(cashTendered) - balanceDue
    : 0;

  // Process payment with audit logging
  const handleCollectPayment = () => {
    if (!selectedOrder || !activeStaff) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setOrders((prev: PickupOrder[]) =>
        prev.map((o: PickupOrder) =>
          o.id === selectedOrder.id ? { ...o, isPaid: true, paidAmount: o.totalAmount } : o
        )
      );
      setIsProcessingPayment(false);
      setCashTendered('');
    }, 600);
  };

  // Mark order as completed and hand off to customer
  const handleCompletePickup = () => {
    if (!selectedOrder || !activeStaff) return;

    // Remove from ready pickup queue (frees rack slot)
    const nextRemaining = orders.filter((o: PickupOrder) => o.id !== selectedOrder.id);
    setOrders(nextRemaining);
    setSelectedOrderId(nextRemaining[0]?.id || null);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header with Active Counter Staff Audit Indicator */}
      <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Express Pickup Terminal</h1>
          <p className="text-xs text-slate-400">
            Retrieve customer garments, settle balances, and log handoffs.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">Counter Attendant:</span>
            <span className="text-white font-semibold">{activeStaff?.name || 'Staff Member'}</span>
            <span className="text-slate-500">({activeStaff?.role || 'Staff'})</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-900/50 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span>{orders.length} Ready</span>
          </div>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Search & Order Selection (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID, Name, Phone, or Rack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {filteredOrders.map((order: PickupOrder) => {
              const isSelected = order.id === selectedOrderId;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrderId(order.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-800 border-blue-500/80 shadow-md ring-1 ring-blue-500/50'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        {order.orderId}
                      </span>
                      <h3 className="font-semibold text-sm text-white">{order.customerName}</h3>
                    </div>

                    <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold">
                      <MapPin className="w-3.5 h-3.5" />
                      {order.rackLocation}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>{order.itemsSummary}</span>
                    <Badge variant={order.isPaid ? 'success' : 'warning'} size="sm">
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-500">No ready orders match your search</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Fulfillment & Payment (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <Card className="p-6 space-y-6 bg-slate-900/80 border-slate-800 rounded-2xl shadow-xl">
              
              {/* Storage Rack Banner */}
              <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-800/50 p-5 rounded-2xl flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Storage Slot</span>
                  <div className="text-3xl font-black text-white flex items-center gap-2">
                    <MapPin className="w-7 h-7 text-emerald-400" />
                    {selectedOrder.rackLocation}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <span className="text-xs text-slate-400">Ready Time</span>
                  <p className="text-xs font-semibold text-slate-200">{selectedOrder.readySince}</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Customer Name</span>
                  <p className="font-semibold text-white text-sm">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Contact Number</span>
                  <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    {selectedOrder.customerPhone}
                  </p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shirt className="w-4 h-4 text-blue-400" /> Items for Handoff ({selectedOrder.itemCount})
                </h4>
                <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-800 text-xs text-slate-300 font-medium">
                  {selectedOrder.itemsSummary}
                </div>
              </div>

              {/* Issue Warning Banner */}
              {selectedOrder.hasIssue && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-900/50 text-xs text-red-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <span className="font-bold block">Garment Issue Note:</span>
                    <span>{selectedOrder.issueNote}</span>
                  </div>
                </div>
              )}

              {/* Unpaid Balance Payment Controls */}
              {!selectedOrder.isPaid && (
                <div className="p-4 bg-amber-950/30 border border-amber-900/40 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
                    <span>Balance Due at Counter:</span>
                    <span className="text-base">${balanceDue.toFixed(2)}</span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                        paymentMethod === 'card'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Card / POS
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                        paymentMethod === 'cash'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5" /> Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all ${
                        paymentMethod === 'transfer'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Transfer
                    </button>
                  </div>

                  {/* Cash Change Calculator */}
                  {paymentMethod === 'cash' && (
                    <div className="pt-2 flex items-center gap-3 text-xs">
                      <div className="flex-1 space-y-1">
                        <label className="text-slate-400 block">Amount Received ($):</label>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={cashTendered}
                          onChange={(e) => setCashTendered(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <label className="text-slate-400 block">Change Due:</label>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 font-bold text-emerald-400">
                          ${cashChange.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Financial Breakdown */}
              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Total Amount:</span>
                  <span className="text-white font-semibold">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span>Paid to Date:</span>
                  <span className="text-emerald-400 font-semibold">${selectedOrder.paidAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                {!selectedOrder.isPaid ? (
                  <Button
                    variant="solid"
                    disabled={isProcessingPayment}
                    onClick={handleCollectPayment}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs py-3 flex items-center justify-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    {isProcessingPayment ? 'Processing Settlement...' : `Collect $${balanceDue.toFixed(2)} & Mark Paid`}
                  </Button>
                ) : (
                  <Button
                    variant="solid"
                    onClick={handleCompletePickup}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-3 flex items-center justify-center gap-2"
                  >
                    <ReceiptText className="w-4 h-4" />
                    Confirm Handoff by {activeStaff?.name || 'Staff'} & Close Order
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-slate-800 rounded-2xl">
              <p className="text-xs text-slate-500">Select an order from the queue to process customer pickup</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PickupPage;