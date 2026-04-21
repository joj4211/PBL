import earVestibularNeuritisZh from './ear_vestibular_neuritis/ear_vestibular_neuritis.zh.json';
import earVestibularNeuritisEn from './ear_vestibular_neuritis/ear_vestibular_neuritis.en.json';
import noseAllergicRhinitisZh from './nose_allergic_rhinitis/nose_allergic_rhinitis.zh.json';
import noseAllergicRhinitisEn from './nose_allergic_rhinitis/nose_allergic_rhinitis.en.json';
import noseEcrswnpZh from './nose_ecrswnp/nose_ecrswnp.zh.json';
import noseEcrswnpEn from './nose_ecrswnp/nose_ecrswnp.en.json';
import noseEpistaxisHhtZh from './nose_epistaxis_hht/nose_epistaxis_hht.zh.json';
import noseEpistaxisHhtEn from './nose_epistaxis_hht/nose_epistaxis_hht.en.json';
import noseNpcZh from './nose_npc/nose_npc.zh.json';
import noseNpcEn from './nose_npc/nose_npc.en.json';
import noseCaudalDeviationZh from './nose_caudal_deviation/nose_caudal_deviation.zh.json';
import noseCaudalDeviationEn from './nose_caudal_deviation/nose_caudal_deviation.en.json';

export const defaultCaseId = 'ear_vestibular_neuritis';

export const caseIds = [
  'ear_vestibular_neuritis',
  'nose_allergic_rhinitis',
  'nose_ecrswnp',
  'nose_epistaxis_hht',
  'nose_npc',
  'nose_caudal_deviation',
];

const contentByLang = {
  zh: {
    ear_vestibular_neuritis: earVestibularNeuritisZh,
    nose_allergic_rhinitis: noseAllergicRhinitisZh,
    nose_ecrswnp: noseEcrswnpZh,
    nose_epistaxis_hht: noseEpistaxisHhtZh,
    nose_npc: noseNpcZh,
    nose_caudal_deviation: noseCaudalDeviationZh,
  },
  en: {
    ear_vestibular_neuritis: earVestibularNeuritisEn,
    nose_allergic_rhinitis: noseAllergicRhinitisEn,
    nose_ecrswnp: noseEcrswnpEn,
    nose_epistaxis_hht: noseEpistaxisHhtEn,
    nose_npc: noseNpcEn,
    nose_caudal_deviation: noseCaudalDeviationEn,
  },
};

export function getCase(id, lang = 'zh') {
  return contentByLang[lang]?.[id] ?? contentByLang.zh?.[id] ?? null;
}

export function getNoseCase(id, lang = 'zh') {
  return id?.startsWith('nose_') ? getCase(id, lang) : null;
}
