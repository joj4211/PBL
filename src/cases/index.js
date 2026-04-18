import case01Zh from './case_01/case_01.zh.json';
import case01En from './case_01/case_01.en.json';

const contentByLang = {
  zh: { case_01: case01Zh },
  en: { case_01: case01En },
};

export function getCase(id, lang = 'zh') {
  return contentByLang[lang]?.[id] ?? contentByLang['zh']?.[id] ?? null;
}

export const defaultCaseId = 'case_01';
