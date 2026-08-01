// src/components/TicketsDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';

export default function TicketsDashboard() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New ticket form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/tickets');
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const newTicket = await apiRequest('/tickets', {
        method: 'POST',
        body: JSON.stringify({ title, description, priority }),
      });
      
      // Add the new ticket to the top of the list
      setTickets([newTicket, ...tickets]);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    try {
      const updatedTicket = await apiRequest(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });

      setTickets(tickets.map(t => (t.id === id ? updatedTicket : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div style={{ marginTop: '2rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
      <h2>Support Tickets for {user.email}</h2>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* CREATE TICKET FORM */}
        <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
          <h3>Submit a Ticket</h3>
          <input
            type="text"
            placeholder="Ticket Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <button type="submit">Create Ticket</button>
        </form>

        {/* TICKET LIST */}
        <div style={{ flex: 1 }}>
          <h3>Your Tickets</h3>
          {tickets.length === 0 ? (
            <p>No tickets found. Create one to get started!</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {tickets.map((ticket) => (
                <li key={ticket.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{ticket.title}</strong>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '0.8rem',
                      backgroundColor: ticket.status === 'open' ? '#e6f4ea' : '#f1f3f4',
                      color: ticket.status === 'open' ? '#137333' : '#5f6368'
                    }}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#555' }}>{ticket.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    <span>Priority: <strong>{ticket.priority}</strong></span>
                    <button onClick={() => handleUpdateStatus(ticket.id, ticket.status)}>
                      Mark as {ticket.status === 'open' ? 'Closed' : 'Open'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
