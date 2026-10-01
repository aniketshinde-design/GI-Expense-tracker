import React from 'react';
import { AlertCircle, ChevronRight, User, Receipt, ArrowRight, Shield, Edit3 } from 'lucide-react';
import { MemberStats } from '../types';
import { formatINR } from '../utils/formatters';

interface MemberCardsGridProps {
  memberStatsList: MemberStats[];
  onSelectMember: (memberId: string) => void;
  onOpenEditAllocations?: () => void;
}

export const MemberCardsGrid: React.FC<MemberCardsGridProps> = ({
  memberStatsList,
  onSelectMember,
  onOpenEditAllocations,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <span>Operative Field Allocations</span>
            <span className="text-xs font-mono font-normal text-slate-400">
              (Individually Configurable)
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Click any operative's card to view their isolated personal ledger and audit breakdown
          </p>
        </div>

        {onOpenEditAllocations && (
          <button
            onClick={onOpenEditAllocations}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Allocations</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {memberStatsList.map((stat) => {
          const { member, spent, remaining, percentageRemaining, isLowBalance, isOverBudget } = stat;

          return (
            <div
              key={member.id}
              onClick={() => onSelectMember(member.id)}
              className={`group relative rounded-xl bg-slate-900/90 border p-4 sm:p-5 transition-all duration-200 cursor-pointer hover:bg-slate-850 hover:shadow-xl ${
                isOverBudget
                  ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                  : isLowBalance
                  ? 'border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Top Header inside Card */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`relative w-9 h-9 rounded-lg bg-gradient-to-tr ${member.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {member.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5 text-sm sm:text-base">
                      {member.name}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {member.callsign} · {member.role.split(' ')[0]}
                    </div>
                  </div>
                </div>

                {/* Status / Allocation Badge */}
                {isOverBudget ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950/80 text-rose-300 border border-rose-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Exceeded
                  </span>
                ) : isLowBalance ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Low Balance
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    Alloc: {formatINR(member.allocation)}
                  </span>
                )}
              </div>

              {/* Main Balance Display */}
              <div className="space-y-1 my-3">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex justify-between">
                  <span>Balance Remaining</span>
                  <span className="text-slate-300 font-semibold">{percentageRemaining.toFixed(0)}%</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight tabular-nums ${
                      isOverBudget
                        ? 'text-rose-400'
                        : isLowBalance
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {formatINR(remaining)}
                  </span>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 border border-slate-750 overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOverBudget
                      ? 'bg-rose-500'
                      : isLowBalance
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${percentageRemaining}%` }}
                />
              </div>

              {/* Sub-metrics: Spent & Mode */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div>
                  <span className="text-slate-400">Spent: </span>
                  <span className="text-slate-200 font-semibold">{formatINR(spent)}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px]">
                  <span>{stat.expenseCount} entries</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-indigo-400">{stat.billsCount} bills</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
