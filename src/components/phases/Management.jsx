import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { stripOptionPrefix } from '../../utils/text';

function DecisionStage({ stage, stageIdx, onComplete }) {
  const { ui } = useLanguage();
  const [selected, setSelected] = useState(null);

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    setTimeout(() => onComplete(), 1200);
  };

  const getOptionStyle = (opt) => {
    if (!selected) return 'option-card';
    if (opt.id === selected.id) {
      return opt.correct
        ? 'option-card option-card-correct'
        : 'option-card option-card-incorrect';
    }
    return 'option-card opacity-40';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: stageIdx * 0.1 }}
      className="glass-card p-5 sm:p-6 space-y-4"
    >
      {/* Stage label */}
      <div className="flex items-center gap-2">
        <span className="phase-tag bg-warm-100 text-warm-600">{ui.management.stageLabel} {stageIdx + 1}</span>
        <span className="font-semibold text-warm-800">{stage.stage}</span>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {stage.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => handleSelect(opt)}
            className={getOptionStyle(opt)}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold opacity-60 mt-0.5">
                {opt.id}
              </span>
              <span className="text-warm-800 text-sm leading-snug flex-1">{stripOptionPrefix(opt.text)}</span>
              {selected?.id === opt.id && opt.correct && (
                <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-sage-500" />
              )}
              {selected?.id === opt.id && !opt.correct && (
                <XCircle className="flex-shrink-0 w-5 h-5 text-red-400" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`rounded-xl border-2 px-4 py-3 text-sm leading-relaxed font-medium ${
                selected.correct
                  ? 'bg-sage-50/80 border-sage-300 text-sage-700'
                  : 'bg-red-50/60 border-red-200 text-red-700'
              }`}
            >
              {selected.feedback}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Management({ caseData, currentPhase, advancePhase }) {
  const { ui } = useLanguage();
  const { title, clinicalDecisionTree } = caseData.management;
  const [completedStages, setCompletedStages] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  const handleStageComplete = () => {
    const next = activeStage + 1;
    setCompletedStages(next);
    if (next < clinicalDecisionTree.length) {
      setActiveStage(next);
    }
  };

  const allDone = completedStages >= clinicalDecisionTree.length;

  return (
    <PhaseTransition>
      <ProgressIndicator currentPhase={currentPhase} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center flex-shrink-0">
            <Pill className="w-6 h-6 text-sage-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">{title}</h2>
            <p className="text-warm-400 text-sm mt-1">{ui.management.subtitle}</p>
          </div>
        </motion.div>

        {/* Decision stages — reveal sequentially */}
        <div className="space-y-5 mb-8">
          {clinicalDecisionTree.map((stage, idx) => (
            <AnimatePresence key={idx}>
              {idx <= activeStage && (
                <DecisionStage
                  stage={stage}
                  stageIdx={idx}
                  onComplete={handleStageComplete}
                />
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Proceed — only after all stages answered */}
        <AnimatePresence>
          {allDone && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 pb-12"
            >
              <Button onClick={advancePhase} size="lg">
                {ui.management.proceed}
                <ChevronRight className="inline ml-1.5 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhaseTransition>
  );
}
