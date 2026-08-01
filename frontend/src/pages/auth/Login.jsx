import { motion } from 'framer-motion';
import AuthLayout from '@components/layout/AuthLayout';
import LeftPanel from '@components/layout/LeftPanel';
import RightPanel from '@components/layout/RightPanel';

/**
 * Login page — composes AuthLayout with LeftPanel and RightPanel.
 */
const Login = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="h-full"
    >
      <AuthLayout>
        <LeftPanel />
        <RightPanel />
      </AuthLayout>
    </motion.div>
  );
};

export default Login;
