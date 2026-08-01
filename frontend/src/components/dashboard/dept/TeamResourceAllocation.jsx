const Avatar = ({ initials }) => (
  <div className="w-[30px] h-[30px] rounded-full bg-[#CCFBF1] text-[#115E59] text-[12px] font-bold flex items-center justify-center shrink-0">
    {initials}
  </div>
);

const TeamResourceAllocation = ({ team = [] }) => {
  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] p-5 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.06em]">Team Resource Allocation</h3>
        <button className="text-[11px] font-bold text-[#0F766E] hover:text-[#0D9488] transition-colors">
          View All Agents →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F1F5F9]">
              <th className="pb-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.06em]">Agent</th>
              <th className="pb-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.06em]">Active Workload</th>
              <th className="pb-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.06em]">Avg Resolution</th>
              <th className="pb-3 text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.06em]">SLA Breaches</th>
            </tr>
          </thead>
          <tbody>
            {team.map((agent) => (
              <tr key={agent.id} className="border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E2E8F0] overflow-hidden flex items-center justify-center text-[13px] font-bold text-[#64748B]">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-[#0F172A]">{agent.name}</p>
                      <p className="text-[11px] text-[#64748B]">{agent.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden min-w-[60px]">
                      <div 
                        className={`h-full ${agent.assigned > 5 ? 'bg-[#F59E0B]' : 'bg-[#3B82F6]'}`} 
                        style={{ width: `${Math.min((agent.assigned / 10) * 100, 100)}%` }} 
                      />
                    </div>
                    <span className="text-[12px] font-semibold text-[#475569] w-4">{agent.assigned}</span>
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-[12px] font-semibold text-[#475569]">{agent.avgDuration}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-1.5">
                    {agent.slaBreaches > 0 ? (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                        <span className="text-[12px] font-semibold text-[#EF4444]">{agent.slaBreaches}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        <span className="text-[12px] font-semibold text-[#22C55E]">0</span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td colSpan="4" className="py-6 text-center text-[12px] text-[#64748B]">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamResourceAllocation;
