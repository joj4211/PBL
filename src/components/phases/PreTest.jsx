import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ChevronRight, CheckCircle } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import Button from '../ui/Button';

// ── Single MC Question ────────────────────────────────────────

function MCQuestion({ question, onDone }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  const handleSelect = (id) => {
    if (result) return;
    setSelected(id);
  };

  const handleConfirm = () => {
    if (!selected || result) return;
    const r = onDone(selected);
    setResult(r);
  };

  const optionClass = (optId) => {
    if (!result) return selected === optId ? 'option-card option-card-selected' : 'option-card';
    if (optId === result.correctId) return 'option-card option-card-correct';
    if (optId === result.selectedId && !result.isCorrect) return 'option-card option-card-incorrect';
    return 'option-card opacity-40';
  };

  return (
    <div className="space-y-3">
      {question.options.map((opt) => (
        <button key={opt.id} onClick={() => handleSelect(opt.id)} className={optionClass(opt.id)}>
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold opacity-60">
              {opt.id}
            </span>
            <span className="text-warm-800 text-sm leading-snug flex-1 text-left">{opt.text}</span>
          </div>
        </button>
      ))}

      {!result && (
        <div className="pt-2 flex justify-end">
          <Button onClick={handleConfirm} disabled={!selected}>
            確認答案
          </Button>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <div className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${
              result.isCorrect
                ? 'bg-sage-50 border-sage-300 text-sage-700'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {result.isCorrect ? '✓ Correct' : `✗ Incorrect — correct answer: ${result.correctId}`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── PreTest Phase ─────────────────────────────────────────────

export default function PreTest({ caseData, currentPhase, advancePhase, submitAnswer }) {
  const questions = caseData.preTest.questions;
  const [qIndex, setQIndex] = useState(0);
  const [doneAnswers, setDoneAnswers] = useState([]);
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[qIndex];
  const isLastQuestion = qIndex === questions.length - 1;
  const currentAnswered = doneAnswers[qIndex] != null;

  const handleDone = (selectedId) => {
    const result = submitAnswer('preTest', questions[qIndex], selectedId);
    setDoneAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = result;
      return next;
    });
    return result;
  };

  const handleNext = () => {
    if (isLastQuestion) setShowSummary(true);
    else setQIndex((i) => i + 1);
  };

  const correct = doneAnswers.filter((a) => a?.isCorrect).length;
  const total = questions.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

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
          <div className="w-12 h-12 rounded-2xl bg-warm-100 flex items-center justify-center flex-shrink-0">
            <ClipboardList className="w-6 h-6 text-warm-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">Pre-Test Assessment</h2>
            <p className="text-warm-500 text-sm mt-1 leading-relaxed">
              {caseData.preTest.instructions}
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key={`q-${qIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
              className="glass-card p-6 sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="phase-tag bg-sage-100 text-sage-600">
                  Question {qIndex + 1} / {total}
                </span>
              </div>

              <p className="text-warm-900 font-medium leading-relaxed text-base sm:text-lg">
                {currentQuestion.text}
              </p>

              <MCQuestion
                key={currentQuestion.id}
                question={currentQuestion}
                onDone={handleDone}
              />

              {currentAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end pt-2"
                >
                  <Button onClick={handleNext}>
                    {isLastQuestion ? 'View Result' : 'Next'}
                    <ChevronRight className="inline ml-1 w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-sage-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-warm-900 font-serif">Pre-Test Complete</h3>
                <p className="text-warm-500 text-sm mt-1">Here is your baseline result</p>
              </div>

              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-warm-700">{correct}</div>
                  <div className="text-xs text-warm-400 mt-1">Correct</div>
                </div>
                <div className="w-px bg-warm-200" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-sage-600">{pct}%</div>
                  <div className="text-xs text-warm-400 mt-1">Score</div>
                </div>
                <div className="w-px bg-warm-200" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-warm-400">{total}</div>
                  <div className="text-xs text-warm-400 mt-1">Total</div>
                </div>
              </div>

              <p className="text-warm-500 text-sm italic">
                Don't worry about the score — this is just your starting point.
              </p>

              <Button onClick={advancePhase} size="lg">
                Enter Clinical Case
                <ChevronRight className="inline ml-1.5 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhaseTransition>
  );
}
