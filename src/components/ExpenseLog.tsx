import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Calendar, CheckCircle2, XCircle, CreditCard, Banknote, 
  Receipt, Edit2, Trash2, ChevronDown, Eye, RefreshCw 
} from 'lucide-react';
import { Expense, MemberId, PaymentMode, TeamMember } from '../types';
import { formatDateTime, formatINR } from '../utils/formatters';

interface ExpenseLogProps {
  expenses: Expense[];
  members: TeamMember[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onViewReceipt: (imageUrl: string, title: string) => void;
  initialMemberFilter?: MemberId | 'all';
}

export const ExpenseLog: React.FC<ExpenseLogProps> = ({
  expenses,
  members,
  onEditExpense,
  onDeleteExpense,
  onViewReceipt,
  initialMemberFilter = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [memberFilter, setMemberFilter] = useState<MemberId | 'all'>(initialMemberFilter);
  const [paymentModeFilter, setPaymentModeFilter] = useState<PaymentMode | 'all'>('all');
  const [billFilter, setBillFilter] = useState<'all' | 'with-bill' | 'no-bill'>('all');
  const [dateFilter, setDateFilter] = useState<string>(''); // YYYY-MM-DD
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const memberMap = useMemo(() => {
    return new Map(members.map((m) => [m.id, m]));
  }, [members]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((item) => {
        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const memberName = memberMap.get(item.doneBy)?.name.toLowerCase() || '';
          const matchReason = item.reason.toLowerCase().includes(q);
          const matchMember = memberName.includes(q);
          const matchLocation = item.location?.toLowerCase().includes(q) || false;
          const matchNotes = item.notes?.toLowerCase().includes(q) || false;
          if (!matchReason && !matchMember && !matchLocation && !matchNotes) {
            return false;
          }
        }

        // Member filter
        if (memberFilter !== 'all' && item.doneBy !== memberFilter) {
          return false;
        }

        // Payment mode filter
        if (paymentModeFilter !== 'all' && item.paymentMode !== paymentModeFilter) {
          return false;
        }

        // Bill availability filter
        if (billFilter === 'with-bill' && !item.billAvailable) {
          return false;
        }
        if (billFilter === 'no-bill' && item.billAvailable) {
          return false;
        }

        // Date filter
        if (dateFilter) {
          const itemDate = item.timestamp.split('T')[0];
          if (itemDate !== dateFilter) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [expenses, searchQuery, memberFilter, paymentModeFilter, billFilter, dateFilter, memberMap]);

  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setMemberFilter('all');
    setPaymentModeFilter('all');
    setBillFilter('all');
    setDateFilter('');
  };

  const hasActiveFilters =
    searchQuery ||
    memberFilter !== 'all' ||
    paymentModeFilter !== 'all' ||
    billFilter !== 'all' ||
    dateFilter !== '';

  return (
    <div className="space-y-4">
      {/* Controls & Search Bar */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          {/* Free text search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search expenses by reason, member, location, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-750 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Member Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => setMemberFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                memberFilter === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              All Members
            </button>
            {members.map((m) => (
              <button
                key={m.id}
                onClick={() => setMemberFilter(m.id)}
                className={`px-2.5 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  memberFilter === m.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${m.avatarColor}`} />
                <span>{m.name}</span>
              </button>
            ))}

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border flex items-center gap-1 transition-colors ${
                showFilters || hasActiveFilters
                  ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="More Filters"
            >
              <Filter className="w-3.5 h-3.5" />
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Filters Drawer (Category removed) */}
        {showFilters && (
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in duration-150">
            {/* Payment Mode */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Payment Mode</label>
              <select
                value={paymentModeFilter}
                onChange={(e) => setPaymentModeFilter(e.target.value as PaymentMode | 'all')}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none"
              >
                <option value="all">All Modes (Cash & Online)</option>
                <option value="Cash">Cash Only</option>
                <option value="Online">Online (UPI/Cards) Only</option>
              </select>
            </div>

            {/* Bill Status */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Bill / Receipt</label>
              <select
                value={billFilter}
                onChange={(e) => setBillFilter(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none"
              >
                <option value="all">All Records</option>
                <option value="with-bill">Bill Attached / Available</option>
                <option value="no-bill">Missing Bill / Un-vouched</option>
              </select>
            </div>

            {/* Date filter */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400 uppercase">Specific Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 outline-none font-mono"
              />
            </div>

            {/* Reset Filters button */}
            <div className="sm:col-span-3 flex items-end justify-end pt-1">
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
          <div>
            Showing <strong className="text-slate-200">{filteredExpenses.length}</strong> of{' '}
            {expenses.length} mission expenses
          </div>
          <div>
            Filtered Total: <strong className="text-emerald-400">{formatINR(totalFilteredAmount)}</strong>
          </div>
        </div>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center space-y-3 bg-slate-900/40">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-slate-200">
              {expenses.length === 0 ? 'No Expenses Logged Yet' : 'No Matching Expenses Found'}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {expenses.length === 0
                ? 'The ground intelligence mission ledger is fresh and ready. Tap "+ Log Expense" to record the first operational expense.'
                : 'No ground expenses match your current search query or filter criteria.'}
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredExpenses.map((expense) => {
            const member = memberMap.get(expense.doneBy) || {
              name: expense.doneBy,
              avatarColor: 'from-slate-600 to-slate-700',
              callsign: 'OP',
            };

            return (
              <div
                key={expense.id}
                className="group rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-3.5 sm:p-4 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left Column: Member Avatar, Reason, Tags */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${member.avatarColor} shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md mt-0.5`}
                      title={`${member.name} (${member.callsign})`}
                    >
                      {member.name[0]}
                    </div>

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-200">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">•</span>
                        <span className="text-[11px] font-mono text-slate-400">
                          {formatDateTime(expense.timestamp)}
                        </span>
                      </div>

                      {/* Reason Description */}
                      <p className="text-sm font-medium text-slate-100 break-words">
                        {expense.reason}
                      </p>

                      {/* Location & Notes */}
                      {(expense.location || expense.notes) && (
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                          {expense.location && (
                            <span className="flex items-center gap-1">
                              <span className="text-slate-500">📍</span>
                              <span>{expense.location}</span>
                            </span>
                          )}
                          {expense.notes && (
                            <span className="text-slate-400 italic">
                              "{expense.notes}"
                            </span>
                          )}
                        </div>
                      )}

                      {/* Pills: Payment Mode & Bill Status (Category removed) */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {/* Payment Mode */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 ${
                            expense.paymentMode === 'Cash'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60'
                          }`}
                        >
                          {expense.paymentMode === 'Cash' ? (
                            <Banknote className="w-3 h-3" />
                          ) : (
                            <CreditCard className="w-3 h-3" />
                          )}
                          <span>{expense.paymentMode}</span>
                        </span>

                        {/* Bill Status */}
                        {expense.billAvailable ? (
                          <button
                            type="button"
                            onClick={() =>
                              expense.billImageUrl
                                ? onViewReceipt(expense.billImageUrl, expense.reason)
                                : undefined
                            }
                            className={`px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 transition-colors ${
                              expense.billImageUrl
                                ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-700 hover:bg-indigo-900 cursor-pointer'
                                : 'bg-slate-800/80 text-slate-300 border border-slate-700'
                            }`}
                          >
                            <Receipt className="w-3 h-3 text-indigo-400" />
                            <span>Bill Available</span>
                            {expense.billImageUrl && (
                              <span className="underline ml-0.5 text-indigo-200">View</span>
                            )}
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-400/90 bg-amber-950/50 border border-amber-800/50 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            <span>No Bill</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Amount & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80 gap-1.5 shrink-0">
                    <div className="text-right">
                      <div className="text-lg sm:text-xl font-mono font-bold text-emerald-400 tabular-nums">
                        {formatINR(expense.amount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {expense.billImageUrl && (
                        <button
                          onClick={() => onViewReceipt(expense.billImageUrl!, expense.reason)}
                          title="View Receipt"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onEditExpense(expense)}
                        title="Edit Entry"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        title="Delete Entry"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
