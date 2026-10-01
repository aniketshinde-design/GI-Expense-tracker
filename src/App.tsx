import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Download, RefreshCw, BookOpen, AlertTriangle, ShieldCheck, 
  Calendar, CheckCircle, Database, Edit3 
} from 'lucide-react';
import { Expense, MemberId, TeamMember } from './types';
import { INITIAL_TEAM_MEMBERS, MISSION_CONFIG } from './data/seedData';
import { 
  calculateMemberStats, 
  calculateTeamStats, 
  exportExpensesToCSV, 
  exportExpensesToJSON, 
  formatINR 
} from './utils/formatters';
import { Header } from './components/Header';
import { ConsolidatedBanner } from './components/ConsolidatedBanner';
import { MemberCardsGrid } from './components/MemberCardsGrid';
import { ExpenseLog } from './components/ExpenseLog';
import { AddExpenseModal } from './components/AddExpenseModal';
import { EditExpenseModal } from './components/EditExpenseModal';
import { IndividualLedgerModal } from './components/IndividualLedgerModal';
import { TeamAnalyticsView } from './components/TeamAnalyticsView';
import { ReceiptViewerModal } from './components/ReceiptViewerModal';
import { SystemSpecModal } from './components/SystemSpecModal';
import { EditAllocationsModal } from './components/EditAllocationsModal';

const EXPENSES_STORAGE_KEY = 'groundops_clean_ledger_v2';
const MEMBERS_STORAGE_KEY = 'groundops_clean_members_v2';

export default function App() {
  // Members with editable allocation (defaults to Aniket, Darsh, Geetika, Aditi @ ₹35k each)
  const [members, setMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 4) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved member allocations', e);
    }
    return INITIAL_TEAM_MEMBERS;
  });

  // Expenses: Starts with NO previous logs by default
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved expenses', e);
    }
    return []; // No previous logs included
  });

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'analytics'>('dashboard');

  // Modals state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);
  const [addExpenseInitialMember, setAddExpenseInitialMember] = useState<MemberId>('aniket');

  const [isEditExpenseOpen, setIsEditExpenseOpen] = useState<boolean>(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);

  const [isIndividualLedgerOpen, setIsIndividualLedgerOpen] = useState<boolean>(false);
  const [selectedLedgerMemberId, setSelectedLedgerMemberId] = useState<MemberId | null>(null);

  const [isEditAllocationsOpen, setIsEditAllocationsOpen] = useState<boolean>(false);
  const [isSpecModalOpen, setIsSpecModalOpen] = useState<boolean>(false);

  const [receiptModal, setReceiptModal] = useState<{ isOpen: boolean; url: string | null; title?: string }>({
    isOpen: false,
    url: null,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist expenses
  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify(expenses));
    } catch (e) {
      console.error('Error saving expenses to localStorage', e);
    }
  }, [expenses]);

  // Persist members
  useEffect(() => {
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
    } catch (e) {
      console.error('Error saving members to localStorage', e);
    }
  }, [members]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Calculations
  const memberStatsList = useMemo(() => {
    return members.map((m) => calculateMemberStats(m, expenses));
  }, [members, expenses]);

  const teamStats = useMemo(() => {
    return calculateTeamStats(expenses, members);
  }, [expenses, members]);

  // Handlers
  const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Logged ₹${newExpense.amount} under ${members.find((m) => m.id === newExpense.doneBy)?.name}`);
  };

  const handleUpdateExpense = (updated: Expense) => {
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    showToast(`Updated expense record (${formatINR(updated.amount)})`);
  };

  const handleDeleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (target) {
      showToast(`Deleted entry. ${formatINR(target.amount)} restored to balance.`);
    }
  };

  const handleSaveAllocations = (newAllocations: Record<MemberId, number>) => {
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        allocation: newAllocations[m.id] ?? m.allocation,
      }))
    );
    showToast('Updated operative allocations and consolidated budget.');
  };

  const handleOpenAddExpense = (memberId?: MemberId) => {
    setAddExpenseInitialMember(memberId || 'aniket');
    setIsAddExpenseOpen(true);
  };

  const handleOpenIndividualLedger = (memberId: string) => {
    setSelectedLedgerMemberId(memberId as MemberId);
    setIsIndividualLedgerOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsEditExpenseOpen(true);
  };

  const handleViewReceipt = (url: string, title: string) => {
    setReceiptModal({
      isOpen: true,
      url,
      title,
    });
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all recorded expenses to reset the ledger?')) {
      setExpenses([]);
      showToast('All expense records cleared.');
    }
  };

  const selectedMemberForLedger = members.find((m) => m.id === selectedLedgerMemberId) || null;
  const selectedMemberStatsForLedger = memberStatsList.find((s) => s.member.id === selectedLedgerMemberId) || null;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 pb-20 sm:pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 rounded-xl bg-slate-900 border border-emerald-500/60 p-3 sm:p-4 text-emerald-300 text-xs sm:text-sm font-medium shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tactical Header */}
      <Header
        members={members}
        onOpenAddExpense={() => handleOpenAddExpense()}
        onOpenEditAllocations={() => setIsEditAllocationsOpen(true)}
        onOpenSpecs={() => setIsSpecModalOpen(true)}
        onExportCSV={() => {
          exportExpensesToCSV(expenses, members);
          showToast('Downloaded CSV expense ledger');
        }}
        onResetData={handleClearAll}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Page Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        {/* TAB 1: DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Consolidated Team Hero Card (editable consolidated budget) */}
            <ConsolidatedBanner
              teamStats={teamStats}
              memberStatsList={memberStatsList}
              onSelectMember={handleOpenIndividualLedger}
              onOpenAddExpense={() => handleOpenAddExpense()}
              onOpenEditAllocations={() => setIsEditAllocationsOpen(true)}
            />

            {/* Individual Operatives Grid (4 cards for Aniket, Darsh, Geetika, Aditi) */}
            <MemberCardsGrid
              memberStatsList={memberStatsList}
              onSelectMember={handleOpenIndividualLedger}
              onOpenEditAllocations={() => setIsEditAllocationsOpen(true)}
            />

            {/* Quick Actions and Activity Context Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Mission Timeline Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase">Mission Window</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200">
                    2 Oct 2026 – 18 Oct 2026
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono">
                    17 Days Operational Window
                  </div>
                </div>
              </div>

              {/* Data Safety & Export Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Field Data Sync</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200">
                      Persistent Offline Safe
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {expenses.length} records logged
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => exportExpensesToCSV(expenses, members)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-mono flex items-center gap-1 border border-slate-700"
                  title="Download CSV"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>CSV</span>
                </button>
              </div>

              {/* Edit Allocations Quick Card */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-800 text-indigo-400 flex items-center justify-center shrink-0">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Budget Allocations</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200">
                      {formatINR(teamStats.totalBudget)} Pool
                    </div>
                    <div className="text-[11px] text-indigo-300">
                      Configurable per member
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditAllocationsOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700 text-indigo-200 text-xs font-medium"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Recent Expenses Preview Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                    <span>Recent Mission Expenses</span>
                    <span className="text-xs font-mono font-normal text-slate-400">
                      (Live Ground Audit)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Chronological activity log recorded across field operatives
                  </p>
                </div>
                {expenses.length > 0 && (
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    View All Log ({expenses.length}) →
                  </button>
                )}
              </div>

              <ExpenseLog
                expenses={expenses.slice(0, 5)}
                members={members}
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense}
                onViewReceipt={handleViewReceipt}
              />
            </div>
          </div>
        )}

        {/* TAB 2: EXPENSE LOG & HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  Mission Expense Audit Ledger
                </h2>
                <p className="text-xs text-slate-400">
                  Comprehensive chronological ledger with filtering, receipt attachments, and full audit trail
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportExpensesToCSV(expenses, members)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={() => handleOpenAddExpense()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Expense</span>
                </button>
              </div>
            </div>

            <ExpenseLog
              expenses={expenses}
              members={members}
              onEditExpense={handleEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onViewReceipt={handleViewReceipt}
            />
          </div>
        )}

        {/* TAB 3: CONSOLIDATED TEAM ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-100">
                  Consolidated Budget Intelligence
                </h2>
                <p className="text-xs text-slate-400">
                  Spend distributions against allocations, burn velocity, and field liquidity
                </p>
              </div>

              <button
                onClick={() => setIsEditAllocationsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium"
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Adjust Allocations</span>
              </button>
            </div>

            <TeamAnalyticsView
              teamStats={teamStats}
              memberStatsList={memberStatsList}
              expenses={expenses}
              onSelectMember={handleOpenIndividualLedger}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile Field Logging */}
      <div className="fixed bottom-5 right-5 z-40 sm:hidden">
        <button
          onClick={() => handleOpenAddExpense()}
          className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 border-2 border-emerald-400/80 cursor-pointer"
          title="Log Expense"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
        </button>
      </div>

      {/* Footer Info & Reset */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] text-[11px] text-slate-500 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-400">OPERATION VANGUARD</span>
            <span>•</span>
            <span>Ground Intelligence Unit</span>
            <span>•</span>
            <span>{formatINR(teamStats.totalBudget)} Total Budget</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditAllocationsOpen(true)}
              className="text-emerald-400 hover:underline"
            >
              Edit Allocations
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSpecModalOpen(true)}
              className="text-indigo-400 hover:underline"
            >
              System Specifications
            </button>
            <span>•</span>
            <button
              onClick={handleClearAll}
              className="text-rose-400/80 hover:text-rose-300"
            >
              Clear All Logs
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
        members={members}
        memberStatsList={memberStatsList}
        initialMemberId={addExpenseInitialMember}
      />

      <EditExpenseModal
        isOpen={isEditExpenseOpen}
        expense={expenseToEdit}
        onClose={() => {
          setIsEditExpenseOpen(false);
          setExpenseToEdit(null);
        }}
        onSave={handleUpdateExpense}
        onDelete={handleDeleteExpense}
        members={members}
        memberStatsList={memberStatsList}
      />

      <IndividualLedgerModal
        isOpen={isIndividualLedgerOpen}
        onClose={() => {
          setIsIndividualLedgerOpen(false);
          setSelectedLedgerMemberId(null);
        }}
        member={selectedMemberForLedger}
        stats={selectedMemberStatsForLedger}
        expenses={expenses}
        onOpenAddExpenseForMember={(memId) => handleOpenAddExpense(memId as MemberId)}
        onEditExpense={handleEditExpense}
        onViewReceipt={handleViewReceipt}
      />

      <EditAllocationsModal
        isOpen={isEditAllocationsOpen}
        onClose={() => setIsEditAllocationsOpen(false)}
        members={members}
        onSaveAllocations={handleSaveAllocations}
      />

      <ReceiptViewerModal
        isOpen={receiptModal.isOpen}
        imageUrl={receiptModal.url}
        title={receiptModal.title}
        onClose={() => setReceiptModal({ isOpen: false, url: null })}
      />

      <SystemSpecModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />
    </div>
  );
}
