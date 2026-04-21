import { useEffect, useRef, useState } from 'react';
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
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import { getDomainByCaseId } from '../../config/domains';

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
  restart,
  user,
  attemptSaved,
  markAttemptSaved,
  onExit,
}) {
  const { ui, lang } = useLanguage();
  const [saveStatus, setSaveStatus] = useState('');
  const saveStartedRef = useRef(false);
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
  const insightMessage = ui.analytics.insights[insight.level].replace(
    '{delta}',
    Math.abs(insight.delta)
  );
  const domain = getDomainByCaseId(caseData.id);

  const chartData = [
    { name: ui.analytics.preLabel,         score: preScore.percentage,         color: '#CEB07A', scoreObj: preScore },
    { name: ui.analytics.interactiveLabel, score: interactiveScore.percentage, color: '#95B880', scoreObj: interactiveScore },
    { name: ui.analytics.postLabel,        score: postScore.percentage,        color: '#5E8847', scoreObj: postScore },
  ];

  const insightStyles = {
    excellent: 'bg-sage-50 border-sage-300 text-sage-700',
    good: 'bg-sage-50 border-sage-200 text-sage-600',
    steady: 'bg-warm-50 border-warm-300 text-warm-700',
    reflect: 'bg-warm-50 border-warm-200 text-warm-600',
  };

  useEffect(() => {
    if (!user || attemptSaved || saveStartedRef.current) return;

    let cancelled = false;
    saveStartedRef.current = true;

    async function saveAttempt() {
      setSaveStatus('正在儲存本次學習紀錄...');
      const { error } = await supabase.from('case_attempts').insert({
        user_id: user.id,
        case_id: caseData.id,
        domain: domain.id,
        language: lang,
        pre_test_score: preScore.percentage,
        interactive_score: interactiveScore.percentage,
        post_test_score: postScore.percentage,
        answers: {
          preTest: preAnswers,
          interactive: interactiveAnswers,
          postTest: postAnswers,
        },
      });

      if (cancelled) return;

      if (error) {
        saveStartedRef.current = false;
        setSaveStatus(`學習紀錄儲存失敗：${error.message}`);
        return;
      }

      markAttemptSaved();
      setSaveStatus('本次學習紀錄已儲存。');
    }

    saveAttempt();

    return () => {
      cancelled = true;
    };
  }, [
    attemptSaved,
    caseData.id,
    domain.id,
    interactiveScore.percentage,
    lang,
    markAttemptSaved,
    postScore.percentage,
    preScore.percentage,
    user,
  ]);

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
            <h2 className="text-2xl font-bold text-warm-900 font-serif">{ui.analytics.title}</h2>
            <p className="text-warm-400 text-sm mt-1">{ui.analytics.subtitle}</p>
          </div>
        </motion.div>

        <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-5">
          {/* Score overview cards */}
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
            {chartData.map(({ name, score, color, scoreObj }) => (
              <div key={name} className="glass-card p-4 text-center">
                <div className="text-xs font-semibold text-warm-400 mb-2">{name}</div>
                <div
                  className="text-3xl font-bold"
                  style={{ color }}
                >
                  {score}%
                </div>
                <div className="text-xs text-warm-300 mt-1">
                  {scoreObj.correct}/{scoreObj.total}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Bar chart */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h3 className="text-sm font-semibold text-warm-600 mb-5 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-sage-400" />
              {ui.analytics.chartTitle}
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
                {ui.analytics.insightTitle}
              </p>
              <p className="text-sm leading-relaxed">{insightMessage}</p>
            </div>
          </motion.div>

          {/* Learning points */}
          {caseData.learningPoints?.length > 0 && (
            <motion.div variants={fadeUp} className="glass-card p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="w-4 h-4 text-sage-500" />
                <h3 className="text-sm font-semibold text-warm-700 uppercase tracking-wider">
                  {ui.analytics.learningPointsTitle}
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

          {saveStatus && (
            <motion.div variants={fadeUp} className="glass-card-sage px-4 py-3">
              <p className="text-sm font-medium text-sage-700">{saveStatus}</p>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 pt-4">
            <Button
              onClick={restart}
              variant="secondary"
              size="md"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              {ui.analytics.restart}
            </Button>
            <Button
              onClick={onExit}
              variant="secondary"
              size="md"
            >
              {lang === 'zh' ? '退出' : 'Exit'}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
