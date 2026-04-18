import { useState, useCallback } from 'react';
import { PHASES, getNextPhase } from '../logic/stateMachine';
import { scoreMultipleChoice, scoreTextInput } from '../logic/scoring';
import { cases, defaultCaseId } from '../config/casesConfig';

export const useCase = (caseId = defaultCaseId) => {
  const caseData = cases.find((c) => c.id === caseId) ?? cases[0];

  const [currentPhase, setCurrentPhase] = useState(PHASES.INTRO);
  const [answers, setAnswers] = useState({
    preTest: {},
    interactive: {},
    postTest: {},
  });

  const advancePhase = useCallback(() => {
    setCurrentPhase((prev) => getNextPhase(prev) ?? prev);
  }, []);

  const submitAnswer = useCallback((phase, question, value) => {
    let result;
    if (question.type === 'multiple-choice') {
      result = scoreMultipleChoice(question, value);
    } else if (question.type === 'text-input') {
      result = scoreTextInput(question, value);
    }

    if (result) {
      setAnswers((prev) => ({
        ...prev,
        [phase]: { ...prev[phase], [question.id]: result },
      }));
    }

    return result;
  }, []);

  const getPhaseAnswers = useCallback(
    (phase) => answers[phase] ?? {},
    [answers]
  );

  return {
    caseData,
    currentPhase,
    answers,
    advancePhase,
    submitAnswer,
    getPhaseAnswers,
    setCurrentPhase,
  };
};
