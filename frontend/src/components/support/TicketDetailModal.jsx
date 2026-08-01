import { useEffect, useState } from 'react';
import { apiRequest } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { X, MessageSquare, ShieldAlert } from 'lucide-react';

export default function TicketDetailModal({ ticketId, onClose, onRefresh }) {
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const [ticketData, commentsData] = await Promise.all([
        apiRequest(`/tickets/${ticketId}`),
        apiRequest(`/comments/${ticketId}`)
      ]);

      setTicket(ticketData.ticket);
      setComments(commentsData.comments || []);
    } catch (err) {
      console.error('Error loading ticket details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) fetchTicketDetails();
  }, [ticketId]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSubmitting(true);
      const data = await apiRequest(`/comments/${ticketId}`, {
        method: 'POST',
        body: JSON.stringify({
          message: newMessage,
          is_internal: isInternal
        })
      });

      setComments((prev) => [...prev, data.comment]);
      setNewMessage('');
      setIsInternal(false);
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const data = await apiRequest(`/tickets/${ticketId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      // The PATCH route returns raw data or { ticket: data } depending on the fix, but currently returns raw data
      // If our route returned `res.json(data)`, then data *is* the ticket.
      const updatedTicket = data.ticket || data;
      setTicket(updatedTicket);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  if (!ticketId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-[12px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Ticket #{ticketId.split('-')[0]}
              </span>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                ticket?.priority === 'urgent' || ticket?.priority === 'critical' ? 'bg-red-100 text-red-700' :
                ticket?.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {ticket?.priority}
              </span>
            </div>
            <h2 className="text-[18px] font-bold text-slate-800 leading-tight">{ticket?.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex-1 p-12 flex items-center justify-center text-slate-500">
            Loading details...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* Description & Status Bar */}
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-slate-50 rounded-[8px] border border-slate-200/80">
                <p className="text-slate-700 text-[13px] whitespace-pre-wrap leading-relaxed">{ticket?.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-[8px] shadow-sm">
                <span className="text-[13px] font-medium text-slate-600 flex items-center gap-2">
                  Current Status:
                </span>
                <div className="flex gap-1.5">
                  {['open', 'in_progress', 'resolved', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-[6px] transition-all ${
                        ticket?.status === status
                          ? 'bg-[#0F766E] text-white shadow-sm ring-1 ring-inset ring-black/10'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Comments Thread */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[12px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                Discussion ({comments.length})
              </h3>

              <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {comments.length === 0 ? (
                  <p className="text-[13px] text-slate-400 italic text-center py-4 bg-slate-50 rounded-[8px] border border-dashed border-slate-200">No messages yet. Start the conversation below.</p>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c.id}
                      className={`p-3.5 rounded-[8px] border text-[13px] ${
                        c.is_internal
                          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-semibold opacity-80 text-slate-700">
                          {c.profiles?.email || 'User'} <span className="opacity-60 font-normal">({c.profiles?.role || 'customer'})</span>
                        </span>
                        {c.is_internal && (
                          <span className="px-1.5 py-0.5 bg-amber-200/60 text-amber-800 font-bold rounded uppercase flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            Internal Staff Note
                          </span>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed opacity-90">{c.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handlePostComment} className="pt-4 border-t border-slate-100 flex flex-col gap-3 mt-auto">
              <textarea
                rows="3"
                placeholder="Write a response..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-3 text-[13px] border border-slate-200 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] resize-none"
              />

              <div className="flex items-center justify-between">
                {user?.role !== 'customer' ? (
                  <label className="flex items-center gap-2 text-[12px] font-medium text-amber-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    Post as internal staff note
                  </label>
                ) : <div />}

                <button
                  type="submit"
                  disabled={submitting || !newMessage.trim()}
                  className="px-5 py-2.5 bg-[#0F766E] hover:bg-[#0D645E] text-white text-[13px] font-semibold rounded-[6px] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Send Reply'}
                </button>
              </div>
            </form>

          </div>
        )}
      </div>
    </div>
  );
}
