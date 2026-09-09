import React, { useState } from "react";
import {
  DollarSign,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Reusable UI Components
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import StatCard from "@/components/ui/StatCard";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: "Revenue" | "Utility" | "Supplies" | "Equipment Maintenance" | "Payroll" | "Refund";
  type: "Income" | "Expense";
  amount: number;
  paymentMethod: "Card / POS" | "Bank Transfer" | "Cash" | "Store Wallet";
  status: "Completed" | "Pending";
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-8801",
    date: "Sep 08, 2026",
    description: "Order #BK-1092 - Sarah Jenkins",
    category: "Revenue",
    type: "Income",
    amount: 45.0,
    paymentMethod: "Card / POS",
    status: "Completed",
  },
  {
    id: "TXN-8802",
    date: "Sep 07, 2026",
    description: "Restock Commercial Laundry Detergent & Softener",
    category: "Supplies",
    type: "Expense",
    amount: 120.0,
    paymentMethod: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "TXN-8803",
    date: "Sep 06, 2026",
    description: "Industrial Steam Press Maintenance & Calibration",
    category: "Equipment Maintenance",
    type: "Expense",
    amount: 85.0,
    paymentMethod: "Cash",
    status: "Completed",
  },
  {
    id: "TXN-8804",
    date: "Sep 05, 2026",
    description: "Order #BK-1089 - Apex Hubs (Partial Deposit)",
    category: "Revenue",
    type: "Income",
    amount: 180.0,
    paymentMethod: "Bank Transfer",
    status: "Completed",
  },
  {
    id: "TXN-8805",
    date: "Sep 04, 2026",
    description: "Monthly Water Utility Bill",
    category: "Utility",
    type: "Expense",
    amount: 65.0,
    paymentMethod: "Bank Transfer",
    status: "Completed",
  },
];

export default function AdminFinancials() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Income" | "Expense">("All");

  // Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Supplies" as Transaction["category"],
    paymentMethod: "Bank Transfer" as Transaction["paymentMethod"],
  });

  // Calculate Metrics
  const totalIncome = transactions
    .filter((t) => t.type === "Income" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "Expense" && t.status === "Completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const outstandingBalance = 135.0; // Mock unpaid customer balances

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newExpense.amount);

    if (!newExpense.description || isNaN(amountVal) || amountVal <= 0) {
      showToast("Please provide a valid description and amount.", "error");
      return;
    }

    const createdTxn: Transaction = {
      id: `TXN-${Math.floor(8800 + Math.random() * 1000)}`,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      description: newExpense.description,
      category: newExpense.category,
      type: "Expense",
      amount: amountVal,
      paymentMethod: newExpense.paymentMethod,
      status: "Completed",
    };

    setTransactions([createdTxn, ...transactions]);
    setIsExpenseModalOpen(false);
    setNewExpense({
      description: "",
      amount: "",
      category: "Supplies",
      paymentMethod: "Bank Transfer",
    });

    showToast("Expense logged successfully!", "success");
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "All" || t.type === filterType;
    return matchesSearch && matchesFilter;
    
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">
            Financials & Accounting
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Monitor revenue, track operational expenses, and audit transaction logs.
          </p>
        </div>

        <Button
          onClick={() => setIsExpenseModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Record Expense
        </Button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`$${totalIncome.toFixed(2)}`}
          change="+12.4% from last month"
          isPositive={true}
          icon={ArrowUpRight}
          description="Total income generated from sales and services"
        />

        <StatCard
          label="Operational Expenses"
          value={`$${totalExpenses.toFixed(2)}`}
          description="Utilities, supplies & repairs"
          isPositive={false}
          icon={ArrowDownRight}
        />

        <StatCard
          label="Net Profit Margin"
          value={`$${netProfit.toFixed(2)}`}
          description="Gross income minus store expenses"
          isPositive={netProfit >= 0}
          icon={DollarSign}
        />

        <StatCard
          label="Unpaid Receivables"
          value={`$${outstandingBalance.toFixed(2)}`}
          description="Pending customer collections"
          isPositive={false}
          icon={AlertCircle}
        />
      </div>

      {/* Ledger Table Section */}
      <div className="p-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search by description or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-[var(--color-text-secondary)]" />}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-[var(--color-text-secondary)] flex items-center gap-1 shrink-0">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(["All", "Income", "Expense"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${
                  filterType === type
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text)]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg">
          <table className="w-full text-left text-xs text-[var(--color-text)]">
            <thead className="bg-[var(--color-bg)] text-[var(--color-text-secondary)] uppercase font-bold border-b border-[var(--color-border)]">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-[var(--color-text-secondary)]">
                    No financial records match your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[var(--color-text-secondary)]">
                      {txn.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--color-text-secondary)]">
                      {txn.date}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[var(--color-text)]">
                      {txn.description}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)]">
                        {txn.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">
                      {txn.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-right font-bold whitespace-nowrap">
                      <span
                        className={
                          txn.type === "Income" ? "text-emerald-500" : "text-red-500"
                        }
                      >
                        {txn.type === "Income" ? "+" : "-"}${txn.amount.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Record Operational Expense"
        description="Log store expenses like chemical restocks, utility bills, or repairs."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="record-expense-form">
              Save Expense
            </Button>
          </>
        }
      >
        <form id="record-expense-form" onSubmit={handleAddExpense} className="space-y-4">
          <Input
            label="Expense Description *"
            required
            type="text"
            placeholder="e.g. 5x Heavy Duty Laundry Powder Bags"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />

          <Input
            label="Amount ($) *"
            required
            type="number"
            step="0.01"
            placeholder="0.00"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
            leftIcon={<DollarSign className="w-4 h-4 text-[var(--color-text-secondary)]" />}
          />

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Expense Category
            </label>
            <select
              value={newExpense.category}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  category: e.target.value as Transaction["category"],
                })
              }
              className="w-full h-10 px-3 text-xs rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="Supplies">Supplies & Chemicals</option>
              <option value="Utility">Electricity & Water Utilities</option>
              <option value="Equipment Maintenance">Equipment Maintenance & Repairs</option>
              <option value="Payroll">Staff Wages / Bonuses</option>
              <option value="Refund">Customer Refunds</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--color-text-secondary)] block">
              Payment Method
            </label>
            <select
              value={newExpense.paymentMethod}
              onChange={(e) =>
                setNewExpense({
                  ...newExpense,
                  paymentMethod: e.target.value as Transaction["paymentMethod"],
                })
              }
              className="w-full h-10 px-3 text-xs rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card / POS">Card / POS</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}