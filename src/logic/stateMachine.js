// State machine for phase progression

export const PHASES = {
  INTRO: 'intro',
  PRE_TEST: 'preTest',
  CHIEF_COMPLAINT: 'chiefComplaint',
  PHYSICAL_EXAM: 'physicalExam',
  WORKUP: 'workup',
  MANAGEMENT: 'management',
  INTERACTIVE: 'interactive',
  POST_TEST: 'postTest',
  ANALYTICS: 'analytics',
  POST_PEARLS: 'postPearls',
};

export const PHASE_ORDER = [
  PHASES.INTRO,
  PHASES.PRE_TEST,
  PHASES.CHIEF_COMPLAINT,
  PHASES.PHYSICAL_EXAM,
  PHASES.WORKUP,
  PHASES.MANAGEMENT,
  PHASES.INTERACTIVE,
  PHASES.POST_TEST,
  PHASES.ANALYTICS,
  PHASES.POST_PEARLS,
];

export const PHASE_META = {
  [PHASES.INTRO]:           { label: '開始',    shortLabel: '開始' },
  [PHASES.PRE_TEST]:        { label: '前測評估', shortLabel: '前測' },
  [PHASES.CHIEF_COMPLAINT]: { label: '病史詢問', shortLabel: '病史' },
  [PHASES.PHYSICAL_EXAM]:   { label: '理學檢查', shortLabel: '理學' },
  [PHASES.WORKUP]:          { label: '檢查判讀', shortLabel: '檢查' },
  [PHASES.MANAGEMENT]:      { label: '治療決策', shortLabel: '治療' },
  [PHASES.INTERACTIVE]:     { label: '互動問答', shortLabel: '問答' },
  [PHASES.POST_TEST]:       { label: '後測評估', shortLabel: '後測' },
  [PHASES.ANALYTICS]:       { label: '成效分析', shortLabel: '分析' },
  [PHASES.POST_PEARLS]:     { label: '學習精華', shortLabel: '精華' },
};

export const getNextPhase = (currentPhase) => {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  return idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null;
};

export const getPhaseIndex = (phase) => PHASE_ORDER.indexOf(phase);

export const getTotalPhases = () => PHASE_ORDER.length;
