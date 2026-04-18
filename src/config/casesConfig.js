// ============================================================
//  casesConfig.js — Config-driven Case Definitions
//  SSOT: All displayed content must originate from this file.
//  To add a new case: append a new object to the `cases` array.
// ============================================================

// ── CASE 01: The Spinning World ──────────────────────────────
// Source: case_01.json (derived from PPT, verified 2026-04-18)
const case_01 = {
  id: 'case_01',
  title: 'Case 01: The Spinning World',
  subtitle: 'Acute Vestibular Neuritis (Right Side)',
  coverDescription:
    'Target Learners: PGY Residents / Medical Students\n\nEducational Goal: Differentiate peripheral from central vertigo (HINTS exam), interpret Caloric canal paresis, and understand VEMP in localizing vestibular nerve involvement.',
  estimatedTime: '30–45 min',
  difficulty: 'Intermediate',
  tags: ['ENT', 'Emergency', 'HINTS', 'Vertigo'],

  // ── PRE-TEST ───────────────────────────────────────────────
  preTest: {
    title: 'Pre-Test (Baseline Assessment)',
    instructions: 'Before we begin the case, answer the following question to assess your baseline knowledge.',
    questions: [
      {
        id: 'pre-q1',
        type: 'multiple-choice',
        text: 'A patient presents with acute onset continuous vertigo, nausea, and spontaneous left-beating nystagmus. Which finding would most strongly suggest a peripheral etiology?',
        options: [
          { id: 'A', text: '(A) Vertical nystagmus.' },
          { id: 'B', text: '(B) A corrective "catch-up" saccade during the Head Impulse Test (HIT) to the right.', correct: true },
          { id: 'C', text: '(C) Skew deviation (vertical misalignment of the eyes).' },
          { id: 'D', text: '(D) Nystagmus that changes direction with gaze.' },
        ],
        explanation: null,
      },
    ],
  },

  // ── CHIEF COMPLAINT & CLINICAL HISTORY ────────────────────
  chiefComplaint: {
    slides: [
      {
        slideIndex: 1,
        type: 'narrative',
        content:
          'A 42-year-old female presents to the ER with sudden, severe, constant vertigo that started 12 hours ago. She has intense nausea and has vomited twice. She denies any hearing loss, tinnitus, or focal neurological symptoms (no weakness, no numbness), she had URI symptoms in recent week.',
      },
      {
        slideIndex: 2,
        type: 'history-taking',
        title: 'Problem List & History Taking',
        instruction: 'The user must identify the "Essential Negative Findings" to rule out a stroke:',
        questionsAndRationales: [
          {
            question: '1. "Do you have any difficulty speaking or swallowing?"',
            rationale: '→ Rule out brainstem involvement',
          },
          {
            question: '2. "Did the vertigo start suddenly or gradually?"',
            rationale: '→ Acute onset is typical for VN',
          },
          {
            question: '3. "Any recent viral infections?"',
            rationale: '→ VN is often preceded by an upper respiratory infection.',
          },
        ],
      },
    ],
  },

  // ── PHYSICAL EXAMINATION ───────────────────────────────────
  physicalExam: {
    title: 'Physical Examination (The HINTS Exam)',
    videoPlaceholder: {
      label: 'HINTS Exam Demonstration Video',
      note: 'Video placeholder — to be replaced with: Nystagmus, Head Impulse Test, Skew Test',
      filename: 'video_hints_exam.mp4',
      aspectRatio: '16 / 9',
    },
    steps: [
      {
        stepNumber: 1,
        name: 'Nystagmus Observation',
        description: 'The patient has spontaneous horizontal-torsional nystagmus beating to the LEFT.',
        question: 'Does the nystagmus intensity increase or decrease when looking to the left?',
        correctAnswer: "Increase — Alexander's Law",
      },
      {
        stepNumber: 2,
        name: 'Head Impulse Test (HIT)',
        description: 'Perform a virtual rapid head turn to the right.',
        visual: 'The eyes move with the head and then perform a refixation saccade back to the center.',
      },
      {
        stepNumber: 3,
        name: 'Test of Skew',
        description: 'No vertical ocular misalignment noted.',
      },
    ],
    clinicalDecision: {
      question: 'Is this a "Dangerous" or "Benign" HINTS profile?',
      reasoning: '→ If negative, this indicates a peripheral origin.',
      answer: 'Benign / Peripheral',
    },
  },

  // ── WORKUP ─────────────────────────────────────────────────
  workup: {
    title: 'Vestibular Workup (Data Interpretation)',
    investigations: [
      {
        id: 'pta',
        name: 'PTA (Pure Tone Audiometry)',
        image: 'image_pta.png',
        aspectRatio: '4 / 3',
        question: 'Does the patient have hearing loss?',
        answer: 'No, hearing is within normal limits. This rules out Labyrinthitis.',
      },
      {
        id: 'caloric',
        name: 'Caloric Test',
        images: ['image_caloric_1.png', 'image_caloric_2.png'],
        aspectRatio: '4 / 3',
        observation: 'Right-side irrigation shows significantly reduced response.',
        task: 'Calculate the Canal Paresis (CP).',
        result: 'Right CP > 25% indicates right-side vestibular hypofunction.',
      },
      {
        id: 'vemp',
        name: 'VEMP (cVEMP / oVEMP)',
        image: 'image_vemp.png',
        aspectRatio: '4 / 3',
        task: 'Which nerve is likely affected?',
        rules: [
          '1. The Color Code (The Golden Rule)',
          '🔴 Red Line: Indicates the Right Ear.',
          '🔵 Blue Line: Indicates the Left Ear.',
        ],
      },
    ],
  },

  // ── MANAGEMENT & REHABILITATION ────────────────────────────
  management: {
    title: 'Management & Rehabilitation',
    clinicalDecisionTree: [
      {
        stage: 'Immediate Treatment',
        options: [
          { id: 'A', text: '(A) Epley Maneuver.', feedback: '→ Incorrect. This is not BPPV!' },
          { id: 'B', text: '(B) High-dose Corticosteroids + Vestibular Suppressants (short-term).', feedback: '→ Correct! Steroids may improve nerve recovery.' },
        ],
      },
      {
        stage: 'Long-term Management',
        options: [
          { id: 'A', text: '(A) Absolute bed rest.', feedback: '→ Incorrect. Bed rest hinders central compensation.' },
          { id: 'B', text: '(B) Early Vestibular Rehabilitation Therapy (VRT).', feedback: '→ Correct! Early movement promotes brain adaptation.' },
        ],
      },
    ],
  },

  // ── POST-TEST & KEY LEARNING PEARLS ────────────────────────
  postPearls: {
    title: 'Post-Test & Key Learning Pearls',
    finalReview: [
      'HINTS is King: A normal Head Impulse Test in acute vertigo is actually more concerning for a stroke.',
      'Labyrinthitis vs. Neuritis: If the 42-year-old female had hearing loss, the diagnosis would shift to Labyrinthitis.',
      'The "Slow Phase": Nystagmus beats away from the lesion (The "Fast Phase" is toward the "healthy" ear).',
    ],
  },
};

// ── CASE 002: Placeholder (framework reference) ─────────────
const case_placeholder = {
  id: 'case-002',
  title: '（框架參考用）',
  subtitle: 'Placeholder — not yet populated',
  coverDescription: '此為框架示範用的佔位案例。',
  estimatedTime: '—',
  difficulty: '—',
  tags: [],
  preTest: { instructions: '', questions: [] },
  chiefComplaint: { slides: [] },
  physicalExam: { title: '', steps: [], clinicalDecision: {} },
  workup: { title: '', investigations: [] },
  management: { title: '', clinicalDecisionTree: [] },
  postPearls: { title: '', finalReview: [] },
};

export const cases = [case_01, case_placeholder];

export const defaultCaseId = 'case_01';
