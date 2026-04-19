import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';

const topics = [
  {
    id: 'infection',
    zh: { title: '感染類', subtitle: 'Infection', tags: ['AOM', 'COM', 'Cholesteatoma', 'Otomycosis'] },
    en: { title: 'Infection', subtitle: '感染類', tags: ['AOM', 'COM', 'Cholesteatoma', 'Otomycosis'] },
    icon: '🦠',
    color: 'rose',
    cases: [],
  },
  {
    id: 'hearing',
    zh: { title: '聽力損失類', subtitle: 'Hearing Loss', tags: ['Otosclerosis', 'SSNHL', 'NIHL', 'Presbycusis'] },
    en: { title: 'Hearing Loss', subtitle: '聽力損失類', tags: ['Otosclerosis', 'SSNHL', 'NIHL', 'Presbycusis'] },
    icon: '👂',
    color: 'amber',
    cases: [],
  },
  {
    id: 'dizziness',
    zh: { title: '眩暈類', subtitle: 'Dizziness', tags: ['BPPV', "Meniere's", 'Vestibular Neuritis'] },
    en: { title: 'Dizziness', subtitle: '眩暈類', tags: ['BPPV', "Meniere's", 'Vestibular Neuritis'] },
    icon: '🌀',
    color: 'sage',
    cases: [{ id: 'case_01', zh: '前庭神經炎', en: 'Vestibular Neuritis' }],
  },
  {
    id: 'trauma',
    zh: { title: '急症／外傷', subtitle: 'Trauma / Emergency', tags: ['TM Perforation', 'Temporal Bone Fx', 'FB in ear'] },
    en: { title: 'Trauma / Emergency', subtitle: '急症／外傷', tags: ['TM Perforation', 'Temporal Bone Fx', 'FB in ear'] },
    icon: '🚨',
    color: 'orange',
    cases: [],
  },
  {
    id: 'pediatric',
    zh: { title: '小兒／腫瘤', subtitle: 'Pediatric / Tumor', tags: ['OME', 'Congenital Cholesteatoma', 'Acoustic Neuroma'] },
    en: { title: 'Pediatric / Tumor', subtitle: '小兒／腫瘤', tags: ['OME', 'Congenital Cholesteatoma', 'Acoustic Neuroma'] },
    icon: '🏥',
    color: 'purple',
    cases: [],
  },
];

const colorMap = {
  rose:   { border: 'border-rose-200',   iconBg: 'bg-rose-100',   text: 'text-rose-600',   tagBg: 'bg-rose-50',   tagBorder: 'border-rose-200',   countBg: 'bg-rose-100 text-rose-700' },
  amber:  { border: 'border-amber-200',  iconBg: 'bg-amber-100',  text: 'text-amber-600',  tagBg: 'bg-amber-50',  tagBorder: 'border-amber-200',  countBg: 'bg-amber-100 text-amber-700' },
  sage:   { border: 'border-sage-200',   iconBg: 'bg-sage-100',   text: 'text-sage-600',   tagBg: 'bg-sage-50',   tagBorder: 'border-sage-200',   countBg: 'bg-sage-100 text-sage-700' },
  orange: { border: 'border-orange-200', iconBg: 'bg-orange-100', text: 'text-orange-600', tagBg: 'bg-orange-50', tagBorder: 'border-orange-200', countBg: 'bg-orange-100 text-orange-700' },
  purple: { border: 'border-purple-200', iconBg: 'bg-purple-100', text: 'text-purple-600', tagBg: 'bg-purple-50', tagBorder: 'border-purple-200', countBg: 'bg-purple-100 text-purple-700' },
};

const container = {
  animate: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
};
const cardItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function LandingPage({ lang, onSelectTopic }) {
  const { setLang } = useLanguage();
  const isZh = lang === 'zh';

  const heading    = isZh ? '耳鼻喉科 PBL 學習平台' : 'ENT PBL Learning Platform';
  const subheading = isZh
    ? '以真實病例為核心，建立臨床思維。\n專為醫學生與住院醫師設計。'
    : 'Case-based learning to build clinical reasoning.\nDesigned for medical students and residents.';
  const badge      = isZh ? '互動式學習 · 即時回饋 · 雙語支援' : 'Interactive · Instant Feedback · Bilingual';
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
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-4 py-1.5 rounded-full">
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
          {topics.map((topic) => {
            const c = colorMap[topic.color];
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
