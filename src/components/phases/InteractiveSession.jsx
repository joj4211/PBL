import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronRight, CheckCircle } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import QuestionCard from '../ui/QuestionCard';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function InteractiveSession({
  caseData,
  currentPhase,
  submitAnswer,
  getPhaseAnswers,
  advancePhase,
}) {
  const { ui } = useLanguage();
  const questions = caseData.interactive.questions;
  const savedResults = getPhaseAnswers('interactive');
  const [qIndex, setQIndex] = useState(0);
  const [results, setResults] = useState(savedResults);
  const [showSummary, setShowSummary] = useState(
    () => Object.keys(savedResults).length === questions.length
  );

  const currentQuestion = questions[qIndex];
  const isLastQuestion = qIndex === questions.length - 1;

  const handleSubmit = (value) => {
    const result = submitAnswer('interactive', currentQuestion, value);
    setResults((prev) => ({ ...prev, [currentQuestion.id]: result }));
    return result;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSummary(true);
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((r) => r.isCorrect).length;

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
            <MessageSquare className="w-6 h-6 text-warm-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">{ui.interactive.title}</h2>
            <p className="text-warm-500 text-sm mt-1 leading-relaxed whitespace-pre-line">
              {caseData.interactive.instructions}
            </p>
          </div>
        </motion.div>

        {/* Session progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-warm-400 mb-1.5">
            <span>{ui.interactive.progressLabel}</span>
            <span>{answeredCount} / {questions.length}</span>
          </div>
          <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Question or Summary */}
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key={`iq-${qIndex}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
            >
              <QuestionCard
                question={currentQuestion}
                questionNumber={qIndex + 1}
                totalQuestions={questions.length}
                onSubmit={handleSubmit}
                result={results[currentQuestion?.id]}
              />

              {results[currentQuestion?.id] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 flex justify-end"
                >
                  <Button onClick={handleNext} variant="primary">
                    {isLastQuestion ? ui.interactive.viewSummary : ui.common.next}
                    <ChevronRight className="inline ml-1 w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="int-summary"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-8 text-center space-y-6"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-sage-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-warm-900 font-serif">{ui.interactive.complete}</h3>
                <p className="text-warm-400 text-sm mt-1">{ui.interactive.completeSubtitle}</p>
              </div>

              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-sage-600">{correctCount}</div>
                  <div className="text-xs text-warm-400 mt-1">{ui.interactive.correctLabel}</div>
                </div>
                <div className="w-px bg-warm-200" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-warm-600">{questions.length}</div>
                  <div className="text-xs text-warm-400 mt-1">{ui.interactive.totalLabel}</div>
                </div>
              </div>

              <p className="text-warm-500 text-sm italic leading-relaxed max-w-md mx-auto whitespace-pre-line">
                {ui.interactive.feedbackNote}
              </p>

              <Button onClick={advancePhase} size="lg">
                {ui.interactive.proceed}
                <ChevronRight className="inline ml-1.5 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhaseTransition>
  );
}
