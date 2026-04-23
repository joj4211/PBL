import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const ensureAppUser = useCallback(async (authUser) => {
    if (!authUser?.id) return null;

    const { data: existingUser, error: selectError } = await supabase
      .from('app_users')
      .select('user_id,isAdmin')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (selectError) {
      console.warn('Unable to load app user profile:', selectError.message);
      return null;
    }

    if (existingUser) {
      return existingUser;
    }

    const { data: createdUser, error: insertError } = await supabase
      .from('app_users')
      .insert({ user_id: authUser.id, isAdmin: false })
      .select('user_id,isAdmin')
      .single();

    if (insertError) {
      console.warn('Unable to create app user profile:', insertError.message);
      return null;
    }

    return createdUser;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      } else {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }

      setAuthLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setIsAdmin(false);
      setProfileLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setProfileLoading(true);
      setIsAdmin(false);
      const appUser = await ensureAppUser(user);
      if (cancelled) return;

      setIsAdmin(Boolean(appUser?.isAdmin));
      setProfileLoading(false);
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [ensureAppUser, user]);

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
    const appUser = await ensureAppUser(data.user);
    setIsAdmin(Boolean(appUser?.isAdmin));
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
      const appUser = await ensureAppUser(data.user);
      setIsAdmin(Boolean(appUser?.isAdmin));
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
    setIsAdmin(false);
  }, []);

  return {
    user,
    session,
    isAdmin,
    loading: authLoading || profileLoading,
    signIn,
    signUp,
    signOut,
  };
}
