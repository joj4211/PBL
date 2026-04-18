import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart2, BookMarked, RefreshCw, CheckCircle2 } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import Button from '../ui/Button';
import { calculatePhaseScore, getPerformanceInsight } from '../../logic/scoring';

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-4 py-2.5 text-sm shadow-lg">
      <p className="font-semibold text-warm-700">{label}</p>
      <p className="text-sage-600 font-bold mt-0.5">{payload[0].value}%</p>
    </div>
  );
}

export default function Analytics({
  caseData,
  currentPhase,
  getPhaseAnswers,
  setCurrentPhase,
}) {
  const preAnswers = getPhaseAnswers('preTest');
  const postAnswers = getPhaseAnswers('postTest');
  const interactiveAnswers = getPhaseAnswers('interactive');

  const preScore = calculatePhaseScore(preAnswers, caseData.preTest.questions);
  const postScore = calculatePhaseScore(postAnswers, caseData.postTest.questions);
  const interactiveScore = calculatePhaseScore(
    interactiveAnswers,
    caseData.interactive.questions
  );

  const insight = getPerformanceInsight(preScore.percentage, postScore.percentage);

  const chartData = [
    { name: '前測', score: preScore.percentage, color: '#CEB07A' },
    { name: '互動問答', score: interactiveScore.percentage, color: '#95B880' },
    { name: '後測', score: postScore.percentage, color: '#5E8847' },
  ];

  const insightStyles = {
    excellent: 'bg-sage-50 border-sage-300 text-sage-700',
    good: 'bg-sage-50 border-sage-200 text-sage-600',
    steady: 'bg-warm-50 border-warm-300 text-warm-700',
    reflect: 'bg-warm-50 border-warm-200 text-warm-600',
  };

  return (
    <PhaseTransition>
      <ProgressIndicator currentPhase={currentPhase} />
      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center flex-shrink-0">
            <BarChart2 className="w-6 h-6 text-sage-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">學習成效報告</h2>
            <p className="text-warm-400 text-sm mt-1">以下是您完成本案例後的整體表現分析</p>
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5">
          {/* Score overview cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            {chartData.map(({ name, score, color }) => (
              <div key={name} className="glass-card p-4 text-center">
                <div className="text-xs font-semibold text-warm-400 mb-2">{name}</div>
                <div
                  className="text-3xl font-bold"
                  style={{ color }}
                >
                  {score}%
                </div>
                <div className="text-xs text-warm-300 mt-1">
                  {name === '前測'
                    ? `${preScore.correct}/${preScore.total}`
                    : name === '互動問答'
                    ? `${interactiveScore.correct}/${interactiveScore.total}`
                    : `${postScore.correct}/${postScore.total}`}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bar chart */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-warm-600 mb-5 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sage-400" />
              各階段得分對比
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} barSize={40} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE0C4" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#9A7A4A', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: '#CEB07A', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200,185,160,0.1)' }} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Insight card */}
          <motion.div variants={fadeUp}>
            <div className={`rounded-2xl border-2 p-5 ${insightStyles[insight.level]}`}>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2 opacity-70">
                學習洞察
              </p>
              <p className="text-sm leading-relaxed">{insight.message}</p>
            </div>
          </motion.div>

          {/* Learning points */}
          {caseData.learningPoints?.length > 0 && (
            <motion.div variants={fadeUp} className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="w-4 h-4 text-sage-500" />
                <h3 className="text-sm font-semibold text-warm-700 uppercase tracking-wider">
                  本案例核心學習點
                </h3>
              </div>
              <ul className="space-y-2.5">
                {caseData.learningPoints.map((point, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-sage-400 mt-0.5" />
                    <span className="text-sm text-warm-700 leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Restart */}
          <motion.div variants={fadeUp} className="flex justify-center pt-4">
            <Button
              onClick={() => setCurrentPhase('intro')}
              variant="secondary"
              size="md"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              重新開始案例
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
