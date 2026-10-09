// The archived phase-flow example lives outside the Case Catalogue and loads its own JSON.
import legacyExampleZh from './ear_vestibular_neuritis/ear_vestibular_neuritis.zh.json';
import legacyExampleEn from './ear_vestibular_neuritis/ear_vestibular_neuritis.en.json';

const LEGACY_EXAMPLE_ID = 'ear_vestibular_neuritis';
const zh = { ...legacyExampleZh, id: LEGACY_EXAMPLE_ID };
// A language whose JSON is emptied ({}) falls back to zh.
const en = Object.keys(legacyExampleEn).length > 0 ? { ...legacyExampleEn, id: LEGACY_EXAMPLE_ID } : zh;
const exampleByLang = { zh, en };

export function getLegacyExample(lang) {
  return exampleByLang[lang] ?? zh;
}
