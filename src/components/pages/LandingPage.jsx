import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { domains, domainColorMap } from '../../config/domains';

const container = {
  animate: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
};
const cardItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage({ lang, onSelectTopic, onSelectPerformance, onSignOut }) {
  const { setLang } = useLanguage();
  const isZh = lang === 'zh';

  const heading    = isZh ? '耳鼻喉科 PBL 學習平台' : 'ENT PBL Learning Platform';
  const subheading = isZh
    ? '以真實病例為核心，建立臨床思維。\n專為醫學生與住院醫師設計。'
    : 'Case-based learning to build clinical reasoning.\nDesigned for medical students and residents.';
  const badge      = isZh ? '互動式學習 · 即時回饋 · 雙語支援' : 'Interactive · Instant Feedback · Bilingual';
  const statsTitle = isZh ? '表現統計' : 'Performance Stats';
  const statsText  = isZh ? '查看耳鼻喉三大類的學習紀錄與平均表現' : 'View records and averages across otology, rhinology, and laryngology';
  const comingSoon = isZh ? '即將上線' : 'Coming Soon';
  const caseCount  = (n) => isZh ? `${n} 個病例` : `${n} case${n > 1 ? 's' : ''}`;

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
      <div
        className="absolute top-1/2 right-10 w-64 h-64 rounded-full opacity-15 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #95B880, transparent 70%)', animationDelay: '4s' }}
      />

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
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-flex max-w-full justify-center whitespace-nowrap text-[11px] sm:text-xs font-semibold tracking-[0.08em] sm:tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-3 sm:px-4 py-1.5 rounded-full">
            {badge}
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-warm-900 font-serif leading-tight">
            {heading}
          </h1>
          <p className="mt-3 text-lg text-warm-500 font-light whitespace-pre-line leading-relaxed">
            {subheading}
          </p>
        </motion.div>

        {/* Topic cards */}
        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <motion.button
            variants={cardItem}
            onClick={onSelectPerformance}
            whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-5 text-left w-full border-2 border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-300"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                <BarChart2 className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <div className="text-base font-bold text-sage-700">{statsTitle}</div>
                <div className="text-xs text-warm-400 mt-0.5">{statsText}</div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sage-100 text-sage-700">
              {isZh ? '查看紀錄' : 'View stats'}
            </span>
          </motion.button>

          {domains.map((topic) => {
            const c = domainColorMap[topic.color];
            const t = topic[lang];
            const hasCase = topic.cases.length > 0;

            return (
              <motion.button
                key={topic.id}
                variants={cardItem}
                onClick={() => onSelectTopic(topic)}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}
                whileTap={{ scale: 0.98 }}
                className={`glass-card p-5 text-left w-full border-2 ${c.border} focus:outline-none focus:ring-2 focus:ring-sage-300`}
              >
                {/* Icon + title */}
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {topic.icon}
                  </div>
                  <div>
                    <div className={`text-base font-bold ${c.text}`}>{t.title}</div>
                    <div className="text-xs text-warm-400 mt-0.5">{t.subtitle}</div>
                  </div>
                </div>

                {/* Tag chips */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-0.5 rounded-full border ${c.tagBorder} ${c.text} ${c.tagBg}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Case count */}
                {hasCase ? (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.countBg}`}>
                    {caseCount(topic.cases.length)}
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-warm-100 text-warm-400">
                    {comingSoon}
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
