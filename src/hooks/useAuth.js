import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

function fallbackDisplayName(email) {
  if (!email) return null;
  return email.split('@')[0] || null;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const ensureAppUser = useCallback(async (authUser, medicalRole = null, displayName = null) => {
    if (!authUser?.id) return null;
    const nextMedicalRole = medicalRole ?? authUser.user_metadata?.medical_role ?? null;
    const nextDisplayName = displayName
      ?? authUser.user_metadata?.display_name
      ?? fallbackDisplayName(authUser.email);
    const nextUserAccount = authUser.email?.trim() || null;

    const { data: existingUser, error: selectError } = await supabase
      .from('app_users')
      .select('user_id,isAdmin,medical_role,display_name,user_account')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (selectError) {
      console.warn('Unable to load app user profile:', selectError.message);
      return null;
    }

    if (existingUser) {
      const patch = {};

      if (nextMedicalRole && !existingUser.medical_role) {
        patch.medical_role = nextMedicalRole;
      }

      if (nextDisplayName && !existingUser.display_name) {
        patch.display_name = nextDisplayName;
      }

      if (nextUserAccount && !existingUser.user_account) {
        patch.user_account = nextUserAccount;
      }

      if (Object.keys(patch).length === 0) {
        return existingUser;
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('app_users')
        .update(patch)
        .eq('user_id', authUser.id)
        .select('user_id,isAdmin,medical_role,display_name,user_account')
        .single();

      if (updateError) {
        console.warn('Unable to update app user profile:', updateError.message);
        return existingUser;
      }

      return updatedUser;
    }

    if (!nextDisplayName || !nextUserAccount) {
      return null;
    }

    const { data: createdUser, error: insertError } = await supabase
      .from('app_users')
      .insert({
        user_id: authUser.id,
        isAdmin: false,
        medical_role: nextMedicalRole,
        display_name: nextDisplayName,
        user_account: nextUserAccount,
      })
      .select('user_id,isAdmin,medical_role,display_name,user_account')
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
        setAppUser(null);
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
      setAppUser(null);
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

      setAppUser(appUser);
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
    setAppUser(appUser);
    setIsAdmin(Boolean(appUser?.isAdmin));
    return data;
  }, [ensureAppUser]);

  const signUp = useCallback(async ({ email, password, medicalRole, displayName }) => {
    const nextEmail = email.trim();
    if (!nextEmail || !password) {
      throw new Error('請輸入 email 與密碼。');
    }

    const nextDisplayName = displayName?.trim();
    if (!nextDisplayName) {
      throw new Error('請輸入姓名或暱稱。');
    }

    if (!medicalRole) {
      throw new Error('請選擇身分。');
    }

    const { data, error } = await supabase.auth.signUp({
      email: nextEmail,
      password,
      options: {
        data: {
          medical_role: medicalRole,
          display_name: nextDisplayName,
        },
      },
    });

    if (error) throw error;

    if (data.session) {
      const appUser = await ensureAppUser(data.user, medicalRole, nextDisplayName);
      setAppUser(appUser);
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
    setAppUser(null);
    setIsAdmin(false);
  }, []);

  return {
    user,
    session,
    appUser,
    isAdmin,
    loading: authLoading || profileLoading,
    signIn,
    signUp,
    signOut,
  };
}
