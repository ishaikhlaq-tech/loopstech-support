import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { loginSchema } from '@utils/validators';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import SignInButton from './SignInButton';
import RequestAccount from './RequestAccount';

import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * LoginForm — wires react-hook-form + Zod validation together.
 * Uses real backend auth via AuthContext.
 */
const LoginForm = ({ onToggle }) => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to sign in');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Sign in form"
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
    >
      <EmailField register={register} error={errors.email} />
      <PasswordField register={register} error={errors.password} />
      <SignInButton loading={isSubmitting} />
      <RequestAccount onToggle={onToggle} />
    </motion.form>
  );
};

export default LoginForm;
