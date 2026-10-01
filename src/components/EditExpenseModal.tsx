import React, { useState, useEffect } from 'react';
import { X, Check, AlertTriangle, Camera, Trash2 } from 'lucide-react';
import { Expense, MemberId, PaymentMode, TeamMember, MemberStats } from '../types';
import { formatINR } from '../utils/formatters';

interface EditExpenseModalProps {
  isOpen: boolean;
  expense: Expense | null;
  onClose: () => void;
  onSave: (updatedExpense: Expense) => void;
  onDelete: (expenseId: string) => void;
  members: TeamMember[];
  memberStatsList: MemberStats[];
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  isOpen,
  expense,
  onClose,
  onSave,
  onDelete,
  members,
  memberStatsList,
}) => {
  const [amountStr, setAmountStr] = useState<string>('');
  const [doneBy, setDoneBy] = useState<MemberId>('aniket');
  const [reason, setReason] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Online');
  const [billAvailable, setBillAvailable] = useState<boolean>(true);
  const [billImageUrl, setBillImageUrl] = useState<string | undefined>(undefined);
  const [timestamp, setTimestamp] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (expense) {
      setAmountStr(expense.amount.toString());
      setDoneBy(expense.doneBy);
      setReason(expense.reason);
      setPaymentMode(expense.paymentMode);
      setBillAvailable(expense.billAvailable);
      setBillImageUrl(expense.billImageUrl);
      try {
        const d = new Date(expense.timestamp);
        const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16);
        setTimestamp(localIso);
      } catch {
        setTimestamp(expense.timestamp);
      }
      setLocation(expense.location || '');
      setNotes(expense.notes || '');
      setShowDeleteConfirm(false);
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const numericAmount = parseFloat(amountStr) || 0;

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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0 || !reason.trim()) return;

    onSave({
      ...expense,
      amount: Math.round(numericAmount),
      doneBy,
      reason: reason.trim(),
      paymentMode,
      billAvailable,
      billImageUrl: billAvailable ? billImageUrl : undefined,
      timestamp: timestamp ? new Date(timestamp).toISOString() : expense.timestamp,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl p-5 sm:p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              Edit Expense Record
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              ID: {expense.id} · Balances recalculate automatically
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {showDeleteConfirm ? (
          <div className="py-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-100">Confirm Record Deletion?</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Deleting this ₹{expense.amount} expense will immediately credit back{' '}
                <strong className="text-emerald-400 font-mono">{formatINR(expense.amount)}</strong> to{' '}
                {members.find((m) => m.id === expense.doneBy)?.name} and the team pool.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(expense.id);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            {/* Amount & Member */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  AMOUNT (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-emerald-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-lg font-mono font-bold text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  OPERATIVE (DONE BY)
                </label>
                <select
                  value={doneBy}
                  onChange={(e) => setDoneBy(e.target.value as MemberId)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 outline-none focus:border-emerald-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.callsign})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-xs font-mono font-semibold text-slate-300">
                REASON / DESCRIPTION
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            {/* Payment Mode & Bill Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  PAYMENT MODE
                </label>
                <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Cash')}
                    className={`py-1 rounded-lg font-semibold ${
                      paymentMode === 'Cash' ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMode('Online')}
                    className={`py-1 rounded-lg font-semibold ${
                      paymentMode === 'Online' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Online
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  BILL STATUS
                </label>
                <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillAvailable(true)}
                    className={`py-1 rounded-lg font-semibold ${
                      billAvailable ? 'bg-emerald-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBillAvailable(false);
                      setBillImageUrl(undefined);
                    }}
                    className={`py-1 rounded-lg font-semibold ${
                      !billAvailable ? 'bg-slate-700 text-white' : 'text-slate-400'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Bill Receipt Photo */}
            {billAvailable && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Receipt Voucher</span>
                  {billImageUrl && (
                    <button
                      type="button"
                      onClick={() => setBillImageUrl(undefined)}
                      className="text-rose-400 hover:underline"
                    >
                      Remove photo
                    </button>
                  )}
                </div>
                {billImageUrl ? (
                  <div className="h-20 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                    <img src={billImageUrl} alt="Receipt" className="h-full object-contain" />
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-2 rounded-lg border border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/60 cursor-pointer text-xs text-slate-400">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Attach Receipt Photo</span>
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

            {/* Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  DATE & TIME
                </label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold text-slate-300">
                  LOCATION
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Optional site"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1.5 rounded hover:bg-rose-950/40 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Entry</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
