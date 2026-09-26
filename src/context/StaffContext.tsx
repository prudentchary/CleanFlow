import React, { createContext, useContext, useState, useEffect } from "react";

export type StaffRole = "Wash & Starch" | "Press & Package" | "Manager" | "Cashier";

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  active: boolean;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: "stf-01", name: "Sarah J.", role: "Wash & Starch", phone: "+1 (555) 111-2222", active: true },
  { id: "stf-02", name: "Alex R.", role: "Wash & Starch", phone: "+1 (555) 222-3333", active: true },
  { id: "stf-03", name: "David C.", role: "Press & Package", phone: "+1 (555) 333-4444", active: true },
  { id: "stf-04", name: "Emma W.", role: "Press & Package", phone: "+1 (555) 444-5555", active: true },
  { id: "stf-05", name: "Marcus Vance", role: "Manager", phone: "+1 (555) 555-6666", active: true },
];

export interface StaffContextType {
  staff: StaffMember[];
  activeStaff: StaffMember | null;
  setActiveStaffId: (id: string) => void;
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

  const [activeStaffId, setActiveStaffId] = useState<string>("stf-01");

  useEffect(() => {
    localStorage.setItem("pos_staff", JSON.stringify(staff));
  }, [staff]);

  const activeStaff = staff.find((s) => s.id === activeStaffId) || staff[0] || null;

  const addStaff = (newMember: Omit<StaffMember, "id">) => {
    const created: StaffMember = { ...newMember, id: `stf-${Date.now()}` };
    setStaff((prev) => [created, ...prev]);
  };

  const toggleStaffStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  return (
    <StaffContext.Provider
      value={{
        staff,
        activeStaff,
        setActiveStaffId,
        addStaff,
        toggleStaffStatus,
      }}
    >
      {children}
    </StaffContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error("useStaff must be used within a StaffProvider");
  }
  return context;
};