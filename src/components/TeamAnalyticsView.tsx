import React from 'react';
import { 
  TrendingDown, Users, Banknote, CreditCard, 
  Receipt, ShieldCheck, Calendar, ArrowUpRight 
} from 'lucide-react';
import { Expense, MemberStats, TeamStats } from '../types';
import { formatINR } from '../utils/formatters';

interface TeamAnalyticsViewProps {
  teamStats: TeamStats;
  memberStatsList: MemberStats[];
  expenses: Expense[];
  onSelectMember: (memberId: string) => void;
}

export const TeamAnalyticsView: React.FC<TeamAnalyticsViewProps> = ({
  teamStats,
  memberStatsList,
  expenses,
  onSelectMember,
}) => {
  // Daily spend calculation
  const dailySpendMap = expenses.reduce((acc, e) => {
    const dateKey = e.timestamp.split('T')[0];
    acc[dateKey] = (acc[dateKey] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.entries(dailySpendMap).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div className="space-y-6">
      {/* Top Mission Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Consolidated Pool</span>
            <span className="text-emerald-400">100%</span>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">
            {formatINR(teamStats.totalBudget)}
          </div>
          <div className="text-xs text-slate-400">
            Sum of 4 operative allocations
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Total Ground Spent</span>
            <span className="text-rose-400">{teamStats.percentageSpent.toFixed(1)}%</span>
          </div>
          <div className="text-2xl font-mono font-bold text-rose-400">
            {formatINR(teamStats.totalSpent)}
          </div>
          <div className="text-xs text-slate-400">
            Across {teamStats.totalExpensesCount} field items
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Pool Remaining</span>
            <span className="text-emerald-400 font-bold">{teamStats.percentageRemaining.toFixed(1)}%</span>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {formatINR(teamStats.remainingBalance)}
          </div>
          <div className="text-xs text-slate-400">
            Real-time balance
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>Target Daily Pace</span>
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300">
            {formatINR(teamStats.dailyRecommendedBudget)}
            <span className="text-xs font-normal text-slate-400">/day</span>
          </div>
          <div className="text-xs text-slate-400">
            17-day mission envelope
          </div>
        </div>
      </div>

      {/* Spend Distribution by Member */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Operative Spend Comparison</span>
            </h3>
            <p className="text-xs text-slate-400">
              Breakdown of budget consumed by each operative against their configured allocation
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            Total Budget: {formatINR(teamStats.totalBudget)}
          </span>
        </div>

        <div className="space-y-4">
          {memberStatsList.map((stat) => {
            const { member, spent, remaining, percentageSpent, allocation } = stat;

            return (
              <div
                key={member.id}
                onClick={() => onSelectMember(member.id)}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${member.avatarColor} flex items-center justify-center text-white font-bold text-xs`}>
                      {member.name[0]}
                    </div>
                    <div>
                      <span className="font-bold text-slate-200">{member.name}</span>
                      <span className="text-slate-500 font-mono text-[11px] ml-2 hidden sm:inline">
                        ({member.callsign} · Alloc: {formatINR(allocation)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono font-bold text-slate-200">
                        {formatINR(spent)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {percentageSpent.toFixed(0)}% of quota
                      </div>
                    </div>
                    <div className="w-24 text-right hidden sm:block">
                      <div className="font-mono text-xs text-emerald-400">
                        {formatINR(remaining)}
                      </div>
                      <div className="text-[10px] text-slate-500">remaining</div>
                    </div>
                  </div>
                </div>

                {/* Visual bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percentageSpent > 80
                        ? 'bg-rose-500'
                        : percentageSpent > 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percentageSpent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Mode & Bill Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Mode Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Banknote className="w-4 h-4 text-emerald-400" />
              <span>Field Liquidity: Cash vs Online</span>
            </h3>
            <p className="text-xs text-slate-400">
              Tracking physical cash dependency for remote field ops
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                <Banknote className="w-4 h-4" />
                <span>Physical Cash</span>
              </div>
              <div className="text-xl font-mono font-bold text-slate-100">
                {formatINR(teamStats.totalCashSpent)}
              </div>
              <div className="text-[11px] text-slate-400">
                {teamStats.totalSpent > 0
                  ? ((teamStats.totalCashSpent / teamStats.totalSpent) * 100).toFixed(0)
                  : 0}% of total
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
                <CreditCard className="w-4 h-4" />
                <span>Online / UPI / Card</span>
              </div>
              <div className="text-xl font-mono font-bold text-slate-100">
                {formatINR(teamStats.totalOnlineSpent)}
              </div>
              <div className="text-[11px] text-slate-400">
                {teamStats.totalSpent > 0
                  ? ((teamStats.totalOnlineSpent / teamStats.totalSpent) * 100).toFixed(0)
                  : 0}% of total
              </div>
            </div>
          </div>

          {/* Split Bar */}
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="h-full bg-emerald-500"
              style={{
                width: `${
                  teamStats.totalSpent > 0
                    ? (teamStats.totalCashSpent / teamStats.totalSpent) * 100
                    : 50
                }%`,
              }}
              title="Cash"
            />
            <div
              className="h-full bg-cyan-500"
              style={{
                width: `${
                  teamStats.totalSpent > 0
                    ? (teamStats.totalOnlineSpent / teamStats.totalSpent) * 100
                    : 50
                }%`,
              }}
              title="Online"
            />
          </div>
        </div>

        {/* Bill Audit Compliance Card */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-indigo-400" />
              <span>Voucher Compliance Rate</span>
            </div>
            <div className="text-2xl font-mono font-bold text-indigo-300">
              {teamStats.billComplianceRate.toFixed(0)}%
            </div>
            <p className="text-xs text-slate-400">
              {teamStats.totalBillsCount} expenses with attached bills ·{' '}
              {teamStats.totalExpensesCount - teamStats.totalBillsCount} un-vouched field honorarium/cash slips
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-950/70 border border-indigo-700/60 flex items-center justify-center text-indigo-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Daily Spend Timeline (if any expenses exist) */}
      {sortedDates.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Daily Spend Progression (2–18 Oct 2026)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Chronological burn rate across mission timeline
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Target Pace: ~{formatINR(teamStats.dailyRecommendedBudget)}/day
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {sortedDates.map(([date, amount]) => (
              <div key={date} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
                <div className="text-sm font-mono font-bold text-emerald-400">
                  {formatINR(amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
