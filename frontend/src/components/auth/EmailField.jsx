import { Mail } from 'lucide-react';
import Input from '@components/common/Input';

/**
 * Controlled email field for the login form.
 * Accepts react-hook-form `register` and `error` props.
 */
const EmailField = ({ register = () => ({}), error }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="email"
        className="text-[10px] uppercase tracking-[0.1em] font-semibold text-gray-500"
      >
        Email Address
      </label>
      <Input
        id="email"
        type="email"
        icon={Mail}
        placeholder="name@company.com"
        autoComplete="email"
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'email-error' : undefined}
        {...register('email')}
      />
      {error && (
        <p id="email-error" role="alert" className="text-xs text-red-500 mt-0.5">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default EmailField;
