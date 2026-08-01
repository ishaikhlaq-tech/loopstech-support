/**
 * Single row inside the Queue Preview card.
 *
 * Props:
 *  id            — ticket ID badge text (e.g. "TF-1048")
 *  title         — ticket title
 *  priority      — priority label (e.g. "Critical priority")
 *  time          — relative time string (e.g. "10m")
 *  priorityColor — Tailwind text class for priority label
 */
const TicketRow = ({ id, title, priority, time, priorityColor = 'text-gray-500' }) => {
  return (
    <div className="flex items-center gap-3 py-2.5">
      {/* ID badge */}
      <div className="flex-shrink-0 bg-gray-100 rounded px-2 py-1">
        <span className="text-[11px] font-mono font-medium text-gray-500 tracking-tight">
          {id}
        </span>
      </div>

      {/* Title + priority */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
          {title}
        </p>
        <p className={`text-xs font-medium mt-0.5 ${priorityColor}`}>
          {priority}
        </p>
      </div>

      {/* Time */}
      <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
    </div>
  );
};

export default TicketRow;
