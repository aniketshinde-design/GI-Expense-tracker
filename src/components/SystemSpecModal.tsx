import React, { useState } from 'react';
import { X, BookOpen, Layers, Layout, Server, Database, AlertCircle, Copy, Check, ShieldCheck } from 'lucide-react';

interface SystemSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemSpecModal: React.FC<SystemSpecModalProps> = ({ isOpen, onClose }) => {
  const [activeSpecTab, setActiveSpecTab] = useState<'ia' | 'wireframes' | 'techstack' | 'datamodel' | 'edgecases'>('ia');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopySpec = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-750 shadow-2xl p-5 sm:p-7 text-slate-100 my-auto flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                GroundOps System Architecture & Field Specification
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Operation Vanguard · 4-Member Team (2–18 Oct 2026) · ₹1,40,000 Budget
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

        {/* Spec Navigation Tabs */}
        <div className="flex items-center gap-1.5 py-3 border-b border-slate-800 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => setActiveSpecTab('ia')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeSpecTab === 'ia'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>1. Information Architecture</span>
          </button>
          <button
            onClick={() => setActiveSpecTab('wireframes')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeSpecTab === 'wireframes'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>2. Wireframe Specifications</span>
          </button>
          <button
            onClick={() => setActiveSpecTab('techstack')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeSpecTab === 'techstack'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>3. Suggested Tech Stack</span>
          </button>
          <button
            onClick={() => setActiveSpecTab('datamodel')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeSpecTab === 'datamodel'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>4. Data Model & Math Invariants</span>
          </button>
          <button
            onClick={() => setActiveSpecTab('edgecases')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-colors ${
              activeSpecTab === 'edgecases'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>5. Edge Cases & Validation Rules</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto py-4 text-xs sm:text-sm text-slate-300 space-y-4 pr-1 leading-relaxed">
          {activeSpecTab === 'ia' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>1. High-Level Information Architecture & Screen Flow</span>
              </h4>
              <p>
                The mobile-first field architecture is designed for zero-cognitive-friction operation in challenging conditions (moving vehicles, night surveillance, spotty network connections).
              </p>

              {/* ASCII Flowchart */}
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] sm:text-xs text-emerald-400 border border-slate-800 overflow-x-auto whitespace-pre">
{`[ FIELD OPERATIVE / MOBILE DEVICE ]
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL APP SHELL (Header & Active Identity Switcher)     │
│    • Operator: Aniket / Darsh / Geetika / Aditi             │
│    • Mission Window: 02 Oct – 18 Oct 2026 (Day countdown)   │
│    • Floating Action: Quick Log Expense (+₹)                │
└───────────────────────┬─────────────────────────────────────┘
                        │
       ┌────────────────┴────────────────────────┐
       ▼                                         ▼
┌───────────────────────────────┐     ┌───────────────────────────────┐
│ 2. DASHBOARD (COMMAND VIEW)   │     │ 3. ADD EXPENSE (FLOW)         │
│ • Team Consolidated Balance   │◄───┐│ • Amount (numeric pad + chips)│
│   starts ₹1,40,000 & burns    │    ││ • Done By: [4 Operatives]     │
│ • 4 Operative Allocation Cards│    ││ • Live deduction preview      │
│   (Aniket, Darsh, Geetika,    │    ││ • Reason & quick suggestions  │
│    Aditi: ₹35,000 each)       │    ││ • Mode: [Cash] / [Online]     │
│ • Alert Banner (< ₹5k warning)│    ││ • Bill: [Yes] / [No] + Photo  │
│ • Burn velocity (₹/day pace)  │    ││ • Success confirmation &      │
└──────────────┬────────────────┘    ││   "Log another expense" CTA   │
               │                     │└──────────────┬────────────────┘
       ┌───────┴──────┐              │               │
       ▼              ▼              └───────────────┘
┌──────────────┐┌──────────────┐             ▲
│ 4. INDIVIDUAL││ 5. EXPENSE   │             │
│    LEDGER    ││    LOG &     │             │
│ • Tap member ││    AUDIT     │─────────────┘
│ • Isolated   ││ • Search     │  (Recalculates balances on Edit/Delete)
│   ₹35k burn  ││ • Filters:   │
│ • Category   ││   Person,Mode│
│   breakdown  ││   Bill,Date  │
│ • Personal   ││ • Edit/Delete│
│   reimburse  ││ • CSV Export │
└──────────────┘└──────────────┘`}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-slate-200 mb-1">State Synchronicity</div>
                  <p className="text-slate-400 text-xs">
                    Every modification to an individual operative's log instantly cascades to the team's consolidated balance. No asynchronous reconciliation lag or stale balance counters.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-slate-200 mb-1">Audit Trail Transparency</div>
                  <p className="text-slate-400 text-xs">
                    All 4 members can inspect any line item at any second, ensuring total financial transparency across the entire 17-day ground assignment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSpecTab === 'wireframes' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>2. Key Wireframe Descriptions & Layout Blueprints</span>
              </h4>

              <div className="space-y-4">
                {/* Dashboard Wireframe */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 font-mono">
                    A. DASHBOARD (HOME SCREEN) WIREFRAME
                  </div>
                  <p className="text-slate-300 text-xs">
                    Mobile Viewport: 390px × 844px (Standard field phone layout)
                  </p>
                  <pre className="p-3 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
{`+-------------------------------------------------------------+
| [SHIELD] OPERATION VANGUARD      [02-18 OCT 2026] [CSV EXPORT]
| [AVATAR] Active: Aniket (Vanguard-1) v     [+ LOG EXPENSE]  |
+-------------------------------------------------------------+
| [!] FIELD WARNING: Darsh is below ₹5,000 contingency reserve|
+-------------------------------------------------------------+
| CONSOLIDATED MISSION POOL (Starts ₹1,40,000)                |
| REMAINING:  ₹ 1,18,371  / ₹1,40,000                         |
| [====================---------------------------------] 84% |
| Total Spent: ₹21,629 | Daily Burn: ₹7,210/d (Ceiling ₹8.2k) |
| Cash: ₹7,530         | Online: ₹14,099   | Bill Audit: 80%  |
+-------------------------------------------------------------+
| OPERATIVE ALLOCATIONS (₹35,000 each - Tap to inspect)       |
| +-------------------------+ +-------------------------+     |
| | (A) Aniket              | | (D) Darsh               |     |
| | Left: ₹30,600 (87%)     | | Left: ₹30,800 (88%)     |     |
| | Spent: ₹4,400 (3 items) | | Spent: ₹4,200 (2 items) |     |
| +-------------------------+ +-------------------------+     |
| +-------------------------+ +-------------------------+     |
| | (G) Geetika             | | (A) Aditi               |     |
| | Left: ₹33,170 (95%)     | | Left: ₹23,801 (68%)     |     |
| | Spent: ₹1,830 (2 items) | | Spent: ₹11,199 (3 items)|     |
| +-------------------------+ +-------------------------+     |
+-------------------------------------------------------------+`}
                  </pre>
                </div>

                {/* Add Expense Wireframe */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono">
                    B. ADD EXPENSE FORM WIREFRAME
                  </div>
                  <pre className="p-3 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
{`+-------------------------------------------------------------+
| LOG FIELD EXPENSE                                       [X] |
+-------------------------------------------------------------+
| AMOUNT (₹) *                                                |
| [ ₹ 3,250                                                ]  |
| [+100] [+200] [+500] [+1000] [+2000] [+5000] [Clear]        |
+-------------------------------------------------------------+
| DONE BY (OPERATIVE QUOTA) *                                 |
| [(•) Aniket: ₹30.6k] [( ) Darsh: ₹30.8k]                    |
| [( ) Geetika: ₹33.1k] [( ) Aditi: ₹23.8k]                   |
| -> Deduction Preview: Aniket's balance will become ₹27,350  |
+-------------------------------------------------------------+
| CATEGORY: [Travel & Fuel] [Food] [Stay] [Gear] [Comms] [Tip]|
| REASON / DESCRIPTION *: [Patrol vehicle diesel refill      ]|
| Suggestions: [Diesel refill] [Toll Plaza] [Ration for team] |
+-------------------------------------------------------------+
| PAYMENT MODE:  [ (•) Cash ]   [ ( ) Online / UPI ]          |
| BILL AVAILABLE: [ (•) Yes ]   [ ( ) No ]                    |
| [CAMERA ICON] [ Upload / Capture Receipt Voucher Photo ]    |
+-------------------------------------------------------------+
| DATE/TIME: [ 2026-10-02 08:45 ]  LOCATION: [ Sector 4 Out ] |
+-------------------------------------------------------------+
| [ Cancel ]                         [ SUBMIT & DEDUCT ₹3,250]|
+-------------------------------------------------------------+`}
                  </pre>
                </div>

                {/* Expense Log Wireframe */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-indigo-400 font-mono">
                    C. EXPENSE LOG & HISTORY WIREFRAME
                  </div>
                  <pre className="p-3 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
{`+-------------------------------------------------------------+
| [SEARCH: Reason, Operative, Notes...]                       |
| Filter: [All] [Aniket] [Darsh] [Geetika] [Aditi] [Filters v]|
| Showing 0 expenses · Filtered Total: ₹0                     |
+-------------------------------------------------------------+
| 02 Oct, 08:45 AM · Aniket (Vanguard-1)                      |
| Patrol vehicle diesel refill at staging point               |
| [Online UPI] [Bill: Available (View)]                       |
|                                       ₹3,250  [Edit] [Trash]|
+-------------------------------------------------------------+`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeSpecTab === 'techstack' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>3. Recommended Production Tech Stack</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 font-mono text-sm">
                    Frontend Layer (Field Optimized)
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                    <li><strong className="text-white">React 19 + TypeScript:</strong> Type-safe monetary arithmetic avoiding floating point rounding errors.</li>
                    <li><strong className="text-white">Tailwind CSS v4:</strong> Mobile-first high-contrast tactical dark theme with sunlight-readable contrast ratios.</li>
                    <li><strong className="text-white">Lucide React & Motion:</strong> Minimal footprint icons and tactile haptic-style micro-animations.</li>
                    <li><strong className="text-white">HTML5 IndexedDB / LocalStorage:</strong> Local-first persistence ensuring zero data loss if network drops.</li>
                    <li><strong className="text-white">PWA Service Worker:</strong> Full offline cache manifest and background sync when cellular re-attaches.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-400 font-mono text-sm">
                    Backend & Real-time Persistence
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                    <li><strong className="text-white">Firebase Firestore / Supabase Realtime:</strong> Real-time document listener (`onSnapshot`) syncing expenses across all 4 phones in &lt;150ms.</li>
                    <li><strong className="text-white">Cloud Storage (GCS/S3):</strong> Compressed image uploads for bill receipts with WebP conversion.</li>
                    <li><strong className="text-white">Express / Serverless Proxy:</strong> Node/TypeScript backend for PDF/Excel generation and end-of-mission consolidated debrief exports.</li>
                    <li><strong className="text-white">Deterministic Transactions:</strong> Atomic writes (`runTransaction`) preventing race conditions if two operatives submit expenses simultaneously.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSpecTab === 'datamodel' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>4. Complete Data Model & Mathematical Invariants</span>
              </h4>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] sm:text-xs text-slate-300 space-y-2 overflow-x-auto">
                <div className="text-indigo-400">// TypeScript Operational Schema</div>
{`interface ExpenseRecord {
  id: string;                    // UUID or nanoId (e.g. "exp-01")
  amount: number;                // Positive integer in INR (₹)
  doneBy: 'aniket' | 'darsh' | 'geetika' | 'aditi';
  reason: string;                // Field narrative / reason
  paymentMode: 'Cash' | 'Online';
  billAvailable: boolean;        // Mandatory voucher audit flag
  billImageUrl?: string;         // Base64 DataURI or CDN Storage URL
  timestamp: string;             // ISO-8601 string (e.g. 2026-10-02T08:45:00Z)
  location?: string;             // GPS Grid / Landmark name
  notes?: string;                // Internal team memo
  createdAt: string;             // Server-side audit timestamp
}

interface TeamMemberAllocation {
  id: 'aniket' | 'darsh' | 'geetika' | 'aditi';
  name: string;
  allocation: number;            // Individually editable budget
}
`}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2">
                <div className="font-bold text-emerald-400 font-mono text-xs uppercase">
                  Mathematical Invariant Laws (Single Source of Truth)
                </div>
                <div className="space-y-2 text-xs font-mono text-slate-300">
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400">1. Individual Spent:</span><br />
                    <code>Spent(member) = Σ amount for all expenses WHERE doneBy === member</code>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400">2. Individual Remaining:</span><br />
                    <code>Remaining(member) = Allocation(member) - Spent(member)</code>
                  </div>
                  <div className="p-2 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400">3. Team Consolidated Balance:</span><br />
                    <code>ConsolidatedTotal = Σ Allocation(m) for all members</code><br />
                    <code>ConsolidatedRemaining = ConsolidatedTotal - Σ amount for all expenses</code><br />
                    <span className="text-emerald-400 font-sans text-[11px]">
                      Identity: ConsolidatedRemaining ≡ Remaining(Aniket) + Remaining(Darsh) + Remaining(Geetika) + Remaining(Aditi)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSpecTab === 'edgecases' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>5. Critical Edge Cases, Validation Rules & Field Safeguards</span>
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Edge Case 1: Expense Exceeds Member's Remaining Quota (Negative Balance)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Rule:</strong> If an entered expense exceeds a member's remaining balance (e.g., Aniket has ₹2,000 left and enters a ₹3,500 repair), the UI presents a high-visibility warning banner showing the exact negative deficit. In a ground intelligence situation, the action is not arbitrarily blocked (which could leave operatives stranded in the field without transport or fuel), but flagged with a high-priority "Budget Deficit Alert" requiring intra-team reallocation or commander approval.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Edge Case 2: Complete Cellular Outage & Offline Logging</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Rule:</strong> Field expenses can be captured in offline mode. Entries are instantly saved to local storage with optimistic balance updates. A persistent offline queue stores pending receipts and synchronization vectors, automatically flushing when reconnecting.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Edge Case 3: Expense Deletion / Reversal Balance Recalculation</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Rule:</strong> If a team member accidentally logs duplicate transactions or deletes an entry, the application executes a mathematical re-fold over the active expense collection. Balances are derived dynamically from transaction history, preventing accumulator drift or orphan balances.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400 text-xs flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Edge Case 4: Missing Bill Protocol (Informant Honorarium / Roadside Stalls)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>Rule:</strong> In ground intelligence ops, cash tips to local informants or remote highway chai stalls do not provide printed invoices. Selecting "Bill Available: No" bypasses receipt requirement while mandatory "Notes / Location" tags document the ground rationale for audit debriefs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">Operation Vanguard Field Spec v1.0</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
