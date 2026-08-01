import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from '@components/auth/LoginForm';
import SignupForm from '@components/auth/SignupForm';

/**
 * RightPanel — occupies 50% of the screen on desktop.
 * Vertically centers the login/signup form and heading block.
 */
const RightPanel = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full lg:w-[54%] flex items-center justify-center px-8 lg:px-16 py-10 lg:py-8 bg-white">
      <div className="w-full max-w-[370px]">

        {/* ── Header block ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-7"
        >
          <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-brand-600 mb-2.5">
            Workspace Access
          </p>
          <h2 className="text-[26px] font-bold text-gray-900 leading-tight tracking-tight">
            {isLogin ? 'Sign in to LoopTech Support' : 'Create your account'}
          </h2>
          <p className="mt-2 text-[13px] text-gray-500 leading-relaxed">
            {isLogin 
              ? 'Use your organization credentials to continue.'
              : 'Create a sign-in account. An admin must link it to a client before ticket submission.'}
          </p>
        </motion.div>

        {/* ── Forms ── */}
        {isLogin ? (
          <LoginForm onToggle={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggle={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default RightPanel;
