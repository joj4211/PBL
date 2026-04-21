import { useState, useCallback } from 'react';
import { PHASES, getNextPhase, getPrevPhase } from '../logic/stateMachine';
import { scoreMultipleChoice, scoreTextInput } from '../logic/scoring';
import { getCase, defaultCaseId } from '../cases/index';

export const useCase = (caseId = defaultCaseId, lang = 'zh') => {
  const caseData = getCase(caseId, lang);

  const [currentPhase, setCurrentPhase] = useState(PHASES.INTRO);
  const [preTestAnswer, setPreTestAnswer] = useState(null);
  const [answersByPhase, setAnswersByPhase] = useState({});
  const [attemptSaved, setAttemptSaved] = useState(false);

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
  }, []);

  const startAtPhase = useCallback((phase = PHASES.INTRO) => {
    setCurrentPhase(phase);
    setPreTestAnswer(null);
    setAnswersByPhase({});
    setAttemptSaved(false);
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
