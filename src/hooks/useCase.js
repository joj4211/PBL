import { useState, useCallback } from 'react';
import { PHASES, getNextPhase } from '../logic/stateMachine';
import { scoreMultipleChoice, scoreTextInput } from '../logic/scoring';
import { cases, defaultCaseId } from '../config/casesConfig';

export const useCase = (caseId = defaultCaseId) => {
  const caseData = cases.find((c) => c.id === caseId) ?? cases[0];

  const [currentPhase, setCurrentPhase] = useState(PHASES.INTRO);
  const [preTestAnswer, setPreTestAnswer] = useState(null);
  const [answersByPhase, setAnswersByPhase] = useState({});

  const advancePhase = useCallback(() => {
    setCurrentPhase((prev) => getNextPhase(prev) ?? prev);
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
  }, []);

  return {
    caseData,
    currentPhase,
    preTestAnswer,
    advancePhase,
    submitAnswer,
    submitPreTest,
    getPhaseAnswers,
    setCurrentPhase,
    restart,
  };
};
