import React from 'react';
import { X, Plus, AlertTriangle, Receipt } from 'lucide-react';
import { Expense, MemberStats, TeamMember } from '../types';
import { formatDateTime, formatINR } from '../utils/formatters';

interface IndividualLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember | null;
  stats: MemberStats | null;
  expenses: Expense[];
  onOpenAddExpenseForMember: (memberId: string) => void;
  onEditExpense: (expense: Expense) => void;
  onViewReceipt: (url: string, title: string) => void;
}

export const IndividualLedgerModal: React.FC<IndividualLedgerModalProps> = ({
  isOpen,
  onClose,
  member,
  stats,
  expenses,
  onOpenAddExpenseForMember,
  onEditExpense,
  onViewReceipt,
}) => {
  if (!isOpen || !member || !stats) return null;

  const memberExpenses = expenses
    .filter((e) => e.doneBy === member.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl p-5 sm:p-7 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${member.avatarColor} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
              {member.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  {member.name}'s Field Ledger
                </h3>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300 border border-slate-700">
                  {member.callsign}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {member.role} · Current Allocation: {formatINR(member.allocation)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenAddExpenseForMember(member.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log For {member.name}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Low balance warning */}
        {stats.isLowBalance && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Low Allocation Warning:</strong> {member.name}'s remaining balance has fallen below ₹5,000. Prioritize essential field transit and meal expenses only.
            </span>
          </div>
        )}

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Remaining</div>
            <div className={`text-xl sm:text-2xl font-mono font-bold mt-1 ${stats.isLowBalance ? 'text-amber-400' : 'text-emerald-400'}`}>
              {formatINR(stats.remaining)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats.percentageRemaining.toFixed(0)}% of {formatINR(member.allocation)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Total Spent</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-slate-100 mt-1">
              {formatINR(stats.spent)}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats.expenseCount} transactions
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Cash vs Online</div>
            <div className="text-xs font-mono font-semibold text-slate-200 mt-1 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Cash:</span>
                <span className="text-emerald-400">{formatINR(stats.cashSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Online:</span>
                <span className="text-cyan-400">{formatINR(stats.onlineSpent)}</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase">Bill Compliance</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-indigo-300 mt-1">
              {stats.billsCount} / {stats.expenseCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats.expenseCount > 0 ? ((stats.billsCount / stats.expenseCount) * 100).toFixed(0) : 100}% verified
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase">
            <span>Transaction History ({memberExpenses.length})</span>
            <span>Allocated: {formatINR(member.allocation)}</span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {memberExpenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No expenses logged yet by {member.name}. Full {formatINR(member.allocation)} allocation intact.
              </div>
            ) : (
              memberExpenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 truncate">{exp.reason}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span>{formatDateTime(exp.timestamp)}</span>
                      <span>•</span>
                      <span className={exp.paymentMode === 'Cash' ? 'text-emerald-400' : 'text-cyan-400'}>
                        {exp.paymentMode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      {formatINR(exp.amount)}
                    </div>
                    {exp.billImageUrl && (
                      <button
                        onClick={() => onViewReceipt(exp.billImageUrl!, exp.reason)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300"
                        title="View receipt"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{member.name} ({member.callsign})</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
