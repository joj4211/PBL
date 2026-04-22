import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import { domains } from '../../config/domains';

const colorMap = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  sage: 'bg-sage-100 text-sage-700 border-sage-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
};

function average(values) {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export default function PerformancePage({ user, lang, onBack, onSignOut }) {
  const { setLang } = useLanguage();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isZh = lang === 'zh';

  const text = {
    back: isZh ? '返回' : 'Back',
    signOut: isZh ? '登出' : 'Sign out',
    badge: isZh ? '個人表現紀錄' : 'Personal performance',
    title: isZh ? '表現統計' : 'Performance Stats',
    subtitle: isZh
      ? '依耳科、鼻科、喉科整理你的作答紀錄與平均表現。'
      : 'Review your attempt history and average scores across otology, rhinology, and laryngology.',
    attempts: isZh ? '完成次數' : 'Attempts',
    average: isZh ? '平均表現' : 'Average',
    noRecord: isZh ? '尚無紀錄' : 'No records yet',
    noData: isZh ? '完成案例後，這裡會出現你的主題表現。' : 'Complete a case to see topic performance here.',
    loading: isZh ? '讀取表現紀錄中...' : 'Loading performance records...',
    error: isZh ? '讀取紀錄失敗' : 'Failed to load records',
  };

  useEffect(() => {
    let cancelled = false;

    async function loadAttempts() {
      setLoading(true);
      setError('');

      const { data, error: queryError } = await supabase
        .from('case_attempts')
        .select('case_id, domain, pre_test_score, interactive_score, post_test_score')
        .eq('user_id', user.id);

      if (cancelled) return;

      if (queryError) {
        setError(queryError.message);
        setAttempts([]);
      } else {
        setAttempts(data ?? []);
      }

      setLoading(false);
    }

    loadAttempts();

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  const topicStats = useMemo(() => domains.map((topic) => {
    const topicAttempts = attempts.filter((attempt) => (
      attempt.domain === topic.id || topic.cases.some((caseItem) => caseItem.id === attempt.case_id)
    ));
    const scores = topicAttempts.map((attempt) => average([
      attempt.pre_test_score,
      attempt.interactive_score,
      attempt.post_test_score,
    ].filter((score) => typeof score === 'number')));

    return {
      ...topic,
      attempts: topicAttempts.length,
      score: average(scores.filter((score) => score !== null)),
    };
  }), [attempts]);

  const overallAverage = average(topicStats
    .map((topic) => topic.score)
    .filter((score) => score !== null));

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFEF8 40%, #F0F5EC 100%)' }}
    >
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          <ArrowLeft className="inline w-3 h-3 mr-1" />
          {text.back}
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={onSignOut}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {text.signOut}
        </button>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200 outline-none"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="relative z-10 min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-4 py-1.5 rounded-full">
              <BarChart2 className="w-3.5 h-3.5" />
              {text.badge}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-warm-900 font-serif leading-tight">
              {text.title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-warm-500 font-light leading-relaxed">
              {text.subtitle}
            </p>
          </motion.div>

          <div className="glass-card p-5 sm:p-6 mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-warm-500">{text.average}</div>
              <div className="text-xs text-warm-400 mt-1">{user.email ?? user.id}</div>
            </div>
            <div className="text-4xl font-bold text-sage-600">
              {overallAverage === null ? '--' : `${overallAverage}%`}
            </div>
          </div>

          {loading && (
            <div className="glass-card p-5 text-sm font-semibold text-warm-600">{text.loading}</div>
          )}

          {!loading && error && (
            <div className="glass-card p-5 text-sm font-semibold text-warm-600">
              {text.error}：{error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topicStats.map((topic, index) => {
                const topicText = topic[lang];

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    className="glass-card p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-bold text-warm-900">{topicText.title}</h2>
                        <p className="text-xs text-warm-400 mt-1">{topicText.subtitle}</p>
                        <p className="text-xs text-warm-400 mt-2">
                          {text.attempts}：{topic.attempts}
                        </p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[topic.color]}`}>
                        {topic.score === null ? text.noRecord : `${topic.score}%`}
                      </span>
                    </div>

                    <div className="mt-5 h-2 rounded-full bg-warm-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sage-500 transition-all duration-500"
                        style={{ width: `${topic.score ?? 0}%` }}
                      />
                    </div>

                    {topic.score !== null ? (
                      <p className="mt-4 text-xs text-sage-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {text.average} {topic.score}%
                      </p>
                    ) : (
                      <p className="mt-4 text-xs text-warm-400">{text.noData}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
