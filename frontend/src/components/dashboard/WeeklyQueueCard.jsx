import QueueChart from './QueueChart';

const WeeklyQueueCard = ({ data, created = 0, resolved = 0 }) => {
  const netQueue = created - resolved;
  const netQueueStr = netQueue > 0 ? `+${netQueue}` : netQueue;

  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-200 ease-out p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.06em]">Weekly Queue Load</h3>
        <div className="flex items-center gap-3 text-[10px] font-bold text-[#64748B] uppercase tracking-[0.06em]">
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div> Created</div>
          <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></div> Resolved</div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="border border-[#E2E8F0] rounded-[5px] px-3 py-2 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.06em] mb-0.5">Created</span>
          <span className="text-[19px] font-bold text-[#0F172A] leading-none">{created}</span>
        </div>
        <div className="border border-[#E2E8F0] rounded-[5px] px-3 py-2 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.06em] mb-0.5">Resolved</span>
          <span className="text-[19px] font-bold text-[#0F172A] leading-none">{resolved}</span>
        </div>
        <div className="border border-[#FED7AA] bg-[#FFF7ED] rounded-[5px] px-3 py-2 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.06em] mb-0.5">Net Queue</span>
          <span className="text-[19px] font-bold text-[#EA580C] leading-none">{netQueueStr}</span>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[220px]">
        <QueueChart data={data} />
      </div>
    </div>
  );
};

export default WeeklyQueueCard;
