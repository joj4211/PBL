export const domains = [
  {
    id: 'ear',
    zh: { title: '耳科', subtitle: 'Otology', tags: ['Vertigo', 'Hearing Loss', 'Otitis', 'Vestibular'] },
    en: { title: 'Otology', subtitle: '耳科', tags: ['Vertigo', 'Hearing Loss', 'Otitis', 'Vestibular'] },
    icon: '👂',
    color: 'amber',
    cases: [{ id: 'ear_vestibular_neuritis', zh: '前庭神經炎', en: 'Vestibular Neuritis' }],
  },
  {
    id: 'nose',
    zh: { title: '鼻科', subtitle: 'Rhinology', tags: ['Rhinitis', 'Sinusitis', 'Epistaxis', 'Nasal Obstruction'] },
    en: { title: 'Rhinology', subtitle: '鼻科', tags: ['Rhinitis', 'Sinusitis', 'Epistaxis', 'Nasal Obstruction'] },
    icon: '👃',
    color: 'sage',
    cases: [
      { id: 'nose_allergic_rhinitis', zh: '鼻水背後的拼圖', en: 'The Allergic Puzzle' },
      { id: 'nose_ecrswnp', zh: '無聲蔓延的鼻息肉', en: 'The Silent Polyposis' },
      { id: 'nose_epistaxis_hht', zh: '血流不止的危機：嚴重鼻出血與 HHT', en: 'The Unstoppable Red Tide' },
      { id: 'nose_npc', zh: '隱匿的危機：頸部腫塊與無聲的鼻咽癌', en: 'The Hidden Threat: Nasopharyngeal Carcinoma' },
      { id: 'nose_caudal_deviation', zh: 'The Complex Blockage: Beyond the Mucosa', en: 'The Complex Blockage: Beyond the Mucosa' },
    ],
  },
  {
    id: 'throat',
    zh: { title: '喉科', subtitle: 'Laryngology', tags: ['Hoarseness', 'Dysphagia', 'Airway', 'Laryngitis'] },
    en: { title: 'Laryngology', subtitle: '喉科', tags: ['Hoarseness', 'Dysphagia', 'Airway', 'Laryngitis'] },
    icon: '🗣️',
    color: 'rose',
    cases: [],
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
