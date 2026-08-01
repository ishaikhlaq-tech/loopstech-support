import { useNavigate } from 'react-router-dom';

const ActiveAssignedQueue = ({ queue = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[6px] border border-[#E2E8F0] shadow-[0_1px_2px_0_rgba(0,0,0,0.02)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-200 ease-out p-5 mb-4">
      <div className="flex items-center justify-between mb-6 border-b border-[#F1F5F9] pb-3 -mx-5 px-5 -mt-1">
        <h3 className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-[0.06em]">Active Assigned Queue</h3>
        <button 
          onClick={() => navigate('/tickets')}
          className="text-[11px] font-bold text-[#0F766E] hover:text-[#0D9488] transition-colors flex items-center gap-1"
        >
          View All <span className="text-[13px]">→</span>
        </button>
      </div>
      
      {queue.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-[0.06em]">
            No active tasks.{' '}
            <button 
              onClick={() => navigate('/tickets')}
              className="text-[#0F766E] hover:text-[#0D9488] transition-colors inline-flex items-center gap-1 ml-1"
            >
              Browse Queue <span className="text-[13px]">→</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {queue.map(ticket => (
            <div key={ticket.id} className="flex items-center justify-between border-b border-[#F1F5F9] pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-[#3B82F6]' : 'bg-[#E2E8F0]'}`} />
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">{ticket.title}</p>
                  <p className="text-[11px] text-[#64748B] capitalize">{ticket.status} • {ticket.priority} priority</p>
                </div>
              </div>
              <div className="text-[11px] text-[#94A3B8]">
                {new Date(ticket.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveAssignedQueue;
