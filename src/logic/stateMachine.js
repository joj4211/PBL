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
};

export const PHASE_ORDER = [
  PHASES.INTRO,
  PHASES.CHIEF_COMPLAINT,
  PHASES.PHYSICAL_EXAM,
  PHASES.WORKUP,
  PHASES.MANAGEMENT,
  PHASES.INTERACTIVE,
  PHASES.ANALYTICS,
];

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
