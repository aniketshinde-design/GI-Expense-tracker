import { TeamMember, MissionConfig, Expense } from '../types';

export const MISSION_CONFIG: MissionConfig = {
  name: 'Ground Intelligence Taskforce',
  codename: 'OPERATION VANGUARD',
  startDate: '2026-10-02',
  endDate: '2026-10-18',
  totalDays: 17,
  defaultIndividualAllocation: 35000,
  lowBalanceThreshold: 5000,
};

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'aniket',
    name: 'Aniket',
    role: 'Lead Field Officer',
    callsign: 'Vanguard-1',
    avatarColor: 'from-blue-600 to-indigo-700',
    badgeBg: 'bg-blue-950/80 text-blue-300 border-blue-800',
    borderColor: 'border-blue-500/40 hover:border-blue-500',
    allocation: 35000,
  },
  {
    id: 'darsh',
    name: 'Darsh',
    role: 'Tactical Mobility & Recon',
    callsign: 'Vanguard-2',
    avatarColor: 'from-amber-600 to-orange-700',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800',
    borderColor: 'border-amber-500/40 hover:border-amber-500',
    allocation: 35000,
  },
  {
    id: 'geetika',
    name: 'Geetika',
    role: 'Field Analyst & Surveillance',
    callsign: 'Vanguard-3',
    avatarColor: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
    borderColor: 'border-emerald-500/40 hover:border-emerald-500',
    allocation: 35000,
  },
  {
    id: 'aditi',
    name: 'Aditi',
    role: 'Comms & Quartermaster',
    callsign: 'Vanguard-4',
    avatarColor: 'from-purple-600 to-fuchsia-700',
    badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-800',
    borderColor: 'border-purple-500/40 hover:border-purple-500',
    allocation: 35000,
  },
];

// Quick suggestions for fast typing in the field
export const COMMON_FIELD_REASONS = [
  'Patrol vehicle fuel refill',
  'Highway toll plaza',
  'Team food & ration',
  'Drinking water bottles',
  'Field lodging / motel stay',
  'Flashlight batteries & gear',
  'Mobile 5G data recharge',
  'Local route informant fee',
  'Emergency tyre repair',
  'Ordnance maps & stationery',
];

// Clean slate: No previous logs included
export const INITIAL_EXPENSES: Expense[] = [];
