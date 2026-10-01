import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, Camera, Upload, Plus, Receipt, ArrowRight } from 'lucide-react';
import { Expense, MemberId, PaymentMode, TeamMember, MemberStats } from '../types';
import { COMMON_FIELD_REASONS } from '../data/seedData';
import { formatINR } from '../utils/formatters';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  members: TeamMember[];
  memberStatsList: MemberStats[];
  initialMemberId?: MemberId;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  members,
  memberStatsList,
  initialMemberId,
}) => {
  const [amountStr, setAmountStr] = useState<string>('');
  const [doneBy, setDoneBy] = useState<MemberId>(initialMemberId || 'aniket');
  const [reason, setReason] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Online');
  const [billAvailable, setBillAvailable] = useState<boolean>(true);
  const [billImageUrl, setBillImageUrl] = useState<string | undefined>(undefined);
  const [timestamp, setTimestamp] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Form submission feedback state
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState<boolean>(false);
  const [lastLoggedAmount, setLastLoggedAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialMemberId) {
        setDoneBy(initialMemberId);
      }
      const now = new Date();
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setTimestamp(localIso);
      setSubmittedSuccessfully(false);
      setErrorMessage(null);
    }
  }, [isOpen, initialMemberId]);

  if (!isOpen) return null;

  const numericAmount = parseFloat(amountStr) || 0;
  const selectedMemberStat = memberStatsList.find((s) => s.member.id === doneBy);
  const remainingBefore = selectedMemberStat ? selectedMemberStat.remaining : (members.find(m => m.id === doneBy)?.allocation || 35000);
  const remainingAfter = remainingBefore - numericAmount;
  const wouldExceedBudget = remainingAfter < 0;
  const wouldBeLowBalance = remainingAfter > 0 && remainingAfter <= 5000;

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseFloat(amountStr) || 0;
    setAmountStr((current + addValue).toString());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBillImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (numericAmount <= 0) {
      setErrorMessage('Please enter a valid expense amount greater than ₹0.');
      return;
    }

    if (!reason.trim()) {
      setErrorMessage('Please provide a reason or description for this expense.');
      return;
    }

    onAddExpense({
      amount: Math.round(numericAmount),
      doneBy,
      reason: reason.trim(),
      paymentMode,
      billAvailable,
      billImageUrl: billAvailable ? billImageUrl : undefined,
      timestamp: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString(),
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setLastLoggedAmount(numericAmount);
    setSubmittedSuccessfully(true);
  };

  const handleResetForAnother = () => {
    setAmountStr('');
    setReason('');
    setBillImageUrl(undefined);
    setNotes('');
    setLocation('');
    setSubmittedSuccessfully(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl p-5 sm:p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                Log Mission Expense
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Immediate Real-time Deduction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success Feedback View */}
        {submittedSuccessfully ? (
          <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-100">Expense Logged Successfully</h4>
              <p className="text-sm font-mono text-emerald-400">
                {formatINR(lastLoggedAmount)} deducted from {members.find((m) => m.id === doneBy)?.name}
              </p>
              <p className="text-xs text-slate-400">
                Consolidated team balance and individual ledger updated in real time.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={handleResetForAnother}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log Another Expense</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium text-sm transition-all"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. AMOUNT INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
                <span>AMOUNT (₹) *</span>
                <span className="text-[11px] text-slate-400">INR Currency</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-bold text-emerald-400 font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  min="1"
                  required
                  placeholder="0"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-2xl font-mono font-bold text-white placeholder-slate-600 outline-none tabular-nums"
                  autoFocus
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[100, 200, 500, 1000, 2000, 5000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuickAddAmount(val)}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-300 hover:text-white font-mono text-xs transition-colors border border-slate-700/60"
                  >
                    +{formatINR(val)}
                  </button>
                ))}
                {numericAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmountStr('')}
                    className="px-2 py-1 rounded-md bg-rose-950/60 hover:bg-rose-900 text-rose-300 font-mono text-xs transition-colors border border-rose-800/60"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* 2. DONE BY (WHO PAID / WHOSE ALLOCATION) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
                <span>DONE BY (OPERATIVE ALLOCATION) *</span>
                <span className="text-[11px] text-slate-400">Deducts from individual allocation</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {members.map((m) => {
                  const stat = memberStatsList.find((s) => s.member.id === m.id);
                  const remaining = stat ? stat.remaining : m.allocation;
                  const isSelected = doneBy === m.id;

                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setDoneBy(m.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-tr ${m.avatarColor} flex items-center justify-center text-white font-bold text-[10px]`}>
                          {m.name[0]}
                        </div>
                        <div className="font-semibold text-xs text-slate-200 truncate">
                          {m.name}
                        </div>
                      </div>
                      <div className="mt-1 text-[11px] font-mono text-slate-400">
                        Left: <span className={remaining < 5000 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>{formatINR(remaining)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {numericAmount > 0 && selectedMemberStat && (
                <div
                  className={`p-2.5 rounded-lg border text-xs font-mono transition-all flex items-center justify-between ${
                    wouldExceedBudget
                      ? 'bg-rose-950/50 border-rose-700 text-rose-300'
                      : wouldBeLowBalance
                      ? 'bg-amber-950/50 border-amber-700 text-amber-300'
                      : 'bg-slate-850 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {wouldExceedBudget ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : wouldBeLowBalance ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span>
                      {selectedMemberStat.member.name}'s balance will become{' '}
                      <strong className="underline">{formatINR(remainingAfter)}</strong>
                    </span>
                  </div>
                  {wouldExceedBudget && (
                    <span className="font-bold text-[10px] uppercase text-rose-400 bg-rose-900/60 px-2 py-0.5 rounded">
                      Over Budget!
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 3. REASON / DESCRIPTION (Category removed) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  REASON / DESCRIPTION *
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Field purpose</span>
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Fuel for surveillance vehicle, Lunch ration, Toll"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-slate-500 outline-none"
              />

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1 pt-1">
                {COMMON_FIELD_REASONS.slice(0, 5).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setReason(item)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-850 hover:bg-slate-750 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. PAYMENT MODE & BILL AVAILABILITY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  PAYMENT MODE
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Cash')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      paymentMode === 'Cash'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Online')}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      paymentMode === 'Online'
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    💳 Online
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  BILL AVAILABLE?
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setBillAvailable(true)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      billAvailable
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ✓ Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBillAvailable(false);
                      setBillImageUrl(undefined);
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      !billAvailable
                        ? 'bg-slate-700 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ✕ No
                  </button>
                </div>
              </div>
            </div>

            {/* Bill Photo Upload */}
            {billAvailable && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                    Receipt Voucher Photo (Optional)
                  </span>
                  {billImageUrl && (
                    <button
                      type="button"
                      onClick={() => setBillImageUrl(undefined)}
                      className="text-[11px] text-rose-400 hover:underline"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                {billImageUrl ? (
                  <div className="relative w-full h-24 rounded-lg bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
                    <img
                      src={billImageUrl}
                      alt="Bill receipt"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-2.5 rounded-lg border border-dashed border-slate-700 hover:border-slate-500 bg-slate-900/60 cursor-pointer text-xs text-slate-400 hover:text-slate-200 transition-colors">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Upload or Capture Receipt Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* 5. DATE & TIME & LOCATION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  DATE & TIME
                </label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  LOCATION / SITE (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sector 4 Outpost, Toll Plaza"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:border-emerald-500 outline-none placeholder-slate-600"
                />
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium text-xs sm:text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Submit & Deduct Balance</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
