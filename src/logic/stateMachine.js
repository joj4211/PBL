// State machine for phase progression

export const PHASES = {
  INTRO: 'intro',
  PRE_TEST: 'preTest',
  CASE_STUDY: 'caseStudy',
  INTERACTIVE: 'interactive',
  POST_TEST: 'postTest',
  ANALYTICS: 'analytics',
};

export const PHASE_ORDER = [
  PHASES.INTRO,
  PHASES.PRE_TEST,
  PHASES.CASE_STUDY,
  PHASES.INTERACTIVE,
  PHASES.POST_TEST,
  PHASES.ANALYTICS,
];

export const PHASE_META = {
  [PHASES.INTRO]: { label: '開始', shortLabel: '開始', icon: 'BookOpen' },
  [PHASES.PRE_TEST]: { label: '前測評估', shortLabel: '前測', icon: 'ClipboardList' },
  [PHASES.CASE_STUDY]: { label: '臨床案例', shortLabel: '案例', icon: 'FileText' },
  [PHASES.INTERACTIVE]: { label: '互動問答', shortLabel: '問答', icon: 'MessageSquare' },
  [PHASES.POST_TEST]: { label: '後測評估', shortLabel: '後測', icon: 'CheckSquare' },
  [PHASES.ANALYTICS]: { label: '學習成效', shortLabel: '成效', icon: 'BarChart2' },
};

export const getNextPhase = (currentPhase) => {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  return idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null;
};

export const getPrevPhase = (currentPhase) => {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  return idx > 0 ? PHASE_ORDER[idx - 1] : null;
};

export const getPhaseIndex = (phase) => PHASE_ORDER.indexOf(phase);

export const getTotalPhases = () => PHASE_ORDER.length;

export const getProgressPercent = (currentPhase) => {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  return Math.round((idx / (PHASE_ORDER.length - 1)) * 100);
};
