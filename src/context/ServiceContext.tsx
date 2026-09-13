import React, { createContext, useState, useEffect } from "react";

export interface ServiceItem {
  id: string;
  name: string;
  category: "Fabrics" | "House Cleaning";
  price: number;
  unitLabel: string;
  description: string;
  turnaround: string;
  popular: boolean;
  isActive: boolean;
}

const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: "srv-fb-1",
    name: "T-Shirt / Polo",
    category: "Fabrics",
    price: 3.5,
    unitLabel: "per piece",
    description: "Wash, press, and fold or hanger placement.",
    turnaround: "24-48 hrs",
    popular: true,
    isActive: true,
  },
  {
    id: "srv-fb-2",
    name: "Joggers / Sweatpants",
    category: "Fabrics",
    price: 4.5,
    unitLabel: "per pair",
    description: "Gentle wash with fabric softening and neat fold.",
    turnaround: "24-48 hrs",
    popular: false,
    isActive: true,
  },
  {
    id: "srv-fb-3",
    name: "Corporate Shirt / Blouse",
    category: "Fabrics",
    price: 4.0,
    unitLabel: "per piece",
    description: "Starch treatment option, precise collar pressing.",
    turnaround: "24-48 hrs",
    popular: true,
    isActive: true,
  },
  {
    id: "srv-fb-4",
    name: "2-Piece Corporate Suit",
    category: "Fabrics",
    price: 18.0,
    unitLabel: "per set",
    description: "Eco dry cleaning, delicate hand pressing, suit cover.",
    turnaround: "48 hrs",
    popular: false,
    isActive: true,
  },
];

export interface ServiceContextType {
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, "id" | "isActive">) => void;
  updateService: (id: string, updated: Partial<ServiceItem>) => void;
  toggleServiceActive: (id: string) => void;
  deleteService: (id: string) => void;
}
// eslint-disable-next-line react-refresh/only-export-components
export const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem("cleanflow_services_db");
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  useEffect(() => {
    localStorage.setItem("cleanflow_services_db", JSON.stringify(services));
  }, [services]);

  const addService = (newSrv: Omit<ServiceItem, "id" | "isActive">) => {
    const created: ServiceItem = {
      ...newSrv,
      id: `srv-${Date.now()}`,
      isActive: true,
    };
    setServices((prev) => [created, ...prev]);
  };

  const updateService = (id: string, updated: Partial<ServiceItem>) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const toggleServiceActive = (id: string) => {
    setServices((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ServiceContext.Provider
      value={{ services, addService, updateService, toggleServiceActive, deleteService }}
    >
      {children}
    </ServiceContext.Provider>
  );
};