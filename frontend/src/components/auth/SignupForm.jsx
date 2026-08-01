import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import EmailField from './EmailField';
import PasswordField from './PasswordField';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

import Input from '@components/common/Input';

const NameField = ({ register, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] uppercase tracking-[0.1em] font-semibold text-gray-500">
      Full Name
    </label>
    <Input
      type="text"
      icon={User}
      placeholder="Alice Smith"
      autoComplete="name"
      aria-invalid={error ? 'true' : 'false'}
      {...register('name')}
    />
    {error && <span className="text-[12px] text-red-500">{error.message}</span>}
  </div>
);

const SignupForm = ({ onToggle }) => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (data) => {
    try {
      await signup(data.email, data.password, data.name);
      // After signup, automatically login
      await login(data.email, data.password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to create account');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
    >
      <NameField register={register} error={errors.name} />
      <EmailField register={register} error={errors.email} />
      <PasswordField register={register} error={errors.password} />
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="h-[42px] w-full mt-2 bg-[#0F766E] hover:bg-[#0D645E] text-white text-[14px] font-semibold rounded-[6px] transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
      >
        {isSubmitting ? 'Creating...' : 'Create Account'}
      </button>

      <p className="text-center text-[13px] text-gray-500 mt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggle}
          className="text-brand-600 font-semibold hover:text-brand-700 transition-colors focus:outline-none focus:underline"
        >
          Sign in
        </button>
      </p>
    </motion.form>
  );
};

export default SignupForm;
