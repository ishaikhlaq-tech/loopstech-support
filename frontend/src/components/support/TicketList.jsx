import { Lock, ArrowUp, CheckCircle2, AlertCircle, Clock, ArrowUpRight, UserMinus, Circle } from 'lucide-react';

const PRIORITY_STYLES = {
  CRITICAL: { label: 'CRITICAL', color: 'text-[#DC2626]', border: 'border-[#FECACA]', dot: 'bg-[#DC2626]' },
  HIGH:     { label: 'HIGH',     color: 'text-[#EA580C]', border: 'border-[#FED7AA]', dot: 'bg-[#EA580C]' },
  MEDIUM:   { label: 'MEDIUM',  color: 'text-[#2563EB]', border: 'border-[#BFDBFE]', dot: 'bg-[#2563EB]' },
  LOW:      { label: 'LOW',     color: 'text-[#059669]', border: 'border-[#A7F3D0]', dot: 'bg-[#059669]' },
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

const TicketList = ({ tickets = [], onSelectTicket }) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm mb-5 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <colgroup>
          <col style={{ width: '20%' }} />
          <col style={{ width: '33%' }} />
          <col style={{ width: '16%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '7%' }} />
        </colgroup>
        <thead>
          <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]" style={{ height: '40px' }}>
            <th className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em]">ID</th>
            <th className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em]">SUBJECT</th>
            <th className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em]">AUTHOR</th>
            <th className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] text-center">PRIORITY</th>
            <th className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] text-center">STATUS</th>
            <th className="px-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.07em] text-right">AGE</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const priorityStyle = PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.MEDIUM;
            const badge = STATUS_BADGE[ticket.status] || STATUS_BADGE['CLOSED'];
            const BadgeIcon = badge.icon;

            let rowBg = 'bg-white';
            let leftBorderCss = 'border-l-[#E2E8F0]';
            let indicatorColor = 'bg-[#CBD5E1]';

            if (ticket.leftBorderColor.includes('109F8D') || ticket.leftBorderColor.includes('3B82F6') || ticket.leftBorderColor.includes('8B5CF6')) {
              rowBg = 'bg-[#F0FAFA]';
              leftBorderCss = 'border-l-[#22D3EE]';
              indicatorColor = 'bg-[#22D3EE]';
            } else if (ticket.leftBorderColor.includes('F59E0B') || ticket.leftBorderColor.includes('D97706') || ticket.leftBorderColor.includes('DC2626')) {
              rowBg = 'bg-[#FFFCF0]';
              leftBorderCss = 'border-l-[#FBBF24]';
              indicatorColor = 'bg-[#FBBF24]';
            }

            return (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket && onSelectTicket(ticket.id)}
                style={{ height: '72px' }}
                className={`border-b border-[#EEF0F4] last:border-0 hover:brightness-[0.97] transition-all cursor-pointer ${rowBg} border-l-[3px] ${leftBorderCss}`}
              >
                {/* ID */}
                <td className="px-3 align-middle">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-[3px] h-[14px] rounded-full shrink-0 ${indicatorColor}`} />
                    <span className="inline-flex items-center h-[20px] px-2 bg-white border border-[#E2E8F0] rounded-[4px] text-[10px] font-semibold font-mono text-[#64748B] shadow-sm whitespace-nowrap">
                      {ticket.id}
                    </span>
                  </div>
                </td>

                {/* Subject */}
                <td className="px-3 align-middle">
                  <div className="flex flex-col gap-[2px]">
                    <span
                      className="text-[13px] font-bold text-[#0F172A] leading-[1.25] truncate"
                      style={{ maxWidth: '340px' }}
                    >
                      {ticket.subject}
                    </span>
                    <span
                      className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.04em] leading-tight truncate"
                      style={{ maxWidth: '340px' }}
                    >
                      {ticket.company}
                    </span>
                  </div>
                </td>

                {/* Author */}
                <td className="px-3 align-middle">
                  <div className="flex items-center gap-1.5">
                    <div className="w-[24px] h-[24px] rounded-full bg-[#CCFBF1] flex items-center justify-center text-[#0F766E] text-[9px] font-bold shrink-0">
                      {ticket.author.initials}
                    </div>
                    <span className="text-[12px] font-medium text-[#475569] whitespace-nowrap">{ticket.author.name}</span>
                  </div>
                </td>

                {/* Priority */}
                <td className="px-3 align-middle text-center">
                  <div className={`inline-flex items-center justify-center gap-[5px] h-[20px] px-2 rounded-full border bg-white ${priorityStyle.border} ${priorityStyle.color} text-[10px] font-bold whitespace-nowrap`}>
                    <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${priorityStyle.dot}`} />
                    {priorityStyle.label}
                  </div>
                </td>

                {/* Status */}
                <td className="px-3 align-middle text-center">
                  <div className={`inline-flex items-center justify-center gap-[4px] h-[20px] px-2 rounded-full border text-[10px] font-bold whitespace-nowrap ${badge.bg} ${badge.border} ${badge.color}`}>
                    <BadgeIcon className="w-[10px] h-[10px] shrink-0" strokeWidth={2} />
                    {badge.text}
                  </div>
                </td>

                {/* Age */}
                <td className="px-3 align-middle text-right">
                  <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">{ticket.createdAt}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TicketList;
