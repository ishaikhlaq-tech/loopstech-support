import { Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="h-[60px] bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 shrink-0">
      {/* Left side: Titles */}
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-1.5">
          WORKSPACE
        </span>
        <h1 className="text-[22px] font-bold text-slate-900 leading-none tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4">
        {/* Status Indicator Pill */}
        <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"></div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
            ONLINE
          </span>
        </div>

        {/* Notification Bell Button */}
        <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center relative bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
          <Bell className="w-5 h-5 text-slate-600" strokeWidth={2} />
          {/* Notification Badge */}
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
            4
          </div>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
