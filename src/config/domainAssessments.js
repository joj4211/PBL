const t = (text) => ({ zh: text, en: text });

const mcq = ({ id, prompt, options, answer, explanation }) => ({
  id,
  type: 'multiple-choice',
  prompt: t(prompt),
  options: options.map((text, idx) => ({
    id: String.fromCharCode(65 + idx),
    text: t(text),
    correct: String.fromCharCode(65 + idx) === answer,
  })),
  explanation: t(explanation),
});

const questionBank = {
  nose: {
    preTest: [
      mcq({ id: 'nose-pre-1', prompt: '40 歲男性主訴無痛性頸部腫塊與單側耳悶，理學檢查發現單側中耳積液 (OME)。為了排除原發惡性腫瘤，內視鏡檢查時最必須仔細檢視哪一個解剖構造？', options: ['梨狀竇 (Piriform sinus)', '喉室 (Laryngeal ventricle)', '鼻咽側隱窩 (Fossa of Rosenmüller)', '舌根底 (Base of tongue)'], answer: 'C', explanation: '正確答案為 C。單側中耳積液在成人必須高度懷疑鼻咽腫瘤阻塞耳咽管開口，內視鏡應直擊鼻咽側隱窩 (Rosenmüller fossa)。' }),
      mcq({ id: 'nose-pre-2', prompt: '為了找出明確過敏原而安排「皮膚點刺測試 (Skin prick testing)」前，必須請病患停用哪一類藥物至少 7-10 天，以免產生偽陰性？', options: ['局部類固醇鼻噴劑 (INCS)', '白三烯素受體拮抗劑 (Montelukast)', '抗組織胺 (Antihistamines)', '口服抗生素 (Antibiotics)'], answer: 'C', explanation: '正確答案為 C。抗組織胺會壓抑皮膚組織胺反應，導致檢測結果全盤偽陰性。' }),
      mcq({ id: 'nose-pre-3', prompt: '根據最新診斷指引，要確立「慢性鼻竇炎 (CRS)」的診斷，患者的鼻部症狀（如鼻塞、流黃鼻涕、嗅覺異常等）必須持續超過多長的時間？', options: ['4 週', '8 週', '12 週', '6 個月'], answer: 'C', explanation: '正確答案為 C。鼻部症狀持續超過 12 週，且搭配內視鏡或影像學發現發炎證據，即可診斷為慢性鼻竇炎。' }),
      mcq({ id: 'nose-pre-4', prompt: '在年輕人與兒童中最常見的「前鼻出血 (Anterior epistaxis)」，其出血點高達 90% 位於鼻中膈前下方的哪個解剖血管叢？', options: ["Woodruff's plexus", "Kiesselbach's plexus (Little's area)", '蝶顎動脈叢 (Sphenopalatine plexus)', '篩前動脈叢 (Anterior ethmoidal plexus)'], answer: 'B', explanation: '正確答案為 B。Kiesselbach\'s plexus 是四條動脈交會處，黏膜薄且易受外力摳挖受傷，是前鼻出血最常見位置。' }),
      mcq({ id: 'nose-pre-5', prompt: '鼻閥 (Nasal valve) 是鼻腔呼吸氣流阻力最大的地方。請問「內鼻閥 (Internal nasal valve)」的角度主要是由鼻中膈與哪一個軟骨所構成的交角？', options: ['下側鼻軟骨 (Lower lateral cartilage)', '上側鼻軟骨 (Upper lateral cartilage)', '鼻翼軟骨 (Alar cartilage)', '鼻骨 (Nasal bone)'], answer: 'B', explanation: '正確答案為 B。內鼻閥 (10-15 度交角) 是由鼻中膈、上側鼻軟骨與下鼻甲前端共同構成的狹窄區。' }),
    ],
    postTest: [
      mcq({ id: 'nose-post-1', prompt: '在確認為非角化型鼻咽癌後，下列哪一項抽血檢驗指標對於評估「腫瘤負荷量」以及「治療後追蹤復發」具有最高的敏感性與特異性？', options: ['癌胚抗原 (CEA)', '鱗狀細胞癌抗原 (SCC Ag)', '血漿 EB 病毒 DNA 濃度 (Plasma EBV DNA titer)', '鼻咽切片組織之潛伏膜蛋白 (LMP-1)'], answer: 'C', explanation: '正確答案為 C。Plasma EBV DNA titer 是目前鼻咽癌監測腫瘤負荷量、預後及復發的最強大液態活檢 (liquid biopsy) 指標。' }),
      mcq({ id: 'nose-post-2', prompt: '病患主訴長期依賴「速效鼻噴劑」導致鼻子越來越塞，這種現象在學理上稱為什麼？應該換成哪一種噴劑作為第一線常規治療？', options: ['萎縮性鼻炎；改用生理食鹽水洗鼻。', '藥物性鼻炎 (Rhinitis medicamentosa)；改用局部類固醇鼻噴劑 (INCS)。', '血管運動性鼻炎；改用口服抗組織胺。', '空鼻症 (Empty nose syndrome)；改用玻尿酸注射。'], answer: 'B', explanation: '正確答案為 B。局部去充血劑連續使用超過 7 天會引發反彈性血管擴張 (藥物性鼻炎)；INCS 才是改善鼻炎症狀的根本首選。' }),
      mcq({ id: 'nose-post-3', prompt: '對於合併鼻息肉且對類固醇與手術反應不佳的「Type 2 發炎反應」慢性鼻竇炎患者，目前最新的標靶生物製劑 (Biologics) 主要是阻斷哪些發炎介質？', options: ['IgE 或是 IL-4 / IL-13 / IL-5', 'TNF-α 或是 IL-1', 'CD20 或是 VEGF', 'IFN-γ 或是 IL-2'], answer: 'A', explanation: '正確答案為 A。Type 2 鼻竇炎的核心路徑牽涉 IgE 及第 2 型細胞介素 (IL-4, 5, 13)，如 Dupilumab 等單株抗體即是針對此路徑。' }),
      mcq({ id: 'nose-post-4', prompt: '對於使用鼻後部填塞無效的頑固性「後鼻出血 (Posterior epistaxis)」，若安排全身麻醉進行內視鏡止血手術，最常被尋找並結紮的動脈為哪一條？', options: ['內頸動脈 (Internal carotid artery)', '顏面動脈 (Facial artery)', '蝶顎動脈 (Sphenopalatine artery, SPA)', '篩後動脈 (Posterior ethmoidal artery)'], answer: 'C', explanation: '正確答案為 C。內視鏡蝶顎動脈結紮術 (ESPAL) 具有高成功率與低併發症，是目前處置難治型後鼻出血的手術黃金標準。' }),
      mcq({ id: 'nose-post-5', prompt: '在執行鼻中膈成形術 (Septoplasty) 時，若外科醫師過度切除背側與尾側的支撐軟骨 (L-strut)，最容易導致患者術後出現何種外觀併發症？', options: ['鷹勾鼻 (Hump nose)', '歪鼻變形 (Crooked nose)', '馬鞍鼻變形 (Saddle nose deformity)', '朝天鼻 (Short nose deformity)'], answer: 'C', explanation: '正確答案為 C。必須保留至少 1-1.5 公分的 dorsal and caudal strut (L-strut) 以支撐鼻背，否則會塌陷形成馬鞍鼻。' }),
    ],
  },
  ear: {
    preTest: [
      mcq({ id: 'ear-pre-1', prompt: '根據臨床標準定義，診斷「突發性感音神經性聽損 (SSNHL)」的發作時間與聽力下降幅度標準為何？', options: ['24 小時內，單一頻率大於 20 分貝下降。', '1 週內，連續 2 個頻率大於 40 分貝下降。', '72 小時內，連續 3 個頻率發生大於 30 分貝的感音神經性聽力下降。', '1 個月內，平均聽力下降超過 50 分貝。'], answer: 'C', explanation: '正確答案為 C。SSNHL 屬耳科急症，標準定義為「3天內 (72小時)、連續3個頻率、掉30分貝以上」。' }),
      mcq({ id: 'ear-pre-2', prompt: '在門診理學檢查時，若發現「壓迫同側頸靜脈 (Jugular vein compression)」可使患者的搏動性耳鳴完全消失，這強烈暗示耳鳴屬於哪一種來源？', options: ['動脈性異常 (Arterial origin)', '靜脈性異常 (Venous origin)', '肌肉性陣攣 (Muscular myoclonus)', '聽神經病變 (Auditory neuropathy)'], answer: 'B', explanation: '正確答案為 B。壓迫頸靜脈會阻斷靜脈回流，若耳鳴因此消失或減弱，強烈暗示為靜脈性來源。' }),
      mcq({ id: 'ear-pre-3', prompt: '根據 2015 年診斷準則，要確立「確定性梅尼爾氏症」，其自發性眩暈發作時間長度必須符合什麼條件？', options: ['發作 1 次，持續超過 24 小時。', '發作至少 2 次以上，每次持續 20 分鐘到 12 小時。', '發作至少 5 次，每次持續 5 分鐘到 72 小時。', '持續數秒鐘的姿勢性眩暈，伴隨眼震。'], answer: 'B', explanation: '正確答案為 B。選項 C 其實是前庭性偏頭痛 (Vestibular migraine) 的標準；選項 D 則是 BPPV。' }),
      mcq({ id: 'ear-pre-4', prompt: '在進行 HINTS 檢查時，下列哪一項發現最能支持「周邊性前庭神經炎」而非中樞型中風？', options: ['出現純垂直性眼震 (Pure vertical nystagmus)。', '頭部脈衝測試 (HIT) 出現校正性眼球跳動 (Catch-up saccade)。', '檢查發現有眼球歪斜偏移 (Skew deviation)。', '眼震方向會隨著注視方向改變而改變 (Direction-changing nystagmus)。'], answer: 'B', explanation: '正確答案為 B。HIT 異常代表周邊前庭功能低下；A/C/D 皆為中樞病灶 Red Flags。' }),
      mcq({ id: 'ear-pre-5', prompt: '在耳內視鏡理學檢查中，下列哪一項發現是「次發性後天型膽脂瘤」最具特異性的典型特徵？', options: ['緊張部 (Pars Tensa) 出現紅腫外凸。', '鬆弛部 (Pars Flaccida) 內陷袋中發現角質碎屑 (Keratin debris)。', '中耳腔出現清澈積液與氣液面。', '耳膜表面出現出血性水泡 (Bullae formation)。'], answer: 'B', explanation: '正確答案為 B。上鼓室內陷袋中的角質碎屑是後天型膽脂瘤的標準特徵。' }),
    ],
    postTest: [
      mcq({ id: 'ear-post-1', prompt: '對於全身性類固醇治療無效的 ISSNHL 患者，若改採中耳腔內類固醇注射作為救援治療，最常見主要併發症為何？', options: ['永久性顏面神經麻痺', '醫源性腦脊髓液漏 (CSF leakage)', '內耳迷路炎 (Labyrinthitis)', '持續性的耳膜穿孔 (Persistent tympanic membrane perforation)'], answer: 'D', explanation: '正確答案為 D。IT steroid 多次注射最主要併發症是耳膜持續性穿孔。' }),
      mcq({ id: 'ear-post-2', prompt: '針對「乙狀竇骨壁缺損」導致的搏動性耳鳴，文獻建議的核心外科手術機轉與目的為何？', options: ['經乳突重建乙狀竇壁 (Resurfacing)，建立堅硬屏障隔絕噪音傳導。', '內頸靜脈結紮術 (IJV ligation) 徹底阻斷血流。', '乙狀竇完全切除術 (Sigmoid sinus excision)。', '迷路切除術 (Labyrinthectomy) 直接破壞聽覺接收器。'], answer: 'A', explanation: '正確答案為 A。手術精髓為重建隔音牆 (Resurfacing)，並避免過度壓迫乙狀竇。' }),
      mcq({ id: 'ear-post-3', prompt: '面對聽力已嚴重喪失且出現 Tumarkin crisis 的頑固型病患，強烈建議採用哪一種耳內注射治療？', options: ['耳內注射類固醇 (Dexamethasone)', '耳內注射慶大黴素 (Gentamicin)', '耳內注射玻尿酸 (Hyaluronic acid)', '耳內注射利多卡因 (Lidocaine)'], answer: 'B', explanation: '正確答案為 B。Gentamicin 化學性破壞前庭神經，可有效停止危險眩暈。' }),
      mcq({ id: 'ear-post-4', prompt: '針對確診急性前庭神經炎病患，關於急性期與長期處置建議，下列何者最正確？', options: ['應立即執行耳石復位術 (Epley Maneuver)。', '建議長期絕對臥床休息。', '急性期可給高劑量類固醇，且症狀緩解後應盡早開始前庭復健 (Early VRT)。', '長期開立前庭抑制劑直到眩暈完全消失。'], answer: 'C', explanation: '正確答案為 C。Early VRT 可促進中樞代償；長期抑制劑與臥床反而不利恢復。' }),
      mcq({ id: 'ear-post-5', prompt: '懷疑中耳膽脂瘤病患做 HRCT 時，最常見哪個骨性構造破壞？後續標準處置為何？', options: ['內聽道擴大；安排加馬刀放療。', '盾狀骨 (Scutum) 侵蝕；需安排乳突鑿開與鼓室成形術清除。', '半規管完全骨化；持續點耳滴劑觀察。', '乙狀竇骨壁缺損；常規靜脈抗生素即可。'], answer: 'B', explanation: '正確答案為 B。CT 初期典型徵象是 Scutum 與聽小骨侵蝕，需手術徹底清除。' }),
    ],
  },
  throat: {
    preTest: [
      mcq({ id: 'throat-pre-1', prompt: '在門診評估疑似 OSA 患者時，若要快速篩檢中重度高風險族群，哪份問卷最廣泛推薦？', options: ['匹茲堡睡眠品質量表 (PSQI)', 'STOP-Bang questionnaire', '艾普沃斯嗜睡量表 (ESS)', '柏林問卷 (Berlin Questionnaire)'], answer: 'B', explanation: '正確答案為 B。STOP-Bang 具高敏感度，是快速篩檢中重度 OSA 的最佳工具。' }),
      mcq({ id: 'throat-pre-2', prompt: '成人反覆性扁桃腺炎的主要致病菌種通常為哪兩者？', options: ['僅 A 群 β-溶血性鏈球菌 (GABHS)', '綠膿桿菌與退伍軍人菌', '嗜血桿菌 (H. influenzae) 與金黃色葡萄球菌 (S. aureus)', '厭氧菌與白色念珠菌'], answer: 'C', explanation: '正確答案為 C。這也是短期抗生素常無法根除反覆性發作的原因。' }),
      mcq({ id: 'throat-pre-3', prompt: '面對新發現甲狀腺結節，除超音波外第一線常規必抽哪個荷爾蒙指標？', options: ['降鈣素 (Calcitonin)', '甲狀腺球蛋白 (Tg)', '血清甲狀腺刺激素 (Serum TSH)', '游離甲狀腺素 (Free T4)'], answer: 'C', explanation: '正確答案為 C。TSH 是甲狀腺結節評估的標準起手式。' }),
      mcq({ id: 'throat-pre-4', prompt: '根據 GRBAS，若病患 B (Breathiness) 分數極高，暗示聲帶何種生理異常？', options: ['聲帶震動極度不規律', '聲帶無法完全閉合', '聲帶張力過高', '假聲帶過度代償擠壓'], answer: 'B', explanation: '正確答案為 B。高氣息聲表示聲門閉合不全，發聲時空氣大量漏出。' }),
      mcq({ id: 'throat-pre-5', prompt: '急診面對 Ludwig\'s angina 舌根後推堵塞口咽時，暫時維持氣流最適合安全的人工氣道為何？', options: ['口咽呼吸道 (Oral/Guedel airway)', '鼻咽呼吸道 (Nasopharyngeal airway)', '喉罩呼吸道 (LMA)', '盲目經口氣管插管'], answer: 'B', explanation: '正確答案為 B。鼻咽呼吸道可越過後推舌根；有作嘔反射時不適合口咽呼吸道。' }),
    ],
    postTest: [
      mcq({ id: 'throat-post-1', prompt: '無法適應 CPAP 而考慮改用 ASV 的病患，醫師必須確認沒有哪種病史以免死亡率上升？', options: ['嚴重慢性阻塞性肺病 (Severe COPD)', '第 II 型糖尿病 (Type 2 DM)', '伴隨低 LVEF 的心臟衰竭', '難治型高血壓 (Refractory hypertension)'], answer: 'C', explanation: '正確答案為 C。SERVE-HF 證實 LVEF ≤ 45% 心衰竭患者使用 ASV 會增加心血管死亡率。' }),
      mcq({ id: 'throat-post-2', prompt: '扁桃腺切除術後第 5-10 天發生次發性出血，常與局部感染有關，標準第一線處置為何？', options: ['立即進開刀房重新縫合', '單純給予口服或靜脈抗生素治療', '輸注新鮮冷凍血漿 (FFP)', '局部注射高濃度腎上腺素'], answer: 'B', explanation: '正確答案為 B。多數次發性出血給予抗生素即會自行止血，極少需再次手術。' }),
      mcq({ id: 'throat-post-3', prompt: '根據 2025 ATA 指引，<2 公分、無 ETE、cN0 的乳突癌首選手術範圍為何？', options: ['單側甲狀腺葉切除術 (Lobectomy)，不建議常規預防性中央頸部淋巴廓清 (pCLND)。', '單側葉切除且強制同側 pCLND。', '必須甲狀腺全切除術。', '無線電頻率燒灼 (RFA) 即可。'], answer: 'A', explanation: '正確答案為 A。2025 ATA 擴大 Lobectomy 角色，且更不建議 T1-T2 cN0 常規 pCLND。' }),
      mcq({ id: 'throat-post-4', prompt: '喉顯微手術移除聲帶黏膜下病灶採用 Microflap 的核心原則是？', options: ['深切到聲帶肌肉層徹底挖除', '大範圍切除周圍正常組織', '切口靠近病灶且維持極淺層剝離，最小化正常組織破壞', '高功率 CO2 雷射大範圍氣化'], answer: 'C', explanation: '正確答案為 C。Microflap 關鍵是保留正常黏膜與韌帶，避免疤痕造成永久發聲障礙。' }),
      mcq({ id: 'throat-post-5', prompt: 'Ludwig\'s angina 若發生 CICO 並做緊急環甲膜切開後，為何穩定後需盡快轉正式氣切？', options: ['長期放置會摩擦環狀軟骨，導致聲門下狹窄。', '會壓迫雙側喉返神經導致永久失聲。', '會加速深頸部膿瘍灌入肺部。', '容易誘發甲狀腺風暴。'], answer: 'A', explanation: '正確答案為 A。Cricothyroidotomy 僅暫時救命，需盡快改氣切避免後續聲門下狹窄。' }),
    ],
  },
};

export const domainAssessments = {
  ear: {
    preTest: {
      id: 'ear_pretest_v2',
      zh: { title: '耳科前測', subtitle: '完成前測後即可進入耳科案例。' },
      en: { title: 'Otology Pre-test', subtitle: 'Complete this pre-test to unlock otology cases.' },
      questions: questionBank.ear.preTest,
    },
    postTest: {
      id: 'ear_posttest_v2',
      zh: { title: '耳科後測', subtitle: '完成所有耳科案例後即可進行後測。' },
      en: { title: 'Otology Post-test', subtitle: 'Take this post-test after finishing all otology cases.' },
      questions: questionBank.ear.postTest,
    },
  },
  nose: {
    preTest: {
      id: 'nose_pretest_v2',
      zh: { title: '鼻科前測', subtitle: '完成前測後即可進入鼻科案例。' },
      en: { title: 'Rhinology Pre-test', subtitle: 'Complete this pre-test to unlock rhinology cases.' },
      questions: questionBank.nose.preTest,
    },
    postTest: {
      id: 'nose_posttest_v2',
      zh: { title: '鼻科後測', subtitle: '完成所有鼻科案例後即可進行後測。' },
      en: { title: 'Rhinology Post-test', subtitle: 'Take this post-test after finishing all rhinology cases.' },
      questions: questionBank.nose.postTest,
    },
  },
  throat: {
    preTest: {
      id: 'throat_pretest_v2',
      zh: { title: '喉科前測', subtitle: '完成前測後即可進入喉科案例。' },
      en: { title: 'Laryngology Pre-test', subtitle: 'Complete this pre-test to unlock laryngology cases.' },
      questions: questionBank.throat.preTest,
    },
    postTest: {
      id: 'throat_posttest_v2',
      zh: { title: '喉科後測', subtitle: '完成所有喉科案例後即可進行後測。' },
      en: { title: 'Laryngology Post-test', subtitle: 'Take this post-test after finishing all laryngology cases.' },
      questions: questionBank.throat.postTest,
    },
  },
};

export function getDomainAssessment(domainId, kind = 'preTest') {
  const domain = domainAssessments[domainId];
  if (!domain) return null;
  return kind === 'postTest' ? domain.postTest : domain.preTest;
}
