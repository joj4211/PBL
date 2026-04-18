// State machine for phase progression

export const PHASES = {
  INTRO:           'intro',
  PRE_TEST:        'preTest',
  CHIEF_COMPLAINT: 'chiefComplaint',
  PHYSICAL_EXAM:   'physicalExam',
  WORKUP:          'workup',
  MANAGEMENT:      'management',
  INTERACTIVE:     'interactive',
  POST_TEST:       'postTest',
  ANALYTICS:       'analytics',
  POST_PEARLS:     'postPearls',
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

export const getNextPhase = (currentPhase) => {
  const idx = PHASE_ORDER.indexOf(currentPhase);
  return idx < PHASE_ORDER.length - 1 ? PHASE_ORDER[idx + 1] : null;
};

export const getPhaseIndex = (phase) => PHASE_ORDER.indexOf(phase);

export const getTotalPhases = () => PHASE_ORDER.length;
