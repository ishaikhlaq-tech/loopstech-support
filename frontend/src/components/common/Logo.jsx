import { motion } from 'framer-motion';

const Logo = ({ isCollapsed }) => {
  return (
    <motion.div
      className="flex items-center gap-2.5 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Square brand mark */}
      <div className="w-8 h-8 bg-[#109F8D] rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-[13px] tracking-wide select-none">LT</span>
      </div>

      {/* Text lockup */}
      {!isCollapsed && (
        <motion.div 
          className="flex flex-col leading-none"
          initial={{ opacity: 0, w: 0 }}
          animate={{ opacity: 1, w: 'auto' }}
          exit={{ opacity: 0, w: 0 }}
        >
          <span className="text-[16px] tracking-tight whitespace-nowrap">
            <span className="font-extrabold text-[#0F172A]">LoopTech </span>
            <span className="font-bold text-[#10B981]">Support</span>
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Logo;
