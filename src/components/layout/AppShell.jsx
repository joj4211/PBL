import { useLanguage } from '../../contexts/LanguageContext';

export default function AppShell({
  children,
  showCaseControls = false,
  showBackControl = true,
  showExitControl = true,
  onBack,
  onExit,
  onSignOut,
}) {
  const { lang, setLang } = useLanguage();
  const navLabels = lang === 'zh'
    ? { back: '上一頁', exit: '退出' }
    : { back: 'Back', exit: 'Exit' };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFEF8 40%, #F0F5EC 100%)' }}
    >
      {/* Ambient background orbs */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-25 animate-float"
        style={{ background: 'radial-gradient(circle, #B8D0A8, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20 animate-float"
        style={{
          background: 'radial-gradient(circle, #DFC99E, transparent 70%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute top-1/2 right-10 w-64 h-64 rounded-full opacity-15 animate-float"
        style={{
          background: 'radial-gradient(circle, #95B880, transparent 70%)',
          animationDelay: '4s',
        }}
      />

      {/* Case navigation */}
      {showCaseControls && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          {showBackControl && (
            <button
              onClick={onBack}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
            >
              {navLabels.back}
            </button>
          )}
          {showExitControl && (
            <button
              onClick={onExit}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
            >
              {navLabels.exit}
            </button>
          )}
        </div>
      )}

      {/* Language toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
          >
            {lang === 'zh' ? '登出' : 'Sign out'}
          </button>
        )}
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200 outline-none"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
