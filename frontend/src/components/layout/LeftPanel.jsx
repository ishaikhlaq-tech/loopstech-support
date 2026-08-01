import { motion } from 'framer-motion';
import Logo from '@components/common/Logo';
import StatsCard from '@components/common/StatsCard';
import QueuePreview from '@components/common/QueuePreview';

const STATS = [
  { label: 'Open SLA',     value: '96%', dotColor: 'bg-teal-500',  delay: 0.2  },
  { label: 'Active Queue', value: '128', dotColor: 'bg-blue-500',  delay: 0.25 },
  { label: 'At Risk',      value: '07',  dotColor: 'bg-amber-500', delay: 0.3  },
];

/**
 * LeftPanel — occupies 50% of the screen on desktop.
 * Contains logo, hero text, stats cards, and queue preview.
 */
const LeftPanel = () => {
  return (
    <div className="w-full lg:w-[46%] flex flex-col px-10 lg:px-14 pt-8 pb-8 bg-stone-50 border-b lg:border-b-0 lg:border-r border-gray-100">

      {/* ── Logo ── */}
      <div className="mb-2 transform scale-95 origin-top-left">
        <Logo />
      </div>

      {/* ── Operations Snapshot label ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-[9.5px] uppercase tracking-[0.16em] font-semibold text-gray-400 mt-4 mb-6"
      >
        Operations Snapshot
      </motion.p>

      {/* ── Hero heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
        className="mb-6"
      >
        <h1 className="text-[37px] lg:text-[40px] font-semibold text-gray-900 leading-[1.1] tracking-tight">
          Support work,<br />routed clearly.
        </h1>
        <p className="mt-3 text-[13px] text-gray-500 leading-relaxed max-w-[290px]">
          Sign in to triage requests, protect SLA commitments, and keep every client-facing update in one place.
        </p>
      </motion.div>

      {/* ── Stats row ── */}
      <div className="flex gap-2.5 mb-5">
        {STATS.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ── Queue Preview ── */}
      <QueuePreview />
    </div>
  );
};

export default LeftPanel;
