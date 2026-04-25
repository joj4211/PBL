import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useDomainProgress(userId, domainId) {
  const [progress, setProgress] = useState(null);
  const [assessmentStats, setAssessmentStats] = useState({
    preTestLatest: null,
    preTestBest: null,
    preTestCount: 0,
    postTestLatest: null,
    postTestBest: null,
    postTestCount: 0,
  });
  const [caseAttempts, setCaseAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    if (!userId || !domainId) return;

    setLoading(true);
    setError('');

    const [progressRes, attemptsRes, assessmentsRes] = await Promise.all([
      supabase
        .from('user_domain_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('domain_id', domainId)
        .maybeSingle(),
      supabase
        .from('case_attempts')
        .select('case_id')
        .eq('user_id', userId)
        .eq('domain', domainId),
      supabase
        .from('domain_assessments')
        .select('assessment_type, score, completed_at')
        .eq('user_id', userId)
        .eq('domain_id', domainId)
        .order('completed_at', { ascending: false }),
    ]);

    const nextError = progressRes.error || attemptsRes.error || assessmentsRes.error;

    if (nextError) {
      setError(nextError.message);
      setLoading(false);
      return;
    }

    setProgress(progressRes.data ?? {
      user_id: userId,
      domain_id: domainId,
      pretest_completed: false,
      posttest_completed: false,
    });

    const counts = (attemptsRes.data ?? []).reduce((acc, attempt) => {
      const caseId = attempt.case_id;
      acc[caseId] = (acc[caseId] ?? 0) + 1;
      return acc;
    }, {});

    setCaseAttempts(counts);

    const assessments = assessmentsRes.data ?? [];

    const pickStats = (type) => {
      const rows = assessments.filter((item) => item.assessment_type === type);
      if (rows.length === 0) {
        return { latest: null, best: null, count: 0 };
      }

      const latest = rows[0].score;
      const best = rows.reduce((max, item) => Math.max(max, item.score ?? 0), 0);
      return { latest, best, count: rows.length };
    };

    const pre = pickStats('preTest');
    const post = pickStats('postTest');

    setAssessmentStats({
      preTestLatest: pre.latest,
      preTestBest: pre.best,
      preTestCount: pre.count,
      postTestLatest: post.latest,
      postTestBest: post.best,
      postTestCount: post.count,
    });

    setLoading(false);
  }, [domainId, userId]);

  useEffect(() => {
    if (!userId || !domainId) return;
    refresh();
  }, [domainId, refresh, userId]);

  return {
    progress,
    assessmentStats,
    caseAttempts,
    loading,
    error,
    refresh,
  };
}
