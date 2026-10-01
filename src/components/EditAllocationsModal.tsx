import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { MemberId, TeamMember } from '../types';
import { formatINR } from '../utils/formatters';

interface EditAllocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: TeamMember[];
  onSaveAllocations: (newAllocations: Record<MemberId, number>) => void;
}

export const EditAllocationsModal: React.FC<EditAllocationsModalProps> = ({
  isOpen,
  onClose,
  members,
  onSaveAllocations,
}) => {
  const [allocations, setAllocations] = useState<Record<MemberId, string>>({
    aniket: '35000',
    darsh: '35000',
    geetika: '35000',
    aditi: '35000',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const initialMap: Record<MemberId, string> = {
        aniket: '35000',
        darsh: '35000',
        geetika: '35000',
        aditi: '35000',
      };
      members.forEach((m) => {
        initialMap[m.id] = m.allocation.toString();
      });
      setAllocations(initialMap);
      setError(null);
    }
  }, [isOpen, members]);

  if (!isOpen) return null;

  const handleChange = (id: MemberId, val: string) => {
    setAllocations((prev) => ({
      ...prev,
      [id]: val,
    }));
  };

  const calculatedTotal = Object.values(allocations).reduce((sum, val) => {
    const num = parseFloat(val) || 0;
    return sum + num;
  }, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed: Record<MemberId, number> = {
      aniket: 0,
      darsh: 0,
      geetika: 0,
      aditi: 0,
    };

    for (const [id, val] of Object.entries(allocations)) {
      const num = parseFloat(val);
      if (isNaN(num) || num < 0) {
        setError(`Please enter a valid non-negative allocation amount for all members.`);
        return;
      }
      parsed[id as MemberId] = Math.round(num);
    }

    onSaveAllocations(parsed);
    onClose();
  };

  const handleResetDefault = () => {
    setAllocations({
      aniket: '35000',
      darsh: '35000',
      geetika: '35000',
      aditi: '35000',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl p-5 sm:p-6 text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-200 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              ₹
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-100">
                Edit Operative Allocations
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Adjust individual budgets & consolidated total
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

        {error && (
          <div className="p-3 rounded-lg bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-300">
            Set custom ground allocations for each member. The consolidated team budget updates dynamically to match the sum.
          </p>

          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${member.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}
                  >
                    {member.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs text-slate-200">
                      {member.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono truncate">
                      {member.callsign} · {member.role}
                    </div>
                  </div>
                </div>

                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-emerald-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    required
                    value={allocations[member.id] || ''}
                    onChange={(e) => handleChange(member.id, e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-right font-mono font-bold text-white text-sm outline-none focus:border-emerald-500 tabular-nums"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Consolidated Sum Preview */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase">
                Consolidated Team Total
              </div>
              <div className="text-[11px] text-slate-500">
                Sum of 4 allocations
              </div>
            </div>
            <div className="text-xl font-mono font-extrabold text-emerald-400 tabular-nums">
              {formatINR(calculatedTotal)}
            </div>
          </div>

          {/* Reset button */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={handleResetDefault}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to default ₹35k each</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Allocations</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
