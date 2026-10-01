import React from 'react';
import { AlertTriangle, TrendingDown, ArrowUpRight, Wallet, CheckCircle, CreditCard, Banknote, ShieldAlert } from 'lucide-react';
import { MemberStats, TeamStats } from '../types';
import { formatINR, formatShortINR } from '../utils/formatters';

interface ConsolidatedBannerProps {
  teamStats: TeamStats;
  memberStatsList: MemberStats[];
  onSelectMember: (memberId: string) => void;
  onOpenAddExpense: () => void;
  onOpenEditAllocations?: () => void;
}

export const ConsolidatedBanner: React.FC<ConsolidatedBannerProps> = ({
  teamStats,
  memberStatsList,
  onSelectMember,
  onOpenAddExpense,
  onOpenEditAllocations,
}) => {
  // Check for any members in alert threshold (< ₹5,000)
  const lowBalanceMembers = memberStatsList.filter((m) => m.isLowBalance || m.isOverBudget);

  // Status color logic based on percentage remaining
  const isHealthy = teamStats.percentageRemaining > 30;
  const isWarning = teamStats.percentageRemaining <= 30 && teamStats.percentageRemaining > 15;
  const isCritical = teamStats.percentageRemaining <= 15;

  return (
    <div className="space-y-3">
      {/* Alert Banner for Low Balance Members */}
      {lowBalanceMembers.length > 0 && (
        <div className="rounded-xl border border-amber-500/50 bg-amber-950/40 p-3 sm:p-4 text-amber-200 flex items-start gap-3 backdrop-blur-md animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm flex-1">
            <span className="font-bold text-amber-300">FIELD BUDGET WARNING:</span>{' '}
            {lowBalanceMembers.map((m, idx) => (
              <span key={m.member.id}>
                <button
                  onClick={() => onSelectMember(m.member.id)}
                  className="underline hover:text-white font-bold ml-1"
                >
                  {m.member.name} ({formatINR(m.remaining)} left)
                </button>
                {idx < lowBalanceMembers.length - 1 ? ',' : ''}
              </span>
            ))}
            {' '}is below the ₹5,000 contingency threshold! Coordinate cash allocations or re-budget accordingly.
          </div>
        </div>
      )}

      {/* Main Consolidated Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-750 p-5 sm:p-7 shadow-2xl">
        {/* Glow ambient background element */}
        <div 
          className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors ${
            isCritical ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Consolidated Balance */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                Ground Mission Consolidated Fund
              </span>
              {onOpenEditAllocations ? (
                <button
                  onClick={onOpenEditAllocations}
                  title="Click to edit allocations"
                  className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 hover:border-emerald-600 hover:bg-emerald-900/60 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Total Pool: {formatINR(teamStats.totalBudget)}</span>
                  <span className="text-[10px] text-emerald-300 underline ml-0.5">Edit</span>
                </button>
              ) : (
                <span className="px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60">
                  Total Pool: {formatINR(teamStats.totalBudget)}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-medium text-slate-400">
                Team Consolidated Balance Remaining
              </div>
              <div className="flex items-baseline gap-3">
                <span 
                  className={`text-4xl sm:text-5xl font-mono font-extrabold tracking-tight tabular-nums ${
                    isCritical 
                      ? 'text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.3)]' 
                      : isWarning 
                      ? 'text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                      : 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  }`}
                >
                  {formatINR(teamStats.remainingBalance)}
                </span>
                <span className="text-sm sm:text-base font-semibold text-slate-400">
                  / {formatINR(teamStats.totalBudget)}
                </span>
              </div>
            </div>

            {/* Consolidated Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Burn: {teamStats.percentageSpent.toFixed(1)}% spent</span>
                <span className="text-slate-200 font-semibold">{teamStats.percentageRemaining.toFixed(1)}% remaining</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700/80 overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCritical
                      ? 'bg-gradient-to-r from-rose-600 to-rose-400'
                      : isWarning
                      ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-400'
                  }`}
                  style={{ width: `${teamStats.percentageRemaining}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Key Tactical Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 lg:w-96">
            {/* Total Spent */}
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-750">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Total Spent</span>
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="text-lg font-mono font-bold text-slate-100 tabular-nums mt-1">
                {formatINR(teamStats.totalSpent)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Across {teamStats.totalExpensesCount} log entries
              </div>
            </div>

            {/* Daily Burn Rate */}
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-750">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Daily Burn</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-lg font-mono font-bold text-cyan-300 tabular-nums mt-1">
                {formatINR(teamStats.currentDayBurnAverage)}
                <span className="text-xs font-normal text-slate-400">/day</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Pace ceiling: {formatINR(teamStats.dailyRecommendedBudget)}/day
              </div>
            </div>

            {/* Cash vs Online Split */}
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-750">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Payment Mode</span>
                <Banknote className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xs font-medium text-slate-200 mt-1 flex flex-col gap-0.5">
                <span className="flex justify-between font-mono">
                  <span className="text-slate-400">Cash:</span>
                  <span className="text-emerald-400 font-bold">{formatINR(teamStats.totalCashSpent)}</span>
                </span>
                <span className="flex justify-between font-mono">
                  <span className="text-slate-400">Online:</span>
                  <span className="text-cyan-400 font-bold">{formatINR(teamStats.totalOnlineSpent)}</span>
                </span>
              </div>
            </div>

            {/* Bill Compliance */}
            <div className="p-3 rounded-xl bg-slate-850/80 border border-slate-750">
              <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
                <span>Bill Audit</span>
                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-lg font-mono font-bold text-indigo-300 tabular-nums mt-1">
                {teamStats.billComplianceRate.toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {teamStats.totalBillsCount} of {teamStats.totalExpensesCount} with receipts
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
