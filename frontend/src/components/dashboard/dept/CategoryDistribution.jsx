const CategoryDistribution = ({ breakdown = { urgent: 0, high: 0, medium: 0, low: 0 } }) => {
  const total = breakdown.urgent + breakdown.high + breakdown.medium + breakdown.low;

  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-200 ease-out p-5 h-full flex flex-col">
      <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.06em] mb-4">Priority Breakdown</h3>
      {total === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-[0.1em]">No Data Available</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center gap-3">
          {Object.entries(breakdown).map(([priority, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const colors = {
              urgent: 'bg-[#E11D48]',
              high: 'bg-[#F59E0B]',
              medium: 'bg-[#3B82F6]',
              low: 'bg-[#64748B]'
            };
            return (
              <div key={priority} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#475569] capitalize">{priority}</span>
                  <span className="text-[#0F172A]">{count} <span className="text-[#94A3B8] font-normal">({percentage}%)</span></span>
                </div>
                <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div className={`h-full ${colors[priority]}`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryDistribution;
