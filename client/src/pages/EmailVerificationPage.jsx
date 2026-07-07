import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import Button from '../components/Button.jsx';

/**
 * /verify-email
 * Shown after email registration. Prompts user to check inbox.
 * Allows resending the verification email.
 */
const EmailVerificationPage = () => {
  const { resendVerification } = useAuth();
  const { showToast } = useToast();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  // Get email from sessionStorage (set in RegisterPage before redirect)
  const email = sessionStorage.getItem('verify_email') || '';

  const handleResend = async () => {
    if (!email) {
      showToast('Could not determine your email. Please register again.', 'error');
      return;
    }
    setResending(true);
    try {
      await resendVerification(email);
      setResent(true);
      showToast('Verification email resent! Check your inbox.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to resend. Please try again.', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="text-center">
      {/* Icon */}
      <div className="flex justify-center mb-5">
        <div className="w-16 h-16 rounded-full bg-brand-blue-50 flex items-center justify-center">
          <Mail size={32} className="text-brand-blue-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h1>
      <p className="text-sm text-gray-500 mb-1">
        We've sent a verification link to
      </p>
      {email && (
        <p className="text-sm font-semibold text-brand-blue-700 mb-5 break-all">{email}</p>
      )}
      <p className="text-sm text-gray-500 mb-8">
        Click the link in the email to activate your account and get started.
      </p>

      {/* Resend button */}
      {resent ? (
        <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium mb-6">
          <CheckCircle size={16} />
          Email resent successfully!
        </div>
      ) : (
        <Button
          variant="secondary"
          className="w-full mb-4"
          onClick={handleResend}
          loading={resending}
        >
          <RefreshCw size={15} />
          Resend verification email
        </Button>
      )}

      <p className="text-sm text-gray-400">
        Already verified?{' '}
        <Link to="/login" className="text-brand-blue-600 font-medium hover:underline">
          Log in
        </Link>
      </p>

      <p className="text-xs text-gray-400 mt-6">
        Didn't receive the email? Check your spam folder or{' '}
        <Link to="/register" className="underline">
          try a different email
        </Link>
        .
      </p>
    </div>
  );
};

export default EmailVerificationPage;
