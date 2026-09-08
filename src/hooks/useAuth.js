import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const CONSENT_VERSION = '2026-09-08-v1';
const GENERATED_EMAIL_DOMAIN = 'participants.pbl-study.example';

function normalizeAccount(account) {
  return account.trim().toLocaleLowerCase('en-US');
}

function validateNewAccount(account) {
  const normalized = normalizeAccount(account);

  if (normalized.length < 3 || normalized.length > 32) {
    throw new Error('帳號長度需為 3–32 個字元。');
  }

  if (/\s/.test(normalized) || normalized.includes('@')) {
    throw new Error('帳號不可包含空白或 @ 符號，請勿使用 Email 作為帳號。');
  }

  return normalized;
}

async function accountToGeneratedEmail(account) {
  const bytes = new TextEncoder().encode(normalizeAccount(account));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `pbl-${hash}@${GENERATED_EMAIL_DOMAIN}`;
}

async function accountToLoginEmail(account) {
  const normalized = normalizeAccount(account);
  return normalized.includes('@') ? normalized : accountToGeneratedEmail(normalized);
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const ensureAppUser = useCallback(async (authUser, registration = null) => {
    if (!authUser?.id) return null;

    const nextAccount = registration?.account
      ?? authUser.user_metadata?.user_account
      ?? authUser.email?.split('@')[0]
      ?? null;
    const nextMedicalRole = registration?.medicalRole
      ?? authUser.user_metadata?.medical_role
      ?? null;
    const nextConsentVersion = registration?.consentVersion
      ?? authUser.user_metadata?.consent_version
      ?? null;
    const nextConsentedAt = registration?.consentedAt
      ?? authUser.user_metadata?.consented_at
      ?? null;

    const { data: existingUser, error: selectError } = await supabase
      .from('app_users')
      .select('user_id,isAdmin,medical_role,display_name,user_account,consent_version,consented_at')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existingUser) {
      const patch = {};
      if (nextMedicalRole && !existingUser.medical_role) patch.medical_role = nextMedicalRole;
      if (nextAccount && !existingUser.user_account) patch.user_account = nextAccount;
      if (nextAccount && !existingUser.display_name) patch.display_name = nextAccount;
      if (nextConsentVersion && !existingUser.consent_version) patch.consent_version = nextConsentVersion;
      if (nextConsentedAt && !existingUser.consented_at) patch.consented_at = nextConsentedAt;

      if (Object.keys(patch).length === 0) return existingUser;

      const { data: updatedUser, error: updateError } = await supabase
        .from('app_users')
        .update(patch)
        .eq('user_id', authUser.id)
        .select('user_id,isAdmin,medical_role,display_name,user_account,consent_version,consented_at')
        .single();

      if (updateError) throw updateError;
      return updatedUser;
    }

    if (!nextAccount) return null;

    const { data: createdUser, error: insertError } = await supabase
      .from('app_users')
      .insert({
        user_id: authUser.id,
        isAdmin: false,
        medical_role: nextMedicalRole,
        display_name: nextAccount,
        user_account: nextAccount,
        consent_version: nextConsentVersion,
        consented_at: nextConsentedAt,
      })
      .select('user_id,isAdmin,medical_role,display_name,user_account,consent_version,consented_at')
      .single();

    if (insertError?.code === '23505') {
      const { data: concurrentUser, error: concurrentSelectError } = await supabase
        .from('app_users')
        .select('user_id,isAdmin,medical_role,display_name,user_account,consent_version,consented_at')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (concurrentSelectError) throw concurrentSelectError;
      if (concurrentUser) return concurrentUser;
      throw new Error('此帳號已被使用，請更換帳號。');
    }
    if (insertError) throw insertError;
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
      try {
        const nextAppUser = await ensureAppUser(user);
        if (cancelled) return;
        setAppUser(nextAppUser);
        setIsAdmin(Boolean(nextAppUser?.isAdmin));
      } catch (error) {
        if (!cancelled) {
          console.warn('Unable to load app user profile:', error.message);
          setAppUser(null);
          setIsAdmin(false);
        }
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [ensureAppUser, user]);

  const signIn = useCallback(async ({ account, password }) => {
    if (!account.trim() || !password) {
      throw new Error('請輸入帳號與密碼。');
    }

    const email = await accountToLoginEmail(account);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    const nextAppUser = await ensureAppUser(data.user);
    setAppUser(nextAppUser);
    setIsAdmin(Boolean(nextAppUser?.isAdmin));
    return data;
  }, [ensureAppUser]);

  const signUp = useCallback(async ({ account, password, medicalRole, consentAccepted }) => {
    const normalizedAccount = validateNewAccount(account);

    if (!password) throw new Error('請輸入密碼。');
    if (!medicalRole) throw new Error('請選擇職級。');
    if (!consentAccepted) throw new Error('請先閱讀並勾選同意聲明。');

    const consentedAt = new Date().toISOString();
    const email = await accountToGeneratedEmail(normalizedAccount);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_account: normalizedAccount,
          medical_role: medicalRole,
          consent_version: CONSENT_VERSION,
          consented_at: consentedAt,
        },
      },
    });

    if (error) {
      if (error.message?.toLowerCase().includes('already')) {
        throw new Error('此帳號已被使用，請更換帳號。');
      }
      throw error;
    }

    if (!data.session) {
      throw new Error('後台目前要求 Email 驗證，請先關閉 Supabase 的 Confirm email 選項。');
    }

    const nextAppUser = await ensureAppUser(data.user, {
      account: normalizedAccount,
      medicalRole,
      consentVersion: CONSENT_VERSION,
      consentedAt,
    });
    setAppUser(nextAppUser);
    setIsAdmin(Boolean(nextAppUser?.isAdmin));
    return data;
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
