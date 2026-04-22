import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const ADMIN_EMAILS = ['joj4211@gmail.com'];

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        setUser(null);
        setSession(null);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }

      setLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const ensureAppUser = useCallback(async (authUser) => {
    if (!authUser?.id) return;

    const { error } = await supabase
      .from('app_users')
      .upsert({ user_id: authUser.id }, { onConflict: 'user_id' });

    if (error) throw error;
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const nextEmail = email.trim();
    if (!nextEmail || !password) {
      throw new Error('請輸入 email 與密碼。');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: nextEmail,
      password,
    });

    if (error) throw error;
    await ensureAppUser(data.user);
    return data;
  }, [ensureAppUser]);

  const signUp = useCallback(async ({ email, password }) => {
    const nextEmail = email.trim();
    if (!nextEmail || !password) {
      throw new Error('請輸入 email 與密碼。');
    }

    const { data, error } = await supabase.auth.signUp({
      email: nextEmail,
      password,
    });

    if (error) throw error;

    if (data.session) {
      await ensureAppUser(data.user);
    }

    return {
      ...data,
      needsConfirmation: !data.session,
    };
  }, [ensureAppUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return {
    user,
    session,
    isAdmin: ADMIN_EMAILS.includes(user?.email ?? ''),
    loading,
    signIn,
    signUp,
    signOut,
  };
}
