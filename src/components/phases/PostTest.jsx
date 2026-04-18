import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, ChevronRight, TrendingUp } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import QuestionCard from '../ui/QuestionCard';
import Button from '../ui/Button';
import { calculatePhaseScore } from '../../logic/scoring';
import { useLanguage } from '../../contexts/LanguageContext';

export default function PostTest({
  caseData,
  currentPhase,
  submitAnswer,
  getPhaseAnswers,
  advancePhase,
}) {
  const { ui } = useLanguage();
  const questions = caseData.postTest.questions;
  const [qIndex, setQIndex] = useState(0);
  const [phaseAnswers, setPhaseAnswers] = useState({});
  const [showSummary, setShowSummary] = useState(false);

  const currentQuestion = questions[qIndex];
  const isLastQuestion = qIndex === questions.length - 1;

  const handleSubmit = (value) => {
    const result = submitAnswer('postTest', currentQuestion, value);
    setPhaseAnswers((prev) => ({ ...prev, [currentQuestion.id]: result }));
    return result;
  };

  const handleNext = () => {
    if (isLastQuestion) setShowSummary(true);
    else setQIndex((i) => i + 1);
  };

  const score = calculatePhaseScore(phaseAnswers, questions);
  const preAnswers = getPhaseAnswers('preTest');
  const preScore = calculatePhaseScore(preAnswers, caseData.preTest.questions);
  const delta = score.percentage - preScore.percentage;

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
            <CheckSquare className="w-6 h-6 text-sage-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">{ui.postTest.title}</h2>
            <p className="text-warm-500 text-sm mt-1 leading-relaxed whitespace-pre-line">
              {caseData.postTest.instructions}
            </p>
          </div>
        </motion.div>

        {/* Question or Summary */}
        <AnimatePresence mode="wait">
          {!showSummary ? (
            <motion.div
              key={`pq-${qIndex}`}
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
                  <Button onClick={handleNext}>
                    {isLastQuestion ? ui.postTest.viewResult : ui.common.next}
                    <ChevronRight className="inline ml-1 w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="post-summary"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Score card */}
              <div className="glass-card p-8 text-center space-y-5">
                <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-sage-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-warm-900 font-serif">{ui.postTest.complete}</h3>
                  <p className="text-warm-400 text-sm mt-1">{ui.postTest.congratulations}</p>
                </div>

                {/* Score comparison */}
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-xs font-semibold text-warm-400 mb-2">{ui.postTest.preLabel}</div>
                    <div className="text-4xl font-bold text-warm-500">{preScore.percentage}%</div>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ChevronRight className="w-5 h-5 text-warm-300" />
                    <span
                      className={`text-sm font-bold ${
                        delta > 0 ? 'text-sage-500' : delta < 0 ? 'text-orange-400' : 'text-warm-400'
                      }`}
                    >
                      {delta > 0 ? `+${delta}%` : `${delta}%`}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-semibold text-sage-500 mb-2">{ui.postTest.postLabel}</div>
                    <div className="text-4xl font-bold text-sage-600">{score.percentage}%</div>
                  </div>
                </div>

                <Button onClick={advancePhase} size="lg">
                  {ui.postTest.proceed}
                  <ChevronRight className="inline ml-1.5 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhaseTransition>
  );
}
