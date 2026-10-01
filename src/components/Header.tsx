import React from 'react';
import { Shield, Download, BookOpen, Clock } from 'lucide-react';
import { TeamMember } from '../types';
import { MISSION_CONFIG } from '../data/seedData';

interface HeaderProps {
  members: TeamMember[];
  onOpenAddExpense: () => void;
  onOpenEditAllocations: () => void;
  onOpenSpecs: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  activeTab: 'dashboard' | 'history' | 'analytics';
  setActiveTab: (tab: 'dashboard' | 'history' | 'analytics') => void;
}

export const Header: React.FC<HeaderProps> = ({
  members,
  onOpenAddExpense,
  onOpenEditAllocations,
  onOpenSpecs,
  onExportCSV,
  onResetData,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Top Mission Identification Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 border-b border-slate-850/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse absolute -top-0.5 -right-0.5" />
            <Shield className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-mono uppercase font-bold tracking-wider text-emerald-400">
              {MISSION_CONFIG.codename}
            </span>
            <span className="hidden sm:inline text-slate-400 mx-2">|</span>
            <span className="hidden sm:inline text-slate-300 font-medium">Ground Intel Activity</span>
          </div>
        </div>

        {/* Date Window Badge & Top Tools */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold text-slate-200">02 OCT – 18 OCT 2026</span>
            <span className="text-cyan-400/90 font-medium ml-1 hidden xs:inline">(17 Days)</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenEditAllocations}
              title="Edit Member Allocations"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <span className="font-mono text-emerald-400 font-bold">₹</span>
              <span className="hidden md:inline">Edit Allocations</span>
              <span className="md:hidden">Allocations</span>
            </button>

            <button
              onClick={onOpenSpecs}
              title="System Architecture & Specifications"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 text-[11px] font-medium transition-colors"
            >
              <BookOpen className="w-3 h-3" />
              <span className="hidden md:inline">Spec & Architecture</span>
              <span className="md:hidden">Spec</span>
            </button>

            <button
              onClick={onExportCSV}
              title="Export CSV Ledger"
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: Team Summary, Navigation Tabs, and Primary Action Button */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Team Members Roster Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5 overflow-hidden">
            {members.map((member) => (
              <div
                key={member.id}
                title={`${member.name} (${member.role})`}
                className={`inline-block h-6 w-6 rounded-full ring-2 ring-[#090d16] bg-gradient-to-tr ${member.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}
              >
                {member.name[0]}
              </div>
            ))}
          </div>
          <div className="hidden sm:block text-xs text-slate-300 font-medium">
            <span>Aniket, Darsh, Geetika, Aditi</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log & History
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Analytics
          </button>
        </nav>

        {/* Primary Action Button */}
        <div>
          <button
            onClick={onOpenAddExpense}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <span className="text-base leading-none font-extrabold">+</span>
            <span>Log Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
