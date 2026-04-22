import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, ChevronRight, Eye, CheckCircle2 } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Step Card ─────────────────────────────────────────────────

function StepCard({ step, stepIdx }) {
  const { ui } = useLanguage();
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: stepIdx * 0.15 }}
      className="glass-card p-5 sm:p-6 space-y-3"
    >
      {/* Step label */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-sage-600">{step.stepNumber}</span>
        </div>
        <h3 className="font-semibold text-warm-800">{step.name}</h3>
      </div>

      {/* Description */}
      <p className="text-warm-700 text-sm leading-relaxed pl-10">{step.description}</p>

      {/* Visual note */}
      {step.visual && (
        <div className="pl-10">
          <p className="text-xs italic text-warm-500 bg-warm-50/80 border border-warm-200 rounded-lg px-3 py-2 leading-relaxed">
            <Eye className="inline w-3.5 h-3.5 mr-1 opacity-60" />
            {step.visual}
          </p>
        </div>
      )}

      {/* Interactive question (Step 1 only) */}
      {step.question && (
        <div className="pl-10 space-y-2 pt-1">
          <p className="text-sm font-medium text-warm-700">{step.question}</p>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="text-xs font-semibold text-sage-600 hover:text-sage-700 underline underline-offset-2 transition-colors"
            >
              {ui.physicalExam.revealAnswer}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 bg-sage-50/80 border border-sage-200 rounded-lg px-3 py-2"
            >
              <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-sage-500" />
              <p className="text-sm font-semibold text-sage-700">{step.correctAnswer}</p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Clinical Decision ─────────────────────────────────────────

function ClinicalDecision({ decision }) {
  const { ui } = useLanguage();
  const [selected, setSelected] = useState(null);

  const isCorrect = (choice) => choice === decision.answer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.5 }}
      className="glass-card p-5 sm:p-6 space-y-4"
    >
      <div className="flex items-center gap-2">
        <span className="phase-tag bg-warm-100 text-warm-600">{ui.physicalExam.clinicalDecision}</span>
      </div>
      <p className="font-semibold text-warm-900 text-base">{decision.question}</p>

      <div className="flex gap-3 flex-wrap">
        {['Dangerous', decision.answer].map((choice) => {
          const chosen = selected === choice;
          const correct = isCorrect(choice);
          let cls = 'option-card flex-1 min-w-[120px] text-center';
          if (chosen && correct) cls += ' option-card-correct';
          else if (chosen && !correct) cls += ' option-card-incorrect';
          return (
            <button key={choice} onClick={() => setSelected(choice)} className={cls}>
              <span className="font-medium text-sm">{choice}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card-sage p-4 space-y-1">
              <p className="text-xs font-semibold text-sage-600 uppercase tracking-wider">{ui.physicalExam.answer}</p>
              <p className="text-sm font-bold text-sage-700">{decision.answer}</p>
              <p className="text-sm text-warm-700 leading-relaxed">{decision.reasoning}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function PhysicalExam({ caseData, currentPhase, advancePhase }) {
  const { ui } = useLanguage();
  const { title, videoPlaceholder, steps, clinicalDecision } = caseData.physicalExam;

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
            <Stethoscope className="w-6 h-6 text-sage-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">{title}</h2>
            <p className="text-warm-400 text-sm mt-1">{ui.physicalExam.subtitle}</p>
          </div>
        </motion.div>

        <div className="space-y-5 mb-8">
          {/* Video placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImagePlaceholder
              media={videoPlaceholder}
              type="video"
            />
          </motion.div>

          {/* Steps */}
          {steps.map((step, idx) => (
            <StepCard key={step.stepNumber} step={step} stepIdx={idx} />
          ))}

          {/* Clinical Decision */}
          <ClinicalDecision decision={clinicalDecision} />
        </div>

        {/* Proceed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col items-center gap-3 pb-12"
        >
          <Button onClick={advancePhase} size="lg">
            {ui.physicalExam.proceed}
            <ChevronRight className="inline ml-1.5 w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
