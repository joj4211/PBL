import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, ChevronRight, CheckCircle } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import QuestionCard from '../ui/QuestionCard';
import Button from '../ui/Button';
import { calculatePhaseScore } from '../../logic/scoring';

export default function PreTest({ caseData, currentPhase, submitAnswer, getPhaseAnswers, advancePhase }) {
  const questions = caseData.preTest.questions;
  const [qIndex, setQIndex] = useState(0);
  const [phaseAnswers, setPhaseAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[qIndex];
  const isLastQuestion = qIndex === questions.length - 1;

  const handleSubmit = (value) => {
    const result = submitAnswer('preTest', currentQuestion, value);
    setPhaseAnswers((prev) => ({ ...prev, [currentQuestion.id]: result }));
    return result;
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSummary(true);
    } else {
      setQIndex((i) => i + 1);
    }
  };

  const score = calculatePhaseScore(phaseAnswers, questions);
  const allAnswered = Object.keys(phaseAnswers).length === questions.length;

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
            <h2 className="text-2xl font-bold text-warm-900 font-serif">前測評估</h2>
            <p className="text-warm-500 text-sm mt-1 leading-relaxed whitespace-pre-line">
              {caseData.preTest.instructions}
            </p>
          </div>
        </motion.div>

        {/* Question or Summary */}
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key={`q-${qIndex}`}
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
                result={phaseAnswers[currentQuestion?.id]}
              />

              {phaseAnswers[currentQuestion?.id] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-end"
                >
                  <Button onClick={handleNext} variant="primary">
                    {isLastQuestion ? '查看結果' : '下一題'}
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
                <h3 className="text-2xl font-bold text-warm-900 font-serif">前測完成</h3>
                <p className="text-warm-500 text-sm mt-1">以下是您的初始評估結果</p>
              </div>

              <div className="flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-warm-700">{score.correct}</div>
                  <div className="text-xs text-warm-400 mt-1">答對題數</div>
                </div>
                <div className="w-px bg-warm-200" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-sage-600">{score.percentage}%</div>
                  <div className="text-xs text-warm-400 mt-1">正確率</div>
                </div>
                <div className="w-px bg-warm-200" />
                <div className="text-center">
                  <div className="text-4xl font-bold text-warm-400">{score.total}</div>
                  <div className="text-xs text-warm-400 mt-1">總題數</div>
                </div>
              </div>

              <p className="text-warm-500 text-sm italic">
                不必在意分數——前測只是幫助我們了解您的起點。<br />
                讓我們繼續進入臨床案例。
              </p>

              <Button onClick={advancePhase} size="lg">
                進入臨床案例
                <ChevronRight className="inline ml-1.5 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhaseTransition>
  );
}
