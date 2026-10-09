export const domains = [
  {
    id: 'ear',
    zh: { title: '耳科', subtitle: '前庭、聽力與中耳疾病', tags: ['眩暈', '聽力損失', '中耳炎', '前庭功能'] },
    en: { title: 'Otology', subtitle: 'Vestibular, hearing, and middle ear disorders', tags: ['Vertigo', 'Hearing Loss', 'Otitis', 'Vestibular'] },
    icon: '👂',
    color: 'amber',
    caseIds: [
      'ear_menieres_disease',
      'ear_sudden_hearing_loss',
      'ear_pulsatile_tinnitus',
      'ear_spinning_world_acute_vestibular_neuritis',
      'ear_cholesteatoma_silent_erosion',
    ],
  },
  {
    id: 'nose',
    zh: { title: '鼻科', subtitle: '鼻炎、鼻竇炎與鼻阻塞', tags: ['鼻炎', '鼻竇炎', '鼻出血', '鼻阻塞'] },
    en: { title: 'Rhinology', subtitle: 'Rhinitis, sinusitis, and nasal obstruction', tags: ['Rhinitis', 'Sinusitis', 'Epistaxis', 'Nasal Obstruction'] },
    icon: '👃',
    color: 'sage',
    caseIds: [
      'nose_allergic_rhinitis',
      'nose_ecrswnp',
      'nose_epistaxis_hht',
      'nose_npc',
      'nose_caudal_deviation',
    ],
  },
  {
    id: 'throat',
    zh: { title: '喉科', subtitle: '嗓音、吞嚥與呼吸道問題', tags: ['聲音沙啞', '吞嚥困難', '呼吸道', '喉炎'] },
    en: { title: 'Laryngology', subtitle: 'Voice, swallowing, and airway problems', tags: ['Hoarseness', 'Dysphagia', 'Airway', 'Laryngitis'] },
    icon: '🗣️',
    color: 'rose',
    caseIds: [
      'throat_hoarseness_vocal_polyp',
      'throat_osas',
      'throat_thyroid_nodule',
      'throat_recurrent_tonsillitis',
      'throat_ludwigs_angina_airway',
    ],
  },
];

export const domainColorMap = {
  amber: { border: 'border-amber-200', iconBg: 'bg-amber-100', text: 'text-amber-600', tagBg: 'bg-amber-50', tagBorder: 'border-amber-200', countBg: 'bg-amber-100 text-amber-700' },
  sage:  { border: 'border-sage-200',  iconBg: 'bg-sage-100',  text: 'text-sage-600',  tagBg: 'bg-sage-50',  tagBorder: 'border-sage-200',  countBg: 'bg-sage-100 text-sage-700' },
  rose:  { border: 'border-rose-200',  iconBg: 'bg-rose-100',  text: 'text-rose-600',  tagBg: 'bg-rose-50',  tagBorder: 'border-rose-200',  countBg: 'bg-rose-100 text-rose-700' },
};
