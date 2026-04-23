export const domainAssessments = {
  ear: {
    preTest: {
      id: 'ear_pretest_v1',
      zh: {
        title: '耳科前測',
        subtitle: '完成前測後即可進入耳科案例。',
      },
      en: {
        title: 'Otology Pre-test',
        subtitle: 'Complete this pre-test to unlock otology cases.',
      },
      questions: [
        {
          id: 'ear-pre-1',
          type: 'multiple-choice',
          prompt: {
            zh: '下列哪項最符合梅尼爾氏症典型發作時間？',
            en: "Which duration best matches a typical Meniere's disease attack?",
          },
          options: [
            { id: 'A', text: { zh: '數秒內結束', en: 'Resolves within seconds' }, correct: false },
            { id: 'B', text: { zh: '20 分鐘到 12 小時', en: '20 minutes to 12 hours' }, correct: true },
            { id: 'C', text: { zh: '固定超過 72 小時', en: 'Always longer than 72 hours' }, correct: false },
          ],
          explanation: {
            zh: '梅尼爾氏症典型眩暈發作時間約 20 分鐘到 12 小時。',
            en: "Typical Meniere's vertigo episodes last about 20 minutes to 12 hours.",
          },
        },
        {
          id: 'ear-pre-2',
          type: 'multiple-choice',
          prompt: {
            zh: '突發性聽損的初始治療重點為何？',
            en: 'What is the key early treatment goal for sudden hearing loss?',
          },
          options: [
            { id: 'A', text: { zh: '盡早評估並啟動治療', en: 'Rapid assessment and early treatment' }, correct: true },
            { id: 'B', text: { zh: '先觀察 3 個月', en: 'Observe for 3 months first' }, correct: false },
            { id: 'C', text: { zh: '僅使用止痛藥', en: 'Use painkillers only' }, correct: false },
          ],
          explanation: {
            zh: '突發性聽損通常需要儘早介入。',
            en: 'Sudden hearing loss generally requires timely intervention.',
          },
        },
        {
          id: 'ear-pre-3',
          type: 'multiple-choice',
          prompt: {
            zh: '搏動性耳鳴評估最重要的是？',
            en: 'What is most important when evaluating pulsatile tinnitus?',
          },
          options: [
            { id: 'A', text: { zh: '確認是否與脈搏同步', en: 'Check if symptoms are pulse-synchronous' }, correct: true },
            { id: 'B', text: { zh: '只看純音聽力', en: 'Only check pure tone audiometry' }, correct: false },
            { id: 'C', text: { zh: '一定是心理因素', en: 'Assume psychogenic cause only' }, correct: false },
          ],
          explanation: {
            zh: '是否與脈搏同步可幫助辨識血管相關病因。',
            en: 'Pulse-synchronous symptoms help identify vascular causes.',
          },
        },
      ],
    },
    postTest: {
      id: 'ear_posttest_v1',
      zh: { title: '耳科後測', subtitle: '完成所有耳科案例後即可進行後測。' },
      en: { title: 'Otology Post-test', subtitle: 'Take this post-test after finishing all otology cases.' },
      questions: [],
    },
  },
  nose: {
    preTest: {
      id: 'nose_pretest_v1',
      zh: { title: '鼻科前測', subtitle: '完成前測後即可進入鼻科案例。' },
      en: { title: 'Rhinology Pre-test', subtitle: 'Complete this pre-test to unlock rhinology cases.' },
      questions: [
        {
          id: 'nose-pre-1',
          type: 'multiple-choice',
          prompt: {
            zh: '過敏性鼻炎長期控制最關鍵的藥物是？',
            en: 'Which medication is central for long-term allergic rhinitis control?',
          },
          options: [
            { id: 'A', text: { zh: '鼻噴類固醇', en: 'Intranasal corticosteroids' }, correct: true },
            { id: 'B', text: { zh: '長期口服去充血劑', en: 'Long-term oral decongestants' }, correct: false },
            { id: 'C', text: { zh: '抗生素常規使用', en: 'Routine antibiotics' }, correct: false },
          ],
          explanation: {
            zh: 'INCS 為過敏性鼻炎核心治療。',
            en: 'INCS is a cornerstone therapy for allergic rhinitis.',
          },
        },
        {
          id: 'nose-pre-2',
          type: 'multiple-choice',
          prompt: {
            zh: '大量反覆鼻出血時，應優先排除？',
            en: 'In severe recurrent epistaxis, what should be ruled out first?',
          },
          options: [
            { id: 'A', text: { zh: '重大血管病灶', en: 'Major vascular lesions' }, correct: true },
            { id: 'B', text: { zh: '單純季節性過敏', en: 'Simple seasonal allergy' }, correct: false },
            { id: 'C', text: { zh: '單純感冒', en: 'Simple cold' }, correct: false },
          ],
          explanation: {
            zh: '需先排除危險血管性病因。',
            en: 'Dangerous vascular etiologies should be excluded first.',
          },
        },
        {
          id: 'nose-pre-3',
          type: 'multiple-choice',
          prompt: {
            zh: '鼻咽癌追蹤時常見實用腫瘤標記是？',
            en: 'A practical marker often used in NPC follow-up is?',
          },
          options: [
            { id: 'A', text: { zh: 'EBV DNA', en: 'EBV DNA' }, correct: true },
            { id: 'B', text: { zh: '尿酸', en: 'Uric acid' }, correct: false },
            { id: 'C', text: { zh: '血糖', en: 'Blood glucose' }, correct: false },
          ],
          explanation: {
            zh: 'EBV DNA 常用於 NPC 追蹤。',
            en: 'EBV DNA is widely used for NPC monitoring.',
          },
        },
      ],
    },
    postTest: {
      id: 'nose_posttest_v1',
      zh: { title: '鼻科後測', subtitle: '完成所有鼻科案例後即可進行後測。' },
      en: { title: 'Rhinology Post-test', subtitle: 'Take this post-test after finishing all rhinology cases.' },
      questions: [],
    },
  },
  throat: {
    preTest: {
      id: 'throat_pretest_v1',
      zh: { title: '喉科前測', subtitle: '完成前測後即可進入喉科案例。' },
      en: { title: 'Laryngology Pre-test', subtitle: 'Complete this pre-test to unlock laryngology cases.' },
      questions: [
        {
          id: 'throat-pre-1',
          type: 'multiple-choice',
          prompt: {
            zh: '聲帶息肉病人最常見主訴之一是？',
            en: 'A common complaint in vocal polyp patients is?',
          },
          options: [
            { id: 'A', text: { zh: '持續沙啞', en: 'Persistent hoarseness' }, correct: true },
            { id: 'B', text: { zh: '劇烈腹痛', en: 'Severe abdominal pain' }, correct: false },
            { id: 'C', text: { zh: '關節紅腫', en: 'Joint swelling' }, correct: false },
          ],
          explanation: {
            zh: '聲帶病灶常以聲音改變呈現。',
            en: 'Voice changes are common in vocal fold pathology.',
          },
        },
        {
          id: 'throat-pre-2',
          type: 'multiple-choice',
          prompt: {
            zh: 'OSA 手術評估常需先做？',
            en: 'OSA surgical planning commonly requires?',
          },
          options: [
            { id: 'A', text: { zh: '氣道評估與睡眠檢查', en: 'Airway evaluation and sleep testing' }, correct: true },
            { id: 'B', text: { zh: '僅憑 BMI', en: 'BMI alone' }, correct: false },
            { id: 'C', text: { zh: '不需影像與內視鏡', en: 'No imaging or endoscopy needed' }, correct: false },
          ],
          explanation: {
            zh: 'OSA 手術需完整氣道與睡眠評估。',
            en: 'Comprehensive airway and sleep assessment is required for OSA surgery.',
          },
        },
        {
          id: 'throat-pre-3',
          type: 'multiple-choice',
          prompt: {
            zh: '甲狀腺結節風險評估常用工具是？',
            en: 'Which tool is commonly used for thyroid nodule risk stratification?',
          },
          options: [
            { id: 'A', text: { zh: '超音波風險分層', en: 'Ultrasound risk stratification' }, correct: true },
            { id: 'B', text: { zh: '僅看年齡', en: 'Age only' }, correct: false },
            { id: 'C', text: { zh: '僅看喉嚨痛', en: 'Sore throat only' }, correct: false },
          ],
          explanation: {
            zh: '超音波特徵是風險分層關鍵。',
            en: 'Ultrasound features are central to risk stratification.',
          },
        },
      ],
    },
    postTest: {
      id: 'throat_posttest_v1',
      zh: { title: '喉科後測', subtitle: '完成所有喉科案例後即可進行後測。' },
      en: { title: 'Laryngology Post-test', subtitle: 'Take this post-test after finishing all laryngology cases.' },
      questions: [],
    },
  },
};

function mirrorQuestionsWithNewIds(questions, suffix) {
  return questions.map((question) => ({
    ...question,
    id: `${question.id}-${suffix}`,
  }));
}

export function getDomainAssessment(domainId, kind = 'preTest') {
  const domain = domainAssessments[domainId];
  if (!domain) return null;

  if (kind === 'postTest') {
    const postTemplate = domain.postTest;
    const fallbackQuestions = mirrorQuestionsWithNewIds(domain.preTest.questions, 'post');

    return {
      ...postTemplate,
      questions: postTemplate.questions?.length ? postTemplate.questions : fallbackQuestions,
    };
  }

  return domain.preTest;
}
