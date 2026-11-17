import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase } from '../../../lib/supabase';

const AuthContext = createContext(null);

const toCurrentUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Student',
    email: user.email || '',
    role: user.user_metadata?.role || 'student',
  };
};

const configurationError = 'Connect this app to Supabase before using accounts.';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    try {
      localStorage.removeItem('dsp_password_overrides');
      localStorage.removeItem('dsp_registered_accounts');
      localStorage.removeItem('dsp_auth_session');
    } catch {
      // Browser storage is optional.
    }
    if (!isSupabaseConfigured) {
      return undefined;
    }

    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setCurrentUser(error ? null : toCurrentUser(data.session?.user));
      setIsLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(toCurrentUser(session?.user));
      setIsLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    if (!supabase) return { success: false, error: configurationError };
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) return { success: false, reason: 'AUTH_FAILED', error: error.message };
    const user = toCurrentUser(data.user);
    setCurrentUser(user);
    return { success: true, user };
  };

  const signup = async ({ name, email, password }) => {
    if (!supabase) return { success: false, error: configurationError };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: name.trim(), role: 'student' },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { success: false, error: error.message };
    if (data.session) setCurrentUser(toCurrentUser(data.user));
    return { success: true, requiresEmailConfirmation: !data.session };
  };

  const updatePassword = async (_email, newPassword) => {
    if (!supabase) throw new Error(configurationError);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
    return true;
  };

  const logout = async () => {
    if (!supabase) {
      setCurrentUser(null);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: Boolean(currentUser),
        isLoading,
        isSupabaseConfigured,
        login,
        signup,
        updatePassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;