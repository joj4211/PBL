import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, Lock, Mail } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function EntryPage({ onSignIn, onSignUp, loading }) {
  const { lang } = useLanguage();
  const [mode, setMode] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      email: 'Email',
      emailPlaceholder: '請輸入 email',
      password: '密碼',
      passwordPlaceholder: '請輸入密碼',
      failed: '操作失敗，請稍後再試。',
      processing: '處理中...',
      createAccount: '註冊並開始',
      start: '登入並開始',
      confirmation: '註冊完成。請先到信箱確認 email，再回來登入。',
      note: '請使用 Supabase Auth 帳號登入。未登入者無法讀取 private bucket 內的圖片或影片。',
    },
    en: {
      eyebrow: 'Interactive PBL Learning',
      title: 'Interactive PBL Clinical Reasoning Platform',
      description: 'Build clinical reasoning through realistic cases, staged questions, exam interpretation, and performance feedback.',
      features: ['Case based', 'Instant feedback', 'Performance records'],
      signIn: 'Sign in',
      signUp: 'Register',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      failed: 'Something went wrong. Please try again later.',
      processing: 'Processing...',
      createAccount: 'Register and start',
      start: 'Sign in and start',
      confirmation: 'Account created. Please confirm your email, then sign in.',
      note: 'Sign in with Supabase Auth. Private bucket images and videos are available only after sign-in.',
    },
  }[lang];

  const resetMessage = () => setMessage('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessage();

    setSubmitting(true);
    try {
      if (isSignUp) {
        const result = await onSignUp({ email, password });
        if (result?.needsConfirmation) {
          setMessage(text.confirmation);
        }
      } else {
        await onSignIn({ email, password });
      }
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
              <span className="text-xs font-semibold text-warm-600">{text.email}</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                <Mail className="w-4 h-4 text-warm-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm text-warm-800 outline-none"
                  placeholder={text.emailPlaceholder}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-warm-600">{text.password}</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                <Lock className="w-4 h-4 text-warm-400" />
                <input
                  required
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm text-warm-800 outline-none"
                  placeholder={text.passwordPlaceholder}
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
          </form>
        </section>
      </motion.div>
    </div>
  );
}
