import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, UserRound } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function EntryPage({ onSignIn, onSignUp, loading }) {
  const { lang } = useLanguage();
  const [mode, setMode] = useState('signIn');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === 'signUp';
  const text = {
    zh: {
      eyebrow: 'Interactive PBL Learning',
      title: '互動式 PBL 臨床推理學習平台',
      description: '透過臨床案例、階段式問答、檢查判讀與能力評估，協助學員在接近真實情境的流程中培養臨床思考。',
      features: ['案例導向', '即時回饋', '表現紀錄'],
      signIn: '登入',
      signUp: '註冊',
      userId: 'user_id',
      userIdPlaceholder: '請輸入你的 user_id',
      failed: '操作失敗，請稍後再試。',
      processing: '處理中...',
      createAccount: '註冊並開始',
      start: '登入並開始',
      testSignIn: '使用測試帳號登入',
      note: '不需要 email 或密碼。若 user_id 尚未建立，登入時也會自動建立資料。',
    },
    en: {
      eyebrow: 'Interactive PBL Learning',
      title: 'Interactive PBL Clinical Reasoning Platform',
      description: 'Build clinical reasoning through realistic cases, staged questions, exam interpretation, and performance feedback.',
      features: ['Case based', 'Instant feedback', 'Performance records'],
      signIn: 'Sign in',
      signUp: 'Register',
      userId: 'user_id',
      userIdPlaceholder: 'Enter your user_id',
      failed: 'Something went wrong. Please try again later.',
      processing: 'Processing...',
      createAccount: 'Register and start',
      start: 'Sign in and start',
      testSignIn: 'Use test account',
      note: 'No email or password required. If the user_id does not exist yet, signing in will create it.',
    },
  }[lang];

  const resetMessage = () => setMessage('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessage();

    setSubmitting(true);
    try {
      if (isSignUp) {
        await onSignUp({ userId });
      } else {
        await onSignIn({ userId });
      }
    } catch (error) {
      setMessage(error.message || text.failed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestSignIn = async () => {
    resetMessage();
    setSubmitting(true);
    try {
      await onSignIn({ userId: 'TEST_101' });
    } catch (error) {
      setMessage(error.message || text.failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl grid md:grid-cols-[1.05fr_0.95fr] gap-5"
      >
        <section className="glass-card p-7 sm:p-8 flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center">
              <BookOpenCheck className="w-6 h-6 text-sage-500" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-sage-600 mb-3">
                {text.eyebrow}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-warm-900 font-serif leading-tight">
                {text.title}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-warm-600 leading-relaxed">
                {text.description}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {text.features.map((item) => (
              <div key={item} className="rounded-xl bg-white/35 border border-white/60 px-4 py-3">
                <p className="text-sm font-semibold text-warm-800">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card p-7 sm:p-8">
          <div className="flex rounded-xl border border-warm-200 bg-white/35 p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('signIn');
                resetMessage();
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                !isSignUp ? 'bg-sage-500 text-white' : 'text-warm-600 hover:bg-white/50'
              }`}
            >
              {text.signIn}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signUp');
                resetMessage();
              }}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                isSignUp ? 'bg-sage-500 text-white' : 'text-warm-600 hover:bg-white/50'
              }`}
            >
              {text.signUp}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-warm-600">{text.userId}</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                <UserRound className="w-4 h-4 text-warm-400" />
                <input
                  required
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  className="w-full bg-transparent text-sm text-warm-800 outline-none"
                  placeholder={text.userIdPlaceholder}
                />
              </div>
            </label>

            <p className="rounded-xl border border-warm-200 bg-warm-50/60 px-4 py-3 text-xs text-warm-600 leading-relaxed">
              {text.note}
            </p>

            {message && (
              <p className="rounded-xl border border-warm-200 bg-warm-50/70 px-4 py-3 text-sm text-warm-700">
                {message}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading || submitting}>
              {submitting ? text.processing : isSignUp ? text.createAccount : text.start}
            </Button>

            <button
              type="button"
              onClick={handleTestSignIn}
              disabled={loading || submitting}
              className="w-full rounded-xl border border-warm-200 bg-white/45 px-4 py-3 text-sm font-semibold text-warm-700 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {text.testSignIn}
            </button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
