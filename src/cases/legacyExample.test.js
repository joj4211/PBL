import { describe, expect, it } from 'vitest';
import { getLegacyExample } from './legacyExample';

describe('getLegacyExample', () => {
  it.each(['zh', 'en'])('returns playable content with pre-test questions for %s', (lang) => {
    const example = getLegacyExample(lang);
    expect(example.id).toBe('ear_vestibular_neuritis');
    expect(example.preTest.questions.length).toBeGreaterThan(0);
  });

  it('falls back to zh content for an unknown language', () => {
    expect(getLegacyExample('fr')).toEqual(getLegacyExample('zh'));
  });
});
