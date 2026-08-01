import { ClipboardList } from 'lucide-react';

const EmptyTickets = ({ onClear }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] mb-5 py-[100px] flex flex-col items-center justify-center">
      {/* Illustration */}
      <div className="w-[60px] h-[60px] bg-[#EAF5F3] rounded-[10px] flex items-center justify-center mb-5">
        <ClipboardList className="w-8 h-8 text-[#109F8D]" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h2 className="text-[13px] font-bold text-[#0F172A] uppercase tracking-[0.06em] mb-2">
        No tickets match the active filters
      </h2>
      <p className="text-[12px] text-[#64748B] mb-7">Try adjusting or clearing your filters to see more results.</p>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClear}
          className="px-5 h-9 text-[12px] font-semibold text-[#475569] bg-white border border-[#E2E8F0] rounded-[6px] hover:bg-slate-50 transition-colors shadow-sm"
        >
          Clear Filters
        </button>
        <button className="px-5 h-9 text-[12px] font-semibold text-white bg-[#109F8D] rounded-[6px] hover:bg-[#0D8777] transition-colors shadow-sm">
          Create New Ticket +
        </button>
      </div>
    </div>
  );
};

export default EmptyTickets;
