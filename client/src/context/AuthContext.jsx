import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import supabase from '../services/supabaseClient.js';
import apiClient from '../services/apiClient.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // profile from public.users
  const [session, setSession] = useState(null); // Supabase Auth session
  const [loading, setLoading] = useState(true);

  // Sync profile to public.users and store in state
  const syncAndSetUser = useCallback(async (supabaseSession) => {
    if (!supabaseSession) {
      setUser(null);
      setSession(null);
      return;
    }
    setSession(supabaseSession);
    // Store token so apiClient interceptor picks it up
    localStorage.setItem('sb_token', supabaseSession.access_token);
    // Sync profile in the background — don't block auth state
    apiClient.post('/auth/sync-profile', {})
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Profile sync failed — still mark as logged in with basic info
        setUser({ id: supabaseSession.user.id, email: supabaseSession.user.email, fullName: supabaseSession.user.user_metadata?.full_name || '' });
      });
  }, []);

  // Listen to Supabase Auth state changes (login, logout, token refresh)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      syncAndSetUser(s);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      syncAndSetUser(s);
    });

    return () => subscription.unsubscribe();
  }, [syncAndSetUser]);

  // ── Auth actions ──────────────────────────────────────────────────────────

  /** Sign in with Google — opens Google consent screen */
  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw { message: error.message };
  }, []);

  /** Sign in with email + password */
  const loginWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    // Supabase returns a clear error if credentials are wrong or email is unconfirmed
    if (error) throw { message: error.message };
    return data.user;
  }, []);

  /** Register with email + password — sends a verification email */
  const registerWithEmail = useCallback(async ({ email, password, fullName, phone }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw { message: error.message };

    // Supabase returns empty identities when email already exists (to prevent enumeration)
    if (data.user && data.user.identities?.length === 0) {
      throw { message: 'This email is already registered. Please log in or check your inbox for a verification email.' };
    }

    return data.user;
  }, []);

  /** Resend verification email */
  const resendVerification = useCallback(async (email) => {
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    if (error) throw { message: error.message };
  }, []);

  /** Sign out */
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('sb_token');
    setUser(null);
    setSession(null);
  }, []);

  /** Update local user state (used by profile page) */
  const updateUserLocal = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: Boolean(user),
        isEmailVerified: Boolean(session?.user?.email_confirmed_at),
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        resendVerification,
        logout,
        updateUserLocal,
        // Legacy aliases so existing pages don't break immediately
        login: loginWithEmail,
        register: registerWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
