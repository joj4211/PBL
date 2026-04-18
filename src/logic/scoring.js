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

export const getPerformanceInsight = (prePercent, postPercent) => {
  const delta = postPercent - prePercent;
  if (delta >= 30)
    return {
      level: 'excellent',
      message: `您的知識提升了 ${delta}%！案例學習發揮了顯著效果，繼續保持這種學習狀態。`,
    };
  if (delta >= 10)
    return {
      level: 'good',
      message: `後測提升了 ${delta}%，顯示您從案例中獲得了具體收穫。深化理解後，分數還能更高。`,
    };
  if (delta >= 0)
    return {
      level: 'steady',
      message: `前後測表現穩定（+${delta}%）。您原本就有一定的基礎知識，可以嘗試更深入的案例挑戰。`,
    };
  return {
    level: 'reflect',
    message: `案例為您帶來了新的視角和思考框架。臨床思維的培養需要時間，建議複習本案例的關鍵學習點。`,
  };
};
