import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { domains } from '../config/domains';
import { domainOf, getCase, listDomainCases } from './catalogue';

const LANGS = ['zh', 'en'];
const LEGACY_EXAMPLE_ID = 'ear_vestibular_neuritis';
const listedCaseIds = domains.flatMap((domain) => domain.caseIds);
const caseFolders = readdirSync(new URL('.', import.meta.url), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && entry.name !== LEGACY_EXAMPLE_ID)
  .map((entry) => entry.name);

describe('getCase', () => {
  it.each(listedCaseIds)('returns zh and en content for %s with the folder name as id', (id) => {
    for (const lang of LANGS) {
      expect(getCase(id, lang).id).toBe(id);
    }
  });

  it.each(listedCaseIds)('has the same non-zero step count in zh and en for %s', (id) => {
    const zhSteps = getCase(id, 'zh').steps;
    const enSteps = getCase(id, 'en').steps;
    expect(zhSteps.length).toBeGreaterThan(0);
    expect(enSteps.length).toBe(zhSteps.length);
  });

  const stepAnswers = (id, lang) =>
    getCase(id, lang).steps.map((step) => ({
      optionIds: step.options.map((option) => option.id),
      correctIds: step.options.filter((option) => option.correct).map((option) => option.id),
    }));

  it.each(listedCaseIds)(
    'has the same option ids and correct options in zh and en for every step of %s',
    (id) => {
      expect(stepAnswers(id, 'zh')).toEqual(stepAnswers(id, 'en'));
    },
  );
});

describe('Case JSON', () => {
  it.each(caseFolders)('has no id field in %s, since the folder name is the identity', (id) => {
    for (const lang of LANGS) {
      const raw = JSON.parse(readFileSync(new URL(`./${id}/${id}.${lang}.json`, import.meta.url), 'utf8'));
      expect(raw).not.toHaveProperty('id');
    }
  });
});

describe('Domain configuration', () => {
  it.each(caseFolders)('lists case folder %s in exactly one Domain', (id) => {
    const listingDomains = domains.filter((domain) => domain.caseIds.includes(id));
    expect(listingDomains.map((domain) => domain.id)).toHaveLength(1);
  });
});

describe('listDomainCases', () => {
  it.each(domains.map((domain) => domain.id))('lists %s cases in caseIds order with titles from the Case JSON', (domainId) => {
    const domain = domains.find((d) => d.id === domainId);
    for (const lang of LANGS) {
      const listed = listDomainCases(domainId, lang);
      expect(listed.map((c) => c.id)).toEqual(domain.caseIds);
      for (const item of listed) {
        const content = getCase(item.id, lang);
        expect(item).toEqual({
          id: item.id,
          title: content.title,
          subtitle: content.subtitle,
          difficulty: content.difficulty,
          estimatedTime: content.estimatedTime,
        });
      }
    }
  });
});

describe('domainOf', () => {
  it.each(domains.flatMap((domain) => domain.caseIds.map((id) => [id, domain.id])))(
    'returns the Domain for %s as %s',
    (id, domainId) => {
      expect(domainOf(id).id).toBe(domainId);
    },
  );
});

describe('unknown ids', () => {
  it('getCase throws for an unknown case id', () => {
    expect(() => getCase('no_such_case', 'zh')).toThrow(/no_such_case/);
  });

  it('getCase throws for the legacy example, which is not in the catalogue', () => {
    expect(() => getCase(LEGACY_EXAMPLE_ID, 'zh')).toThrow(LEGACY_EXAMPLE_ID);
  });

  it('getCase throws for an unknown language', () => {
    expect(() => getCase(listedCaseIds[0], 'fr')).toThrow(/fr/);
  });

  it('listDomainCases throws for an unknown Domain', () => {
    expect(() => listDomainCases('no_such_domain', 'zh')).toThrow(/no_such_domain/);
  });

  it('domainOf throws for an unknown case id', () => {
    expect(() => domainOf('no_such_case')).toThrow(/no_such_case/);
  });
});
