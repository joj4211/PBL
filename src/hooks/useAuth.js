import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const STORAGE_KEY = 'pbl_user_id';

function normalizeUserId(userId) {
  return userId.trim();
}

function makeUser(userId) {
  return { id: userId, user_id: userId };
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUserId = localStorage.getItem(STORAGE_KEY);
    if (savedUserId) {
      setUser(makeUser(savedUserId));
    }
    setLoading(false);
  }, []);

  const enterWithUserId = useCallback(async ({ userId }) => {
    const nextUserId = normalizeUserId(userId);
    if (!nextUserId) {
      throw new Error('請輸入 user_id。');
    }

    const { error } = await supabase
      .from('app_users')
      .upsert({ user_id: nextUserId }, { onConflict: 'user_id' });

    if (error) throw error;

    localStorage.setItem(STORAGE_KEY, nextUserId);
    setUser(makeUser(nextUserId));
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    user,
    session: user,
    loading,
    signIn: enterWithUserId,
    signUp: enterWithUserId,
    signOut,
  };
}
