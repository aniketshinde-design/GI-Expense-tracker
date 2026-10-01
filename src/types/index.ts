export type MemberId = 'aniket' | 'darsh' | 'geetika' | 'aditi';

export interface TeamMember {
  id: MemberId;
  name: string;
  role: string;
  callsign: string;
  avatarColor: string;
  badgeBg: string;
  borderColor: string;
  allocation: number; // Editable allocation (starts at ₹35,000)
}

export type PaymentMode = 'Cash' | 'Online';

export interface Expense {
  id: string;
  amount: number;
  doneBy: MemberId;
  reason: string;
  paymentMode: PaymentMode;
  billAvailable: boolean;
  billImageUrl?: string; // base64 / object url
  timestamp: string; // ISO 8601
  location?: string;
  notes?: string;
  createdAt: string;
}

export interface MissionConfig {
  name: string;
  codename: string;
  startDate: string; // '2026-10-02'
  endDate: string;   // '2026-10-18'
  totalDays: number; // 17 days
  defaultIndividualAllocation: number; // 35000
  lowBalanceThreshold: number; // 5000
}

export interface MemberStats {
  member: TeamMember;
  allocation: number;
  spent: number;
  remaining: number;
  percentageRemaining: number;
  percentageSpent: number;
  expenseCount: number;
  cashSpent: number;
  onlineSpent: number;
  billsCount: number;
  isLowBalance: boolean;
  isOverBudget: boolean;
}

export interface TeamStats {
  totalBudget: number; // Sum of all members' current allocations
  totalSpent: number;
  remainingBalance: number;
  percentageRemaining: number;
  percentageSpent: number;
  totalExpensesCount: number;
  totalCashSpent: number;
  totalOnlineSpent: number;
  totalBillsCount: number;
  billComplianceRate: number;
  dailyRecommendedBudget: number;
  currentDayBurnAverage: number;
  daysRemaining: number;
  activeMissionDay: number;
}
