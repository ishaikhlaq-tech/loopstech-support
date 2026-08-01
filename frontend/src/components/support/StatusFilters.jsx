import { Filter, FolderOpen, ArrowUp, User, UserMinus, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import ViewToggle from './ViewToggle';

const STATUS_PILLS = [
  {
    id: 'all', label: 'All', icon: Filter,
    defaultClass: 'border-[#E2E8F0] text-[#475569] bg-white hover:bg-slate-50',
    activeClass:  'border-[#0F766E] text-[#0F766E] bg-[#EAF5F3]',
  },
  {
    id: 'open', label: 'Open', icon: FolderOpen,
    defaultClass: 'border-[#E2E8F0] text-[#475569] bg-white hover:bg-slate-50',
    activeClass:  'border-[#3B82F6] text-[#3B82F6] bg-[#EFF6FF]',
  },
  {
    id: 'critical', label: 'Critical', icon: ArrowUp,
    defaultClass: 'border-[#FECACA] text-[#DC2626] bg-[#FEF2F2] hover:bg-[#FEE2E2]',
    activeClass:  'border-[#DC2626] text-[#DC2626] bg-[#FEE2E2] ring-1 ring-[#DC2626]',
  },
  {
    id: 'mine', label: 'Mine', icon: User,
    defaultClass: 'border-[#E9D5FF] text-[#9333EA] bg-[#FAF5FF] hover:bg-[#F3E8FF]',
    activeClass:  'border-[#9333EA] text-[#9333EA] bg-[#F3E8FF] ring-1 ring-[#9333EA]',
  },
  {
    id: 'unassigned', label: 'Unassigned', icon: UserMinus,
    defaultClass: 'border-[#E2E8F0] text-[#475569] bg-white hover:bg-slate-50',
    activeClass:  'border-[#475569] text-[#475569] bg-[#F1F5F9]',
  },
  {
    id: 'pending', label: 'Pending User', icon: Clock,
    defaultClass: 'border-[#E2E8F0] text-[#475569] bg-white hover:bg-slate-50',
    activeClass:  'border-[#F59E0B] text-[#D97706] bg-[#FFFBEB]',
  },
  {
    id: 'escalated', label: 'Escalated', icon: ArrowUpRight,
    defaultClass: 'border-[#E2E8F0] text-[#475569] bg-white hover:bg-slate-50',
    activeClass:  'border-[#F59E0B] text-[#D97706] bg-[#FFFBEB]',
  },
  {
    id: 'resolved', label: 'Resolved', icon: CheckCircle2,
    defaultClass: 'border-[#109F8D] text-[#109F8D] bg-[#EAF5F3] hover:bg-[#D4EBE7]',
    activeClass:  'border-[#0F766E] text-[#0F766E] bg-[#D4EBE7] ring-1 ring-[#0F766E]',
  },
];

const StatusFilters = ({ activeStatus, setActiveStatus, viewMode, setViewMode }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] mb-5 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[12px] font-bold text-[#0F172A] leading-none">Quick Status Filters</h3>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STATUS_PILLS.map((pill) => {
          const Icon = pill.icon;
          const isActive = activeStatus === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveStatus(pill.id)}
              className={`flex items-center gap-1 px-3 h-[30px] rounded-full border text-[11px] font-semibold transition-all ${
                isActive ? pill.activeClass : pill.defaultClass
              }`}
            >
              <Icon className="w-3 h-3" strokeWidth={2.5} />
              {pill.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StatusFilters;
