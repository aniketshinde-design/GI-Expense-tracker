import { Expense, MemberId, MemberStats, TeamMember, TeamStats } from '../types';
import { MISSION_CONFIG } from '../data/seedData';

/**
 * Formats a number to Indian Rupee format (e.g., ₹1,40,000 or ₹35,000)
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Formats short INR (e.g. ₹1.4L or ₹35k)
 */
export function formatShortINR(amount: number): string {
  if (Math.abs(amount) >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')}L`;
  }
  if (Math.abs(amount) >= 1000) {
    return `₹${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return `₹${amount}`;
}

/**
 * Formats ISO timestamp to readable date & time
 */
export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Computes individual stats for a specific member based on their current allocation
 */
export function calculateMemberStats(member: TeamMember, expenses: Expense[]): MemberStats {
  const memberExpenses = expenses.filter((e) => e.doneBy === member.id);
  const spent = memberExpenses.reduce((sum, e) => sum + e.amount, 0);
  const allocation = member.allocation;
  const remaining = allocation - spent;
  const percentageRemaining = allocation > 0 ? Math.max(0, Math.min(100, (remaining / allocation) * 100)) : 0;
  const percentageSpent = allocation > 0 ? Math.max(0, Math.min(100, (spent / allocation) * 100)) : 100;

  const cashSpent = memberExpenses
    .filter((e) => e.paymentMode === 'Cash')
    .reduce((sum, e) => sum + e.amount, 0);

  const onlineSpent = memberExpenses
    .filter((e) => e.paymentMode === 'Online')
    .reduce((sum, e) => sum + e.amount, 0);

  const billsCount = memberExpenses.filter((e) => e.billAvailable).length;

  return {
    member,
    allocation,
    spent,
    remaining,
    percentageRemaining,
    percentageSpent,
    expenseCount: memberExpenses.length,
    cashSpent,
    onlineSpent,
    billsCount,
    isLowBalance: remaining <= MISSION_CONFIG.lowBalanceThreshold && remaining > 0,
    isOverBudget: remaining < 0,
  };
}

/**
 * Computes team consolidated statistics dynamically from members' allocations
 */
export function calculateTeamStats(expenses: Expense[], members: TeamMember[]): TeamStats {
  // Dynamically sum all member allocations for total consolidated budget
  const totalBudget = members.reduce((sum, m) => sum + m.allocation, 0);
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBalance = totalBudget - totalSpent;
  const percentageRemaining = totalBudget > 0 ? Math.max(0, Math.min(100, (remainingBalance / totalBudget) * 100)) : 0;
  const percentageSpent = totalBudget > 0 ? Math.max(0, Math.min(100, (totalSpent / totalBudget) * 100)) : 100;

  const totalCashSpent = expenses
    .filter((e) => e.paymentMode === 'Cash')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOnlineSpent = expenses
    .filter((e) => e.paymentMode === 'Online')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalBillsCount = expenses.filter((e) => e.billAvailable).length;
  const billComplianceRate = expenses.length > 0 ? (totalBillsCount / expenses.length) * 100 : 100;

  const dailyRecommendedBudget = Math.round(totalBudget / MISSION_CONFIG.totalDays);

  const uniqueDates = new Set(expenses.map((e) => e.timestamp.split('T')[0]));
  const activeDaysLogged = Math.max(1, uniqueDates.size);
  const currentDayBurnAverage = Math.round(totalSpent / activeDaysLogged);

  return {
    totalBudget,
    totalSpent,
    remainingBalance,
    percentageRemaining,
    percentageSpent,
    totalExpensesCount: expenses.length,
    totalCashSpent,
    totalOnlineSpent,
    totalBillsCount,
    billComplianceRate,
    dailyRecommendedBudget,
    currentDayBurnAverage,
    daysRemaining: 17,
    activeMissionDay: 1,
  };
}

/**
 * Generates and triggers download of CSV expense report (without category)
 */
export function exportExpensesToCSV(expenses: Expense[], members: TeamMember[]): void {
  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  const headers = [
    'Expense ID',
    'Date & Time',
    'Done By',
    'Amount (INR)',
    'Payment Mode',
    'Bill Available',
    'Reason / Description',
    'Location',
    'Notes',
  ];

  const rows = expenses.map((e) => [
    `"${e.id}"`,
    `"${e.timestamp}"`,
    `"${memberMap.get(e.doneBy) || e.doneBy}"`,
    e.amount,
    `"${e.paymentMode}"`,
    e.billAvailable ? '"YES"' : '"NO"',
    `"${(e.reason || '').replace(/"/g, '""')}"`,
    `"${(e.location || '').replace(/"/g, '""')}"`,
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GroundOps_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export full JSON for air-gapped backup
 */
export function exportExpensesToJSON(expenses: Expense[], members: TeamMember[]): void {
  const payload = {
    exportedAt: new Date().toISOString(),
    mission: MISSION_CONFIG,
    members,
    expenses,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GroundOps_Backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
