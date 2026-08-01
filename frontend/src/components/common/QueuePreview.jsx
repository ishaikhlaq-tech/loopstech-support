import { motion } from 'framer-motion';
import TicketRow from './TicketRow';

const SAMPLE_TICKETS = [
  {
    id: 'TF-1048',
    title: 'Payment callback failing',
    priority: 'Critical priority',
    time: '10m',
    priorityColor: 'text-red-500',
  },
  {
    id: 'TF-1047',
    title: 'User access request',
    priority: 'High priority',
    time: '24m',
    priorityColor: 'text-orange-500',
  },
  {
    id: 'TF-1046',
    title: 'Dashboard data mismatch',
    priority: 'Medium priority',
    time: '1h',
    priorityColor: 'text-amber-600',
  },
];

/**
 * Queue Preview card — shows a live snapshot of open support tickets.
 */
const QueuePreview = () => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
      className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold text-gray-500 leading-none">
            Queue Preview
          </p>
          <p className="text-[11px] text-gray-400 mt-1 font-normal">
            Today at {timeStr}
          </p>
        </div>

        {/* LIVE badge */}
        <div className="flex items-center gap-1.5 border border-brand-200 rounded-full px-2.5 py-1 bg-white">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          <span className="text-[9.5px] font-semibold text-brand-600 tracking-wider uppercase">
            Live
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Ticket list */}
      <div className="divide-y divide-gray-50">
        {SAMPLE_TICKETS.map((ticket) => (
          <TicketRow key={ticket.id} {...ticket} />
        ))}
      </div>
    </motion.div>
  );
};

export default QueuePreview;
