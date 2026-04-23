export function buildOverallFromSteps(steps = []) {
  const total = steps.length;
  const correct = steps.filter((step) => Boolean(step?.isCorrect)).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  return { correct, total, percentage };
}

export function mapPhaseAnswersToSteps(answersByPhase = {}) {
  const phaseOrder = ['preTest', 'interactive', 'postTest'];
  const steps = [];

  phaseOrder.forEach((phaseKey) => {
    const phaseAnswers = answersByPhase?.[phaseKey] ?? {};

    Object.values(phaseAnswers).forEach((answer, index) => {
      if (!answer || typeof answer !== 'object') return;

      const {
        questionId,
        type,
        selectedId = null,
        selectedIds = null,
        selectedText = null,
        inputText = null,
        matchedKeywords = null,
        correctId = null,
        correctIds = null,
        isCorrect = false,
        explanation = null,
        feedback = null,
        feedbackLevel = null,
      } = answer;

      steps.push({
        phase: phaseKey,
        order: index,
        questionId: questionId ?? null,
        type: type ?? null,
        selectedId,
        selectedIds,
        selectedText,
        inputText,
        matchedKeywords,
        correctId,
        correctIds,
        isCorrect: Boolean(isCorrect),
        explanation,
        feedback,
        feedbackLevel,
      });
    });
  });

  return steps;
}

export function buildCaseAttemptAnswers({
  caseId,
  caseTitle,
  domain,
  language,
  steps,
}) {
  const overall = buildOverallFromSteps(steps);

  return {
    schemaVersion: '2.0.0',
    caseMeta: {
      caseId,
      caseTitle,
      domain,
      language,
    },
    summary: {
      overall: overall.percentage,
    },
    steps,
  };
}
