// Pure scoring/grading logic — no UI dependencies

export const scoreMultipleChoice = (question, selectedId) => {
  const correctOption = question.options.find((o) => o.correct);
  const isCorrect = correctOption?.id === selectedId;
  return {
    questionId: question.id,
    type: 'multiple-choice',
    selectedId,
    correctId: correctOption?.id,
    isCorrect,
    explanation: question.explanation,
  };
};

export const scoreTextInput = (question, inputText) => {
  const normalized = inputText.toLowerCase();
  const matched = question.keywords.filter((kw) =>
    normalized.includes(kw.toLowerCase())
  );

  let feedbackLevel = 'hint';
  if (matched.length >= 2) feedbackLevel = 'excellent';
  else if (matched.length === 1) feedbackLevel = 'good';

  const feedback = question.feedbackTemplate[feedbackLevel].replace(
    '{keyword}',
    matched[0] ?? ''
  );

  return {
    questionId: question.id,
    type: 'text-input',
    inputText,
    matchedKeywords: matched,
    feedbackLevel,
    feedback,
    isCorrect: feedbackLevel !== 'hint',
  };
};

export const calculatePhaseScore = (phaseAnswers, questions) => {
  let correct = 0;
  let total = 0;

  questions.forEach((q) => {
    const answer = phaseAnswers?.[q.id];
    if (!answer) return;
    total++;
    if (answer.isCorrect) correct++;
  });

  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
  };
};

// Returns level and delta only; message strings live in ui.[lang].json
export const getPerformanceInsight = (prePercent, postPercent) => {
  const delta = postPercent - prePercent;
  let level = 'reflect';
  if (delta >= 30) level = 'excellent';
  else if (delta >= 10) level = 'good';
  else if (delta >= 0) level = 'steady';
  return { level, delta };
};
