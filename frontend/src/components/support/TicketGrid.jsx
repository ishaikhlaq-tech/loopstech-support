import { Lock, ArrowUp, CheckCircle2, AlertCircle, Clock, ArrowUpRight, UserMinus, Circle } from 'lucide-react';

const PRIORITY_STYLES = {
  CRITICAL: { label: 'CRITICAL', color: 'text-[#DC2626]', icon: AlertCircle },
  HIGH:     { label: 'HIGH',     color: 'text-[#D97706]', icon: ArrowUp },
  MEDIUM:   { label: 'MEDIUM',  color: 'text-[#3B82F6]', icon: Circle },
  LOW:      { label: 'LOW',     color: 'text-[#10B981]', icon: Circle },
};

const STATUS_BADGE = {
  'OPEN':         { text: 'OPEN',         bg: 'bg-[#EFF6FF]', border: 'border-[#BFDBFE]', color: 'text-[#3B82F6]',  icon: Circle },
  'IN PROGRESS':  { text: 'IN PROGRESS',  bg: 'bg-[#F5F3FF]', border: 'border-[#DDD6FE]', color: 'text-[#8B5CF6]',  icon: Circle },
  'PENDING USER': { text: 'PENDING',      bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', color: 'text-[#D97706]',  icon: Clock },
  'ESCALATED':    { text: 'ESCALATED',    bg: 'bg-[#FFFBEB]', border: 'border-[#FDE68A]', color: 'text-[#D97706]',  icon: ArrowUpRight },
  'CRITICAL':     { text: 'CRITICAL',     bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]', color: 'text-[#DC2626]',  icon: AlertCircle },
  'RESOLVED':     { text: 'RESOLVED',     bg: 'bg-[#F0FDF4]', border: 'border-[#BBF7D0]', color: 'text-[#16A34A]',  icon: CheckCircle2 },
  'UNASSIGNED':   { text: 'UNASSIGNED',   bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]', color: 'text-[#64748B]',  icon: UserMinus },
  'CLOSED':       { text: 'CLOSED',       bg: 'bg-[#F8FAFC]', border: 'border-[#E2E8F0]', color: 'text-[#475569]',  icon: Lock },
};

// Map original row background to the light card background shown in screenshot
const BG_MAP = {
  'bg-white': 'bg-white',
  'bg-[#FEF2F2]': 'bg-[#FEF2F2]',
  'bg-[#FFFBEB]': 'bg-[#FFFBEB]',
  'bg-[#F0FDF4]': 'bg-[#F0FDF4]',
  'bg-[#F5F3FF]': 'bg-[#F0FAFF]', // light cyan/blue for mine
};

const TicketGrid = ({ tickets = [], onSelectTicket }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
      {tickets.map((ticket) => {
        const priorityStyle = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.MEDIUM;
        const PriorityIcon = priorityStyle.icon;
        // In the screenshot, all closed tickets are shown in this grid, but let's use the actual ticket status
        const badge = STATUS_BADGE[ticket.status] || STATUS_BADGE['CLOSED'];
        const BadgeIcon = badge.icon;
        
        // Some custom logic for the card backgrounds based on screenshot:
        // TKT...05 has a light cyan bg and cyan left border.
        // TKT...03 has a light yellow bg and orange border.
        let cardBg = 'bg-white';
        let leftBorder = 'bg-[#E2E8F0]';
        
        if (ticket.leftBorderColor.includes('109F8D') || ticket.leftBorderColor.includes('3B82F6')) {
          cardBg = 'bg-[#F0FDF4]'; // light green/cyan
          leftBorder = 'bg-[#06B6D4]'; // cyan
        } else if (ticket.leftBorderColor.includes('F59E0B') || ticket.leftBorderColor.includes('D97706')) {
          cardBg = 'bg-[#FFFBEB]'; // light yellow
          leftBorder = 'bg-[#F59E0B]'; // orange
        }

        return (
          <div 
            key={ticket.id}
            onClick={() => onSelectTicket && onSelectTicket(ticket.id)}
            className={`relative rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col p-5 cursor-pointer ${cardBg}`}
          >
            {/* Left Color Strip */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${leftBorder}`} />
            
            <div className="flex justify-between items-start mb-3">
              <div className="inline-flex items-center justify-center px-3 py-1 bg-white/60 border border-[#E2E8F0] rounded-md text-[13px] font-medium font-mono text-[#475569]">
                {ticket.id}
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-bold tracking-wide bg-[#F8FAFC] border-[#E2E8F0] text-[#475569]`}>
                <Lock className="w-3.5 h-3.5" strokeWidth={2.5} />
                CLOSED
              </div>
            </div>

            <h4 className="text-[16px] font-bold text-[#0F172A] leading-tight mb-3">
              {ticket.subject}
            </h4>
            
            <div className="flex justify-between items-start mb-6">
              <span className="text-[12px] font-semibold text-[#94A3B8] uppercase leading-relaxed max-w-[70%]">
                {ticket.company}
              </span>
              <div className={`inline-flex items-center gap-1.5 h-[26px] px-2.5 rounded-full border text-[12px] font-bold bg-white border-[#E2E8F0] ${priorityStyle.color}`}>
                <PriorityIcon className="w-3.5 h-3.5 fill-current" strokeWidth={0} />
                {priorityStyle.label}
              </div>
            </div>

            <div className="mt-auto flex justify-between items-center pt-2">
              <div className="flex items-center gap-2">
                <div className="w-[32px] h-[32px] rounded-full bg-[#CCFBF1] flex items-center justify-center text-[#115E59] text-[13px] font-bold">
                  {ticket.author.initials}
                </div>
                <span className="text-[14px] font-medium text-[#475569]">{ticket.author.name}</span>
              </div>
              <span className="text-[13px] text-[#94A3B8] font-medium">
                {ticket.createdAt}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TicketGrid;
