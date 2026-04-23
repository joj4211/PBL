import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import { buildCaseAttemptAnswers, buildOverallFromSteps } from '../../logic/attemptPayload';

function mapQuestionToStep(question, selectedId) {
  const correctOption = question.options.find((option) => option.correct);

  return {
    questionId: question.id,
    type: question.type,
    selectedId,
    selectedIds: null,
    inputText: null,
    matchedKeywords: null,
    correctId: correctOption?.id ?? null,
    correctIds: null,
    isCorrect: correctOption?.id === selectedId,
    explanation: question.explanation,
    feedback: null,
    feedbackLevel: null,
  };
}

export default function DomainAssessmentPage({
  domain,
  kind,
  assessment,
  user,
  lang,
  onBack,
  onSaved,
  onSignOut,
}) {
  const { setLang } = useLanguage();
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [savedScore, setSavedScore] = useState(null);
  const [error, setError] = useState('');

  const isZh = lang === 'zh';
  const text = {
    back: isZh ? '返回主題' : 'Back to topic',
    signOut: isZh ? '登出' : 'Sign out',
    submit: isZh ? '提交測驗' : 'Submit assessment',
    submitting: isZh ? '提交中...' : 'Submitting...',
    selectPrompt: isZh ? '請先完成所有題目。' : 'Please answer all questions first.',
    doneTitle: isZh ? '測驗完成' : 'Assessment complete',
    doneNote: isZh ? '分數已成功儲存，已為你解鎖下一步。' : 'Score saved successfully. The next step is now unlocked.',
    score: isZh ? '本次正確率' : 'Attempt score',
  };

  const titleBlock = assessment[lang] ?? assessment.zh;
  const total = assessment.questions.length;
  const answered = Object.keys(responses).length;

  const steps = useMemo(() => assessment.questions
    .map((question) => {
      const selectedId = responses[question.id];
      if (!selectedId) return null;
      return mapQuestionToStep(question, selectedId);
    })
    .filter(Boolean), [assessment.questions, responses]);

  const overall = buildOverallFromSteps(steps);

  const handleSubmit = async () => {
    if (answered !== total) {
      setError(text.selectPrompt);
      return;
    }

    setSubmitting(true);
    setError('');

    const answersPayload = buildCaseAttemptAnswers({
      caseId: `${domain.id}_${kind}`,
      caseTitle: titleBlock.title,
      domain: domain.id,
      language: lang,
      steps,
    });

    const nowIso = new Date().toISOString();

    const { error: insertError } = await supabase
      .from('domain_assessments')
      .insert({
        user_id: user.id,
        domain_id: domain.id,
        assessment_type: kind,
        score: overall.percentage,
        answers: answersPayload,
        completed_at: nowIso,
      });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setSavedScore(overall.percentage);
    setSubmitting(false);

    if (onSaved) {
      onSaved();
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFEF8 40%, #F0F5EC 100%)' }}
    >
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          <ArrowLeft className="inline w-3 h-3 mr-1" />
          {text.back}
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={onSignOut}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {text.signOut}
        </button>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200 outline-none"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="relative z-10 min-h-screen px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <div className="text-3xl mb-2">{domain.icon}</div>
            <h1 className="text-2xl font-bold text-warm-900 font-serif">{titleBlock.title}</h1>
            <p className="text-sm text-warm-500 mt-1">{titleBlock.subtitle}</p>
            <p className="text-xs text-warm-400 mt-3">{answered} / {total}</p>
          </motion.div>

          {assessment.questions.map((question, index) => {
            const selectedId = responses[question.id] ?? null;
            const questionText = question.prompt?.[lang] ?? question.prompt?.zh;
            const explanation = question.explanation?.[lang] ?? question.explanation?.zh;
            const correctOption = question.options.find((option) => option.correct);

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-5"
              >
                <p className="text-xs font-semibold text-sage-600 mb-2">Q{index + 1}</p>
                <p className="text-sm text-warm-800 mb-4">{questionText}</p>

                <div className="space-y-2">
                  {question.options.map((option) => {
                    const optionText = option.text?.[lang] ?? option.text?.zh;
                    const selected = selectedId === option.id;
                    const optionClass = selected ? 'option-card option-card-selected' : 'option-card';

                    return (
                      <button
                        key={option.id}
                        onClick={() => setResponses((prev) => ({ ...prev, [question.id]: option.id }))}
                        className={optionClass}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <span className="w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold uppercase opacity-60">
                            {option.id}
                          </span>
                          <span className="text-sm text-warm-800">{optionText}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedId && (
                  <p className="mt-3 text-xs text-warm-500">
                    {isZh ? '正解：' : 'Correct: '}
                    {correctOption?.id} · {explanation}
                  </p>
                )}
              </motion.div>
            );
          })}

          {savedScore !== null ? (
            <div className="glass-card-sage p-5 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-sage-600" />
              <div>
                <p className="text-sm font-semibold text-sage-700">{text.doneTitle}</p>
                <p className="text-xs text-sage-600">{text.doneNote}</p>
                <p className="text-xs text-sage-600 mt-1">{text.score}：{savedScore}%</p>
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 space-y-3">
              <p className="text-sm text-warm-600">{text.score}：{overall.percentage}%</p>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <Button onClick={handleSubmit} disabled={submitting} className="w-full sm:w-auto">
                {submitting ? text.submitting : text.submit}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
