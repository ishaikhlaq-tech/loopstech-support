import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Password field with lock icon, visibility toggle, and react-hook-form support.
 */
const PasswordField = ({ register = () => ({}), error }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="password"
        className="text-[10px] uppercase tracking-[0.1em] font-semibold text-gray-500"
      >
        Password
      </label>

      <div className="relative">
        {/* Lock icon — left */}
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Lock className="h-[15px] w-[15px] text-gray-400" strokeWidth={1.75} />
        </div>

        {/* Native input */}
        <input
          id="password"
          type={visible ? 'text' : 'password'}
          placeholder="Enter your password"
          autoComplete="current-password"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'password-error' : undefined}
          className={[
            'w-full h-10 border border-gray-200 rounded-lg bg-white',
            'text-[13px] text-gray-900 placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
            'transition-all duration-200',
            'pl-10 pr-10',
          ].join(' ')}
          {...register('password')}
        />

        {/* Eye toggle — right */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.85 }}
          onClick={() => setVisible((prev) => !prev)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <EyeOff className="h-[15px] w-[15px]" strokeWidth={1.75} />
          ) : (
            <Eye className="h-[15px] w-[15px]" strokeWidth={1.75} />
          )}
        </motion.button>
      </div>

      {error && (
        <p id="password-error" role="alert" className="text-xs text-red-500 mt-0.5">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default PasswordField;
