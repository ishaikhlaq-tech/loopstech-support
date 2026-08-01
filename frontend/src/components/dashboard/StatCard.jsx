const StatCard = ({ title, value, borderColor }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:-translate-y-[1px] transition-all duration-200 ease-out flex flex-col justify-center overflow-hidden min-h-[92px] relative pl-[20px] pr-4 py-3.5">
      <div className={`absolute left-0 top-0 bottom-0 w-[4px] rounded-l-[5px] ${borderColor || 'bg-[#CBD5E1]'}`}></div>
      <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.06em] mb-1.5">{title}</span>
      <span className="text-[30px] font-bold text-[#0F172A] leading-none tracking-tight">{value}</span>
    </div>
  );
};

export default StatCard;
