import { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@components/layout/DashboardLayout';
import TicketsFilter from '@components/support/TicketsFilter';
import StatusFilters from '@components/support/StatusFilters';
import TicketList from '@components/support/TicketList';
import TicketGrid from '@components/support/TicketGrid';
import EmptyTickets from '@components/support/EmptyTickets';
import TicketPagination from '@components/support/TicketPagination';
import CreateTicketModal from '@components/support/CreateTicketModal';
import TicketDetailModal from '@components/support/TicketDetailModal';
import { apiRequest } from '../../api/client';

// Helper to map DB priority/status to UI styling
const mapTicketData = (dbTicket) => {
  const priorityMap = {
    low: { status: 'LOW', color: 'border-l-[#94A3B8]', bg: 'bg-white' },
    medium: { status: 'MEDIUM', color: 'border-l-[#3B82F6]', bg: 'bg-white' },
    high: { status: 'HIGH', color: 'border-l-[#F59E0B]', bg: 'bg-[#FFFBEB]' },
    critical: { status: 'CRITICAL', color: 'border-l-[#DC2626]', bg: 'bg-[#FEF2F2]' }
  };
  
  const statusMap = {
    open: 'open',
    closed: 'closed',
    resolved: 'resolved',
    escalated: 'escalated'
  };

  const priorityStyle = priorityMap[dbTicket.priority?.toLowerCase()] || priorityMap.medium;

  return {
    id: dbTicket.id,
    subject: dbTicket.title,
    company: 'Support Portal User', // We don't have company in DB yet
    author: { name: 'Current User', initials: 'CU' },
    priority: dbTicket.priority?.toUpperCase(),
    statusKey: statusMap[dbTicket.status?.toLowerCase()] || 'open',
    status: dbTicket.status?.toUpperCase(),
    leftBorderColor: priorityStyle.color,
    rowBg: priorityStyle.bg,
    assignedToMe: true, // Assuming all fetched tickets belong to user for now
    createdAt: new Date(dbTicket.created_at).toLocaleDateString(),
  };
};

const Tickets = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    client: 'all',
    department: 'all',
    category: 'all',
    sortBy: 'created_at',
    order: 'desc'
  });
  const [viewMode, setViewMode] = useState('grid');
  
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        priority: filters.priority,
        sortBy: filters.sortBy,
        order: filters.order
      }).toString();

      const data = await apiRequest(`/tickets?${queryParams}`);
      setTickets(data.map(mapTicketData));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced API call when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const handleTicketCreated = (newTicketDbData) => {
    setTickets([mapTicketData(newTicketDbData), ...tickets]);
    setIsCreateModalOpen(false);
  };

  // Client-side filtering is no longer needed since it's server-side, but StatusFilters might still need it or we can just pass tickets.
  // Actually, let's keep filteredTickets = tickets so StatusFilters works with the new data.
  const filteredTickets = tickets;

  return (
    <DashboardLayout title="Support Tickets">
      <div className="w-full px-8 py-8 max-w-[1440px] mx-auto min-h-full flex flex-col">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">My Support Tickets</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 bg-[#0F766E] text-white text-[13px] font-semibold rounded-[6px] hover:bg-[#0D645E] transition-colors"
          >
            + Create New Ticket
          </button>
        </div>

        {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded">Error loading tickets: {error}</p>}

        <TicketsFilter filters={filters} setFilters={setFilters} />
        <StatusFilters 
          activeStatus={filters.status} 
          setActiveStatus={(status) => setFilters(prev => ({ ...prev, status }))} 
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col mb-5">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#64748B]">Loading tickets...</p>
            </div>
          ) : filteredTickets.length > 0 ? (
            viewMode === 'grid' ? (
              <TicketGrid tickets={filteredTickets} onSelectTicket={(id) => setSelectedTicketId(id)} />
            ) : (
              <TicketList tickets={filteredTickets} onSelectTicket={(id) => setSelectedTicketId(id)} />
            )
          ) : (
            <EmptyTickets onClear={() => setFilters({ search: '', status: 'all', priority: 'all', sortBy: 'created_at', order: 'desc' })} />
          )}
        </div>

        <TicketPagination total={filteredTickets.length} />
      </div>
      
      {isCreateModalOpen && (
        <CreateTicketModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSuccess={handleTicketCreated} 
        />
      )}

      {selectedTicketId && (
        <TicketDetailModal
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onRefresh={fetchTickets}
        />
      )}
    </DashboardLayout>
  );
};

export default Tickets;
