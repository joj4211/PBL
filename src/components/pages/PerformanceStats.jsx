import { motion } from 'framer-motion';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { useLanguage } from '../../contexts/LanguageContext';

const mockDomains = [
  {
    id: 'infection',
    zh: '感染類', en: 'Infection',
    icon: '🦠',
    completed: 3, total: 8,
    accuracy: 78,
    lastStudied: '2026-04-17',
    color: 'rose',
    radarLabel: '感染類',
  },
  {
    id: 'hearing',
    zh: '聽力損失類', en: 'Hearing Loss',
    icon: '👂',
    completed: 2, total: 6,
    accuracy: 65,
    lastStudied: '2026-04-15',
    color: 'amber',
    radarLabel: '聽力損失',
  },
  {
    id: 'dizziness',
    zh: '眩暈類', en: 'Dizziness',
    icon: '🌀',
    completed: 5, total: 5,
    accuracy: 88,
    lastStudied: '2026-04-19',
    color: 'sage',
    radarLabel: '眩暈類',
  },
  {
    id: 'trauma',
    zh: '急症／外傷', en: 'Trauma / Emergency',
    icon: '🚨',
    completed: 1, total: 7,
    accuracy: 70,
    lastStudied: '2026-04-10',
    color: 'orange',
    radarLabel: '急症外傷',
  },
  {
    id: 'pediatric',
    zh: '小兒／腫瘤', en: 'Pediatric / Tumor',
    icon: '🏥',
    completed: 0, total: 6,
    accuracy: 0,
    lastStudied: null,
    color: 'purple',
    radarLabel: '小兒腫瘤',
  },
];

const colorMap = {
  rose:   { border: 'border-rose-200',   iconBg: 'bg-rose-100',   text: 'text-rose-600',   bar: 'bg-rose-400',   barBg: 'bg-rose-100',   badge: 'bg-rose-100 text-rose-700',   radar: '#FB7185' },
  amber:  { border: 'border-amber-200',  iconBg: 'bg-amber-100',  text: 'text-amber-600',  bar: 'bg-amber-400',  barBg: 'bg-amber-100',  badge: 'bg-amber-100 text-amber-700',  radar: '#FBBF24' },
  sage:   { border: 'border-sage-200',   iconBg: 'bg-sage-100',   text: 'text-sage-600',   bar: 'bg-sage-500',   barBg: 'bg-sage-100',   badge: 'bg-sage-100 text-sage-700',   radar: '#86EFAC' },
  orange: { border: 'border-orange-200', iconBg: 'bg-orange-100', text: 'text-orange-600', bar: 'bg-orange-400', barBg: 'bg-orange-100', badge: 'bg-orange-100 text-orange-700', radar: '#FB923C' },
  purple: { border: 'border-purple-200', iconBg: 'bg-purple-100', text: 'text-purple-600', bar: 'bg-purple-400', barBg: 'bg-purple-100', badge: 'bg-purple-100 text-purple-700', radar: '#C084FC' },
};

const cardItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const container = {
  animate: { transition: { delayChildren: 0.15, staggerChildren: 0.08 } },
};

const totalCompleted = mockDomains.reduce((s, d) => s + d.completed, 0);
const activeDomains  = mockDomains.filter((d) => d.accuracy > 0);
const avgAccuracy    = activeDomains.length
  ? Math.round(activeDomains.reduce((s, d) => s + d.accuracy, 0) / activeDomains.length)
  : 0;
const studyDays = 12;

const radarData = mockDomains.map((d) => ({
  domain: d.radarLabel,
  score: d.accuracy,
  fullMark: 100,
}));

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs text-warm-700 shadow-lg">
        <span className="font-semibold">{payload[0].payload.domain}</span>: {payload[0].value}%
      </div>
    );
  }
  return null;
}

export default function PerformanceStats({ lang, onBack }) {
  const { setLang } = useLanguage();
  const isZh = lang === 'zh';

  const formatDate = (dateStr) => {
    if (!dateStr) return isZh ? '尚未學習' : 'Not started';
    const d = new Date(dateStr);
    return isZh
      ? `${d.getMonth() + 1}/${d.getDate()} 學習`
      : `Studied ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

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
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-16">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-2">📊</div>
          <h1 className="text-3xl font-bold text-warm-900 font-serif">
            {isZh ? '學習表現統計' : 'Learning Performance'}
          </h1>
          <p className="text-warm-400 text-sm mt-1">
            {isZh ? '五大 ENT 領域完整學習概覽' : 'Overview across 5 ENT domains'}
          </p>
        </motion.div>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl glass-card p-5 mb-6 grid grid-cols-3 divide-x divide-warm-200"
        >
          <div className="text-center px-3">
            <div className="text-2xl font-bold text-warm-900">{totalCompleted}</div>
            <div className="text-xs text-warm-400 mt-0.5">
              {isZh ? '已完成病例' : 'Cases Done'}
            </div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-bold text-sage-600">{avgAccuracy}%</div>
            <div className="text-xs text-warm-400 mt-0.5">
              {isZh ? '平均正確率' : 'Avg Accuracy'}
            </div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-bold text-warm-900">{studyDays}</div>
            <div className="text-xs text-warm-400 mt-0.5">
              {isZh ? '學習天數' : 'Study Days'}
            </div>
          </div>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl glass-card p-6 mb-6"
        >
          <div className="text-sm font-semibold text-warm-700 mb-4 text-center">
            {isZh ? '五領域綜合表現' : '5-Domain Performance Overview'}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#E5E0D8" />
              <PolarAngleAxis
                dataKey="domain"
                tick={{ fill: '#8C7B6B', fontSize: 12, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#B8A898', fontSize: 10 }}
                tickCount={5}
              />
              <Radar
                name={isZh ? '正確率' : 'Accuracy'}
                dataKey="score"
                stroke="#7BAF6E"
                fill="#7BAF6E"
                fillOpacity={0.25}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Domain cards */}
        <motion.div
          variants={container}
          initial="initial"
          animate="animate"
          className="w-full max-w-2xl flex flex-col gap-3"
        >
          {mockDomains.map((domain) => {
            const c = colorMap[domain.color];
            return (
              <motion.div
                key={domain.id}
                variants={cardItem}
                className={`glass-card p-5 border-l-4 ${c.border}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center text-xl flex-shrink-0`}>
                    {domain.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${c.text}`}>
                      {isZh ? domain.zh : domain.en}
                    </div>
                    <div className="text-xs text-warm-400">
                      {isZh ? domain.en : domain.zh}
                    </div>
                  </div>
                  <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {formatDate(domain.lastStudied)}
                  </div>
                </div>

                {/* Case count + progress */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-warm-500">
                    {isZh
                      ? `已完成 ${domain.completed} / ${domain.total} 個病例`
                      : `${domain.completed} / ${domain.total} cases`}
                  </span>
                  <span className={`text-sm font-bold ${c.text}`}>
                    {domain.accuracy}%
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${c.barBg} overflow-hidden`}>
                  <motion.div
                    className={`h-full rounded-full ${c.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${domain.accuracy}%` }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="h-12" />
      </div>
    </div>
  );
}
