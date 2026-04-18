import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, Send } from 'lucide-react';
import Button from './Button';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Multiple Choice ───────────────────────────────────────────

function MultipleChoiceQuestion({ question, onSubmit, submitted, result }) {
  const { ui } = useLanguage();
  const [selected, setSelected] = useState(result?.selectedId ?? null);

  useEffect(() => {
    setSelected(result?.selectedId ?? null);
  }, [result]);

  const handleSelect = (id) => {
    if (submitted) return;
    setSelected(id);
  };

  const handleSubmit = () => {
    if (!selected || submitted) return;
    onSubmit(selected);
  };

  const getOptionClass = (optId) => {
    if (!submitted) {
      return selected === optId ? 'option-card option-card-selected' : 'option-card';
    }
    if (optId === result?.correctId) return 'option-card option-card-correct';
    if (optId === result?.selectedId && !result?.isCorrect) return 'option-card option-card-incorrect';
    return 'option-card opacity-50';
  };

  return (
    <div className="space-y-3">
      {question.options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => handleSelect(opt.id)}
          className={getOptionClass(opt.id)}
        >
          <div className="flex items-center gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold uppercase opacity-60">
              {opt.id}
            </span>
            <span className="text-warm-800 text-sm leading-snug">{opt.text}</span>
            {submitted && opt.id === result?.correctId && (
              <CheckCircle2 className="ml-auto flex-shrink-0 w-5 h-5 text-sage-500" />
            )}
            {submitted && opt.id === result?.selectedId && !result?.isCorrect && (
              <XCircle className="ml-auto flex-shrink-0 w-5 h-5 text-red-400" />
            )}
          </div>
        </button>
      ))}

      {!submitted && (
        <div className="pt-2 flex justify-end">
          <Button onClick={handleSubmit} disabled={!selected}>
            {ui.common.confirm}
          </Button>
        </div>
      )}

      {/* Explanation */}
      <AnimatePresence>
        {submitted && result?.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="glass-card-sage p-4 mt-2">
              <div className="flex items-start gap-2">
                <Lightbulb className="flex-shrink-0 w-4 h-4 text-sage-500 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-sage-600 mb-1">{ui.questionCard.explanationLabel}</p>
                  <p className="text-sm text-warm-700 leading-relaxed">{result.explanation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Text Input ────────────────────────────────────────────────

function TextInputQuestion({ question, onSubmit, submitted, result }) {
  const { ui } = useLanguage();
  const [text, setText] = useState(result?.inputText ?? '');

  useEffect(() => {
    setText(result?.inputText ?? '');
  }, [result]);

  const handleSubmit = () => {
    if (!text.trim() || submitted) return;
    onSubmit(text.trim());
  };

  const feedbackColors = {
    excellent: 'border-sage-400 bg-sage-50/60',
    good: 'border-warm-400 bg-warm-50/60',
    hint: 'border-warm-300 bg-warm-50/40',
  };

  const feedbackIcons = {
    excellent: <CheckCircle2 className="w-5 h-5 text-sage-500" />,
    good: <CheckCircle2 className="w-5 h-5 text-warm-500" />,
    hint: <Lightbulb className="w-5 h-5 text-warm-400" />,
  };

  const feedbackLabels = {
    excellent: ui.questionCard.feedbackExcellent,
    good: ui.questionCard.feedbackGood,
    hint: ui.questionCard.feedbackHint,
  };

  return (
    <div className="space-y-3">
      {question.hint && !submitted && (
        <p className="text-xs text-warm-500 italic flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 flex-shrink-0" />
          {question.hint}
        </p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={submitted}
        placeholder={question.placeholder ?? ui.questionCard.placeholder}
        rows={4}
        className="w-full px-4 py-3 rounded-xl border-2 border-warm-200 bg-white/50
          text-warm-800 text-sm leading-relaxed placeholder:text-warm-300
          focus:outline-none focus:border-sage-300 focus:bg-white/70
          transition-colors duration-200 resize-none
          disabled:opacity-60 disabled:cursor-not-allowed"
      />

      {!submitted && (
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={!text.trim()}>
            <Send className="w-4 h-4 mr-1.5 inline" />
            {ui.questionCard.submitButton}
          </Button>
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {submitted && result?.feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden"
          >
            <div
              className={`rounded-xl border-2 p-4 ${feedbackColors[result.feedbackLevel]}`}
            >
              <div className="flex items-start gap-2">
                {feedbackIcons[result.feedbackLevel]}
                <div>
                  <p className="text-xs font-semibold text-warm-700 mb-1">
                    {feedbackLabels[result.feedbackLevel]}
                  </p>
                  <p className="text-sm text-warm-700 leading-relaxed">{result.feedback}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── QuestionCard (outer shell) ────────────────────────────────

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  result = null,
}) {
  const { ui } = useLanguage();
  const [submitted, setSubmitted] = useState(Boolean(result));

  useEffect(() => {
    setSubmitted(Boolean(result));
  }, [result]);

  const handleSubmit = (value) => {
    const res = onSubmit(value);
    setSubmitted(true);
    return res;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="glass-card p-6 sm:p-8 space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="phase-tag bg-sage-100 text-sage-600">
          {ui.questionCard.questionLabel} {questionNumber} / {totalQuestions}
        </span>
        {submitted && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              result?.isCorrect
                ? 'bg-sage-100 text-sage-600'
                : result?.feedbackLevel === 'good'
                ? 'bg-warm-100 text-warm-600'
                : 'bg-warm-100 text-warm-500'
            }`}
          >
            {result?.isCorrect
              ? ui.questionCard.correct
              : result?.feedbackLevel === 'good'
              ? ui.questionCard.close
              : ui.questionCard.review}
          </motion.span>
        )}
      </div>

      {/* Question text */}
      <p className="text-warm-900 font-medium leading-relaxed text-base sm:text-lg">
        {question.text}
      </p>

      {/* Question body */}
      {question.type === 'multiple-choice' ? (
        <MultipleChoiceQuestion
          question={question}
          onSubmit={handleSubmit}
          submitted={submitted}
          result={result}
        />
      ) : (
        <TextInputQuestion
          question={question}
          onSubmit={handleSubmit}
          submitted={submitted}
          result={result}
        />
      )}
    </motion.div>
  );
}
