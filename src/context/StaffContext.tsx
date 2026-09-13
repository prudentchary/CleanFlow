import React, { createContext, useState, useEffect } from "react";

export interface StaffMember {
  id: string;
  name: string;
  role: "Manager" | "Cashier" | "Cleaner";
  phone: string;
  active: boolean;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "staff-1", name: "Marcus Vance", role: "Manager", phone: "+1 (555) 111-2222", active: true },
  { id: "staff-2", name: "Anita Ray", role: "Cashier", phone: "+1 (555) 333-4444", active: true },
];

export interface StaffContextType {
  staff: StaffMember[];
  addStaff: (member: Omit<StaffMember, "id">) => void;
  toggleStaffStatus: (id: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const StaffContext = createContext<StaffContextType | undefined>(undefined);

export const StaffProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem("pos_staff");
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  useEffect(() => {
    localStorage.setItem("pos_staff", JSON.stringify(staff));
  }, [staff]);

  const addStaff = (newMember: Omit<StaffMember, "id">) => {
    const created: StaffMember = { ...newMember, id: `staff-${Date.now()}` };
    setStaff((prev) => [created, ...prev]);
  };

  const toggleStaffStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <StaffContext.Provider value={{ staff, addStaff, toggleStaffStatus }}>
      {children}
    </StaffContext.Provider>
  );
};