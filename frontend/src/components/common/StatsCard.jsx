import { motion } from 'framer-motion';

/**
 * Individual stat card used in the left panel.
 *
 * Props:
 *  label      — uppercase label text (e.g. "OPEN SLA")
 *  value      — large number/value (e.g. "96%")
 *  dotColor   — Tailwind bg class for the colored indicator (e.g. "bg-teal-500")
 *  delay      — Framer Motion stagger delay in seconds
 */
const StatsCard = ({ label, value, dotColor, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 pt-3 pb-2.5 shadow-sm flex flex-col justify-between min-h-[78px]"
    >
      {/* Label */}
      <span className="text-[8.5px] uppercase tracking-[0.14em] font-semibold text-gray-400 leading-none">
        {label}
      </span>

      {/* Value + dot row */}
      <div className="flex items-end justify-between mt-2">
        <span className="text-[26px] font-bold text-gray-900 leading-none">
          {value}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full mb-0.5 flex-shrink-0 ${dotColor}`} />
      </div>
    </motion.div>
  );
};

export default StatsCard;
