import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const TicketPagination = ({ total = 0 }) => {
  return (
    <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-4 mt-auto">
      {/* Results Info */}
      <div className="flex flex-col">
        <span className="text-[12px] font-bold text-[#0F172A]">{total} Result{total !== 1 ? 's' : ''}</span>
        <span className="text-[10px] text-[#64748B]">
          {total === 0 ? 'No tickets to display' : `Showing ${total} ticket${total !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-[#64748B]">Rows per page:</span>
          <div className="flex items-center justify-between w-12 h-7 px-2 bg-white border border-[#E2E8F0] rounded-[6px] cursor-pointer hover:bg-slate-50 transition-colors">
            <span className="text-[11px] font-semibold text-[#0F172A]">15</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" strokeWidth={2} />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 px-2.5 h-7 text-[11px] font-semibold text-[#94A3B8] rounded-[6px] cursor-not-allowed select-none">
            <ChevronLeft className="w-3 h-3" strokeWidth={2} />
            Prev
          </button>
          <button className="flex items-center gap-1 px-2.5 h-7 text-[11px] font-semibold text-[#94A3B8] rounded-[6px] cursor-not-allowed select-none">
            Next
            <ChevronRight className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketPagination;
