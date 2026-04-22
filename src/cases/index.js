import earVestibularNeuritisZh from './ear_vestibular_neuritis/ear_vestibular_neuritis.zh.json';
import earVestibularNeuritisEn from './ear_vestibular_neuritis/ear_vestibular_neuritis.en.json';
import earMenieresDiseaseZh from './ear_menieres_disease/ear_menieres_disease.zh.json';
import earMenieresDiseaseEn from './ear_menieres_disease/ear_menieres_disease.en.json';
import earSuddenHearingLossZh from './ear_sudden_hearing_loss/ear_sudden_hearing_loss.zh.json';
import earSuddenHearingLossEn from './ear_sudden_hearing_loss/ear_sudden_hearing_loss.en.json';
import earPulsatileTinnitusZh from './ear_pulsatile_tinnitus/ear_pulsatile_tinnitus.zh.json';
import earPulsatileTinnitusEn from './ear_pulsatile_tinnitus/ear_pulsatile_tinnitus.en.json';
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
import throatHoarsenessVocalPolypZh from './throat_hoarseness_vocal_polyp/throat_hoarseness_vocal_polyp.zh.json';
import throatHoarsenessVocalPolypEn from './throat_hoarseness_vocal_polyp/throat_hoarseness_vocal_polyp.en.json';
import throatOsasZh from './throat_osas/throat_osas.zh.json';
import throatOsasEn from './throat_osas/throat_osas.en.json';
import throatThyroidNoduleZh from './throat_thyroid_nodule/throat_thyroid_nodule.zh.json';
import throatThyroidNoduleEn from './throat_thyroid_nodule/throat_thyroid_nodule.en.json';
import throatRecurrentTonsillitisZh from './throat_recurrent_tonsillitis/throat_recurrent_tonsillitis.zh.json';
import throatRecurrentTonsillitisEn from './throat_recurrent_tonsillitis/throat_recurrent_tonsillitis.en.json';
import throatLudwigsAnginaAirwayZh from './throat_ludwigs_angina_airway/throat_ludwigs_angina_airway.zh.json';
import throatLudwigsAnginaAirwayEn from './throat_ludwigs_angina_airway/throat_ludwigs_angina_airway.en.json';

export const defaultCaseId = 'ear_vestibular_neuritis';

export const caseIds = [
  'ear_vestibular_neuritis',
  'ear_menieres_disease',
  'ear_sudden_hearing_loss',
  'ear_pulsatile_tinnitus',
  'nose_allergic_rhinitis',
  'nose_ecrswnp',
  'nose_epistaxis_hht',
  'nose_npc',
  'nose_caudal_deviation',
  'throat_hoarseness_vocal_polyp',
  'throat_osas',
  'throat_thyroid_nodule',
  'throat_recurrent_tonsillitis',
  'throat_ludwigs_angina_airway',
];

const contentByLang = {
  zh: {
    ear_vestibular_neuritis: earVestibularNeuritisZh,
    ear_menieres_disease: earMenieresDiseaseZh,
    ear_sudden_hearing_loss: earSuddenHearingLossZh,
    ear_pulsatile_tinnitus: earPulsatileTinnitusZh,
    nose_allergic_rhinitis: noseAllergicRhinitisZh,
    nose_ecrswnp: noseEcrswnpZh,
    nose_epistaxis_hht: noseEpistaxisHhtZh,
    nose_npc: noseNpcZh,
    nose_caudal_deviation: noseCaudalDeviationZh,
    throat_hoarseness_vocal_polyp: throatHoarsenessVocalPolypZh,
    throat_osas: throatOsasZh,
    throat_thyroid_nodule: throatThyroidNoduleZh,
    throat_recurrent_tonsillitis: throatRecurrentTonsillitisZh,
    throat_ludwigs_angina_airway: throatLudwigsAnginaAirwayZh,
  },
  en: {
    ear_vestibular_neuritis: earVestibularNeuritisEn,
    ear_menieres_disease: earMenieresDiseaseEn,
    ear_sudden_hearing_loss: earSuddenHearingLossEn,
    ear_pulsatile_tinnitus: earPulsatileTinnitusEn,
    nose_allergic_rhinitis: noseAllergicRhinitisEn,
    nose_ecrswnp: noseEcrswnpEn,
    nose_epistaxis_hht: noseEpistaxisHhtEn,
    nose_npc: noseNpcEn,
    nose_caudal_deviation: noseCaudalDeviationEn,
    throat_hoarseness_vocal_polyp: throatHoarsenessVocalPolypEn,
    throat_osas: throatOsasEn,
    throat_thyroid_nodule: throatThyroidNoduleEn,
    throat_recurrent_tonsillitis: throatRecurrentTonsillitisEn,
    throat_ludwigs_angina_airway: throatLudwigsAnginaAirwayEn,
  },
};

export function getCase(id, lang = 'zh') {
  return contentByLang[lang]?.[id] ?? contentByLang.zh?.[id] ?? null;
}

export function getStepCase(id, lang = 'zh') {
  const caseData = getCase(id, lang);
  return caseData?.steps?.length ? caseData : null;
}

export function getNoseCase(id, lang = 'zh') {
  return id?.startsWith('nose_') ? getStepCase(id, lang) : null;
}
