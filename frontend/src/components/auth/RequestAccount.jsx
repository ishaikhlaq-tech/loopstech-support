/**
 * "Need workspace access? Request account" call-to-action shown below the Sign In button.
 */
const RequestAccount = ({ onToggle }) => {
  return (
    <p className="text-center text-[13px] text-gray-500">
      Need workspace access?{' '}
      <button
        type="button"
        onClick={onToggle}
        className="text-brand-600 font-semibold hover:text-brand-700 transition-colors focus:outline-none focus:underline"
        aria-label="Request a new workspace account"
      >
        Request account
      </button>
    </p>
  );
};

export default RequestAccount;
