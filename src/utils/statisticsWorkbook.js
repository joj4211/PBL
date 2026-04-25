import ExcelJS from 'exceljs';
import { domains } from '../config/domains';
import { domainAssessments } from '../config/domainAssessments';
import { caseIds, getCase } from '../cases/index';

const DOMAIN_TITLE_MAP = new Map(
  domains.map((domain) => [domain.id, domain.zh.title])
);

function toDisplayValue(value) {
  if (value == null) return '';

  if (Array.isArray(value)) {
    return value.map((item) => toDisplayValue(item)).join(' | ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function numberToColumnName(index) {
  let dividend = index;
  let columnName = '';

  while (dividend > 0) {
    const modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
}

function getColumnLetter(columns, key) {
  const index = columns.findIndex((column) => column.key === key);
  return numberToColumnName(index + 1);
}

function makeRange(letter, lastRow) {
  return `$${letter}$2:$${letter}$${Math.max(lastRow, 2)}`;
}

function buildAssessmentQuestionLookup() {
  const lookup = new Map();

  Object.entries(domainAssessments).forEach(([domainId, assessments]) => {
    ['preTest', 'postTest'].forEach((assessmentType) => {
      const assessment = assessments?.[assessmentType];
      const questions = assessment?.questions ?? [];

      questions.forEach((question, index) => {
        lookup.set(`${domainId}::${assessmentType}::${question.id}`, {
          domainTitle: DOMAIN_TITLE_MAP.get(domainId) ?? domainId,
          assessmentTitle: assessment?.zh?.title ?? assessment?.en?.title ?? assessmentType,
          questionOrder: index + 1,
          questionLabel: question.prompt?.zh ?? question.prompt?.en ?? question.id,
        });
      });
    });
  });

  return lookup;
}

function buildCaseQuestionLookup() {
  const lookup = new Map();

  caseIds.forEach((caseId) => {
    const caseData = getCase(caseId, 'zh');
    if (!caseData) return;

    const domainId = caseId.split('_')[0];
    const domainTitle = DOMAIN_TITLE_MAP.get(domainId) ?? domainId;

    caseData.preTest?.questions?.forEach((question, index) => {
      lookup.set(`${caseId}::preTest::${question.id}`, {
        domainTitle,
        caseTitle: caseData.title,
        stepLabel: 'Case Pre-test',
        questionOrder: index + 1,
        questionLabel: question.text ?? question.id,
      });
    });

    caseData.postTest?.questions?.forEach((question, index) => {
      lookup.set(`${caseId}::postTest::${question.id}`, {
        domainTitle,
        caseTitle: caseData.title,
        stepLabel: 'Case Post-test',
        questionOrder: index + 1,
        questionLabel: question.text ?? question.id,
      });
    });

    caseData.interactive?.questions?.forEach((question, index) => {
      lookup.set(`${caseId}::interactive::${question.id}`, {
        domainTitle,
        caseTitle: caseData.title,
        stepLabel: 'Interactive',
        questionOrder: index + 1,
        questionLabel: question.text ?? question.id,
      });
    });

    caseData.steps?.forEach((step, index) => {
      lookup.set(`${caseId}::step::${step.id ?? `step-${index + 1}`}`, {
        domainTitle,
        caseTitle: caseData.title,
        stepLabel: step.title ?? `Step ${index + 1}`,
        questionOrder: index + 1,
        questionLabel: step.question ?? step.title ?? `Step ${index + 1}`,
      });
    });
  });

  return lookup;
}

function buildUserMap(users = []) {
  return new Map(users.map((user) => [user.user_id, user]));
}

function buildDomainProgressRows(progress = [], usersById) {
  return progress.map((row) => {
    const user = usersById.get(row.user_id) ?? {};

    return {
      user_id: row.user_id,
      user_account: user.user_account ?? '',
      display_name: user.display_name ?? '',
      medical_role: user.medical_role ?? '',
      domain_id: row.domain_id,
      domain_title: DOMAIN_TITLE_MAP.get(row.domain_id) ?? row.domain_id ?? '',
      pretest_completed: row.pretest_completed,
      posttest_completed: row.posttest_completed,
      latest_pretest_score: row.latest_pretest_score,
      best_pretest_score: row.best_pretest_score,
      latest_posttest_score: row.latest_posttest_score,
      best_posttest_score: row.best_posttest_score,
      pretest_completed_at: row.pretest_completed_at ?? '',
      posttest_completed_at: row.posttest_completed_at ?? '',
    };
  });
}

function flattenAssessmentAttempts({ attempts, usersById, assessmentLookup }) {
  const attemptRows = [];
  const answerRows = [];

  (attempts ?? []).forEach((attempt) => {
    const user = usersById.get(attempt.user_id) ?? {};
    const steps = attempt.answers?.steps ?? [];
    const domainTitle = DOMAIN_TITLE_MAP.get(attempt.domain_id) ?? attempt.domain_id ?? '';
    const assessmentInfo = domainAssessments?.[attempt.domain_id]?.[attempt.assessment_type];
    const assessmentTitle = assessmentInfo?.zh?.title ?? assessmentInfo?.en?.title ?? attempt.assessment_type;

    attemptRows.push({
      attempt_id: attempt.id,
      attempt_source: 'domain_assessment',
      user_id: attempt.user_id,
      user_account: user.user_account ?? '',
      display_name: user.display_name ?? '',
      medical_role: user.medical_role ?? '',
      domain_id: attempt.domain_id,
      domain_title: domainTitle,
      assessment_type: attempt.assessment_type,
      assessment_title: assessmentTitle,
      score: attempt.score ?? '',
      started_at: attempt.started_at ?? '',
      completed_at: attempt.completed_at ?? '',
      duration_seconds: attempt.duration_seconds ?? '',
      created_at: attempt.created_at ?? '',
    });

    steps.forEach((step, index) => {
      if (!step || typeof step !== 'object') return;

      const lookup = assessmentLookup.get(`${attempt.domain_id}::${attempt.assessment_type}::${step.questionId}`) ?? {};

      answerRows.push({
        attempt_id: attempt.id,
        attempt_source: 'domain_assessment',
        user_id: attempt.user_id,
        user_account: user.user_account ?? '',
        display_name: user.display_name ?? '',
        medical_role: user.medical_role ?? '',
        domain_id: attempt.domain_id,
        domain_title: lookup.domainTitle ?? domainTitle,
        assessment_type: attempt.assessment_type,
        assessment_title: lookup.assessmentTitle ?? assessmentTitle,
        case_id: '',
        case_title: '',
        phase: 'assessment',
        step_order: 1,
        step_label: assessmentTitle,
        question_id: step.questionId ?? '',
        question_order: lookup.questionOrder ?? index + 1,
        question_label: lookup.questionLabel ?? step.questionId ?? '',
        selected_answer: toDisplayValue(
          step.selectedId
            ?? step.selectedIds
            ?? step.inputText
            ?? step.selectedText
            ?? ''
        ),
        correct_answer: toDisplayValue(step.correctId ?? step.correctIds ?? ''),
        is_correct: step.isCorrect ? 1 : 0,
        started_at: attempt.started_at ?? '',
        completed_at: attempt.completed_at ?? '',
        duration_seconds: attempt.duration_seconds ?? '',
      });
    });
  });

  return { attemptRows, answerRows };
}

function flattenCaseAttempts({ attempts, usersById, caseLookup }) {
  const attemptRows = [];
  const answerRows = [];

  (attempts ?? []).forEach((attempt) => {
    const user = usersById.get(attempt.user_id) ?? {};
    const steps = attempt.answers?.steps ?? [];
    const fallbackCase = getCase(attempt.case_id, 'zh');
    const domainTitle = DOMAIN_TITLE_MAP.get(attempt.domain) ?? attempt.domain ?? '';
    const caseTitle = attempt.answers?.caseMeta?.caseTitle ?? fallbackCase?.title ?? attempt.case_id;

    attemptRows.push({
      attempt_id: attempt.id,
      attempt_source: 'case',
      user_id: attempt.user_id,
      user_account: user.user_account ?? '',
      display_name: user.display_name ?? '',
      medical_role: user.medical_role ?? '',
      domain_id: attempt.domain,
      domain_title: domainTitle,
      case_id: attempt.case_id,
      case_title: caseTitle,
      language: attempt.language ?? '',
      score: attempt.interactive_score ?? '',
      started_at: attempt.started_at ?? '',
      completed_at: attempt.completed_at ?? '',
      duration_seconds: attempt.duration_seconds ?? '',
      status: attempt.status ?? '',
      created_at: attempt.created_at ?? '',
    });

    steps.forEach((step, index) => {
      if (!step || typeof step !== 'object') return;

      const phase = step.phase === 'interactive' ? 'interactive' : step.phase ?? 'step';
      const lookup = caseLookup.get(`${attempt.case_id}::${phase}::${step.questionId}`) ?? {};

      answerRows.push({
        attempt_id: attempt.id,
        attempt_source: 'case',
        user_id: attempt.user_id,
        user_account: user.user_account ?? '',
        display_name: user.display_name ?? '',
        medical_role: user.medical_role ?? '',
        domain_id: attempt.domain,
        domain_title: lookup.domainTitle ?? domainTitle,
        assessment_type: '',
        assessment_title: '',
        case_id: attempt.case_id,
        case_title: lookup.caseTitle ?? caseTitle,
        phase,
        step_order: (step.order ?? index) + 1,
        step_label: step.step ?? lookup.stepLabel ?? phase,
        question_id: step.questionId ?? '',
        question_order: lookup.questionOrder ?? (step.order ?? index) + 1,
        question_label: lookup.questionLabel ?? step.step ?? step.questionId ?? '',
        selected_answer: toDisplayValue(
          step.selectedId
            ?? step.selectedIds
            ?? step.inputText
            ?? step.selectedText
            ?? ''
        ),
        correct_answer: toDisplayValue(step.correctId ?? step.correctIds ?? ''),
        is_correct: step.isCorrect ? 1 : 0,
        started_at: attempt.started_at ?? '',
        completed_at: attempt.completed_at ?? '',
        duration_seconds: attempt.duration_seconds ?? '',
      });
    });
  });

  return { attemptRows, answerRows };
}

function styleSheet(worksheet, columns) {
  worksheet.columns = columns.map((column) => ({
    header: column.header,
    key: column.key,
    width: column.width ?? 18,
  }));

  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  worksheet.autoFilter = {
    from: 'A1',
    to: `${numberToColumnName(columns.length)}1`,
  };

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '5E8847' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
}

function addHeaderNotes(worksheet, columns) {
  columns.forEach((column, index) => {
    if (!column.note) return;
    worksheet.getCell(1, index + 1).note = column.note;
  });
}

function addRows(worksheet, rows, columns) {
  rows.forEach((row) => {
    const nextRow = {};
    columns.forEach((column) => {
      nextRow[column.key] = row[column.key] ?? '';
    });
    worksheet.addRow(nextRow);
  });
}

function addReadmeSheet(workbook) {
  const sheet = workbook.addWorksheet('README');
  sheet.columns = [
    { header: 'Sheet', key: 'sheet', width: 28 },
    { header: '說明', key: 'description', width: 96 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'DCEAD2' },
  };

  const rows = [
    ['users', '使用者主檔，包含 user_id、明文帳號、暱稱、職級與建立時間。'],
    ['domain_progress', '各使用者在耳科/鼻科/喉科的前後測最新分、最高分與完成時間彙總。'],
    ['assessment_attempts', '每一次前測/後測一列，保留 domain、測驗類型、分數、開始時間、完成時間與耗時。'],
    ['assessment_answers', '前後測逐題展平，每題一列，明確標示 domain、assessment、question。'],
    ['case_attempts', '每一次完成 case 一列，保留 case 分數、作答時間、語言與狀態。'],
    ['case_answers', 'case 逐題展平，每題一列，明確標示 domain、case、phase、step、question。'],
    ['user_summary', '每位使用者的整體作答次數、平均分數、整體正確率與總耗時；欄位使用 Excel 公式。'],
    ['user_question_accuracy', '每位使用者在每一題的作答次數、答對次數與正確率；欄位使用 Excel 公式。'],
    ['overall_summary', '所有使用者與各職級在每一題的作答次數、答對次數與正確率；欄位使用 Excel 公式。'],
  ];

  rows.forEach((row) => sheet.addRow(row));

  sheet.addRow([]);
  sheet.addRow(['備註', '這份 Excel 不放 raw answers_json，而是改成可直接統計的展平題目資料。']);
  sheet.addRow(['欄位註解', 'duration_seconds = 單次完整作答耗時（秒）；is_correct = 1 代表答對、0 代表答錯；question_order / step_order 方便排序。']);

  sheet.getCell('B12').note = '若要調整統計口徑，可直接修改 user_summary / user_question_accuracy / overall_summary 裡的公式。';
  sheet.views = [{ state: 'frozen', ySplit: 1 }];
}

function buildUserSummaryRows(users = []) {
  return users.map((user) => ({
    user_id: user.user_id,
    user_account: user.user_account ?? '',
    display_name: user.display_name ?? '',
    medical_role: user.medical_role ?? '',
  }));
}

function buildUserQuestionRows(assessmentAnswers, caseAnswers) {
  const uniqueRows = new Map();

  [...assessmentAnswers, ...caseAnswers].forEach((row) => {
    if (!row || typeof row !== 'object') return;

    const key = [
      row.user_id,
      row.attempt_source,
      row.domain_id,
      row.assessment_type || '',
      row.case_id || '',
      row.phase || '',
      row.question_id || '',
    ].join('::');

    if (!uniqueRows.has(key)) {
      uniqueRows.set(key, {
        user_id: row.user_id,
        user_account: row.user_account,
        display_name: row.display_name,
        medical_role: row.medical_role,
        attempt_source: row.attempt_source,
        domain_id: row.domain_id,
        domain_title: row.domain_title,
        assessment_type: row.assessment_type,
        assessment_title: row.assessment_title,
        case_id: row.case_id,
        case_title: row.case_title,
        phase: row.phase,
        step_label: row.step_label,
        question_id: row.question_id,
        question_order: row.question_order,
        question_label: row.question_label,
      });
    }
  });

  return Array.from(uniqueRows.values()).sort((left, right) => (
    left.user_account.localeCompare(right.user_account)
    || left.domain_id.localeCompare(right.domain_id)
    || (left.case_id || '').localeCompare(right.case_id || '')
    || (left.assessment_type || '').localeCompare(right.assessment_type || '')
    || left.question_order - right.question_order
  ));
}

function buildOverallSummaryRows(assessmentAnswers, caseAnswers, roles) {
  const uniqueQuestions = new Map();

  [...assessmentAnswers, ...caseAnswers].forEach((row) => {
    if (!row || typeof row !== 'object') return;

    const key = [
      row.attempt_source,
      row.domain_id,
      row.assessment_type || '',
      row.case_id || '',
      row.phase || '',
      row.question_id || '',
    ].join('::');

    if (!uniqueQuestions.has(key)) {
      uniqueQuestions.set(key, {
        attempt_source: row.attempt_source,
        domain_id: row.domain_id,
        domain_title: row.domain_title,
        assessment_type: row.assessment_type,
        assessment_title: row.assessment_title,
        case_id: row.case_id,
        case_title: row.case_title,
        phase: row.phase,
        step_label: row.step_label,
        question_id: row.question_id,
        question_order: row.question_order,
        question_label: row.question_label,
      });
    }
  });

  const questionRows = Array.from(uniqueQuestions.values()).sort((left, right) => (
    left.domain_id.localeCompare(right.domain_id)
    || (left.case_id || '').localeCompare(right.case_id || '')
    || (left.assessment_type || '').localeCompare(right.assessment_type || '')
    || left.question_order - right.question_order
  ));

  return questionRows.flatMap((row) => [
    { role_group: 'ALL', ...row },
    ...roles.map((role) => ({ role_group: role, ...row })),
  ]);
}

function buildAssessmentQuestionSummaryRows(assessmentAnswers = []) {
  const rows = new Map();

  assessmentAnswers.forEach((row) => {
    if (!row || typeof row !== 'object') return;

    const key = [
      row.domain_title || '',
      row.assessment_type || '',
      row.assessment_title || '',
      row.question_order || '',
    ].join('::');

    if (!rows.has(key)) {
      rows.set(key, {
        domain_title: row.domain_title,
        assessment_type: row.assessment_type,
        assessment_title: row.assessment_title,
        question_no: row.question_order,
      });
    }
  });

  return Array.from(rows.values()).sort((left, right) => (
    (left.domain_title || '').localeCompare(right.domain_title || '')
    || (left.assessment_type || '').localeCompare(right.assessment_type || '')
    || (left.question_no || 0) - (right.question_no || 0)
  ));
}

function buildCaseQuestionSummaryRows(caseAnswers = []) {
  const rows = new Map();

  caseAnswers.forEach((row) => {
    if (!row || typeof row !== 'object') return;
    if (row.phase === 'preTest' || row.phase === 'postTest') return;

    const key = [
      row.domain_id || '',
      row.domain_title || '',
      row.case_id || '',
      row.case_title || '',
      row.step_order || '',
    ].join('::');

    if (!rows.has(key)) {
      rows.set(key, {
        domain_id: row.domain_id,
        domain_title: row.domain_title,
        case_id: row.case_id,
        case_title: row.case_title,
        step_order: row.step_order,
      });
    }
  });

  return Array.from(rows.values()).sort((left, right) => (
    (left.domain_id || '').localeCompare(right.domain_id || '')
    || (left.case_id || '').localeCompare(right.case_id || '')
    || (left.step_order || 0) - (right.step_order || 0)
  ));
}

function addUserSummaryFormulas({
  worksheet,
  rows,
  assessmentAttemptColumns,
  caseAttemptColumns,
  assessmentAnswerColumns,
  caseAnswerColumns,
  assessmentAttemptLastRow,
  caseAttemptLastRow,
  assessmentAnswerLastRow,
  caseAnswerLastRow,
}) {
  const aaUser = makeRange(getColumnLetter(assessmentAttemptColumns, 'user_id'), assessmentAttemptLastRow);
  const aaType = makeRange(getColumnLetter(assessmentAttemptColumns, 'assessment_type'), assessmentAttemptLastRow);
  const aaScore = makeRange(getColumnLetter(assessmentAttemptColumns, 'score'), assessmentAttemptLastRow);
  const aaDuration = makeRange(getColumnLetter(assessmentAttemptColumns, 'duration_seconds'), assessmentAttemptLastRow);

  const caUser = makeRange(getColumnLetter(caseAttemptColumns, 'user_id'), caseAttemptLastRow);
  const caScore = makeRange(getColumnLetter(caseAttemptColumns, 'score'), caseAttemptLastRow);
  const caDuration = makeRange(getColumnLetter(caseAttemptColumns, 'duration_seconds'), caseAttemptLastRow);

  const asUser = makeRange(getColumnLetter(assessmentAnswerColumns, 'user_id'), assessmentAnswerLastRow);
  const asCorrect = makeRange(getColumnLetter(assessmentAnswerColumns, 'is_correct'), assessmentAnswerLastRow);

  const csUser = makeRange(getColumnLetter(caseAnswerColumns, 'user_id'), caseAnswerLastRow);
  const csCorrect = makeRange(getColumnLetter(caseAnswerColumns, 'is_correct'), caseAnswerLastRow);

  for (let rowIndex = 2; rowIndex <= rows.length + 1; rowIndex += 1) {
    const userIdRef = `$A${rowIndex}`;

    worksheet.getCell(`E${rowIndex}`).value = {
      formula: `COUNTIFS(assessment_attempts!${aaUser},${userIdRef},assessment_attempts!${aaType},"preTest")`,
    };
    worksheet.getCell(`F${rowIndex}`).value = {
      formula: `COUNTIFS(assessment_attempts!${aaUser},${userIdRef},assessment_attempts!${aaType},"postTest")`,
    };
    worksheet.getCell(`G${rowIndex}`).value = {
      formula: `COUNTIF(case_attempts!${caUser},${userIdRef})`,
    };
    worksheet.getCell(`H${rowIndex}`).value = {
      formula: `IFERROR(AVERAGEIF(assessment_attempts!${aaUser},${userIdRef},assessment_attempts!${aaScore}),"")`,
    };
    worksheet.getCell(`I${rowIndex}`).value = {
      formula: `IFERROR(AVERAGEIF(case_attempts!${caUser},${userIdRef},case_attempts!${caScore}),"")`,
    };
    worksheet.getCell(`J${rowIndex}`).value = {
      formula: `COUNTIF(assessment_answers!${asUser},${userIdRef})`,
    };
    worksheet.getCell(`K${rowIndex}`).value = {
      formula: `SUMIF(assessment_answers!${asUser},${userIdRef},assessment_answers!${asCorrect})`,
    };
    worksheet.getCell(`L${rowIndex}`).value = {
      formula: `IF(J${rowIndex}=0,"",K${rowIndex}/J${rowIndex})`,
    };
    worksheet.getCell(`M${rowIndex}`).value = {
      formula: `COUNTIF(case_answers!${csUser},${userIdRef})`,
    };
    worksheet.getCell(`N${rowIndex}`).value = {
      formula: `SUMIF(case_answers!${csUser},${userIdRef},case_answers!${csCorrect})`,
    };
    worksheet.getCell(`O${rowIndex}`).value = {
      formula: `IF(M${rowIndex}=0,"",N${rowIndex}/M${rowIndex})`,
    };
    worksheet.getCell(`P${rowIndex}`).value = {
      formula: `SUMIF(assessment_attempts!${aaUser},${userIdRef},assessment_attempts!${aaDuration})+SUMIF(case_attempts!${caUser},${userIdRef},case_attempts!${caDuration})`,
    };

    worksheet.getCell(`L${rowIndex}`).numFmt = '0.00%';
    worksheet.getCell(`O${rowIndex}`).numFmt = '0.00%';
  }
}

function addUserQuestionFormulas({
  worksheet,
  rows,
  assessmentAnswerColumns,
  caseAnswerColumns,
  assessmentAnswerLastRow,
  caseAnswerLastRow,
}) {
  const asUser = makeRange(getColumnLetter(assessmentAnswerColumns, 'user_id'), assessmentAnswerLastRow);
  const asDomain = makeRange(getColumnLetter(assessmentAnswerColumns, 'domain_id'), assessmentAnswerLastRow);
  const asType = makeRange(getColumnLetter(assessmentAnswerColumns, 'assessment_type'), assessmentAnswerLastRow);
  const asQuestion = makeRange(getColumnLetter(assessmentAnswerColumns, 'question_id'), assessmentAnswerLastRow);
  const asCorrect = makeRange(getColumnLetter(assessmentAnswerColumns, 'is_correct'), assessmentAnswerLastRow);

  const csUser = makeRange(getColumnLetter(caseAnswerColumns, 'user_id'), caseAnswerLastRow);
  const csDomain = makeRange(getColumnLetter(caseAnswerColumns, 'domain_id'), caseAnswerLastRow);
  const csCase = makeRange(getColumnLetter(caseAnswerColumns, 'case_id'), caseAnswerLastRow);
  const csPhase = makeRange(getColumnLetter(caseAnswerColumns, 'phase'), caseAnswerLastRow);
  const csQuestion = makeRange(getColumnLetter(caseAnswerColumns, 'question_id'), caseAnswerLastRow);
  const csCorrect = makeRange(getColumnLetter(caseAnswerColumns, 'is_correct'), caseAnswerLastRow);

  for (let rowIndex = 2; rowIndex <= rows.length + 1; rowIndex += 1) {
    const sourceRef = `$E${rowIndex}`;
    const userRef = `$A${rowIndex}`;
    const domainRef = `$F${rowIndex}`;
    const typeRef = `$H${rowIndex}`;
    const caseRef = `$J${rowIndex}`;
    const phaseRef = `$L${rowIndex}`;
    const questionRef = `$N${rowIndex}`;

    worksheet.getCell(`Q${rowIndex}`).value = {
      formula: `IF(${sourceRef}="domain_assessment",COUNTIFS(assessment_answers!${asUser},${userRef},assessment_answers!${asDomain},${domainRef},assessment_answers!${asType},${typeRef},assessment_answers!${asQuestion},${questionRef}),COUNTIFS(case_answers!${csUser},${userRef},case_answers!${csDomain},${domainRef},case_answers!${csCase},${caseRef},case_answers!${csPhase},${phaseRef},case_answers!${csQuestion},${questionRef}))`,
    };
    worksheet.getCell(`R${rowIndex}`).value = {
      formula: `IF(${sourceRef}="domain_assessment",SUMIFS(assessment_answers!${asCorrect},assessment_answers!${asUser},${userRef},assessment_answers!${asDomain},${domainRef},assessment_answers!${asType},${typeRef},assessment_answers!${asQuestion},${questionRef}),SUMIFS(case_answers!${csCorrect},case_answers!${csUser},${userRef},case_answers!${csDomain},${domainRef},case_answers!${csCase},${caseRef},case_answers!${csPhase},${phaseRef},case_answers!${csQuestion},${questionRef}))`,
    };
    worksheet.getCell(`S${rowIndex}`).value = {
      formula: `IF(Q${rowIndex}=0,"",R${rowIndex}/Q${rowIndex})`,
    };

    worksheet.getCell(`S${rowIndex}`).numFmt = '0.00%';
  }
}

function addOverallSummaryFormulas({
  worksheet,
  rows,
  assessmentAnswerColumns,
  caseAnswerColumns,
  assessmentAnswerLastRow,
  caseAnswerLastRow,
}) {
  const asRole = makeRange(getColumnLetter(assessmentAnswerColumns, 'medical_role'), assessmentAnswerLastRow);
  const asDomain = makeRange(getColumnLetter(assessmentAnswerColumns, 'domain_id'), assessmentAnswerLastRow);
  const asType = makeRange(getColumnLetter(assessmentAnswerColumns, 'assessment_type'), assessmentAnswerLastRow);
  const asQuestion = makeRange(getColumnLetter(assessmentAnswerColumns, 'question_id'), assessmentAnswerLastRow);
  const asCorrect = makeRange(getColumnLetter(assessmentAnswerColumns, 'is_correct'), assessmentAnswerLastRow);

  const csRole = makeRange(getColumnLetter(caseAnswerColumns, 'medical_role'), caseAnswerLastRow);
  const csDomain = makeRange(getColumnLetter(caseAnswerColumns, 'domain_id'), caseAnswerLastRow);
  const csCase = makeRange(getColumnLetter(caseAnswerColumns, 'case_id'), caseAnswerLastRow);
  const csPhase = makeRange(getColumnLetter(caseAnswerColumns, 'phase'), caseAnswerLastRow);
  const csQuestion = makeRange(getColumnLetter(caseAnswerColumns, 'question_id'), caseAnswerLastRow);
  const csCorrect = makeRange(getColumnLetter(caseAnswerColumns, 'is_correct'), caseAnswerLastRow);

  for (let rowIndex = 2; rowIndex <= rows.length + 1; rowIndex += 1) {
    const roleRef = `$A${rowIndex}`;
    const sourceRef = `$B${rowIndex}`;
    const domainRef = `$C${rowIndex}`;
    const typeRef = `$E${rowIndex}`;
    const caseRef = `$G${rowIndex}`;
    const phaseRef = `$I${rowIndex}`;
    const questionRef = `$K${rowIndex}`;

    const assessmentCount = `IF(${roleRef}="ALL",COUNTIFS(assessment_answers!${asDomain},${domainRef},assessment_answers!${asType},${typeRef},assessment_answers!${asQuestion},${questionRef}),COUNTIFS(assessment_answers!${asRole},${roleRef},assessment_answers!${asDomain},${domainRef},assessment_answers!${asType},${typeRef},assessment_answers!${asQuestion},${questionRef}))`;
    const assessmentCorrect = `IF(${roleRef}="ALL",SUMIFS(assessment_answers!${asCorrect},assessment_answers!${asDomain},${domainRef},assessment_answers!${asType},${typeRef},assessment_answers!${asQuestion},${questionRef}),SUMIFS(assessment_answers!${asCorrect},assessment_answers!${asRole},${roleRef},assessment_answers!${asDomain},${domainRef},assessment_answers!${asType},${typeRef},assessment_answers!${asQuestion},${questionRef}))`;
    const caseCount = `IF(${roleRef}="ALL",COUNTIFS(case_answers!${csDomain},${domainRef},case_answers!${csCase},${caseRef},case_answers!${csPhase},${phaseRef},case_answers!${csQuestion},${questionRef}),COUNTIFS(case_answers!${csRole},${roleRef},case_answers!${csDomain},${domainRef},case_answers!${csCase},${caseRef},case_answers!${csPhase},${phaseRef},case_answers!${csQuestion},${questionRef}))`;
    const caseCorrect = `IF(${roleRef}="ALL",SUMIFS(case_answers!${csCorrect},case_answers!${csDomain},${domainRef},case_answers!${csCase},${caseRef},case_answers!${csPhase},${phaseRef},case_answers!${csQuestion},${questionRef}),SUMIFS(case_answers!${csCorrect},case_answers!${csRole},${roleRef},case_answers!${csDomain},${domainRef},case_answers!${csCase},${caseRef},case_answers!${csPhase},${phaseRef},case_answers!${csQuestion},${questionRef}))`;

    worksheet.getCell(`N${rowIndex}`).value = {
      formula: `IF(${sourceRef}="domain_assessment",${assessmentCount},${caseCount})`,
    };
    worksheet.getCell(`O${rowIndex}`).value = {
      formula: `IF(${sourceRef}="domain_assessment",${assessmentCorrect},${caseCorrect})`,
    };
    worksheet.getCell(`P${rowIndex}`).value = {
      formula: `IF(N${rowIndex}=0,"",O${rowIndex}/N${rowIndex})`,
    };

    worksheet.getCell(`P${rowIndex}`).numFmt = '0.00%';
  }
}

function addUserPerformanceSheet({
  workbook,
  users,
  assessmentAttemptColumns,
  assessmentAttemptLastRow,
}) {
  const sheet = workbook.addWorksheet('user_performance');
  const columns = [
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'pre-test average score', key: 'pre_avg_score', width: 18, note: 'Excel 公式：該使用者前測平均分數。' },
    { header: 'pre-test average time cost', key: 'pre_avg_time', width: 20, note: 'Excel 公式：該使用者前測平均耗時（秒）。' },
    { header: 'pre-test repeated times', key: 'pre_times', width: 18, note: 'Excel 公式：該使用者前測作答次數。' },
    { header: 'post-test average score', key: 'post_avg_score', width: 18, note: 'Excel 公式：該使用者後測平均分數。' },
    { header: 'post-test average time cost', key: 'post_avg_time', width: 20, note: 'Excel 公式：該使用者後測平均耗時（秒）。' },
    { header: 'post-test repeated times', key: 'post_times', width: 18, note: 'Excel 公式：該使用者後測作答次數。' },
  ];

  styleSheet(sheet, columns);
  addHeaderNotes(sheet, columns);
  addRows(
    sheet,
    users.map((user) => ({
      user_id: user.user_id,
      display_name: user.display_name ?? '',
      medical_role: user.medical_role ?? '',
    })),
    columns
  );

  const aaUser = makeRange(getColumnLetter(assessmentAttemptColumns, 'user_id'), assessmentAttemptLastRow);
  const aaType = makeRange(getColumnLetter(assessmentAttemptColumns, 'assessment_type'), assessmentAttemptLastRow);
  const aaScore = makeRange(getColumnLetter(assessmentAttemptColumns, 'score'), assessmentAttemptLastRow);
  const aaDuration = makeRange(getColumnLetter(assessmentAttemptColumns, 'duration_seconds'), assessmentAttemptLastRow);

  for (let rowIndex = 2; rowIndex <= users.length + 1; rowIndex += 1) {
    const userRef = `$A${rowIndex}`;

    sheet.getCell(`D${rowIndex}`).value = {
      formula: `IFERROR(AVERAGEIFS(assessment_attempts!${aaScore},assessment_attempts!${aaUser},${userRef},assessment_attempts!${aaType},"preTest"),"")`,
    };
    sheet.getCell(`E${rowIndex}`).value = {
      formula: `IFERROR(AVERAGEIFS(assessment_attempts!${aaDuration},assessment_attempts!${aaUser},${userRef},assessment_attempts!${aaType},"preTest"),"")`,
    };
    sheet.getCell(`F${rowIndex}`).value = {
      formula: `COUNTIFS(assessment_attempts!${aaUser},${userRef},assessment_attempts!${aaType},"preTest")`,
    };
    sheet.getCell(`G${rowIndex}`).value = {
      formula: `IFERROR(AVERAGEIFS(assessment_attempts!${aaScore},assessment_attempts!${aaUser},${userRef},assessment_attempts!${aaType},"postTest"),"")`,
    };
    sheet.getCell(`H${rowIndex}`).value = {
      formula: `IFERROR(AVERAGEIFS(assessment_attempts!${aaDuration},assessment_attempts!${aaUser},${userRef},assessment_attempts!${aaType},"postTest"),"")`,
    };
    sheet.getCell(`I${rowIndex}`).value = {
      formula: `COUNTIFS(assessment_attempts!${aaUser},${userRef},assessment_attempts!${aaType},"postTest")`,
    };
  }
}

function addQuestionAssessmentSheet({
  workbook,
  assessmentSummaryRows,
  caseSummaryRows,
  assessmentAnswerColumns,
  caseAnswerColumns,
  assessmentAnswerLastRow,
  caseAnswerLastRow,
}) {
  const sheet = workbook.addWorksheet('question_assessment');

  sheet.mergeCells('A1:E1');
  sheet.mergeCells('H1:M1');
  sheet.getCell('A1').value = 'assessment_attempts';
  sheet.getCell('H1').value = 'case_attempts';

  ['A1', 'H1'].forEach((cellRef) => {
    const cell = sheet.getCell(cellRef);
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '5E8847' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
  });

  const assessmentHeaders = [
    { cell: 'A2', value: 'domain_title', note: 'domain 中文名稱。' },
    { cell: 'B2', value: 'assessment_type', note: 'preTest / postTest。' },
    { cell: 'C2', value: 'assessment_title', note: '前測/後測標題。' },
    { cell: 'D2', value: 'question_no.', note: '題目順序。' },
    { cell: 'E2', value: 'correct_rate', note: 'Excel 公式：全體使用者在此前後測題目的總正確率。' },
  ];

  const caseHeaders = [
    { cell: 'H2', value: 'domain_id', note: 'ear / nose / throat。' },
    { cell: 'I2', value: 'domain_title', note: 'domain 中文名稱。' },
    { cell: 'J2', value: 'case_id', note: 'case 唯一識別碼。' },
    { cell: 'K2', value: 'case_title', note: 'case 標題。' },
    { cell: 'L2', value: 'step_order', note: 'step 在該 case 中的順序。' },
    { cell: 'M2', value: 'correct_rate', note: 'Excel 公式：全體使用者在此 case step 的總正確率。' },
  ];

  [...assessmentHeaders, ...caseHeaders].forEach(({ cell, value, note }) => {
    sheet.getCell(cell).value = value;
    sheet.getCell(cell).font = { bold: true };
    sheet.getCell(cell).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'DCEAD2' },
    };
    sheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    if (note) {
      sheet.getCell(cell).note = note;
    }
  });

  const totalRows = Math.max(assessmentSummaryRows.length, caseSummaryRows.length);

  for (let index = 0; index < totalRows; index += 1) {
    const rowNumber = index + 3;
    const assessmentRow = assessmentSummaryRows[index];
    const caseRow = caseSummaryRows[index];

    if (assessmentRow) {
      sheet.getCell(`A${rowNumber}`).value = assessmentRow.domain_title ?? '';
      sheet.getCell(`B${rowNumber}`).value = assessmentRow.assessment_type ?? '';
      sheet.getCell(`C${rowNumber}`).value = assessmentRow.assessment_title ?? '';
      sheet.getCell(`D${rowNumber}`).value = assessmentRow.question_no ?? '';
    }

    if (caseRow) {
      sheet.getCell(`H${rowNumber}`).value = caseRow.domain_id ?? '';
      sheet.getCell(`I${rowNumber}`).value = caseRow.domain_title ?? '';
      sheet.getCell(`J${rowNumber}`).value = caseRow.case_id ?? '';
      sheet.getCell(`K${rowNumber}`).value = caseRow.case_title ?? '';
      sheet.getCell(`L${rowNumber}`).value = caseRow.step_order ?? '';
    }
  }

  sheet.columns = [
    { key: 'A', width: 16 },
    { key: 'B', width: 16 },
    { key: 'C', width: 22 },
    { key: 'D', width: 12 },
    { key: 'E', width: 14 },
    { key: 'F', width: 3 },
    { key: 'G', width: 3 },
    { key: 'H', width: 12 },
    { key: 'I', width: 16 },
    { key: 'J', width: 28 },
    { key: 'K', width: 28 },
    { key: 'L', width: 12 },
    { key: 'M', width: 14 },
  ];
  sheet.views = [{ state: 'frozen', ySplit: 2 }];

  const asDomainTitle = makeRange(getColumnLetter(assessmentAnswerColumns, 'domain_title'), assessmentAnswerLastRow);
  const asType = makeRange(getColumnLetter(assessmentAnswerColumns, 'assessment_type'), assessmentAnswerLastRow);
  const asTitle = makeRange(getColumnLetter(assessmentAnswerColumns, 'assessment_title'), assessmentAnswerLastRow);
  const asQuestionOrder = makeRange(getColumnLetter(assessmentAnswerColumns, 'question_order'), assessmentAnswerLastRow);
  const asCorrect = makeRange(getColumnLetter(assessmentAnswerColumns, 'is_correct'), assessmentAnswerLastRow);

  const csDomainId = makeRange(getColumnLetter(caseAnswerColumns, 'domain_id'), caseAnswerLastRow);
  const csCaseId = makeRange(getColumnLetter(caseAnswerColumns, 'case_id'), caseAnswerLastRow);
  const csPhase = makeRange(getColumnLetter(caseAnswerColumns, 'phase'), caseAnswerLastRow);
  const csStepOrder = makeRange(getColumnLetter(caseAnswerColumns, 'step_order'), caseAnswerLastRow);
  const csCorrect = makeRange(getColumnLetter(caseAnswerColumns, 'is_correct'), caseAnswerLastRow);

  for (let index = 0; index < totalRows; index += 1) {
    const rowNumber = index + 3;

    if (assessmentSummaryRows[index]) {
      sheet.getCell(`E${rowNumber}`).value = {
        formula: `IFERROR(SUMIFS(assessment_answers!${asCorrect},assessment_answers!${asDomainTitle},A${rowNumber},assessment_answers!${asType},B${rowNumber},assessment_answers!${asTitle},C${rowNumber},assessment_answers!${asQuestionOrder},D${rowNumber})/COUNTIFS(assessment_answers!${asDomainTitle},A${rowNumber},assessment_answers!${asType},B${rowNumber},assessment_answers!${asTitle},C${rowNumber},assessment_answers!${asQuestionOrder},D${rowNumber}),"")`,
      };
      sheet.getCell(`E${rowNumber}`).numFmt = '0.00%';
    }

    if (caseSummaryRows[index]) {
      sheet.getCell(`M${rowNumber}`).value = {
        formula: `IFERROR(SUMPRODUCT((case_answers!${csDomainId}=H${rowNumber})*(case_answers!${csCaseId}=J${rowNumber})*(case_answers!${csStepOrder}=L${rowNumber})*(case_answers!${csPhase}<>"preTest")*(case_answers!${csPhase}<>"postTest"),case_answers!${csCorrect})/SUMPRODUCT((case_answers!${csDomainId}=H${rowNumber})*(case_answers!${csCaseId}=J${rowNumber})*(case_answers!${csStepOrder}=L${rowNumber})*(case_answers!${csPhase}<>"preTest")*(case_answers!${csPhase}<>"postTest")),"")`,
      };
      sheet.getCell(`M${rowNumber}`).numFmt = '0.00%';
    }
  }
}

function downloadBuffer(buffer, fileName) {
  const blob = new Blob(
    [buffer],
    {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
  );
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function createStatisticsWorkbook({
  users = [],
  domainProgress = [],
  assessmentAttempts = [],
  caseAttempts = [],
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Codex';
  workbook.created = new Date();
  workbook.modified = new Date();

  const usersById = buildUserMap(users);
  const assessmentLookup = buildAssessmentQuestionLookup();
  const caseLookup = buildCaseQuestionLookup();
  const domainProgressRows = buildDomainProgressRows(domainProgress, usersById);
  const { attemptRows: assessmentAttemptRows, answerRows: assessmentAnswerRows } = flattenAssessmentAttempts({
    attempts: assessmentAttempts,
    usersById,
    assessmentLookup,
  });
  const { attemptRows: caseAttemptRows, answerRows: caseAnswerRows } = flattenCaseAttempts({
    attempts: caseAttempts,
    usersById,
    caseLookup,
  });
  const roles = Array.from(new Set(users.map((user) => user.medical_role).filter(Boolean)));
  const assessmentSummaryRows = buildAssessmentQuestionSummaryRows(assessmentAnswerRows);
  const caseSummaryRows = buildCaseQuestionSummaryRows(caseAnswerRows);

  addReadmeSheet(workbook);

  const usersSheet = workbook.addWorksheet('users');
  const userColumns = [
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號，通常是 email。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '使用者暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'isAdmin', key: 'isAdmin', width: 10, note: '是否為管理員。' },
    { header: 'created_at', key: 'created_at', width: 24, note: '帳號建立時間。' },
  ];
  styleSheet(usersSheet, userColumns);
  addHeaderNotes(usersSheet, userColumns);
  addRows(usersSheet, users, userColumns);

  const domainProgressSheet = workbook.addWorksheet('domain_progress');
  const domainProgressColumns = [
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'domain_id', key: 'domain_id', width: 12, note: 'ear / nose / throat。' },
    { header: 'domain_title', key: 'domain_title', width: 14, note: 'domain 中文名稱。' },
    { header: 'pretest_completed', key: 'pretest_completed', width: 16, note: '是否完成前測。' },
    { header: 'posttest_completed', key: 'posttest_completed', width: 16, note: '是否完成後測。' },
    { header: 'latest_pretest_score', key: 'latest_pretest_score', width: 18, note: '目前最新前測分數。' },
    { header: 'best_pretest_score', key: 'best_pretest_score', width: 16, note: '目前最高前測分數。' },
    { header: 'latest_posttest_score', key: 'latest_posttest_score', width: 18, note: '目前最新後測分數。' },
    { header: 'best_posttest_score', key: 'best_posttest_score', width: 16, note: '目前最高後測分數。' },
    { header: 'pretest_completed_at', key: 'pretest_completed_at', width: 24, note: '最新前測完成時間。' },
    { header: 'posttest_completed_at', key: 'posttest_completed_at', width: 24, note: '最新後測完成時間。' },
  ];
  styleSheet(domainProgressSheet, domainProgressColumns);
  addHeaderNotes(domainProgressSheet, domainProgressColumns);
  addRows(domainProgressSheet, domainProgressRows, domainProgressColumns);

  const assessmentAttemptsSheet = workbook.addWorksheet('assessment_attempts');
  const assessmentAttemptColumns = [
    { header: 'attempt_id', key: 'attempt_id', width: 12, note: '單次前測/後測作答識別碼。' },
    { header: 'attempt_source', key: 'attempt_source', width: 18, note: '固定為 domain_assessment。' },
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'domain_id', key: 'domain_id', width: 12, note: 'ear / nose / throat。' },
    { header: 'domain_title', key: 'domain_title', width: 14, note: 'domain 中文名稱。' },
    { header: 'assessment_type', key: 'assessment_type', width: 14, note: 'preTest / postTest。' },
    { header: 'assessment_title', key: 'assessment_title', width: 18, note: '前測/後測標題。' },
    { header: 'score', key: 'score', width: 10, note: '本次前/後測分數。' },
    { header: 'started_at', key: 'started_at', width: 24, note: '本次作答開始時間。' },
    { header: 'completed_at', key: 'completed_at', width: 24, note: '本次作答完成時間。' },
    { header: 'duration_seconds', key: 'duration_seconds', width: 16, note: '本次完整作答耗時（秒）。' },
    { header: 'created_at', key: 'created_at', width: 24, note: '資料建立時間。' },
  ];
  styleSheet(assessmentAttemptsSheet, assessmentAttemptColumns);
  addHeaderNotes(assessmentAttemptsSheet, assessmentAttemptColumns);
  addRows(assessmentAttemptsSheet, assessmentAttemptRows, assessmentAttemptColumns);

  addUserPerformanceSheet({
    workbook,
    users,
    assessmentAttemptColumns,
    assessmentAttemptLastRow: assessmentAttemptRows.length + 1,
  });

  const assessmentAnswersSheet = workbook.addWorksheet('assessment_answers');
  const assessmentAnswerColumns = [
    { header: 'attempt_id', key: 'attempt_id', width: 12, note: '對應 assessment_attempts 的 attempt_id。' },
    { header: 'attempt_source', key: 'attempt_source', width: 18, note: '固定為 domain_assessment。' },
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'domain_id', key: 'domain_id', width: 12, note: 'ear / nose / throat。' },
    { header: 'domain_title', key: 'domain_title', width: 14, note: 'domain 中文名稱。' },
    { header: 'assessment_type', key: 'assessment_type', width: 14, note: 'preTest / postTest。' },
    { header: 'assessment_title', key: 'assessment_title', width: 18, note: '前測/後測標題。' },
    { header: 'phase', key: 'phase', width: 14, note: '固定為 assessment。' },
    { header: 'step_label', key: 'step_label', width: 18, note: 'assessment 標籤。' },
    { header: 'question_id', key: 'question_id', width: 18, note: '題目唯一識別碼。' },
    { header: 'question_order', key: 'question_order', width: 14, note: '題目在該測驗內的順序。' },
    { header: 'question_label', key: 'question_label', width: 46, note: '題目文字。' },
    { header: 'selected_answer', key: 'selected_answer', width: 18, note: '該次作答選擇。' },
    { header: 'correct_answer', key: 'correct_answer', width: 18, note: '標準答案。' },
    { header: 'is_correct', key: 'is_correct', width: 10, note: '1 代表答對，0 代表答錯。' },
    { header: 'started_at', key: 'started_at', width: 24, note: '本次作答開始時間。' },
    { header: 'completed_at', key: 'completed_at', width: 24, note: '本次作答完成時間。' },
    { header: 'duration_seconds', key: 'duration_seconds', width: 16, note: '本次完整作答耗時（秒）。' },
  ];
  styleSheet(assessmentAnswersSheet, assessmentAnswerColumns);
  addHeaderNotes(assessmentAnswersSheet, assessmentAnswerColumns);
  addRows(assessmentAnswersSheet, assessmentAnswerRows, assessmentAnswerColumns);

  const caseAttemptsSheet = workbook.addWorksheet('case_attempts');
  const caseAttemptColumns = [
    { header: 'attempt_id', key: 'attempt_id', width: 12, note: '單次 case 作答識別碼。' },
    { header: 'attempt_source', key: 'attempt_source', width: 12, note: '固定為 case。' },
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'domain_id', key: 'domain_id', width: 12, note: 'ear / nose / throat。' },
    { header: 'domain_title', key: 'domain_title', width: 14, note: 'domain 中文名稱。' },
    { header: 'case_id', key: 'case_id', width: 28, note: 'case 唯一識別碼。' },
    { header: 'case_title', key: 'case_title', width: 28, note: 'case 標題。' },
    { header: 'language', key: 'language', width: 10, note: '該次記錄的語言。' },
    { header: 'score', key: 'score', width: 10, note: '本次 case 分數。' },
    { header: 'started_at', key: 'started_at', width: 24, note: '本次作答開始時間。' },
    { header: 'completed_at', key: 'completed_at', width: 24, note: '本次作答完成時間。' },
    { header: 'duration_seconds', key: 'duration_seconds', width: 16, note: '本次完整作答耗時（秒）。' },
    { header: 'status', key: 'status', width: 12, note: '目前應為 completed。' },
    { header: 'created_at', key: 'created_at', width: 24, note: '資料建立時間。' },
  ];
  styleSheet(caseAttemptsSheet, caseAttemptColumns);
  addHeaderNotes(caseAttemptsSheet, caseAttemptColumns);
  addRows(caseAttemptsSheet, caseAttemptRows, caseAttemptColumns);

  const caseAnswersSheet = workbook.addWorksheet('case_answers');
  const caseAnswerColumns = [
    { header: 'attempt_id', key: 'attempt_id', width: 12, note: '對應 case_attempts 的 attempt_id。' },
    { header: 'attempt_source', key: 'attempt_source', width: 12, note: '固定為 case。' },
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'domain_id', key: 'domain_id', width: 12, note: 'ear / nose / throat。' },
    { header: 'domain_title', key: 'domain_title', width: 14, note: 'domain 中文名稱。' },
    { header: 'assessment_type', key: 'assessment_type', width: 14, note: '只有舊版 phase flow 才可能出現 preTest / postTest。' },
    { header: 'assessment_title', key: 'assessment_title', width: 18, note: 'case 匯出通常留空。' },
    { header: 'case_id', key: 'case_id', width: 28, note: 'case 唯一識別碼。' },
    { header: 'case_title', key: 'case_title', width: 28, note: 'case 標題。' },
    { header: 'phase', key: 'phase', width: 14, note: 'preTest / interactive / postTest / step。' },
    { header: 'step_order', key: 'step_order', width: 12, note: 'step 在該 case 中的順序。' },
    { header: 'step_label', key: 'step_label', width: 20, note: '明確標示是哪個 step。' },
    { header: 'question_id', key: 'question_id', width: 18, note: '題目唯一識別碼。' },
    { header: 'question_order', key: 'question_order', width: 14, note: '題目順序。' },
    { header: 'question_label', key: 'question_label', width: 46, note: '題目文字或 step 問題文字。' },
    { header: 'selected_answer', key: 'selected_answer', width: 20, note: '該次作答選擇。' },
    { header: 'correct_answer', key: 'correct_answer', width: 18, note: '標準答案。' },
    { header: 'is_correct', key: 'is_correct', width: 10, note: '1 代表答對，0 代表答錯。' },
    { header: 'started_at', key: 'started_at', width: 24, note: '本次作答開始時間。' },
    { header: 'completed_at', key: 'completed_at', width: 24, note: '本次作答完成時間。' },
    { header: 'duration_seconds', key: 'duration_seconds', width: 16, note: '本次完整作答耗時（秒）。' },
  ];
  styleSheet(caseAnswersSheet, caseAnswerColumns);
  addHeaderNotes(caseAnswersSheet, caseAnswerColumns);
  addRows(caseAnswersSheet, caseAnswerRows, caseAnswerColumns);

  addQuestionAssessmentSheet({
    workbook,
    assessmentSummaryRows,
    caseSummaryRows,
    assessmentAnswerColumns,
    caseAnswerColumns,
    assessmentAnswerLastRow: assessmentAnswerRows.length + 1,
    caseAnswerLastRow: caseAnswerRows.length + 1,
  });

  const userSummarySheet = workbook.addWorksheet('user_summary');
  const userSummaryColumns = [
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'pretest_attempts', key: 'pretest_attempts', width: 14, note: 'Excel 公式：前測作答次數。' },
    { header: 'posttest_attempts', key: 'posttest_attempts', width: 14, note: 'Excel 公式：後測作答次數。' },
    { header: 'case_attempts', key: 'case_attempts', width: 14, note: 'Excel 公式：完成 case 次數。' },
    { header: 'assessment_avg_score', key: 'assessment_avg_score', width: 16, note: 'Excel 公式：前/後測平均分數。' },
    { header: 'case_avg_score', key: 'case_avg_score', width: 14, note: 'Excel 公式：case 平均分數。' },
    { header: 'assessment_answer_count', key: 'assessment_answer_count', width: 18, note: 'Excel 公式：前/後測總答題數。' },
    { header: 'assessment_correct_count', key: 'assessment_correct_count', width: 18, note: 'Excel 公式：前/後測總答對數。' },
    { header: 'assessment_correct_rate', key: 'assessment_correct_rate', width: 18, note: 'Excel 公式：前/後測整體正確率。' },
    { header: 'case_answer_count', key: 'case_answer_count', width: 14, note: 'Excel 公式：case 總答題數。' },
    { header: 'case_correct_count', key: 'case_correct_count', width: 16, note: 'Excel 公式：case 總答對數。' },
    { header: 'case_correct_rate', key: 'case_correct_rate', width: 14, note: 'Excel 公式：case 整體正確率。' },
    { header: 'total_duration_seconds', key: 'total_duration_seconds', width: 18, note: 'Excel 公式：前/後測與 case 累計耗時。' },
  ];
  styleSheet(userSummarySheet, userSummaryColumns);
  addHeaderNotes(userSummarySheet, userSummaryColumns);
  const userSummaryRows = buildUserSummaryRows(users);
  addRows(userSummarySheet, userSummaryRows, userSummaryColumns);
  addUserSummaryFormulas({
    worksheet: userSummarySheet,
    rows: userSummaryRows,
    assessmentAttemptColumns,
    caseAttemptColumns,
    assessmentAnswerColumns,
    caseAnswerColumns,
    assessmentAttemptLastRow: assessmentAttemptRows.length + 1,
    caseAttemptLastRow: caseAttemptRows.length + 1,
    assessmentAnswerLastRow: assessmentAnswerRows.length + 1,
    caseAnswerLastRow: caseAnswerRows.length + 1,
  });

  const userQuestionSheet = workbook.addWorksheet('user_question_accuracy');
  const userQuestionColumns = [
    { header: 'user_id', key: 'user_id', width: 38, note: '使用者唯一識別碼。' },
    { header: 'user_account', key: 'user_account', width: 28, note: '明文帳號。' },
    { header: 'display_name', key: 'display_name', width: 18, note: '暱稱/姓名。' },
    { header: 'medical_role', key: 'medical_role', width: 14, note: '職級。' },
    { header: 'attempt_source', key: 'attempt_source', width: 18, note: 'domain_assessment 或 case。' },
    { header: 'domain_id', key: 'domain_id', width: 12, note: 'ear / nose / throat。' },
    { header: 'domain_title', key: 'domain_title', width: 14, note: 'domain 中文名稱。' },
    { header: 'assessment_type', key: 'assessment_type', width: 14, note: 'preTest / postTest；case 列可能留空。' },
    { header: 'assessment_title', key: 'assessment_title', width: 18, note: '前/後測標題。' },
    { header: 'case_id', key: 'case_id', width: 28, note: 'case 唯一識別碼。' },
    { header: 'case_title', key: 'case_title', width: 28, note: 'case 標題。' },
    { header: 'phase', key: 'phase', width: 14, note: 'assessment / preTest / interactive / postTest / step。' },
    { header: 'step_label', key: 'step_label', width: 20, note: '明確標示是哪個 step。' },
    { header: 'question_id', key: 'question_id', width: 18, note: '題目唯一識別碼。' },
    { header: 'question_order', key: 'question_order', width: 14, note: '題目順序。' },
    { header: 'question_label', key: 'question_label', width: 46, note: '題目文字或 step 問題文字。' },
    { header: 'attempt_count', key: 'attempt_count', width: 14, note: 'Excel 公式：該使用者此題總作答次數。' },
    { header: 'correct_count', key: 'correct_count', width: 14, note: 'Excel 公式：該使用者此題答對次數。' },
    { header: 'correct_rate', key: 'correct_rate', width: 14, note: 'Excel 公式：答對次數 / 作答次數。' },
  ];
  styleSheet(userQuestionSheet, userQuestionColumns);
  addHeaderNotes(userQuestionSheet, userQuestionColumns);
  const userQuestionRows = buildUserQuestionRows(assessmentAnswerRows, caseAnswerRows);
  addRows(userQuestionSheet, userQuestionRows, userQuestionColumns);
  addUserQuestionFormulas({
    worksheet: userQuestionSheet,
    rows: userQuestionRows,
    assessmentAnswerColumns,
    caseAnswerColumns,
    assessmentAnswerLastRow: assessmentAnswerRows.length + 1,
    caseAnswerLastRow: caseAnswerRows.length + 1,
  });

  const overallSummarySheet = workbook.addWorksheet('overall_summary');
  const overallSummaryColumns = [
    { header: 'role_group', key: 'role_group', width: 16, note: 'ALL 代表全體；其餘為各職級。' },
    { header: 'attempt_source', key: 'attempt_source', width: 18, note: 'domain_assessment 或 case。' },
    { header: 'domain_id', key: 'domain_id', width: 12, note: 'ear / nose / throat。' },
    { header: 'domain_title', key: 'domain_title', width: 14, note: 'domain 中文名稱。' },
    { header: 'assessment_type', key: 'assessment_type', width: 14, note: 'preTest / postTest；case 列可能留空。' },
    { header: 'assessment_title', key: 'assessment_title', width: 18, note: '前/後測標題。' },
    { header: 'case_id', key: 'case_id', width: 28, note: 'case 唯一識別碼。' },
    { header: 'case_title', key: 'case_title', width: 28, note: 'case 標題。' },
    { header: 'phase', key: 'phase', width: 14, note: 'assessment / preTest / interactive / postTest / step。' },
    { header: 'step_label', key: 'step_label', width: 20, note: '明確標示是哪個 step。' },
    { header: 'question_id', key: 'question_id', width: 18, note: '題目唯一識別碼。' },
    { header: 'question_order', key: 'question_order', width: 14, note: '題目順序。' },
    { header: 'question_label', key: 'question_label', width: 46, note: '題目文字或 step 問題文字。' },
    { header: 'attempt_count', key: 'attempt_count', width: 14, note: 'Excel 公式：全體或各職級此題總作答次數。' },
    { header: 'correct_count', key: 'correct_count', width: 14, note: 'Excel 公式：全體或各職級此題答對次數。' },
    { header: 'correct_rate', key: 'correct_rate', width: 14, note: 'Excel 公式：答對次數 / 作答次數。' },
  ];
  styleSheet(overallSummarySheet, overallSummaryColumns);
  addHeaderNotes(overallSummarySheet, overallSummaryColumns);
  const overallSummaryRows = buildOverallSummaryRows(assessmentAnswerRows, caseAnswerRows, roles);
  addRows(overallSummarySheet, overallSummaryRows, overallSummaryColumns);
  addOverallSummaryFormulas({
    worksheet: overallSummarySheet,
    rows: overallSummaryRows,
    assessmentAnswerColumns,
    caseAnswerColumns,
    assessmentAnswerLastRow: assessmentAnswerRows.length + 1,
    caseAnswerLastRow: caseAnswerRows.length + 1,
  });

  return workbook.xlsx.writeBuffer();
}

export async function downloadStatisticsWorkbook(data) {
  const buffer = await createStatisticsWorkbook(data);
  const fileName = `pbl-statistics-${new Date().toISOString().replace(/[:.]/g, '-')}.xlsx`;
  downloadBuffer(buffer, fileName);
  return fileName;
}
