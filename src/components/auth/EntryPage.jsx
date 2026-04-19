import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, LockKeyhole, Mail, UserPlus } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function EntryPage({ onSignIn, onSignUp, loading }) {
  const { lang } = useLanguage();
  const [mode, setMode] = useState('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
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
      displayName: '顯示名稱',
      displayNamePlaceholder: '請輸入你的名稱',
      password: '密碼',
      passwordPlaceholder: '至少 6 個字元',
      confirmPassword: '確認密碼',
      confirmPasswordPlaceholder: '再次輸入密碼',
      passwordMismatch: '兩次輸入的密碼不一致。',
      signUpDone: '註冊完成。若系統要求信箱驗證，請先到信箱完成確認。',
      failed: '操作失敗，請稍後再試。',
      testFailed: '測試帳號登入失敗，請稍後再試。',
      processing: '處理中...',
      createAccount: '建立帳號',
      start: '登入並開始',
      testSignIn: '使用測試帳號登入',
    },
    en: {
      eyebrow: 'Interactive PBL Learning',
      title: 'Interactive PBL Clinical Reasoning Platform',
      description: 'Build clinical reasoning through realistic cases, staged questions, exam interpretation, and performance feedback.',
      features: ['Case based', 'Instant feedback', 'Performance records'],
      signIn: 'Sign in',
      signUp: 'Register',
      displayName: 'Display name',
      displayNamePlaceholder: 'Enter your name',
      password: 'Password',
      passwordPlaceholder: 'At least 6 characters',
      confirmPassword: 'Confirm password',
      confirmPasswordPlaceholder: 'Enter password again',
      passwordMismatch: 'The two passwords do not match.',
      signUpDone: 'Registration complete. If email confirmation is required, please confirm your email first.',
      failed: 'Something went wrong. Please try again later.',
      testFailed: 'Test account sign-in failed. Please try again later.',
      processing: 'Processing...',
      createAccount: 'Create account',
      start: 'Sign in and start',
      testSignIn: 'Use test account',
    },
  }[lang];

  const resetMessage = () => setMessage('');

  const handleTestSignIn = async () => {
    resetMessage();
    setMode('signIn');
    setEmail('joj4211@gmail.com');
    setPassword('123456');
    setSubmitting(true);

    try {
      await onSignIn({ email: 'joj4211@gmail.com', password: '123456' });
    } catch (error) {
      setMessage(error.message || text.testFailed);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessage();

    if (isSignUp && password !== confirmPassword) {
      setMessage(text.passwordMismatch);
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) {
        await onSignUp({ email, password, displayName });
        setMessage(text.signUpDone);
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
            {isSignUp && (
              <label className="block">
                <span className="text-xs font-semibold text-warm-600">{text.displayName}</span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                  <UserPlus className="w-4 h-4 text-warm-400" />
                  <input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-transparent text-sm text-warm-800 outline-none"
                    placeholder={text.displayNamePlaceholder}
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-xs font-semibold text-warm-600">Email</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                <Mail className="w-4 h-4 text-warm-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm text-warm-800 outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-warm-600">{text.password}</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                <LockKeyhole className="w-4 h-4 text-warm-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm text-warm-800 outline-none"
                  placeholder={text.passwordPlaceholder}
                />
              </div>
            </label>

            {isSignUp && (
              <label className="block">
                <span className="text-xs font-semibold text-warm-600">{text.confirmPassword}</span>
                <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                  <LockKeyhole className="w-4 h-4 text-warm-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-warm-800 outline-none"
                    placeholder={text.confirmPasswordPlaceholder}
                  />
                </div>
              </label>
            )}

            {message && (
              <p className="rounded-xl border border-warm-200 bg-warm-50/70 px-4 py-3 text-sm text-warm-700">
                {message}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={loading || submitting}>
              {submitting ? text.processing : isSignUp ? text.createAccount : text.start}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handleTestSignIn}
              disabled={loading || submitting}
            >
              {text.testSignIn}
            </Button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
