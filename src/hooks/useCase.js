import { useState, useCallback } from 'react';
import { PHASES, getNextPhase } from '../logic/stateMachine';
import { scoreMultipleChoice } from '../logic/scoring';
import { cases, defaultCaseId } from '../config/casesConfig';

export const useCase = (caseId = defaultCaseId) => {
  const caseData = cases.find((c) => c.id === caseId) ?? cases[0];

  const [currentPhase, setCurrentPhase] = useState(PHASES.INTRO);
  const [preTestAnswer, setPreTestAnswer] = useState(null);

  const advancePhase = useCallback(() => {
    setCurrentPhase((prev) => getNextPhase(prev) ?? prev);
  }, []);

  const submitPreTest = useCallback((question, selectedId) => {
    const result = scoreMultipleChoice(question, selectedId);
    setPreTestAnswer(result);
    return result;
  }, []);

  const restart = useCallback(() => {
    setCurrentPhase(PHASES.INTRO);
    setPreTestAnswer(null);
  }, []);

  return {
    caseData,
    currentPhase,
    preTestAnswer,
    advancePhase,
    submitPreTest,
    setCurrentPhase,
    restart,
  };
};
