import { motion } from 'framer-motion';

/**
 * Primary action button used across the app.
 * Supports loading state with a spinner and Framer Motion press/hover.
 */
const Button = ({
  children,
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.01 } : {}}
      whileTap={!isDisabled ? { scale: 0.975 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={[
        'w-full h-[42px] rounded-lg font-semibold text-[13px] text-white',
        'bg-brand-600 hover:bg-brand-700',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          {/* Spinner */}
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Signing in…
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;
