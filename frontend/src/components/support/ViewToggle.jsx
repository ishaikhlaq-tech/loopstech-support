import { List, LayoutGrid } from 'lucide-react';

const ViewToggle = ({ viewMode, setViewMode }) => {

  return (
    <div className="flex items-center bg-white border border-[#E2E8F0] rounded-[6px] p-1">
      <button 
        onClick={() => setViewMode('list')}
        className={`flex items-center justify-center w-8 h-8 rounded-[4px] transition-colors ${viewMode === 'list' ? 'bg-[#EAF5F3] text-[#109F8D]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
      >
        <List className="w-[18px] h-[18px]" strokeWidth={2} />
      </button>
      <button 
        onClick={() => setViewMode('grid')}
        className={`flex items-center justify-center w-8 h-8 rounded-[4px] transition-colors ${viewMode === 'grid' ? 'bg-[#EAF5F3] text-[#109F8D]' : 'text-[#64748B] hover:text-[#0F172A]'}`}
      >
        <LayoutGrid className="w-[18px] h-[18px]" strokeWidth={2} />
      </button>
    </div>
  );
};

export default ViewToggle;
