import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Landmark, Loader2 } from 'lucide-react';
import supabase from '../services/supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

/**
 * /auth/callback
 * Supabase redirects here after Google OAuth or email verification.
 * Listens for the session initialization, syncs the profile, and routes to /dashboard.
 */
const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let timeoutId;
    let subscription;

    const checkSession = async () => {
      // Check if session is already parsed
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard', { replace: true });
        return;
      }

      // If not, subscribe and wait for SIGNED_IN event or session presence
      const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (newSession) {
          if (timeoutId) clearTimeout(timeoutId);
          if (subscription) subscription.unsubscribe();
          navigate('/dashboard', { replace: true });
        }
      });
      subscription = data.subscription;

      // Safe fallback timeout (4 seconds) if OAuth callback fails
      timeoutId = setTimeout(() => {
        if (subscription) subscription.unsubscribe();
        showToast('Authentication timeout. Please try logging in again.', 'error');
        navigate('/login?error=google_auth_failed', { replace: true });
      }, 4000);
    };

    checkSession();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate, showToast]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-blue-50 to-white gap-4">
      <div className="w-12 h-12 rounded-xl bg-brand-blue-600 flex items-center justify-center">
        <Landmark size={24} className="text-white" />
      </div>
      <Loader2 size={28} className="animate-spin text-brand-blue-600" />
      <p className="text-gray-500 text-sm font-medium animate-pulse">Completing secure sign-in…</p>
    </div>
  );
};

export default AuthCallbackPage;
