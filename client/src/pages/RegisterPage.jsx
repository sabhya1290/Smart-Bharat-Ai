import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { registerFormSchema } from '../utils/validationSchemas.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import FormField, { inputClasses } from '../components/FormField.jsx';
import Button from '../components/Button.jsx';

/* Google 'G' logo as inline SVG */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const RegisterPage = () => {
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerFormSchema) });

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const newUser = await registerWithEmail({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
      });

      // If email_confirmed_at is set, Supabase skipped confirmation (confirmation disabled)
      // → go straight to dashboard. Otherwise → show verify-email page.
      if (newUser?.email_confirmed_at) {
        showToast('Account created! Welcome to Smart Bharat AI.', 'success');
        navigate('/dashboard');
      } else {
        sessionStorage.setItem('verify_email', values.email);
        showToast('Account created! Please verify your email.', 'success');
        navigate('/verify-email');
      }
    } catch (err) {
      showToast(err.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Redirects to Google — no further action needed here
    } catch (err) {
      showToast(err.message || 'Google sign-up failed. Please try again.', 'error');
      setGoogleLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-sm text-gray-500 mb-6">Join Smart Bharat AI to access personalized civic services.</p>

      {/* Google Sign-Up */}
      <Button
        id="btn-google-register"
        type="button"
        variant="secondary"
        className="w-full mb-4 border-gray-300 text-gray-700 hover:bg-gray-50"
        onClick={onGoogleSignUp}
        loading={googleLoading}
      >
        {!googleLoading && <GoogleIcon />}
        Sign up with Google
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">or register with email</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Email Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField label="Full Name" htmlFor="fullName" error={errors.fullName?.message}>
          <input
            id="fullName"
            type="text"
            className={inputClasses(errors.fullName)}
            {...register('fullName')}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input id="email" type="email" className={inputClasses(errors.email)} {...register('email')} />
        </FormField>

        <FormField label="Phone Number (optional)" htmlFor="phone" error={errors.phone?.message}>
          <input id="phone" type="tel" className={inputClasses(errors.phone)} {...register('phone')} />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            className={inputClasses(errors.password)}
            {...register('password')}
          />
        </FormField>

        <FormField
          label="Confirm Password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <input
            id="confirmPassword"
            type="password"
            className={inputClasses(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button id="btn-email-register" type="submit" className="w-full mt-2" loading={submitting}>
          Create Account
        </Button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-blue-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
