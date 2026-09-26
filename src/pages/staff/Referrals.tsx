import  { useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useStaff } from '@/context/StaffContext';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Search, 
  Calendar, 
  // Gift, 
  UserCheck,
  Building2,
  Wallet,
  CheckCircle2,
  Banknote,
  QrCode,
  Copy,
  Check,
  Trophy,
  Sparkles,
  Percent
} from 'lucide-react';

const DOLLARS_PER_POINT = 0.05; // 1 point = $0.05 bonus
const CLIENT_DISCOUNT_PERCENT = 15; // 15% discount for referred clients

interface ReferredClient {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  totalSpentThisMonth: number;
  pointsGenerated: number;
}

interface StaffReferralRecord {
  staffId: string;
  staffName: string;
  staffRole: string;
  referralCode: string;
  baseSalary: number; // Fixed monthly base salary
  clientsReferredThisMonth: number;
  totalReferredSpendMonth: number;
  accumulatedPoints: number;
  payoutStatus: 'pending' | 'approved' | 'paid';
  referredClients: ReferredClient[];
}

const MOCK_REFERRAL_DATA: StaffReferralRecord[] = [
  {
    staffId: 'stf-01',
    staffName: 'Sarah Jenkins',
    staffRole: 'Wash & Starch',
    referralCode: 'SARAH-CLEAN',
    baseSalary: 2500.00,
    clientsReferredThisMonth: 4,
    totalReferredSpendMonth: 850,
    accumulatedPoints: 850,
    payoutStatus: 'pending',
    referredClients: [
      { id: 'c-101', name: 'Robert Fox', phone: '+1 (555) 234-5678', joinDate: 'Sep 04, 2026', totalSpentThisMonth: 320, pointsGenerated: 320 },
      { id: 'c-102', name: 'Jenny Wilson', phone: '+1 (555) 876-5432', joinDate: 'Sep 11, 2026', totalSpentThisMonth: 210, pointsGenerated: 210 },
      { id: 'c-103', name: 'Albert Flores', phone: '+1 (555) 345-6789', joinDate: 'Sep 18, 2026', totalSpentThisMonth: 180, pointsGenerated: 180 },
      { id: 'c-104', name: 'Kristin Watson', phone: '+1 (555) 987-6543', joinDate: 'Sep 22, 2026', totalSpentThisMonth: 140, pointsGenerated: 140 },
    ],
  },
  {
    staffId: 'stf-02',
    staffName: 'Alex Rivera',
    staffRole: 'Wash & Starch',
    referralCode: 'ALEX-CLEAN',
    baseSalary: 2400.00,
    clientsReferredThisMonth: 2,
    totalReferredSpendMonth: 420,
    accumulatedPoints: 420,
    payoutStatus: 'pending',
    referredClients: [
      { id: 'c-105', name: 'Courtney Henry', phone: '+1 (555) 456-7890', joinDate: 'Sep 08, 2026', totalSpentThisMonth: 270, pointsGenerated: 270 },
      { id: 'c-106', name: 'Theresa Webb', phone: '+1 (555) 654-3210', joinDate: 'Sep 15, 2026', totalSpentThisMonth: 150, pointsGenerated: 150 },
    ],
  },
  {
    staffId: 'stf-03',
    staffName: 'David Chen',
    staffRole: 'Press & Package',
    referralCode: 'DAVID-CLEAN',
    baseSalary: 2650.00,
    clientsReferredThisMonth: 6,
    totalReferredSpendMonth: 1450,
    accumulatedPoints: 1450,
    payoutStatus: 'approved',
    referredClients: [
      { id: 'c-107', name: 'Eleanor Pena', phone: '+1 (555) 789-0123', joinDate: 'Sep 02, 2026', totalSpentThisMonth: 500, pointsGenerated: 500 },
      { id: 'c-108', name: 'Cody Fisher', phone: '+1 (555) 321-0987', joinDate: 'Sep 09, 2026', totalSpentThisMonth: 350, pointsGenerated: 350 },
      { id: 'c-109', name: 'Bessie Cooper', phone: '+1 (555) 890-1234', joinDate: 'Sep 14, 2026', totalSpentThisMonth: 250, pointsGenerated: 250 },
      { id: 'c-110', name: 'Guy Hawkins', phone: '+1 (555) 432-1098', joinDate: 'Sep 20, 2026', totalSpentThisMonth: 350, pointsGenerated: 350 },
    ],
  },
];

export function ReferralPage() {
  const { activeStaff } = useStaff();
  const [records, setRecords] = useState<StaffReferralRecord[]>(MOCK_REFERRAL_DATA);
  const [selectedMonth] = useState('September 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const isManager = activeStaff?.role === 'Manager';

  const currentStaffRecord = records.find(
    (r: StaffReferralRecord) => r.staffId === activeStaff?.id
  ) || records[0];

  const filteredRecords = records.filter((rec: StaffReferralRecord) =>
    rec.staffName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    rec.referralCode.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const totalClientsReferred = records.reduce((sum, r) => sum + r.clientsReferredThisMonth, 0);
  const totalReferredSpend = records.reduce((sum, r) => sum + r.totalReferredSpendMonth, 0);
  const totalBonusPool = records.reduce((sum, r) => sum + (r.accumulatedPoints * DOLLARS_PER_POINT), 0);

  const activeStaffBonus = currentStaffRecord.accumulatedPoints * DOLLARS_PER_POINT;
  const activeStaffTotalPay = currentStaffRecord.baseSalary + activeStaffBonus;

  const shareableUrl = `https://cleanflow.com/register?ref=${currentStaffRecord.referralCode}`;

  const handleApprovePayout = (staffId: string) => {
    setApprovingId(staffId);
    setTimeout(() => {
      setRecords((prev) =>
        prev.map((rec) =>
          rec.staffId === staffId ? { ...rec, payoutStatus: 'approved' } : rec
        )
      );
      setApprovingId(null);
    }, 600);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto bg-[var(--color-background)] min-h-screen text-[var(--color-text)] transition-colors">
      
      {/* Top Header */}
      <div className="p-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] dark:border-slate-800 bg-[var(--color-surface)] dark:bg-slate-900 shadow-[var(--shadow-sm)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] dark:text-white flex items-center gap-2">
            Staff Referral & Bonus Terminal
            <Badge variant="primary" size="sm">
              <Sparkles className="w-3 h-3 mr-1 text-blue-500" /> Active System
            </Badge>
          </h1>
          <p className="text-xs text-[var(--color-text-secondary)] dark:text-slate-400 mt-0.5">
            Track client referrals, spending points, and monthly salary bonuses added to fixed base pay.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] dark:border-slate-800 bg-[var(--color-background)] dark:bg-slate-950 text-xs text-[var(--color-text-secondary)] dark:text-slate-300 font-medium">
            <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
            <span>{selectedMonth}</span>
          </div>
        </div>
      </div>

      {/* StatCards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Clients Brought In"
          value={isManager ? totalClientsReferred : currentStaffRecord.clientsReferredThisMonth}
          icon={Users}
          change="+12% vs last mo"
          isPositive={true}
          description="New active clients this month"
        />

        <StatCard
          label="Referred Client Spend"
          value={`$${(isManager ? totalReferredSpend : currentStaffRecord.totalReferredSpendMonth).toFixed(2)}`}
          icon={TrendingUp}
          change="+18.4%"
          isPositive={true}
          description="Total dry cleaning revenue generated"
        />

        <StatCard
          label="Referral Bonus Earned"
          value={`$${(isManager ? totalBonusPool : activeStaffBonus).toFixed(2)}`}
          icon={Award}
          change="Additional Pay"
          isPositive={true}
          description={`Rate: 100 Pts = ${(100 * DOLLARS_PER_POINT).toFixed(2)} Bonus`}
        />

        <StatCard
          label="Total Estimated Payout"
          value={`$${(isManager ? (records.reduce((s, r) => s + r.baseSalary, 0) + totalBonusPool) : activeStaffTotalPay).toFixed(2)}`}
          icon={Wallet}
          description={isManager ? "Combined Base Salary + Bonus Pool" : `Base ($${currentStaffRecord.baseSalary.toFixed(2)}) + Bonus ($${activeStaffBonus.toFixed(2)})`}
        />
      </div>

      {/* Main Breakdown Layout */}
      {isManager ? (
        /* MANAGER VIEW: ALL STAFF OVERVIEW & PAYROLL APPROVAL */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-[var(--color-text)] dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[var(--color-primary)]" /> Staff Salary & Bonus Payroll Breakdown
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[var(--color-text-secondary)] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search staff or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--color-surface)] dark:bg-slate-900 border border-[var(--color-border)] dark:border-slate-800 rounded-[var(--radius-md)] pl-9 pr-3 py-1.5 text-xs text-[var(--color-text)] dark:text-slate-200 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredRecords.map((record: StaffReferralRecord) => {
              const staffBonus = record.accumulatedPoints * DOLLARS_PER_POINT;
              const totalMonthPay = record.baseSalary + staffBonus;

              return (
                <Card key={record.staffId} className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)] dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-[var(--radius-md)] text-[var(--color-primary)] font-bold text-sm">
                        {record.staffName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--color-text)] dark:text-white text-base">{record.staffName}</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] dark:text-slate-400">
                          {record.staffRole} • Code: <span className="text-[var(--color-primary)] font-mono font-semibold">{record.referralCode}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-[var(--color-text-secondary)] dark:text-slate-400 uppercase font-semibold">Fixed Base Salary</span>
                        <p className="text-sm font-bold text-[var(--color-text)] dark:text-slate-200">${record.baseSalary.toFixed(2)}</p>
                      </div>
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-[var(--color-text-secondary)] dark:text-slate-400 uppercase font-semibold">Referral Bonus</span>
                        <p className="text-sm font-bold text-emerald-500">+${staffBonus.toFixed(2)}</p>
                      </div>
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] text-[var(--color-text-secondary)] dark:text-slate-400 uppercase font-semibold">Total Month Pay</span>
                        <p className="text-base font-black text-[var(--color-primary)]">${totalMonthPay.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={record.payoutStatus === 'approved' ? 'success' : 'warning'} size="sm">
                          {record.payoutStatus.toUpperCase()}
                        </Badge>

                        {record.payoutStatus === 'pending' && (
                          <Button
                            size="sm"
                            variant="solid"
                            isLoading={approvingId === record.staffId}
                            loadingText="Approving..."
                            leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            onClick={() => handleApprovePayout(record.staffId)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                          >
                            Approve Salary + Bonus
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Referred Clients */}
                  <div className="space-y-2 mt-4">
                    <span className="text-xs font-semibold text-[var(--color-text-secondary)] dark:text-slate-400 uppercase tracking-wider block">
                      Clients Referred in {selectedMonth} ({record.clientsReferredThisMonth} Total)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {record.referredClients.map((client: ReferredClient) => (
                        <div key={client.id} className="p-3 bg-[var(--color-background)] dark:bg-slate-950 rounded-[var(--radius-md)] border border-[var(--color-border)] dark:border-slate-800 space-y-1">
                          <p className="font-semibold text-xs text-[var(--color-text)] dark:text-white">{client.name}</p>
                          <p className="text-[11px] text-[var(--color-text-secondary)] dark:text-slate-400">{client.phone}</p>
                          <div className="pt-2 flex items-center justify-between text-[11px]">
                            <span className="text-[var(--color-text-secondary)] dark:text-slate-400">
                              Spent: <strong className="text-emerald-500">${client.totalSpentThisMonth}</strong>
                            </span>
                            <span className="text-amber-500 font-bold">+{client.pointsGenerated} pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* REGULAR STAFF VIEW: PERSONAL REFERRAL DASHBOARD */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Salary Breakdown & QR Terminal */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Compensation Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-sm">
                  <Banknote className="w-5 h-5" /> Your End-of-Month Compensation
                </div>
                <Badge variant="secondary" size="sm">
                  <Trophy className="w-3 h-3 mr-1 text-purple-400" /> Tier 1 Referrer
                </Badge>
              </div>
              
              <div className="p-4 bg-[var(--color-background)] dark:bg-slate-950 border border-[var(--color-border)] dark:border-slate-800 rounded-[var(--radius-md)] space-y-3 text-xs">
                <div className="flex items-center justify-between text-[var(--color-text-secondary)] dark:text-slate-400">
                  <span>Fixed Monthly Base Salary:</span>
                  <span className="text-[var(--color-text)] dark:text-slate-200 font-semibold">${currentStaffRecord.baseSalary.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--color-text-secondary)] dark:text-slate-400">
                  <span>Referral Bonus Earned:</span>
                  <span className="text-emerald-500 font-semibold">+${activeStaffBonus.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[var(--color-border)] dark:border-slate-800 flex items-center justify-between font-bold text-sm text-[var(--color-text)] dark:text-white">
                  <span>Total Estimated Salary:</span>
                  <span className="text-[var(--color-primary)] text-base">${activeStaffTotalPay.toFixed(2)}</span>
                </div>
              </div>

              {/* Instant Client Incentive Callout */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-[var(--radius-md)] flex items-center gap-3 text-xs text-amber-600 dark:text-amber-400">
                <Percent className="w-5 h-5 shrink-0 text-amber-500" />
                <span>Client Benefit: Referred clients automatically get <strong>{CLIENT_DISCOUNT_PERCENT}% OFF</strong> their first dry cleaning order!</span>
              </div>
            </Card>

            {/* Quick Share Code & QR Card */}
            <Card className="p-6 space-y-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--color-primary)]">
                <QrCode className="w-4 h-4" /> Share Code & Digital QR
              </div>

              <div className="text-2xl font-black text-[var(--color-primary)] font-mono tracking-wider bg-[var(--color-background)] dark:bg-slate-950 p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] dark:border-slate-800">
                {currentStaffRecord.referralCode}
              </div>

              {/* QR Code Graphic Generator */}
              <div className="flex justify-center p-3 bg-white rounded-lg w-max mx-auto border border-slate-200 dark:border-slate-800">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(shareableUrl)}`}
                  alt="Staff Referral QR Code"
                  className="w-28 h-28"
                />
              </div>

              <Button
                size="sm"
                variant="solid"
                onClick={handleCopyLink}
                leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                className="w-full text-xs"
              >
                {copiedLink ? 'Direct Link Copied!' : 'Copy Direct Referral Link'}
              </Button>
            </Card>
          </div>

          {/* Right Column: Personal Referred Clients List */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="p-6 space-y-4">
              <h3 className="font-bold text-[var(--color-text)] dark:text-white text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" /> Clients You Brought This Month
              </h3>

              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {currentStaffRecord.referredClients.map((client: ReferredClient) => (
                  <div key={client.id} className="p-4 bg-[var(--color-background)] dark:bg-slate-950 rounded-[var(--radius-md)] border border-[var(--color-border)] dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[var(--color-text)] dark:text-white">{client.name}</h4>
                      <p className="text-xs text-[var(--color-text-secondary)] dark:text-slate-400">{client.phone} • Joined {client.joinDate}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-xs text-[var(--color-text-secondary)] dark:text-slate-400">
                        Month Spend: <strong className="text-emerald-500">${client.totalSpentThisMonth.toFixed(2)}</strong>
                      </span>
                      <p className="text-xs font-bold text-amber-500">+{client.pointsGenerated} Points (${(client.pointsGenerated * DOLLARS_PER_POINT).toFixed(2)})</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferralPage;