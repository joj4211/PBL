import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Construction,
  Image as ImageIcon,
  XCircle,
} from 'lucide-react';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../contexts/LanguageContext';
import { stripOptionPrefix } from '../../utils/text';
import { domainColorMap, getDomainByCaseId } from '../../config/domains';

function scoreAnswers(answers, steps) {
  const correct = answers.filter((answer) => answer?.isCorrect).length;
  return steps.length > 0 ? Math.round((correct / steps.length) * 100) : 0;
}

function MediaPlaceholder({ label, text }) {
  if (!label) return null;

  return (
    <div className="rounded-2xl border border-dashed border-warm-300/80 bg-white/35 px-5 py-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-warm-100/80 flex items-center justify-center flex-shrink-0">
          <ImageIcon className="w-5 h-5 text-warm-500" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-warm-500 mb-1">
            {text.mediaWip}
          </p>
          <p className="text-sm text-warm-700 leading-relaxed">{label}</p>
          <p className="text-xs text-warm-400 mt-2 flex items-center gap-1.5">
            <Construction className="w-3.5 h-3.5" />
            {text.mediaNote}
          </p>
        </div>
      </div>
    </div>
  );
}

function NoseProgressIndicator({ currentIndex, total }) {
  const progress = total > 1 ? (currentIndex / (total - 1)) * 100 : 100;

  return (
    <div className="rounded-2xl border border-white/70 bg-white/45 px-4 py-4 shadow-sm backdrop-blur-md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold tracking-[0.22em] uppercase text-sage-700">
          Step {currentIndex + 1} / {total}
        </span>
        <span className="text-xs font-semibold text-warm-500">
          {Math.round(((currentIndex + 1) / total) * 100)}%
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-warm-100">
        <motion.div
          className="absolute left-0 top-0 h-2 rounded-full bg-sage-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35 }}
        />
        <div className="absolute inset-0 flex items-center justify-between">
          {Array.from({ length: total }).map((_, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                scale: index === currentIndex ? 1.25 : 1,
                backgroundColor: index <= currentIndex ? '#5E8847' : '#DFC99E',
              }}
              transition={{ duration: 0.25 }}
              className="h-3.5 w-3.5 rounded-full border-2 border-white shadow-sm"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NoseCasePage({ caseData, user, lang, onBack, onSignOut }) {
  const { setLang } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [draftSelections, setDraftSelections] = useState({});
  const [saveState, setSaveState] = useState('idle');
  const [saveError, setSaveError] = useState('');
  const domain = getDomainByCaseId(caseData.id);
  const domainText = domain[lang] ?? domain.zh;
  const domainStyles = domainColorMap[domain.color] ?? domainColorMap.sage;

  const step = caseData.steps[stepIndex];
  const selectedAnswer = answers[stepIndex] ?? null;
  const isLastStep = stepIndex === caseData.steps.length - 1;
  const correctIds = step.options.filter((option) => option.correct).map((option) => option.id);
  const isMultiSelect = correctIds.length > 1;
  const draftSelectedIds = draftSelections[stepIndex] ?? [];
  const isZh = lang === 'zh';
  const text = {
    back: isZh ? `返回${domainText.title}` : `Back to ${domainText.title}`,
    signOut: isZh ? '登出' : 'Sign out',
    badge: isZh ? `${domainText.title}互動案例` : `${domainText.title} Interactive Case`,
    clinicalScenario: isZh ? '臨床情境' : 'Clinical Scenario',
    mediaWip: isZh ? '多媒體施工中' : 'Media in progress',
    mediaNote: isZh
      ? '此欄位已預留，之後可加入圖片、影片或互動素材。'
      : 'This field is reserved for future images, videos, or interactive media.',
    feedback: isZh ? '回饋' : 'Feedback',
    confirm: isZh ? '確認選擇' : 'Confirm',
    previous: isZh ? '上一步' : 'Previous',
    next: isZh ? '下一步' : 'Next',
    saving: isZh ? '儲存中...' : 'Saving...',
    finish: isZh ? '完成並儲存' : 'Finish and save',
    saveError: isZh ? '儲存失敗' : 'Save failed',
    complete: isZh ? '案例完成' : 'Case Complete',
    saved: isZh ? '本次學習紀錄已儲存。' : 'This learning record has been saved.',
    backToList: isZh ? `返回${domainText.title}案例列表` : `Back to ${domainText.title} cases`,
  };

  const result = useMemo(() => {
    if (!selectedAnswer) return null;
    return {
      ...selectedAnswer,
      correctIds,
      isCorrect: selectedAnswer.isCorrect,
    };
  }, [correctIds, selectedAnswer]);

  const submitAnswer = (option) => {
    if (selectedAnswer || isMultiSelect) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[stepIndex] = {
        step: step.title,
        selectedId: option.id,
        selectedText: option.text,
        correctIds,
        isCorrect: Boolean(option.correct),
      };
      return next;
    });
  };

  const toggleDraftSelection = (optionId) => {
    if (selectedAnswer || !isMultiSelect) return;
    setDraftSelections((prev) => {
      const current = prev[stepIndex] ?? [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];

      return { ...prev, [stepIndex]: next };
    });
  };

  const submitMultiAnswer = () => {
    if (selectedAnswer || draftSelectedIds.length === 0) return;
    const isCorrect =
      draftSelectedIds.length === correctIds.length &&
      correctIds.every((id) => draftSelectedIds.includes(id));

    setAnswers((prev) => {
      const next = [...prev];
      next[stepIndex] = {
        step: step.title,
        selectedIds: draftSelectedIds,
        selectedText: step.options
          .filter((option) => draftSelectedIds.includes(option.id))
          .map((option) => option.text),
        correctIds,
        isCorrect,
      };
      return next;
    });
  };

  const saveAttempt = async () => {
    setSaveState('saving');
    setSaveError('');

    const score = scoreAnswers(answers, caseData.steps);
    const { error } = await supabase.from('case_attempts').insert({
      user_id: user.id,
      case_id: caseData.id,
      domain: domain.id,
      language: lang,
      pre_test_score: null,
      interactive_score: score,
      post_test_score: null,
      answers: {
        caseTitle: caseData.title,
        answers,
      },
    });

    if (error) {
      setSaveState('error');
      setSaveError(error.message);
      return;
    }

    setSaveState('saved');
  };

  const goNext = () => {
    if (!selectedAnswer) return;
    if (isLastStep) {
      saveAttempt();
      return;
    }
    setStepIndex((index) => index + 1);
  };

  const goPrev = () => {
    setStepIndex((index) => Math.max(0, index - 1));
  };

  const score = scoreAnswers(answers, caseData.steps);

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

      <div className="absolute top-4 right-4 z-20">
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

      <div className="relative z-10 min-h-screen px-4 pb-10 pt-20 sm:pt-16">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${domainStyles.iconBg} flex items-center justify-center flex-shrink-0`}>
                <span className="text-xl">{domain.icon}</span>
              </div>
              <div>
                <span className={`phase-tag ${domainStyles.iconBg} ${domainStyles.text}`}>
                  {text.badge}
                </span>
                <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-warm-900 font-serif leading-tight">
                  {caseData.title}
                </h1>
                <p className="mt-1 text-warm-500 text-sm leading-relaxed">{caseData.subtitle}</p>
              </div>
            </div>
            <div className="w-full sm:w-72">
              <NoseProgressIndicator currentIndex={stepIndex} total={caseData.steps.length} />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {saveState === 'saved' ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-sage-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-warm-900 font-serif">{text.complete}</h2>
                  <p className="text-sm text-warm-500 mt-2">{text.saved}</p>
                </div>
                <div className="text-5xl font-bold text-sage-600">{score}%</div>
                <Button onClick={onBack} size="lg">{text.backToList}</Button>
              </motion.div>
            ) : (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.32 }}
                className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]"
              >
                <section className="rounded-3xl border border-white/70 bg-white/35 p-5 shadow-lg backdrop-blur-md lg:sticky lg:top-20 lg:self-start">
                  <span className="phase-tag bg-sage-100 text-sage-600">
                    Step {stepIndex + 1}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-warm-900 font-serif leading-tight">
                    {step.title}
                  </h2>

                  <div className="mt-5 border-l-4 border-sage-300 pl-4">
                    <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-2">
                      {text.clinicalScenario}
                    </p>
                    <p className="text-sm sm:text-base text-warm-800 leading-loose whitespace-pre-line">
                      {step.scenario}
                    </p>
                  </div>

                  <div className="mt-5 space-y-4">
                    <MediaPlaceholder label={step.media} text={text} />

                    {step.constructionNote && (
                      <p className="rounded-2xl border border-warm-200 bg-warm-50/70 px-4 py-3 text-xs text-warm-600 leading-relaxed">
                        {step.constructionNote}
                      </p>
                    )}
                  </div>
                </section>

                <section className="rounded-3xl border border-white/70 bg-white/55 p-5 shadow-lg backdrop-blur-md sm:p-6">
                  <p className="text-warm-900 font-semibold leading-relaxed text-base sm:text-lg mb-4">
                    {step.question}
                  </p>

                  <div className="space-y-3">
                    {step.options.map((option) => {
                    const selected = result?.selectedId === option.id || result?.selectedIds?.includes(option.id);
                    const draftSelected = draftSelectedIds.includes(option.id);
                    const isCorrectOption = result?.correctIds.includes(option.id);
                    const className = !result
                      ? draftSelected
                        ? 'option-card option-card-selected'
                        : 'option-card'
                      : isCorrectOption
                        ? 'option-card option-card-correct'
                        : selected
                          ? 'option-card option-card-incorrect'
                          : 'option-card opacity-45';

                    return (
                      <button
                        key={option.id}
                        onClick={() => (isMultiSelect ? toggleDraftSelection(option.id) : submitAnswer(option))}
                        className={className}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold uppercase opacity-60">
                            {option.id}
                          </span>
                          <span className="text-warm-800 text-sm leading-relaxed text-left flex-1 whitespace-pre-line">
                            {stripOptionPrefix(option.text)}
                          </span>
                          {result && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-sage-500 flex-shrink-0" />}
                          {result && selected && !option.correct && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                  </div>

                  {isMultiSelect && !result && (
                    <div className="mt-4 flex justify-end">
                      <Button onClick={submitMultiAnswer} disabled={draftSelectedIds.length === 0}>
                        {text.confirm}
                      </Button>
                    </div>
                  )}

                  {result && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-5 overflow-hidden"
                    >
                      <div className="rounded-2xl border border-sage-200/70 bg-sage-50/70 p-4">
                        <p className="text-xs font-semibold text-sage-600 uppercase tracking-wider mb-2">
                          {text.feedback}
                        </p>
                        <p className="text-sm text-warm-700 leading-relaxed whitespace-pre-line">
                          {step.feedback}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {saveState === 'error' && (
                    <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {text.saveError}：{saveError}
                    </p>
                  )}

                  <div className="mt-5 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
                    <Button variant="secondary" onClick={goPrev} disabled={stepIndex === 0} className="w-full sm:w-auto">
                      <ChevronLeft className="inline w-4 h-4 mr-1" />
                      {text.previous}
                    </Button>
                    <Button onClick={goNext} disabled={!selectedAnswer || saveState === 'saving'} className="w-full sm:w-auto">
                      {saveState === 'saving' ? text.saving : isLastStep ? text.finish : text.next}
                      <ChevronRight className="inline w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
