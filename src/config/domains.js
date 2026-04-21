export const domains = [
  {
    id: 'ear',
    zh: { title: '耳科', subtitle: 'Otology', tags: ['Vertigo', 'Hearing Loss', 'Otitis', 'Vestibular'] },
    en: { title: 'Otology', subtitle: '耳科', tags: ['Vertigo', 'Hearing Loss', 'Otitis', 'Vestibular'] },
    icon: '👂',
    color: 'amber',
    cases: [{ id: 'case_01', zh: '前庭神經炎', en: 'Vestibular Neuritis' }],
  },
  {
    id: 'nose',
    zh: { title: '鼻科', subtitle: 'Rhinology', tags: ['Rhinitis', 'Sinusitis', 'Epistaxis', 'Nasal Obstruction'] },
    en: { title: 'Rhinology', subtitle: '鼻科', tags: ['Rhinitis', 'Sinusitis', 'Epistaxis', 'Nasal Obstruction'] },
    icon: '👃',
    color: 'sage',
    cases: [],
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
