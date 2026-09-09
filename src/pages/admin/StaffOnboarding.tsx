import { useState } from "react";
import { UserPlus, ShieldCheck, CheckCircle2, Search, X, Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Custom UI Components
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const AVAILABLE_ROLES = [
  "Field Specialist",
  "Cleaning Supervisor",
  "Logistics Driver",
  "Inventory Manager",
  "Quality Inspector",
];

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  roles: string[];
  status: "Active" | "Pending";
}

export default function StaffOnboarding() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "STF-101",
      name: "Michael Reed",
      email: "m.reed@cleanflow.com",
      phone: "+1 555-0192",
      roles: ["Cleaning Supervisor", "Quality Inspector"],
      status: "Active",
    },
    {
      id: "STF-102",
      name: "Elena Rostova",
      email: "e.rostova@cleanflow.com",
      phone: "+1 555-0143",
      roles: ["Field Specialist"],
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roles: ["Field Specialist"] as string[],
  });

  const toggleRole = (role: string) => {
    if (formData.roles.includes(role)) {
      if (formData.roles.length === 1) {
        showToast("At least one role must be selected.", "info");
        return;
      }
      setFormData({
        ...formData,
        roles: formData.roles.filter((r) => r !== role),
      });
    } else {
      setFormData({
        ...formData,
        roles: [...formData.roles, role],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (formData.roles.length === 0) {
      showToast("Please assign at least one role.", "error");
      return;
    }

    setIsSubmitting(true);

    // Simulate async invitation API dispatch
    setTimeout(() => {
      const newStaff: StaffMember = {
        id: `STF-${100 + staffList.length + 1}`,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone || "N/A",
        roles: formData.roles,
        status: "Pending",
      };

      setStaffList([newStaff, ...staffList]);
      setIsSubmitting(false);
      setIsModalOpen(false);
      setFormData({ fullName: "", email: "", phone: "", roles: ["Field Specialist"] });
      showToast(`Invitation sent to ${newStaff.email}`, "success");
    }, 600);
  };

  const filteredStaff = staffList.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Trigger Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-text)]">Staff Onboarding</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Invite, assign operational roles, and manage team members.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Onboard New Staff
        </Button>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-md">
        <Input
          type="text"
          placeholder="Search staff by name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-[var(--color-text-secondary)]" />}
        />
      </div>

      {/* Staff Roster Table */}
      <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-surface)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg)] border-b border-[var(--color-border)] text-[var(--color-text-secondary)]">
              <tr>
                <th className="p-4 font-medium">Staff Member</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Assigned Roles</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[var(--color-bg)]/50 transition-colors">
                  <td className="p-4 font-medium text-[var(--color-text)]">
                    <div>{staff.name}</div>
                    <span className="text-xs text-[var(--color-text-secondary)] font-normal">
                      {staff.id}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-text-secondary)]">
                    <div>{staff.email}</div>
                    <div className="text-xs">{staff.phone}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {staff.roles.map((role) => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)]"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        staff.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {staff.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Integration */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Onboard New Staff Member"
        description="Send an invitation link and assign roles to new team members."
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="onboard-staff-form"
              isLoading={isSubmitting}
              loadingText="Sending..."
            >
              Send Invitation
            </Button>
          </>
        }
      >
        <form id="onboard-staff-form" onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
          />

          <Input
            label="Email Address *"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@cleanflow.com"
          />

          <Input
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 555-0000"
          />

          {/* Custom Multi-Role Tag Input Grid */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-[var(--color-text)] select-none">
              Assigned Roles *{" "}
              <span className="text-[var(--color-text-secondary)] font-normal">
                (Select all that apply)
              </span>
            </label>

            {/* Selected Badges Display */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
              {formData.roles.map((role) => (
                <span
                  key={role}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 text-xs font-semibold"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => toggleRole(role)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] max-h-40 overflow-y-auto">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = formData.roles.includes(role);
                return (
                  <button
                    type="button"
                    key={role}
                    onClick={() => toggleRole(role)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm"
                        : "hover:bg-[var(--color-bg)] text-[var(--color-text-secondary)]"
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}