const SLAComplianceCard = ({ stats = { total: 0, breaches: 0 } }) => {
  const safe = stats.total - stats.breaches;
  const complianceRate = stats.total > 0 ? Math.round((safe / stats.total) * 100) : 100;

  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-200 ease-out p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.06em]">SLA Compliance</h3>
          <span className="text-[10px] font-bold text-[#22C55E] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
            {complianceRate}%
          </span>
        </div>
        <p className="text-[12px] text-[#94A3B8] mb-6">Target: 95% resolution within 24h</p>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[28px] font-bold text-[#0F172A] leading-none mb-1">{stats.breaches}</span>
          <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-[0.06em]">SLA Breaches</span>
        </div>
        
        {/* Simple Progress Bar */}
        <div className="w-[120px] flex flex-col gap-2">
          <div className="flex justify-between text-[10px] font-bold text-[#64748B]">
            <span>Safe: {safe}</span>
            <span>Total: {stats.total}</span>
          </div>
          <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#22C55E]" style={{ width: `${complianceRate}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SLAComplianceCard;
