// ============================================================
//  casesConfig.js — Config-driven Case Definitions
//  To add a new case: copy the case object below, change the
//  id, and fill in your content. All other logic is automatic.
// ============================================================

export const PHASES = {
  INTRO: 'intro',
  PRE_TEST: 'preTest',
  CASE_STUDY: 'caseStudy',
  INTERACTIVE: 'interactive',
  POST_TEST: 'postTest',
  ANALYTICS: 'analytics',
};

// --------------- CASE DEFINITIONS ---------------

export const cases = [
  {
    id: 'case-001',
    title: '夜班的呼叫',
    subtitle: '一位中年男性的突發胸痛',
    coverDescription:
      '急診室的燈光微微閃爍，今晚的值班將是一場考驗。\n準備好了嗎？',
    estimatedTime: '25–35 分鐘',
    difficulty: '中級',
    tags: ['心臟科', '急症醫學', 'ACS'],

    // ── PRE-TEST ──────────────────────────────────────
    preTest: {
      instructions:
        '在進入案例前，請先回答以下問題，評估您目前的基礎知識。\n不必擔心答錯——這只是幫助我們了解您的起點。',
      questions: [
        {
          id: 'pre-q1',
          type: 'multiple-choice',
          text: '當患者主訴「胸痛伴隨左手臂放射痛、冒冷汗」時，您第一個優先排除的診斷是？',
          options: [
            { id: 'a', text: '胃食道逆流 (GERD)' },
            { id: 'b', text: '急性心肌梗塞 (AMI)', correct: true },
            { id: 'c', text: '肺炎 (Pneumonia)' },
            { id: 'd', text: '肌肉骨骼性疼痛' },
          ],
          explanation:
            '胸痛合併左手臂放射痛與冷汗是急性心肌梗塞的典型表現（三聯症），必須視為心臟急症優先排除，時間就是心肌。',
        },
        {
          id: 'pre-q2',
          type: 'multiple-choice',
          text: '下列何者「不屬於」急性冠心症 (ACS) 的典型危險因子？',
          options: [
            { id: 'a', text: '長期吸煙史' },
            { id: 'b', text: '控制不良的高血壓' },
            { id: 'c', text: '慢性視網膜病變', correct: true },
            { id: 'd', text: '糖尿病合併高血脂' },
          ],
          explanation:
            '慢性視網膜病變本身不是 ACS 的危險因子（雖與糖尿病相關）。ACS 主要危險因子包含：抽菸、高血壓、糖尿病、高血脂、家族史、年齡與男性性別。',
        },
        {
          id: 'pre-q3',
          type: 'multiple-choice',
          text: '懷疑 STEMI 時，理想的「到院至心導管」(Door-to-Balloon) 時間目標為何？',
          options: [
            { id: 'a', text: '60 分鐘以內' },
            { id: 'b', text: '90 分鐘以內', correct: true },
            { id: 'c', text: '120 分鐘以內' },
            { id: 'd', text: '180 分鐘以內' },
          ],
          explanation:
            '根據 ACC/AHA 指引，STEMI 患者的 Door-to-Balloon time 目標為 ≤90 分鐘，可顯著降低心肌壞死面積與死亡率。',
        },
      ],
    },

    // ── CASE STUDY ────────────────────────────────────
    caseStudy: {
      narrative: [
        {
          id: 'scene-1',
          type: 'scene',
          text: '凌晨兩點十七分。急診室。',
        },
        {
          id: 'scene-2',
          type: 'narration',
          text: '護理師快步推著一位面色蒼白的中年男性進入急救區。他緊握著胸口，額頭滲著細密的冷汗，眉頭深鎖。',
        },
        {
          id: 'scene-3',
          type: 'narration',
          text: '「醫生……我胸口很悶……像有石頭壓著……」他說話有些氣促，聲音微微顫抖。',
        },
        {
          id: 'scene-4',
          type: 'patient-info',
          label: '患者基本資料',
          data: [
            { label: '姓名', value: '王先生（化名）' },
            { label: '年齡', value: '45 歲' },
            { label: '性別', value: '男性' },
            { label: '主訴', value: '突發性胸悶、胸痛，持續約 35 分鐘，伴隨左手臂麻痛與冷汗' },
            { label: '發作情境', value: '用力搬運貨物後突然發作' },
          ],
        },
        {
          id: 'scene-5',
          type: 'vitals',
          label: '初步生命徵象',
          data: [
            { label: 'BP', value: '162 / 98 mmHg', status: 'high' },
            { label: 'HR', value: '108 bpm', status: 'high' },
            { label: 'RR', value: '22 次/分', status: 'high' },
            { label: 'SpO₂', value: '95%', status: 'borderline' },
            { label: 'Temp', value: '36.7°C', status: 'normal' },
            { label: 'GCS', value: 'E4V5M6 = 15', status: 'normal' },
          ],
        },
        {
          id: 'scene-6',
          type: 'narration',
          text: '進一步詢問病史：患者有高血壓病史 6 年，目前服用 Amlodipine 5mg QD。抽菸史每天一包，已持續 22 年。無糖尿病，無心臟病家族史。否認藥物過敏。',
        },
        {
          id: 'scene-7',
          type: 'narration',
          text: '身體檢查：心音規則，無明顯雜音；呼吸音清晰，無囉音；腹部柔軟，無壓痛；下肢無水腫。',
        },
      ],
    },

    // ── INTERACTIVE SESSION ───────────────────────────
    interactive: {
      instructions:
        '根據您剛才閱讀的案例，請回答以下問題。\n試著以臨床醫師的角度思考，沒有標準答案——重要的是您的推理過程。',
      questions: [
        {
          id: 'int-q1',
          type: 'text-input',
          text: '根據患者的主訴、危險因子與生命徵象，您最優先懷疑的診斷是什麼？請簡要說明您的臨床推理。',
          hint: '試想：症狀的性質、持續時間、放射部位，以及患者的危險因子組合，讓您聯想到哪個心血管急症？',
          placeholder: '例如：我考慮的是 ___，因為患者有 ___，且症狀表現為 ___...',
          keywords: [
            '心肌梗塞', 'AMI', 'ACS', '急性冠心症', '冠心症',
            'STEMI', 'NSTEMI', '心絞痛', '不穩定心絞痛', '冠狀動脈',
          ],
          feedbackTemplate: {
            excellent:
              '臨床推理清晰！您提到了「{keyword}」，這正是此案例的核心診斷方向。結合患者的年齡、性別、高血壓史、長期吸煙，以及典型的用力誘發性胸痛表現，ACS（急性冠心症）是最需要優先排除的診斷。',
            good:
              '方向正確！您的推理觸及了重要的臨床線索。建議進一步區分 ACS 的亞型：STEMI（ST 上升型）與 NSTEMI（非 ST 上升型）在後續處置上有所不同，需靠 ECG 來鑑別。',
            hint:
              '再想想看——患者是 45 歲男性，有高血壓、長期吸煙史，在用力時突發持續性胸痛合併左臂放射痛與冷汗，症狀超過 30 分鐘。這個臨床組合最讓您擔心的心血管急症是什麼？',
          },
        },
        {
          id: 'int-q2',
          type: 'multiple-choice',
          text: '接下來，您最優先安排的床旁檢查是？',
          options: [
            { id: 'a', text: '胸部 X 光 (CXR)' },
            { id: 'b', text: '12 導程心電圖 (12-lead ECG)', correct: true },
            { id: 'c', text: '腹部超音波' },
            { id: 'd', text: '腦部 CT scan' },
          ],
          explanation:
            '12-lead ECG 是懷疑 ACS 時最關鍵的首要檢查，應在到院 10 分鐘內完成。它可以立即判讀 ST 段變化（STEMI）或其他缺血性改變，直接決定後續緊急處置方向。',
        },
        {
          id: 'int-q3',
          type: 'multiple-choice',
          text: 'ECG 顯示 V1–V4 導程 ST 段上升 ≥2mm，且出現鏡像性下壁導程 ST 壓低。您的立即處置是？',
          options: [
            { id: 'a', text: '給予強效止痛藥（嗎啡）觀察變化' },
            { id: 'b', text: '啟動 STEMI 處置流程，聯絡心臟科進行緊急 PCI', correct: true },
            { id: 'c', text: '安排隔日住院進行選擇性心導管' },
            { id: 'd', text: '先等待第一套心肌酵素（Troponin）回報' },
          ],
          explanation:
            '前壁 STEMI 是心臟科緊急事件。一旦 ECG 確認，應立即啟動「STEMI alert」，同步給予雙重抗血小板藥物（DAPT）、抗凝血劑，並以最快速度將患者送至心導管室進行 Primary PCI，目標 D2B ≤90 分鐘。等待 Troponin 會延誤治療時機。',
        },
        {
          id: 'int-q4',
          type: 'text-input',
          text: '等待心導管前，您會給予哪些初始藥物治療？（請列出您記得的藥物）',
          hint: '想想抗血小板、抗凝血、以及緩解症狀的藥物。',
          placeholder: '例如：Aspirin, Heparin...',
          keywords: [
            'aspirin', '阿斯匹靈', 'heparin', '肝素',
            'clopidogrel', 'ticagrelor', 'p2y12',
            'nitrate', '硝化甘油', 'nitroglycerin', 'oxygen', '氧氣',
            'morphine', '嗎啡', 'beta blocker',
          ],
          feedbackTemplate: {
            excellent:
              '用藥思路非常完整！您提到了「{keyword}」。STEMI 的初始藥物治療記憶口訣為 "MONA-B"：Morphine（止痛）、Oxygen（必要時）、Nitrate（擴張血管）、Aspirin + P2Y12 抑制劑（雙重抗血小板）、Beta-blocker（限情況使用），加上抗凝血劑（Heparin 或 LMWH）。',
            good:
              '您提到了重要的藥物。記得 STEMI 的雙重抗血小板治療（DAPT）非常關鍵：Aspirin 300mg 負荷劑量 + Clopidogrel 或 Ticagrelor（根據院所偏好與患者條件選擇）。同時需要 Heparin 抗凝以防止血栓擴大。',
            hint:
              '從「防止血栓擴大」的角度出發思考：哪個藥物是急性期必備的抗血小板藥物？還有什麼可以幫助抗凝、緩解疼痛與心臟負擔？',
          },
        },
      ],
    },

    // ── POST-TEST ─────────────────────────────────────
    postTest: {
      instructions:
        '完成案例討論後，讓我們再次評估您的理解。\n這一次，試著運用剛才學到的知識來回答。',
      questions: [
        {
          id: 'post-q1',
          type: 'multiple-choice',
          text: '前壁 STEMI（V1-V4 ST 上升）最可能對應哪條冠狀動脈的閉塞？',
          options: [
            { id: 'a', text: '右冠狀動脈 (RCA)' },
            { id: 'b', text: '左前降支 (LAD)', correct: true },
            { id: 'c', text: '左迴旋支 (LCx)' },
            { id: 'd', text: '左主幹 (LM) ——但極少見' },
          ],
          explanation:
            '前壁心肌梗塞（V1-V4 ST 上升）最常見的原因是左前降支（LAD）閉塞，LAD 供應前壁與室間隔大部分心肌，閉塞時影響範圍大，死亡率較高，有「widow maker」之稱。',
        },
        {
          id: 'post-q2',
          type: 'multiple-choice',
          text: '下列關於 Primary PCI 的敘述，何者正確？',
          options: [
            { id: 'a', text: '適用於發病超過 24 小時的穩定患者' },
            { id: 'b', text: 'Door-to-Balloon 時間目標為 ≤90 分鐘', correct: true },
            { id: 'c', text: '需等待 Troponin 升高後才能進行' },
            { id: 'd', text: '若患者無症狀，可延後進行' },
          ],
          explanation:
            'Primary PCI 是 STEMI 的首選再灌注療法，目標 D2B ≤90 分鐘。它優於溶栓治療，提供更完整的血管再通、更低的出血風險，且不需等待心肌酵素確認即可依 ECG 判讀進行。',
        },
        {
          id: 'post-q3',
          type: 'multiple-choice',
          text: '以下哪一個是 STEMI 後最重要的二級預防藥物？',
          options: [
            { id: 'a', text: '長效 Calcium channel blocker' },
            { id: 'b', text: 'DAPT（雙重抗血小板）+ Statin + ACEI/ARB', correct: true },
            { id: 'c', text: '僅 Aspirin，其他藥物視症狀給予' },
            { id: 'd', text: '長期 Nitrate，以維持血管擴張' },
          ],
          explanation:
            'STEMI 後的二級預防以降低再發為目標：DAPT（至少 12 個月）防止支架內血栓、Statin 穩定斑塊並降低 LDL、ACEI/ARB 保護心臟功能避免心臟衰竭，是目前實證最強的組合。',
        },
      ],
    },

    // ── LEARNING POINTS (shown in Analytics) ──────────
    learningPoints: [
      '典型 ACS 三聯症：持續性胸痛 + 放射至左臂 + 冷汗，須立即評估',
      'ECG 是懷疑 ACS 時的第一優先檢查，10 分鐘內完成',
      'STEMI = ST 上升型心肌梗塞，需緊急 PCI，D2B ≤90 分鐘',
      'DAPT（Aspirin + P2Y12 抑制劑）是 STEMI 急性期與二級預防的核心',
      '前壁 STEMI（V1-V4）最常源自 LAD 閉塞，預後較差需積極處置',
    ],
  },

  // ── PLACEHOLDER CASE 002 ──────────────────────────
  {
    id: 'case-002',
    title: '氣喘的少女',
    subtitle: '一位青少年的急性呼吸困難',
    coverDescription: '門診候診區，一位女孩呼吸越來越費力……',
    estimatedTime: '20–30 分鐘',
    difficulty: '初級',
    tags: ['胸腔科', '急症醫學', '氣喘'],
    // TODO: Fill in full case content
    preTest: { instructions: '敬請期待', questions: [] },
    caseStudy: { narrative: [] },
    interactive: { instructions: '敬請期待', questions: [] },
    postTest: { instructions: '敬請期待', questions: [] },
    learningPoints: [],
  },
];

export const defaultCaseId = 'case-001';
