import { describe, expect, it } from 'vitest';
import { getDomainAssessment } from './domainAssessments';

const CJK = /[　-〿㐀-䶿一-鿿豈-﫿＀-￯]/;

const questions = ['ear', 'nose', 'throat']
  .flatMap((domainId) => ['preTest', 'postTest'].map((kind) => [domainId, kind]))
  .flatMap(([domainId, kind]) =>
    getDomainAssessment(domainId, kind).questions.map((question) => [`${domainId} ${kind} ${question.id}`, question]),
  );

const expectBilingual = (text) => {
  expect(text.zh.trim()).not.toBe('');
  expect(text.en.trim()).not.toBe('');
  expect(text.en).not.toMatch(CJK);
};

describe('getDomainAssessment', () => {
  it.each(questions)('has zh and English-only en text for the prompt, options and explanation of %s', (_, question) => {
    expectBilingual(question.prompt);
    question.options.forEach((option) => expectBilingual(option.text));
    expectBilingual(question.explanation);
  });

  it.each(questions)('has exactly one correct option in %s', (_, question) => {
    expect(question.options.filter((option) => option.correct)).toHaveLength(1);
  });
});
