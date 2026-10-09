import { useState, useCallback } from 'react';
import { PHASES, getNextPhase, getPrevPhase } from '../logic/stateMachine';
import { scoreMultipleChoice, scoreTextInput } from '../logic/scoring';
import legacyExampleZh from '../cases/ear_vestibular_neuritis/ear_vestibular_neuritis.zh.json';
import legacyExampleEn from '../cases/ear_vestibular_neuritis/ear_vestibular_neuritis.en.json';

// The archived phase-flow example lives outside the Case Catalogue and loads its own JSON.
const LEGACY_EXAMPLE_ID = 'ear_vestibular_neuritis';
const legacyExampleByLang = {
  zh: { ...legacyExampleZh, id: LEGACY_EXAMPLE_ID },
  en: { ...legacyExampleEn, id: LEGACY_EXAMPLE_ID },
};

function createAttemptStart() {
  return {
    iso: new Date().toISOString(),
    ms: Date.now(),
  };
}

export const useCase = (lang = 'zh') => {
  const caseData = legacyExampleByLang[lang] ?? legacyExampleByLang.zh;

  const [currentPhase, setCurrentPhase] = useState(PHASES.INTRO);
  const [preTestAnswer, setPreTestAnswer] = useState(null);
  const [answersByPhase, setAnswersByPhase] = useState({});
  const [attemptSaved, setAttemptSaved] = useState(false);
  const [attemptStartedAt, setAttemptStartedAt] = useState(null);

  const advancePhase = useCallback(() => {
    setCurrentPhase((prev) => getNextPhase(prev) ?? prev);
  }, []);

  const goBackPhase = useCallback(() => {
    setCurrentPhase((prev) => getPrevPhase(prev) ?? prev);
  }, []);

  const exitToIntro = useCallback(() => {
    setCurrentPhase(PHASES.INTRO);
    setPreTestAnswer(null);
    setAnswersByPhase({});
    setAttemptSaved(false);
    setAttemptStartedAt(null);
  }, []);

  const submitAnswer = useCallback((phaseId, question, value) => {
    const result =
      question.type === 'text-input'
        ? scoreTextInput(question, value)
        : scoreMultipleChoice(question, value);

    setAnswersByPhase((prev) => ({
      ...prev,
      [phaseId]: {
        ...(prev[phaseId] ?? {}),
        [question.id]: result,
      },
    }));

    if (phaseId === 'preTest') {
      setPreTestAnswer(result);
    }

    return result;
  }, []);

  const submitPreTest = useCallback(
    (question, selectedId) => submitAnswer('preTest', question, selectedId),
    [submitAnswer]
  );

  const getPhaseAnswers = useCallback(
    (phaseId) => answersByPhase[phaseId] ?? {},
    [answersByPhase]
  );

  const restart = useCallback(() => {
    setCurrentPhase(PHASES.INTRO);
    setPreTestAnswer(null);
    setAnswersByPhase({});
    setAttemptSaved(false);
    setAttemptStartedAt(createAttemptStart());
  }, []);

  const startAtPhase = useCallback((phase = PHASES.INTRO) => {
    setCurrentPhase(phase);
    setPreTestAnswer(null);
    setAnswersByPhase({});
    setAttemptSaved(false);
    setAttemptStartedAt(createAttemptStart());
  }, []);

  const markAttemptSaved = useCallback(() => {
    setAttemptSaved(true);
  }, []);

  return {
    caseData,
    currentPhase,
    preTestAnswer,
    answersByPhase,
    attemptSaved,
    attemptStartedAt,
    advancePhase,
    goBackPhase,
    exitToIntro,
    submitAnswer,
    submitPreTest,
    getPhaseAnswers,
    markAttemptSaved,
    setCurrentPhase,
    restart,
    startAtPhase,
  };
};
