/**
 * AuthLayout — full-screen two-column shell.
 * On mobile/tablet: stacks vertically.
 * On desktop: side-by-side 50/50.
 */
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-white">
      {children}
    </div>
  );
};

export default AuthLayout;
