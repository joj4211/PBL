import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, BookMarked, RefreshCw, CheckCircle2 } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import { getDomainByCaseId } from '../../config/domains';
import {
  buildCaseAttemptAnswers,
  buildOverallFromSteps,
  mapPhaseAnswersToSteps,
} from '../../logic/attemptPayload';

const stagger = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

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
  const domain = getDomainByCaseId(caseData.id);

  const answersByPhase = useMemo(() => ({
    preTest: getPhaseAnswers('preTest'),
    interactive: getPhaseAnswers('interactive'),
    postTest: getPhaseAnswers('postTest'),
  }), [getPhaseAnswers]);

  const steps = useMemo(() => mapPhaseAnswersToSteps(answersByPhase), [answersByPhase]);
  const overall = useMemo(() => buildOverallFromSteps(steps), [steps]);

  const answersPayload = useMemo(() => buildCaseAttemptAnswers({
    caseId: caseData.id,
    caseTitle: caseData.title,
    domain: domain.id,
    language: lang,
    steps,
  }), [caseData.id, caseData.title, domain.id, lang, steps]);

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
        pre_test_score: null,
        interactive_score: overall.percentage,
        post_test_score: null,
        answers: answersPayload,
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
  }, [answersPayload, attemptSaved, caseData.id, domain.id, lang, markAttemptSaved, overall.percentage, user]);

  return (
    <PhaseTransition>
      <ProgressIndicator currentPhase={currentPhase} />
      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
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
          <motion.div variants={fadeUp} className="glass-card p-6 text-center">
            <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-2">Overall</p>
            <p className="text-5xl font-bold text-sage-600">{overall.percentage}%</p>
            <p className="text-sm text-warm-500 mt-2">{overall.correct} / {overall.total}</p>
          </motion.div>

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
              variant="primary"
              size="md"
            >
              {ui.analytics.backToTopic ?? '返回主題'}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
