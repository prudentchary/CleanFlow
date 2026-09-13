import React, { createContext, useContext, useState, useEffect } from "react";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
}

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "cust-1", name: "Sarah Jenkins", phone: "+1 (555) 234-5678", email: "sarah.j@example.com" },
  { id: "cust-2", name: "David Chen", phone: "+1 (555) 876-5432", email: "d.chen@example.com" },
  { id: "cust-3", name: "Elena Rostova", phone: "+1 (555) 345-6789", email: "elena@example.com" },
];

export interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, "id">) => void;
  deleteCustomer: (id: string) => void;
}

// Unexported context object—prevents Vite Fast Refresh warnings
const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("pos_customers");
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  useEffect(() => {
    localStorage.setItem("pos_customers", JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (newCust: Omit<Customer, "id">) => {
    const created: Customer = { ...newCust, id: `cust-${Date.now()}` };
    setCustomers((prev) => [created, ...prev]);
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, deleteCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomers must be used within a CustomerProvider");
  }
  return context;
};