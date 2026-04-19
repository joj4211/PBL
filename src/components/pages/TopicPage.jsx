import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const container = {
  animate: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
};
const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function TopicPage({ topic, lang, onSelectCase, onBack, onSignOut }) {
  const { setLang } = useLanguage();
  const isZh = lang === 'zh';
  const t = topic[lang];
  const hasCases = topic.cases.length > 0;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFEF8 40%, #F0F5EC 100%)' }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-25 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B8D0A8, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #DFC99E, transparent 70%)', animationDelay: '2s' }}
      />

      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {isZh ? '← 返回' : '← Back'}
        </button>
      </div>

      {/* Language toggle */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={onSignOut}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {isZh ? '登出' : 'Sign out'}
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

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <div className="text-4xl mb-3">{topic.icon}</div>
          <h1 className="text-3xl font-bold text-warm-900 font-serif">{t.title}</h1>
          <p className="text-warm-400 text-sm mt-1">{t.subtitle}</p>
        </motion.div>

        <div className="w-full max-w-2xl">
          {hasCases ? (
            <motion.div
              variants={container}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4"
            >
              {topic.cases.map((c) => (
                <motion.div
                  key={c.id}
                  variants={item}
                  className="glass-card p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="font-semibold text-warm-900">{c[lang]}</div>
                    <div className="text-xs text-warm-400 mt-0.5">
                      {c[lang === 'zh' ? 'en' : 'zh']}
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectCase(c.id)}
                    className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full bg-sage-500 text-white hover:bg-sage-600 transition-colors duration-200"
                  >
                    {isZh ? '開始學習' : 'Start'}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card p-8 text-center"
            >
              <div className="text-3xl mb-3">🚧</div>
              <div className="text-lg font-semibold text-warm-700 mb-1">
                {isZh ? '即將上線' : 'Coming Soon'}
              </div>
              <p className="text-warm-400 text-sm mb-6">
                {isZh
                  ? '此主題的病例正在製作中，敬請期待。'
                  : 'Cases for this topic are being developed. Stay tuned!'}
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {t.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-warm-100 text-warm-500 border border-warm-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
