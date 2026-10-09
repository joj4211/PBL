// Case Catalogue: the single source of Case identity, content, and Domain membership.
// A Case's id is its folder name; the legacy phase-flow example is not part of the catalogue.
import { domains } from '../config/domains';

const LEGACY_EXAMPLE_ID = 'ear_vestibular_neuritis';

const caseFiles = import.meta.glob('./*/*.json', { eager: true, import: 'default' });

const contentByLang = { zh: {}, en: {} };
for (const [path, content] of Object.entries(caseFiles)) {
  const [, id, fileName] = path.split('/');
  const lang = fileName.slice(id.length + 1, -'.json'.length);
  if (id === LEGACY_EXAMPLE_ID || !contentByLang[lang]) continue;
  contentByLang[lang][id] = { ...content, id };
}

export function getCase(id, lang) {
  const content = contentByLang[lang]?.[id];
  if (!content) throw new Error(`Unknown case "${id}" for language "${lang}"`);
  return content;
}

function findDomain(domainId) {
  const domain = domains.find((d) => d.id === domainId);
  if (!domain) throw new Error(`Unknown domain "${domainId}"`);
  return domain;
}

export function listDomainCases(domainId, lang) {
  return findDomain(domainId).caseIds.map((id) => {
    const { title, subtitle, difficulty, estimatedTime } = getCase(id, lang);
    return { id, title, subtitle, difficulty, estimatedTime };
  });
}

export function domainOf(id) {
  const domain = domains.find((d) => d.caseIds.includes(id));
  if (!domain) throw new Error(`Case "${id}" is not listed in any domain`);
  return domain;
}
