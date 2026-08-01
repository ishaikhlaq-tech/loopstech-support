import { forwardRef } from 'react';

/**
 * Base Input primitive.
 * Accepts an optional `icon` prop (Lucide component) rendered on the left.
 * Uses forwardRef so react-hook-form's register() ref flows through.
 */
const Input = forwardRef(({ icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Icon className="h-[15px] w-[15px] text-gray-400" strokeWidth={1.75} />
        </div>
      )}
      <input
        ref={ref}
        className={[
          'w-full h-10 border border-gray-200 rounded-lg bg-white',
          'text-[13px] text-gray-900 placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          'transition-all duration-200',
          Icon ? 'pl-10' : 'pl-4',
          'pr-4',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
