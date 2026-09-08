import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenCheck, Lock, ShieldCheck, UserRound } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

const consent = {
  zh: {
    title: '同意聲明',
    introduction: '本平台為醫學教育用途之應用程式，不屬於您輪訓課程的一部分，也不是考試。',
    sections: [
      ['您會做什麼', '知識性前測 → 15-16 個耳科與鼻科互動教案 → 後測與一份簡短滿意度問卷。可分次進行。'],
      ['完全自願', '您可以不參加，也可以隨時關閉網頁退出，不需說明理由，不影響您的任何權益。'],
      ['不影響考績', '您是否參與、成績如何，絕不作為您目前或未來耳鼻喉科輪訓之成績評定或年度考績依據。'],
      ['隱私保護', '本平台不要求填寫姓名、員工代號、病歷號或電子郵件。註冊時僅需自行設定帳號、密碼並選擇職級；請勿以姓名、電子郵件、員工代號或其他可識別個人身分的資料作為帳號。系統會產生一組隨機 ID，用於串接您的前測、教案與後測紀錄。研究結果僅以整體統計數據發表。'],
      ['風險與報酬', '風險不高於日常數位學習，您所付出的僅為操作時間。無任何報酬。'],
    ],
    agreement: '我已閱讀並理解以上內容。我瞭解參與完全出於自願、可隨時退出，且不影響我的成績評定。我同意參與本研究。',
  },
  en: {
    title: 'Consent Statement',
    introduction: 'This is an app for education purpose. It is not part of your rotation curriculum and it is not an examination.',
    sections: [
      ['What you will do', 'a knowledge pre-test → 15–16 interactive otology and rhinology cases → a post-test and a short satisfaction questionnaire. You may do this across several sessions.'],
      ['Entirely voluntary', 'you may decline, or leave at any time by closing the page, without giving a reason and without any effect on your rights.'],
      ['No effect on your evaluation', 'neither your participation nor your scores will ever be used in assessing any current or future ENT rotation, or your annual performance review.'],
      ['Privacy', 'the platform does not ask for your name, staff number, medical record number, or email. Registration requires only a self-chosen account name, a password, and your role. Do not use your name, email, staff number, or other identifying information as the account name. The system generates a random ID to link your pre-test, cases, and post-test records. Results are reported only as aggregate statistics.'],
      ['Risks and compensation', 'risk is no greater than everyday digital learning; the only cost is your time. There is no payment.'],
    ],
    agreement: 'I have read and understood the above. I understand that participation is voluntary, that I may withdraw at any time, and that this will not affect my evaluation. I agree to take part.',
  },
};

export default function EntryPage({ onSignIn, onSignUp, loading }) {
  const { lang } = useLanguage();
  const [mode, setMode] = useState('signIn');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [medicalRole, setMedicalRole] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isSignUp = mode === 'signUp';
  const roleOptions = ['主治醫師', '住院醫師', 'PGY', 'Clerk'];
  const statement = consent[lang];
  const text = {
    zh: {
      eyebrow: 'Interactive PBL Learning',
      title: '互動式 PBL 臨床推理學習平台',
      description: '透過臨床案例、階段式問答、檢查判讀與能力評估，協助學員培養臨床思考。',
      features: ['案例導向', '即時回饋', '表現紀錄'],
      signIn: '登入',
      signUp: '註冊',
      account: '帳號',
      accountPlaceholder: '請輸入帳號',
      accountHint: '請使用 3–32 個字元，且勿填寫姓名、Email 或員工代號。',
      password: '密碼',
      passwordPlaceholder: '請輸入密碼',
      role: '職級',
      rolePlaceholder: '請選擇職級',
      failed: '操作失敗，請稍後再試。',
      processing: '處理中…',
      createAccount: '註冊並開始',
      start: '登入並開始',
      consentRequired: '請先閱讀並勾選同意聲明。',
    },
    en: {
      eyebrow: 'Interactive PBL Learning',
      title: 'Interactive PBL Clinical Reasoning Platform',
      description: 'Build clinical reasoning through realistic cases, staged questions, exam interpretation, and performance feedback.',
      features: ['Case based', 'Instant feedback', 'Performance records'],
      signIn: 'Sign in',
      signUp: 'Register',
      account: 'Account name',
      accountPlaceholder: 'Enter your account name',
      accountHint: 'Use 3–32 characters. Do not enter your name, email, or staff number.',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      role: 'Role',
      rolePlaceholder: 'Select your role',
      failed: 'Something went wrong. Please try again later.',
      processing: 'Processing…',
      createAccount: 'Register and start',
      start: 'Sign in and start',
      consentRequired: 'Please read and accept the consent statement first.',
    },
  }[lang];

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMessage('');
    setPassword('');
    setConsentAccepted(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    if (isSignUp && !consentAccepted) {
      setMessage(text.consentRequired);
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) {
        await onSignUp({ account, password, medicalRole, consentAccepted });
      } else {
        await onSignIn({ account, password });
      }
    } catch (error) {
      setMessage(error?.message || text.failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-5xl grid md:grid-cols-[0.9fr_1.1fr] gap-5">
        <section className="glass-card p-7 sm:p-8 flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center">
              <BookOpenCheck className="w-6 h-6 text-sage-500" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-sage-600 mb-3">{text.eyebrow}</p>
              <h1 className="text-3xl sm:text-4xl font-bold text-warm-900 font-serif leading-tight">{text.title}</h1>
              <p className="mt-4 text-sm sm:text-base text-warm-600 leading-relaxed">{text.description}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {text.features.map((item) => <div key={item} className="rounded-xl bg-white/35 border border-white/60 px-4 py-3"><p className="text-sm font-semibold text-warm-800">{item}</p></div>)}
          </div>
        </section>

        <section className="glass-card p-7 sm:p-8">
          <div className="flex rounded-xl border border-warm-200 bg-white/35 p-1 mb-6">
            <button type="button" onClick={() => changeMode('signIn')} className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${!isSignUp ? 'bg-sage-500 text-white' : 'text-warm-600 hover:bg-white/50'}`}>{text.signIn}</button>
            <button type="button" onClick={() => changeMode('signUp')} className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${isSignUp ? 'bg-sage-500 text-white' : 'text-warm-600 hover:bg-white/50'}`}>{text.signUp}</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold text-warm-600">{text.account}</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                <UserRound className="w-4 h-4 text-warm-400" />
                <input required minLength={3} maxLength={32} value={account} onChange={(event) => setAccount(event.target.value)} className="w-full bg-transparent text-sm text-warm-800 outline-none" placeholder={text.accountPlaceholder} autoComplete="username" />
              </div>
              {isSignUp && <p className="mt-1.5 text-xs leading-relaxed text-warm-400">{text.accountHint}</p>}
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-warm-600">{text.password}</span>
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5">
                <Lock className="w-4 h-4 text-warm-400" />
                <input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-sm text-warm-800 outline-none" placeholder={text.passwordPlaceholder} autoComplete={isSignUp ? 'new-password' : 'current-password'} />
              </div>
            </label>

            {isSignUp && (
              <>
                <label className="block">
                  <span className="text-xs font-semibold text-warm-600">{text.role}</span>
                  <select required value={medicalRole} onChange={(event) => setMedicalRole(event.target.value)} className="mt-1.5 w-full rounded-xl border-2 border-warm-200 bg-white/45 px-3 py-2.5 text-sm text-warm-800 outline-none">
                    <option value="">{text.rolePlaceholder}</option>
                    {roleOptions.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                </label>

                <div className="rounded-2xl border border-warm-200 bg-warm-50/60 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-bold text-warm-900">
                    <ShieldCheck className="h-5 w-5 text-sage-600" />
                    {statement.title}
                  </div>
                  <div className="max-h-48 space-y-3 overflow-y-auto pr-2 text-xs leading-relaxed text-warm-600">
                    <p>{statement.introduction}</p>
                    {statement.sections.map(([title, body]) => <p key={title}><strong className="text-warm-800">{title}{lang === 'zh' ? '：' : ': '}</strong>{body}</p>)}
                  </div>
                  <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-sage-200 bg-white/60 p-3">
                    <input type="checkbox" checked={consentAccepted} onChange={(event) => setConsentAccepted(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-sage-600" />
                    <span className="text-xs font-medium leading-relaxed text-warm-700">{statement.agreement}</span>
                  </label>
                </div>
              </>
            )}

            {message && <p className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">{message}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={loading || submitting || (isSignUp && !consentAccepted)}>
              {submitting ? text.processing : isSignUp ? text.createAccount : text.start}
            </Button>
          </form>
        </section>
      </motion.div>
    </div>
  );
}
