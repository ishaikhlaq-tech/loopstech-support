import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPanel from '../notifications/NotificationPanel';

const TopNavbar = ({ subtitle = "WORKSPACE", title = "Dashboard" }) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <header className="h-[72px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 shrink-0 relative">
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.05em] leading-none">{subtitle}</span>
        <span className="text-[19px] font-bold text-[#0F172A] leading-none">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        {/* ONLINE Badge */}
        <div className="flex items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-1.5 rounded-md">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div>
          <span className="text-[11px] font-bold text-[#166534] tracking-wide">ONLINE</span>
        </div>
        
        {/* Notification Bell */}
        <div className="relative flex items-center h-full">
          <button 
            className={`notif-toggle-btn flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
              isNotifOpen ? 'bg-slate-50 border-[#CBD5E1]' : 'border-[#E2E8F0] bg-white hover:bg-slate-50'
            }`}
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell className="w-[18px] h-[18px] text-[#64748B]" strokeWidth={2} />
            {unreadCount > 0 && (
              <div className="absolute top-[-4px] right-[-4px] min-w-[18px] h-[18px] bg-[#EF4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm border border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </button>

          {isNotifOpen && (
            <NotificationPanel onClose={() => setIsNotifOpen(false)} />
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;
