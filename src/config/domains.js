export const domains = [
  {
    id: 'ear',
    zh: { title: '耳科', subtitle: '前庭、聽力與中耳疾病', tags: ['眩暈', '聽力損失', '中耳炎', '前庭功能'] },
    en: { title: 'Otology', subtitle: 'Vestibular, hearing, and middle ear disorders', tags: ['Vertigo', 'Hearing Loss', 'Otitis', 'Vestibular'] },
    icon: '👂',
    color: 'amber',
    cases: [
      { id: 'ear_menieres_disease', zh: '天旋地轉與低鳴的浪潮', en: 'The Waves of Vertigo' },
      { id: 'ear_sudden_hearing_loss', zh: '世界突然安靜', en: 'The Silent World' },
      { id: 'ear_pulsatile_tinnitus', zh: '搏動的雜訊與耳悶之謎', en: 'The Pulsating Noise & Blocked Ears' },
      { id: 'ear_spinning_world_acute_vestibular_neuritis', zh: '天旋地轉的急診挑戰', en: 'The Spinning World: ED Challenge' },
      { id: 'ear_cholesteatoma_silent_erosion', zh: '膽脂瘤', en: 'Cholesteatoma: Silent Erosion' },
    ],
  },
  {
    id: 'nose',
    zh: { title: '鼻科', subtitle: '鼻炎、鼻竇炎與鼻阻塞', tags: ['鼻炎', '鼻竇炎', '鼻出血', '鼻阻塞'] },
    en: { title: 'Rhinology', subtitle: 'Rhinitis, sinusitis, and nasal obstruction', tags: ['Rhinitis', 'Sinusitis', 'Epistaxis', 'Nasal Obstruction'] },
    icon: '👃',
    color: 'sage',
    cases: [
      { id: 'nose_allergic_rhinitis', zh: '鼻水背後的拼圖', en: 'The Allergic Puzzle' },
      { id: 'nose_ecrswnp', zh: '無聲蔓延的鼻息肉', en: 'The Silent Polyposis' },
      { id: 'nose_epistaxis_hht', zh: '血流不止的危機：嚴重鼻出血與 HHT', en: 'The Unstoppable Red Tide' },
      { id: 'nose_npc', zh: '隱匿的危機：頸部腫塊與無聲的鼻咽癌', en: 'The Hidden Threat: Nasopharyngeal Carcinoma' },
      { id: 'nose_caudal_deviation', zh: '複雜的鼻阻塞：不只是黏膜問題', en: 'The Complex Blockage: Beyond the Mucosa' },
    ],
  },
  {
    id: 'throat',
    zh: { title: '喉科', subtitle: '嗓音、吞嚥與呼吸道問題', tags: ['聲音沙啞', '吞嚥困難', '呼吸道', '喉炎'] },
    en: { title: 'Laryngology', subtitle: 'Voice, swallowing, and airway problems', tags: ['Hoarseness', 'Dysphagia', 'Airway', 'Laryngitis'] },
    icon: '🗣️',
    color: 'rose',
    cases: [
      { id: 'throat_hoarseness_vocal_polyp', zh: '油漆工的沙啞嗓音', en: "The Painter's Hoarse Voice" },
      { id: 'throat_osas', zh: '沉睡中的窒息與危機', en: 'The Silent Choke & Surgical Crisis' },
      { id: 'throat_thyroid_nodule', zh: '頸部的隱形炸彈：甲狀腺結節的精準評估', en: 'The Hidden Nodule' },
      { id: 'throat_recurrent_tonsillitis', zh: '反覆燃燒的咽喉', en: 'The Burning Throat' },
      { id: 'throat_ludwigs_angina_airway', zh: "深頸部的致命窒息：Ludwig's Angina 氣道保衛戰", en: 'The Deadly Swell' },
    ],
  },
];

export const domainColorMap = {
  amber: { border: 'border-amber-200', iconBg: 'bg-amber-100', text: 'text-amber-600', tagBg: 'bg-amber-50', tagBorder: 'border-amber-200', countBg: 'bg-amber-100 text-amber-700' },
  sage:  { border: 'border-sage-200',  iconBg: 'bg-sage-100',  text: 'text-sage-600',  tagBg: 'bg-sage-50',  tagBorder: 'border-sage-200',  countBg: 'bg-sage-100 text-sage-700' },
  rose:  { border: 'border-rose-200',  iconBg: 'bg-rose-100',  text: 'text-rose-600',  tagBg: 'bg-rose-50',  tagBorder: 'border-rose-200',  countBg: 'bg-rose-100 text-rose-700' },
};

export function getDomainByCaseId(caseId) {
  return domains.find((domain) => domain.cases.some((caseItem) => caseItem.id === caseId)) ?? domains[0];
}
