const mcq = ({ id, prompt, options, answer, explanation }) => ({
  id,
  type: 'multiple-choice',
  prompt,
  options: options.map((text, idx) => ({
    id: String.fromCharCode(65 + idx),
    text,
    correct: String.fromCharCode(65 + idx) === answer,
  })),
  explanation,
});

const questionBank = {
  nose: {
    preTest: [
      mcq({
        id: 'nose-pre-1',
        prompt: {
          zh: '40 歲男性主訴無痛性頸部腫塊與單側耳悶，理學檢查發現單側中耳積液 (OME)。為了排除原發惡性腫瘤，內視鏡檢查時最必須仔細檢視哪一個解剖構造？',
          en: 'A 40-year-old man presents with a painless neck mass and unilateral ear fullness, and physical examination reveals a unilateral middle ear effusion (OME). To rule out a primary malignancy, which anatomical structure must be inspected most carefully during endoscopy?',
        },
        options: [
          { zh: '梨狀竇 (Piriform sinus)', en: 'Piriform sinus' },
          { zh: '喉室 (Laryngeal ventricle)', en: 'Laryngeal ventricle' },
          { zh: '鼻咽側隱窩 (Fossa of Rosenmüller)', en: 'Fossa of Rosenmüller' },
          { zh: '舌根底 (Base of tongue)', en: 'Base of tongue' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。單側中耳積液在成人必須高度懷疑鼻咽腫瘤阻塞耳咽管開口，內視鏡應直擊鼻咽側隱窩 (Rosenmüller fossa)。',
          en: 'The correct answer is C. A unilateral middle ear effusion in an adult must raise strong suspicion of a nasopharyngeal tumor obstructing the Eustachian tube orifice, so endoscopy should go straight to the Rosenmüller fossa.',
        },
      }),
      mcq({
        id: 'nose-pre-2',
        prompt: {
          zh: '為了找出明確過敏原而安排「皮膚點刺測試 (Skin prick testing)」前，必須請病患停用哪一類藥物至少 7-10 天，以免產生偽陰性？',
          en: 'Before arranging skin prick testing to identify a specific allergen, which class of medication must the patient stop for at least 7-10 days to avoid false-negative results?',
        },
        options: [
          { zh: '局部類固醇鼻噴劑 (INCS)', en: 'Intranasal corticosteroid spray (INCS)' },
          { zh: '白三烯素受體拮抗劑 (Montelukast)', en: 'Leukotriene receptor antagonist (Montelukast)' },
          { zh: '抗組織胺 (Antihistamines)', en: 'Antihistamines' },
          { zh: '口服抗生素 (Antibiotics)', en: 'Oral antibiotics' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。抗組織胺會壓抑皮膚組織胺反應，導致檢測結果全盤偽陰性。',
          en: 'The correct answer is C. Antihistamines suppress the skin histamine response, making the entire test falsely negative.',
        },
      }),
      mcq({
        id: 'nose-pre-3',
        prompt: {
          zh: '根據最新診斷指引，要確立「慢性鼻竇炎 (CRS)」的診斷，患者的鼻部症狀（如鼻塞、流黃鼻涕、嗅覺異常等）必須持續超過多長的時間？',
          en: 'According to the latest diagnostic guidelines, how long must nasal symptoms (such as nasal obstruction, yellow nasal discharge, or smell disturbance) persist to establish a diagnosis of chronic rhinosinusitis (CRS)?',
        },
        options: [
          { zh: '4 週', en: '4 weeks' },
          { zh: '8 週', en: '8 weeks' },
          { zh: '12 週', en: '12 weeks' },
          { zh: '6 個月', en: '6 months' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。鼻部症狀持續超過 12 週，且搭配內視鏡或影像學發現發炎證據，即可診斷為慢性鼻竇炎。',
          en: 'The correct answer is C. Nasal symptoms lasting more than 12 weeks, together with evidence of inflammation on endoscopy or imaging, establish the diagnosis of chronic rhinosinusitis.',
        },
      }),
      mcq({
        id: 'nose-pre-4',
        prompt: {
          zh: '在年輕人與兒童中最常見的「前鼻出血 (Anterior epistaxis)」，其出血點高達 90% 位於鼻中膈前下方的哪個解剖血管叢？',
          en: 'In anterior epistaxis, the most common type in young adults and children, up to 90% of bleeding points lie in which vascular plexus on the anteroinferior nasal septum?',
        },
        options: [
          { zh: "Woodruff's plexus", en: "Woodruff's plexus" },
          { zh: "Kiesselbach's plexus (Little's area)", en: "Kiesselbach's plexus (Little's area)" },
          { zh: '蝶顎動脈叢 (Sphenopalatine plexus)', en: 'Sphenopalatine plexus' },
          { zh: '篩前動脈叢 (Anterior ethmoidal plexus)', en: 'Anterior ethmoidal plexus' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。Kiesselbach\'s plexus 是四條動脈交會處，黏膜薄且易受外力摳挖受傷，是前鼻出血最常見位置。',
          en: "The correct answer is B. Kiesselbach's plexus is where four arteries meet; its mucosa is thin and easily injured by external force such as nose picking, making it the most common site of anterior epistaxis.",
        },
      }),
      mcq({
        id: 'nose-pre-5',
        prompt: {
          zh: '鼻閥 (Nasal valve) 是鼻腔呼吸氣流阻力最大的地方。請問「內鼻閥 (Internal nasal valve)」的角度主要是由鼻中膈與哪一個軟骨所構成的交角？',
          en: 'The nasal valve is the point of greatest resistance to airflow in the nasal cavity. The angle of the internal nasal valve is formed mainly between the nasal septum and which cartilage?',
        },
        options: [
          { zh: '下側鼻軟骨 (Lower lateral cartilage)', en: 'Lower lateral cartilage' },
          { zh: '上側鼻軟骨 (Upper lateral cartilage)', en: 'Upper lateral cartilage' },
          { zh: '鼻翼軟骨 (Alar cartilage)', en: 'Alar cartilage' },
          { zh: '鼻骨 (Nasal bone)', en: 'Nasal bone' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。內鼻閥 (10-15 度交角) 是由鼻中膈、上側鼻軟骨與下鼻甲前端共同構成的狹窄區。',
          en: 'The correct answer is B. The internal nasal valve (an angle of 10-15 degrees) is a narrow area formed by the nasal septum, the upper lateral cartilage, and the anterior end of the inferior turbinate.',
        },
      }),
    ],
    postTest: [
      mcq({
        id: 'nose-post-1',
        prompt: {
          zh: '在確認為非角化型鼻咽癌後，下列哪一項抽血檢驗指標對於評估「腫瘤負荷量」以及「治療後追蹤復發」具有最高的敏感性與特異性？',
          en: 'Once non-keratinizing nasopharyngeal carcinoma is confirmed, which blood test marker has the highest sensitivity and specificity for assessing tumor burden and for monitoring recurrence after treatment?',
        },
        options: [
          { zh: '癌胚抗原 (CEA)', en: 'Carcinoembryonic antigen (CEA)' },
          { zh: '鱗狀細胞癌抗原 (SCC Ag)', en: 'Squamous cell carcinoma antigen (SCC Ag)' },
          { zh: '血漿 EB 病毒 DNA 濃度 (Plasma EBV DNA titer)', en: 'Plasma EBV DNA titer' },
          { zh: '鼻咽切片組織之潛伏膜蛋白 (LMP-1)', en: 'Latent membrane protein (LMP-1) in nasopharyngeal biopsy tissue' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。Plasma EBV DNA titer 是目前鼻咽癌監測腫瘤負荷量、預後及復發的最強大液態活檢 (liquid biopsy) 指標。',
          en: 'The correct answer is C. Plasma EBV DNA titer is currently the most powerful liquid biopsy marker for monitoring tumor burden, prognosis, and recurrence in nasopharyngeal carcinoma.',
        },
      }),
      mcq({
        id: 'nose-post-2',
        prompt: {
          zh: '病患主訴長期依賴「速效鼻噴劑」導致鼻子越來越塞，這種現象在學理上稱為什麼？應該換成哪一種噴劑作為第一線常規治療？',
          en: 'A patient reports that long-term reliance on a "fast-acting nasal spray" has made the nose more and more congested. What is this phenomenon called, and which spray should replace it as routine first-line treatment?',
        },
        options: [
          { zh: '萎縮性鼻炎；改用生理食鹽水洗鼻。', en: 'Atrophic rhinitis; switch to saline nasal irrigation.' },
          { zh: '藥物性鼻炎 (Rhinitis medicamentosa)；改用局部類固醇鼻噴劑 (INCS)。', en: 'Rhinitis medicamentosa; switch to an intranasal corticosteroid spray (INCS).' },
          { zh: '血管運動性鼻炎；改用口服抗組織胺。', en: 'Vasomotor rhinitis; switch to oral antihistamines.' },
          { zh: '空鼻症 (Empty nose syndrome)；改用玻尿酸注射。', en: 'Empty nose syndrome; switch to hyaluronic acid injections.' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。局部去充血劑連續使用超過 7 天會引發反彈性血管擴張 (藥物性鼻炎)；INCS 才是改善鼻炎症狀的根本首選。',
          en: 'The correct answer is B. Using a topical decongestant continuously for more than 7 days triggers rebound vasodilation (rhinitis medicamentosa); INCS is the fundamental first choice for improving rhinitis symptoms.',
        },
      }),
      mcq({
        id: 'nose-post-3',
        prompt: {
          zh: '對於合併鼻息肉且對類固醇與手術反應不佳的「Type 2 發炎反應」慢性鼻竇炎患者，目前最新的標靶生物製劑 (Biologics) 主要是阻斷哪些發炎介質？',
          en: 'For patients with Type 2 inflammatory chronic rhinosinusitis with nasal polyps that respond poorly to corticosteroids and surgery, which inflammatory mediators do the latest targeted biologics mainly block?',
        },
        options: [
          { zh: 'IgE 或是 IL-4 / IL-13 / IL-5', en: 'IgE or IL-4 / IL-13 / IL-5' },
          { zh: 'TNF-α 或是 IL-1', en: 'TNF-α or IL-1' },
          { zh: 'CD20 或是 VEGF', en: 'CD20 or VEGF' },
          { zh: 'IFN-γ 或是 IL-2', en: 'IFN-γ or IL-2' },
        ],
        answer: 'A',
        explanation: {
          zh: '正確答案為 A。Type 2 鼻竇炎的核心路徑牽涉 IgE 及第 2 型細胞介素 (IL-4, 5, 13)，如 Dupilumab 等單株抗體即是針對此路徑。',
          en: 'The correct answer is A. The core pathway of Type 2 rhinosinusitis involves IgE and type 2 cytokines (IL-4, 5, 13); monoclonal antibodies such as Dupilumab target this pathway.',
        },
      }),
      mcq({
        id: 'nose-post-4',
        prompt: {
          zh: '對於使用鼻後部填塞無效的頑固性「後鼻出血 (Posterior epistaxis)」，若安排全身麻醉進行內視鏡止血手術，最常被尋找並結紮的動脈為哪一條？',
          en: 'For refractory posterior epistaxis that fails posterior nasal packing, which artery is most commonly identified and ligated when endoscopic hemostatic surgery is performed under general anesthesia?',
        },
        options: [
          { zh: '內頸動脈 (Internal carotid artery)', en: 'Internal carotid artery' },
          { zh: '顏面動脈 (Facial artery)', en: 'Facial artery' },
          { zh: '蝶顎動脈 (Sphenopalatine artery, SPA)', en: 'Sphenopalatine artery (SPA)' },
          { zh: '篩後動脈 (Posterior ethmoidal artery)', en: 'Posterior ethmoidal artery' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。內視鏡蝶顎動脈結紮術 (ESPAL) 具有高成功率與低併發症，是目前處置難治型後鼻出血的手術黃金標準。',
          en: 'The correct answer is C. Endoscopic sphenopalatine artery ligation (ESPAL) has a high success rate and few complications, and is currently the surgical gold standard for intractable posterior epistaxis.',
        },
      }),
      mcq({
        id: 'nose-post-5',
        prompt: {
          zh: '在執行鼻中膈成形術 (Septoplasty) 時，若外科醫師過度切除背側與尾側的支撐軟骨 (L-strut)，最容易導致患者術後出現何種外觀併發症？',
          en: 'During septoplasty, if the surgeon over-resects the dorsal and caudal supporting cartilage (L-strut), which cosmetic complication is the patient most likely to develop after surgery?',
        },
        options: [
          { zh: '鷹勾鼻 (Hump nose)', en: 'Hump nose' },
          { zh: '歪鼻變形 (Crooked nose)', en: 'Crooked nose' },
          { zh: '馬鞍鼻變形 (Saddle nose deformity)', en: 'Saddle nose deformity' },
          { zh: '朝天鼻 (Short nose deformity)', en: 'Short nose deformity' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。必須保留至少 1-1.5 公分的 dorsal and caudal strut (L-strut) 以支撐鼻背，否則會塌陷形成馬鞍鼻。',
          en: 'The correct answer is C. At least 1-1.5 cm of dorsal and caudal strut (L-strut) must be preserved to support the nasal dorsum; otherwise it collapses into a saddle nose.',
        },
      }),
    ],
  },
  ear: {
    preTest: [
      mcq({
        id: 'ear-pre-1',
        prompt: {
          zh: '根據臨床標準定義，診斷「突發性感音神經性聽損 (SSNHL)」的發作時間與聽力下降幅度標準為何？',
          en: 'By the standard clinical definition, what are the onset-time and hearing-drop criteria for diagnosing sudden sensorineural hearing loss (SSNHL)?',
        },
        options: [
          { zh: '24 小時內，單一頻率大於 20 分貝下降。', en: 'Within 24 hours, a drop of more than 20 dB at a single frequency.' },
          { zh: '1 週內，連續 2 個頻率大於 40 分貝下降。', en: 'Within 1 week, a drop of more than 40 dB at 2 consecutive frequencies.' },
          { zh: '72 小時內，連續 3 個頻率發生大於 30 分貝的感音神經性聽力下降。', en: 'Within 72 hours, a sensorineural hearing drop of more than 30 dB at 3 consecutive frequencies.' },
          { zh: '1 個月內，平均聽力下降超過 50 分貝。', en: 'Within 1 month, an average hearing drop of more than 50 dB.' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。SSNHL 屬耳科急症，標準定義為「3天內 (72小時)、連續3個頻率、掉30分貝以上」。',
          en: 'The correct answer is C. SSNHL is an otologic emergency, defined as "within 3 days (72 hours), at 3 consecutive frequencies, a drop of 30 dB or more."',
        },
      }),
      mcq({
        id: 'ear-pre-2',
        prompt: {
          zh: '在門診理學檢查時，若發現「壓迫同側頸靜脈 (Jugular vein compression)」可使患者的搏動性耳鳴完全消失，這強烈暗示耳鳴屬於哪一種來源？',
          en: "On outpatient physical examination, if compressing the ipsilateral jugular vein (jugular vein compression) makes the patient's pulsatile tinnitus disappear completely, what source of tinnitus does this strongly suggest?",
        },
        options: [
          { zh: '動脈性異常 (Arterial origin)', en: 'Arterial origin' },
          { zh: '靜脈性異常 (Venous origin)', en: 'Venous origin' },
          { zh: '肌肉性陣攣 (Muscular myoclonus)', en: 'Muscular myoclonus' },
          { zh: '聽神經病變 (Auditory neuropathy)', en: 'Auditory neuropathy' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。壓迫頸靜脈會阻斷靜脈回流，若耳鳴因此消失或減弱，強烈暗示為靜脈性來源。',
          en: 'The correct answer is B. Compressing the jugular vein blocks venous return; if the tinnitus disappears or weakens as a result, a venous source is strongly suggested.',
        },
      }),
      mcq({
        id: 'ear-pre-3',
        prompt: {
          zh: '根據 2015 年診斷準則，要確立「確定性梅尼爾氏症」，其自發性眩暈發作時間長度必須符合什麼條件？',
          en: "According to the 2015 diagnostic criteria, what duration criteria must the spontaneous vertigo attacks meet to establish definite Meniere's disease?",
        },
        options: [
          { zh: '發作 1 次，持續超過 24 小時。', en: '1 attack lasting more than 24 hours.' },
          { zh: '發作至少 2 次以上，每次持續 20 分鐘到 12 小時。', en: 'At least 2 attacks, each lasting 20 minutes to 12 hours.' },
          { zh: '發作至少 5 次，每次持續 5 分鐘到 72 小時。', en: 'At least 5 attacks, each lasting 5 minutes to 72 hours.' },
          { zh: '持續數秒鐘的姿勢性眩暈，伴隨眼震。', en: 'Positional vertigo lasting a few seconds, accompanied by nystagmus.' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。選項 C 其實是前庭性偏頭痛 (Vestibular migraine) 的標準；選項 D 則是 BPPV。',
          en: 'The correct answer is B. Option C is actually the criterion for vestibular migraine; option D describes BPPV.',
        },
      }),
      mcq({
        id: 'ear-pre-4',
        prompt: {
          zh: '在進行 HINTS 檢查時，下列哪一項發現最能支持「周邊性前庭神經炎」而非中樞型中風？',
          en: 'During a HINTS examination, which of the following findings best supports peripheral vestibular neuritis rather than a central stroke?',
        },
        options: [
          { zh: '出現純垂直性眼震 (Pure vertical nystagmus)。', en: 'Pure vertical nystagmus.' },
          { zh: '頭部脈衝測試 (HIT) 出現校正性眼球跳動 (Catch-up saccade)。', en: 'A catch-up saccade on the head impulse test (HIT).' },
          { zh: '檢查發現有眼球歪斜偏移 (Skew deviation)。', en: 'Skew deviation found on examination.' },
          { zh: '眼震方向會隨著注視方向改變而改變 (Direction-changing nystagmus)。', en: 'Direction-changing nystagmus, which changes direction with the direction of gaze.' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。HIT 異常代表周邊前庭功能低下；A/C/D 皆為中樞病灶 Red Flags。',
          en: 'The correct answer is B. An abnormal HIT indicates peripheral vestibular hypofunction; A/C/D are all red flags for a central lesion.',
        },
      }),
      mcq({
        id: 'ear-pre-5',
        prompt: {
          zh: '在耳內視鏡理學檢查中，下列哪一項發現是「次發性後天型膽脂瘤」最具特異性的典型特徵？',
          en: 'On otoendoscopic physical examination, which of the following findings is the most specific typical feature of secondary acquired cholesteatoma?',
        },
        options: [
          { zh: '緊張部 (Pars Tensa) 出現紅腫外凸。', en: 'A red, swollen, bulging pars tensa.' },
          { zh: '鬆弛部 (Pars Flaccida) 內陷袋中發現角質碎屑 (Keratin debris)。', en: 'Keratin debris in a retraction pocket of the pars flaccida.' },
          { zh: '中耳腔出現清澈積液與氣液面。', en: 'Clear fluid with an air-fluid level in the middle ear cavity.' },
          { zh: '耳膜表面出現出血性水泡 (Bullae formation)。', en: 'Hemorrhagic bullae formation on the surface of the eardrum.' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。上鼓室內陷袋中的角質碎屑是後天型膽脂瘤的標準特徵。',
          en: 'The correct answer is B. Keratin debris in an attic (epitympanic) retraction pocket is the hallmark feature of acquired cholesteatoma.',
        },
      }),
    ],
    postTest: [
      mcq({
        id: 'ear-post-1',
        prompt: {
          zh: '對於全身性類固醇治療無效的 ISSNHL 患者，若改採中耳腔內類固醇注射作為救援治療，最常見主要併發症為何？',
          en: 'For ISSNHL patients who do not respond to systemic corticosteroids, what is the most common major complication when intratympanic corticosteroid injection is used as salvage therapy?',
        },
        options: [
          { zh: '永久性顏面神經麻痺', en: 'Permanent facial nerve palsy' },
          { zh: '醫源性腦脊髓液漏 (CSF leakage)', en: 'Iatrogenic CSF leakage' },
          { zh: '內耳迷路炎 (Labyrinthitis)', en: 'Labyrinthitis' },
          { zh: '持續性的耳膜穿孔 (Persistent tympanic membrane perforation)', en: 'Persistent tympanic membrane perforation' },
        ],
        answer: 'D',
        explanation: {
          zh: '正確答案為 D。IT steroid 多次注射最主要併發症是耳膜持續性穿孔。',
          en: 'The correct answer is D. The main complication of repeated IT steroid injections is persistent perforation of the eardrum.',
        },
      }),
      mcq({
        id: 'ear-post-2',
        prompt: {
          zh: '針對「乙狀竇骨壁缺損」導致的搏動性耳鳴，文獻建議的核心外科手術機轉與目的為何？',
          en: 'For pulsatile tinnitus caused by a sigmoid sinus wall defect, what is the core surgical mechanism and goal recommended in the literature?',
        },
        options: [
          { zh: '經乳突重建乙狀竇壁 (Resurfacing)，建立堅硬屏障隔絕噪音傳導。', en: 'Transmastoid resurfacing of the sigmoid sinus wall to build a rigid barrier that blocks sound transmission.' },
          { zh: '內頸靜脈結紮術 (IJV ligation) 徹底阻斷血流。', en: 'IJV ligation to completely block blood flow.' },
          { zh: '乙狀竇完全切除術 (Sigmoid sinus excision)。', en: 'Sigmoid sinus excision.' },
          { zh: '迷路切除術 (Labyrinthectomy) 直接破壞聽覺接收器。', en: 'Labyrinthectomy to directly destroy the auditory receptors.' },
        ],
        answer: 'A',
        explanation: {
          zh: '正確答案為 A。手術精髓為重建隔音牆 (Resurfacing)，並避免過度壓迫乙狀竇。',
          en: 'The correct answer is A. The essence of the surgery is rebuilding the sound-insulating wall (resurfacing) while avoiding excessive compression of the sigmoid sinus.',
        },
      }),
      mcq({
        id: 'ear-post-3',
        prompt: {
          zh: '面對聽力已嚴重喪失且出現 Tumarkin crisis 的頑固型病患，強烈建議採用哪一種耳內注射治療？',
          en: 'For a refractory patient with severe hearing loss who is having Tumarkin crises, which intratympanic injection therapy is strongly recommended?',
        },
        options: [
          { zh: '耳內注射類固醇 (Dexamethasone)', en: 'Intratympanic corticosteroid (Dexamethasone)' },
          { zh: '耳內注射慶大黴素 (Gentamicin)', en: 'Intratympanic Gentamicin' },
          { zh: '耳內注射玻尿酸 (Hyaluronic acid)', en: 'Intratympanic hyaluronic acid' },
          { zh: '耳內注射利多卡因 (Lidocaine)', en: 'Intratympanic Lidocaine' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。Gentamicin 化學性破壞前庭神經，可有效停止危險眩暈。',
          en: 'The correct answer is B. Gentamicin chemically destroys the vestibular nerve and can effectively stop dangerous vertigo.',
        },
      }),
      mcq({
        id: 'ear-post-4',
        prompt: {
          zh: '針對確診急性前庭神經炎病患，關於急性期與長期處置建議，下列何者最正確？',
          en: 'For a patient with confirmed acute vestibular neuritis, which of the following recommendations on acute and long-term management is most correct?',
        },
        options: [
          { zh: '應立即執行耳石復位術 (Epley Maneuver)。', en: 'Perform the Epley Maneuver immediately.' },
          { zh: '建議長期絕對臥床休息。', en: 'Recommend prolonged strict bed rest.' },
          { zh: '急性期可給高劑量類固醇，且症狀緩解後應盡早開始前庭復健 (Early VRT)。', en: 'High-dose corticosteroids may be given in the acute phase, and vestibular rehabilitation should start as early as possible once symptoms ease (Early VRT).' },
          { zh: '長期開立前庭抑制劑直到眩暈完全消失。', en: 'Prescribe vestibular suppressants long-term until the vertigo has completely resolved.' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。Early VRT 可促進中樞代償；長期抑制劑與臥床反而不利恢復。',
          en: 'The correct answer is C. Early VRT promotes central compensation; long-term suppressants and bed rest actually hinder recovery.',
        },
      }),
      mcq({
        id: 'ear-post-5',
        prompt: {
          zh: '懷疑中耳膽脂瘤病患做 HRCT 時，最常見哪個骨性構造破壞？後續標準處置為何？',
          en: 'When HRCT is performed for suspected middle ear cholesteatoma, which bony structure is most commonly destroyed, and what is the standard subsequent management?',
        },
        options: [
          { zh: '內聽道擴大；安排加馬刀放療。', en: 'Widened internal auditory canal; arrange Gamma Knife radiotherapy.' },
          { zh: '盾狀骨 (Scutum) 侵蝕；需安排乳突鑿開與鼓室成形術清除。', en: 'Erosion of the scutum; arrange mastoidectomy and tympanoplasty for removal.' },
          { zh: '半規管完全骨化；持續點耳滴劑觀察。', en: 'Complete ossification of the semicircular canals; continue ear drops and observe.' },
          { zh: '乙狀竇骨壁缺損；常規靜脈抗生素即可。', en: 'Sigmoid sinus wall defect; routine intravenous antibiotics are sufficient.' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。CT 初期典型徵象是 Scutum 與聽小骨侵蝕，需手術徹底清除。',
          en: 'The correct answer is B. The typical early CT sign is erosion of the scutum and ossicles, and thorough surgical removal is required.',
        },
      }),
    ],
  },
  throat: {
    preTest: [
      mcq({
        id: 'throat-pre-1',
        prompt: {
          zh: '在門診評估疑似 OSA 患者時，若要快速篩檢中重度高風險族群，哪份問卷最廣泛推薦？',
          en: 'When evaluating a patient with suspected OSA in clinic, which questionnaire is most widely recommended for quickly screening for the moderate-to-severe high-risk group?',
        },
        options: [
          { zh: '匹茲堡睡眠品質量表 (PSQI)', en: 'Pittsburgh Sleep Quality Index (PSQI)' },
          { zh: 'STOP-Bang questionnaire', en: 'STOP-Bang questionnaire' },
          { zh: '艾普沃斯嗜睡量表 (ESS)', en: 'Epworth Sleepiness Scale (ESS)' },
          { zh: '柏林問卷 (Berlin Questionnaire)', en: 'Berlin Questionnaire' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。STOP-Bang 具高敏感度，是快速篩檢中重度 OSA 的最佳工具。',
          en: 'The correct answer is B. STOP-Bang has high sensitivity and is the best tool for quickly screening for moderate-to-severe OSA.',
        },
      }),
      mcq({
        id: 'throat-pre-2',
        prompt: {
          zh: '成人反覆性扁桃腺炎的主要致病菌種通常為哪兩者？',
          en: 'Which two organisms are usually the main pathogens in adult recurrent tonsillitis?',
        },
        options: [
          { zh: '僅 A 群 β-溶血性鏈球菌 (GABHS)', en: 'Group A β-hemolytic Streptococcus (GABHS) only' },
          { zh: '綠膿桿菌與退伍軍人菌', en: 'Pseudomonas aeruginosa and Legionella' },
          { zh: '嗜血桿菌 (H. influenzae) 與金黃色葡萄球菌 (S. aureus)', en: 'H. influenzae and S. aureus' },
          { zh: '厭氧菌與白色念珠菌', en: 'Anaerobes and Candida albicans' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。這也是短期抗生素常無法根除反覆性發作的原因。',
          en: 'The correct answer is C. This is also why short courses of antibiotics often fail to eradicate recurrent episodes.',
        },
      }),
      mcq({
        id: 'throat-pre-3',
        prompt: {
          zh: '面對新發現甲狀腺結節，除超音波外第一線常規必抽哪個荷爾蒙指標？',
          en: 'For a newly discovered thyroid nodule, besides ultrasound, which hormone marker must be routinely drawn as a first-line test?',
        },
        options: [
          { zh: '降鈣素 (Calcitonin)', en: 'Calcitonin' },
          { zh: '甲狀腺球蛋白 (Tg)', en: 'Thyroglobulin (Tg)' },
          { zh: '血清甲狀腺刺激素 (Serum TSH)', en: 'Serum TSH' },
          { zh: '游離甲狀腺素 (Free T4)', en: 'Free T4' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。TSH 是甲狀腺結節評估的標準起手式。',
          en: 'The correct answer is C. TSH is the standard first step in evaluating a thyroid nodule.',
        },
      }),
      mcq({
        id: 'throat-pre-4',
        prompt: {
          zh: '根據 GRBAS，若病患 B (Breathiness) 分數極高，暗示聲帶何種生理異常？',
          en: "On the GRBAS scale, if a patient's B (Breathiness) score is very high, what physiological abnormality of the vocal folds does this suggest?",
        },
        options: [
          { zh: '聲帶震動極度不規律', en: 'Extremely irregular vocal fold vibration' },
          { zh: '聲帶無法完全閉合', en: 'Incomplete closure of the vocal folds' },
          { zh: '聲帶張力過高', en: 'Excessive vocal fold tension' },
          { zh: '假聲帶過度代償擠壓', en: 'Excessive compensatory squeezing of the false vocal folds' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。高氣息聲表示聲門閉合不全，發聲時空氣大量漏出。',
          en: 'The correct answer is B. A highly breathy voice indicates incomplete glottic closure, with a large amount of air escaping during phonation.',
        },
      }),
      mcq({
        id: 'throat-pre-5',
        prompt: {
          zh: '急診面對 Ludwig\'s angina 舌根後推堵塞口咽時，暫時維持氣流最適合安全的人工氣道為何？',
          en: "In the emergency department, when Ludwig's angina pushes the tongue base backward and obstructs the oropharynx, which artificial airway is most suitable and safe for temporarily maintaining airflow?",
        },
        options: [
          { zh: '口咽呼吸道 (Oral/Guedel airway)', en: 'Oral/Guedel airway' },
          { zh: '鼻咽呼吸道 (Nasopharyngeal airway)', en: 'Nasopharyngeal airway' },
          { zh: '喉罩呼吸道 (LMA)', en: 'Laryngeal mask airway (LMA)' },
          { zh: '盲目經口氣管插管', en: 'Blind orotracheal intubation' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。鼻咽呼吸道可越過後推舌根；有作嘔反射時不適合口咽呼吸道。',
          en: 'The correct answer is B. A nasopharyngeal airway can bypass the backward-displaced tongue base; an oropharyngeal airway is unsuitable when a gag reflex is present.',
        },
      }),
    ],
    postTest: [
      mcq({
        id: 'throat-post-1',
        prompt: {
          zh: '無法適應 CPAP 而考慮改用 ASV 的病患，醫師必須確認沒有哪種病史以免死亡率上升？',
          en: 'For a patient who cannot tolerate CPAP and is being considered for ASV, which history must the physician rule out to avoid increased mortality?',
        },
        options: [
          { zh: '嚴重慢性阻塞性肺病 (Severe COPD)', en: 'Severe COPD' },
          { zh: '第 II 型糖尿病 (Type 2 DM)', en: 'Type 2 DM' },
          { zh: '伴隨低 LVEF 的心臟衰竭', en: 'Heart failure with low LVEF' },
          { zh: '難治型高血壓 (Refractory hypertension)', en: 'Refractory hypertension' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。SERVE-HF 證實 LVEF ≤ 45% 心衰竭患者使用 ASV 會增加心血管死亡率。',
          en: 'The correct answer is C. SERVE-HF showed that ASV increases cardiovascular mortality in heart failure patients with LVEF ≤ 45%.',
        },
      }),
      mcq({
        id: 'throat-post-2',
        prompt: {
          zh: '扁桃腺切除術後第 5-10 天發生次發性出血，常與局部感染有關，標準第一線處置為何？',
          en: 'Secondary hemorrhage on days 5-10 after tonsillectomy is often related to local infection. What is the standard first-line management?',
        },
        options: [
          { zh: '立即進開刀房重新縫合', en: 'Return to the operating room immediately for re-suturing' },
          { zh: '單純給予口服或靜脈抗生素治療', en: 'Oral or intravenous antibiotics alone' },
          { zh: '輸注新鮮冷凍血漿 (FFP)', en: 'Fresh frozen plasma (FFP) transfusion' },
          { zh: '局部注射高濃度腎上腺素', en: 'Local injection of high-concentration epinephrine' },
        ],
        answer: 'B',
        explanation: {
          zh: '正確答案為 B。多數次發性出血給予抗生素即會自行止血，極少需再次手術。',
          en: 'The correct answer is B. Most secondary hemorrhages stop on their own once antibiotics are given; repeat surgery is rarely needed.',
        },
      }),
      mcq({
        id: 'throat-post-3',
        prompt: {
          zh: '根據 2025 ATA 指引，<2 公分、無 ETE、cN0 的乳突癌首選手術範圍為何？',
          en: 'According to the 2025 ATA guidelines, what is the preferred extent of surgery for papillary carcinoma <2 cm, without ETE, and cN0?',
        },
        options: [
          { zh: '單側甲狀腺葉切除術 (Lobectomy)，不建議常規預防性中央頸部淋巴廓清 (pCLND)。', en: 'Lobectomy, without routine prophylactic central neck dissection (pCLND).' },
          { zh: '單側葉切除且強制同側 pCLND。', en: 'Lobectomy with mandatory ipsilateral pCLND.' },
          { zh: '必須甲狀腺全切除術。', en: 'Total thyroidectomy is required.' },
          { zh: '無線電頻率燒灼 (RFA) 即可。', en: 'Radiofrequency ablation (RFA) is sufficient.' },
        ],
        answer: 'A',
        explanation: {
          zh: '正確答案為 A。2025 ATA 擴大 Lobectomy 角色，且更不建議 T1-T2 cN0 常規 pCLND。',
          en: 'The correct answer is A. The 2025 ATA guidelines expand the role of lobectomy and further advise against routine pCLND for T1-T2 cN0 disease.',
        },
      }),
      mcq({
        id: 'throat-post-4',
        prompt: {
          zh: '喉顯微手術移除聲帶黏膜下病灶採用 Microflap 的核心原則是？',
          en: 'What is the core principle of the microflap technique when removing a submucosal vocal fold lesion by laryngeal microsurgery?',
        },
        options: [
          { zh: '深切到聲帶肌肉層徹底挖除', en: 'Cut deep into the vocalis muscle layer and dig the lesion out completely' },
          { zh: '大範圍切除周圍正常組織', en: 'Widely excise the surrounding normal tissue' },
          { zh: '切口靠近病灶且維持極淺層剝離，最小化正常組織破壞', en: 'Place the incision close to the lesion and keep the dissection very superficial, minimizing damage to normal tissue' },
          { zh: '高功率 CO2 雷射大範圍氣化', en: 'Wide vaporization with a high-power CO2 laser' },
        ],
        answer: 'C',
        explanation: {
          zh: '正確答案為 C。Microflap 關鍵是保留正常黏膜與韌帶，避免疤痕造成永久發聲障礙。',
          en: 'The correct answer is C. The key to the microflap is preserving the normal mucosa and ligament, avoiding scarring that causes permanent voice disorders.',
        },
      }),
      mcq({
        id: 'throat-post-5',
        prompt: {
          zh: 'Ludwig\'s angina 若發生 CICO 並做緊急環甲膜切開後，為何穩定後需盡快轉正式氣切？',
          en: "If CICO occurs in Ludwig's angina and an emergency cricothyroidotomy is performed, why must it be converted to a formal tracheostomy as soon as possible once the patient is stable?",
        },
        options: [
          { zh: '長期放置會摩擦環狀軟骨，導致聲門下狹窄。', en: 'Long-term placement rubs against the cricoid cartilage and causes subglottic stenosis.' },
          { zh: '會壓迫雙側喉返神經導致永久失聲。', en: 'It compresses both recurrent laryngeal nerves and causes permanent loss of voice.' },
          { zh: '會加速深頸部膿瘍灌入肺部。', en: 'It speeds the spread of the deep neck abscess into the lungs.' },
          { zh: '容易誘發甲狀腺風暴。', en: 'It readily triggers thyroid storm.' },
        ],
        answer: 'A',
        explanation: {
          zh: '正確答案為 A。Cricothyroidotomy 僅暫時救命，需盡快改氣切避免後續聲門下狹窄。',
          en: 'The correct answer is A. Cricothyroidotomy is only a temporary life-saving measure; it should be converted to a tracheostomy as soon as possible to avoid later subglottic stenosis.',
        },
      }),
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
