import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import { domains } from '../../config/domains';

const colorMap = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  sage: 'bg-sage-100 text-sage-700 border-sage-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
};

function average(values) {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function mean(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sampleStandardDeviation(values) {
  if (values.length < 2) return null;
  const m = mean(values);
  const variance = values.reduce((sum, value) => sum + ((value - m) ** 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function formatNumber(value, decimals = 3) {
  if (value === null || Number.isNaN(value) || !Number.isFinite(value)) return '--';
  return value.toFixed(decimals);
}

function logGamma(z) {
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    0.000009984369578019571,
    0.00000015056327351493116,
  ];

  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  }

  const adjusted = z - 1;
  let x = 0.9999999999998099;
  for (let i = 0; i < coefficients.length; i += 1) {
    x += coefficients[i] / (adjusted + i + 1);
  }

  const t = adjusted + coefficients.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + ((adjusted + 0.5) * Math.log(t)) - t + Math.log(x);
}

function betaContinuedFraction(x, a, b) {
  const maxIterations = 200;
  const epsilon = 0.000000000000001;
  const fpMin = 0.0000000000000000000000000000001;

  let c = 1;
  let d = 1 - ((a + b) * x / (a + 1));
  if (Math.abs(d) < fpMin) d = fpMin;
  d = 1 / d;
  let fraction = d;

  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m;

    let numerator = (m * (b - m) * x) / ((a + m2 - 1) * (a + m2));
    d = 1 + (numerator * d);
    if (Math.abs(d) < fpMin) d = fpMin;
    c = 1 + (numerator / c);
    if (Math.abs(c) < fpMin) c = fpMin;
    d = 1 / d;
    fraction *= d * c;

    numerator = (-(a + m) * (a + b + m) * x) / ((a + m2) * (a + m2 + 1));
    d = 1 + (numerator * d);
    if (Math.abs(d) < fpMin) d = fpMin;
    c = 1 + (numerator / c);
    if (Math.abs(c) < fpMin) c = fpMin;
    d = 1 / d;
    const delta = d * c;
    fraction *= delta;

    if (Math.abs(delta - 1) < epsilon) break;
  }

  return fraction;
}

function regularizedIncompleteBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;

  const logBeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  const front = Math.exp((a * Math.log(x)) + (b * Math.log(1 - x)) - logBeta);
  const symmetryThreshold = (a + 1) / (a + b + 2);

  if (x < symmetryThreshold) {
    return (front * betaContinuedFraction(x, a, b)) / a;
  }

  return 1 - ((front * betaContinuedFraction(1 - x, b, a)) / b);
}

function studentsTCdf(x, df) {
  if (!Number.isFinite(x) || df <= 0) return null;
  if (x === 0) return 0.5;

  const transformed = df / (df + (x ** 2));
  const ibeta = regularizedIncompleteBeta(transformed, df / 2, 0.5);

  if (x > 0) return 1 - (0.5 * ibeta);
  return 0.5 * ibeta;
}

function inverseStudentsTCdf(target, df) {
  let low = -12;
  let high = 12;

  for (let i = 0; i < 80; i += 1) {
    const mid = (low + high) / 2;
    const cdf = studentsTCdf(mid, df);
    if (cdf < target) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return (low + high) / 2;
}

function computePairedTTest(beforeValues, afterValues) {
  if (beforeValues.length !== afterValues.length) {
    throw new Error('before 與 after 的樣本長度不一致。');
  }

  const pairs = beforeValues
    .map((before, index) => ({
      before,
      after: afterValues[index],
    }))
    .filter(({ before, after }) => Number.isFinite(before) && Number.isFinite(after));

  const cleanBefore = pairs.map((pair) => pair.before);
  const cleanAfter = pairs.map((pair) => pair.after);
  const differences = pairs.map((pair) => pair.after - pair.before);
  const n = differences.length;

  if (n < 2) {
    return {
      n,
      beforeMean: mean(cleanBefore),
      beforeSd: sampleStandardDeviation(cleanBefore),
      afterMean: mean(cleanAfter),
      afterSd: sampleStandardDeviation(cleanAfter),
      meanDifference: mean(differences),
      tStatistic: null,
      degreesOfFreedom: null,
      pValue: null,
      confidenceInterval: [null, null],
      effectSize: null,
      significant: false,
      insufficientSample: true,
    };
  }

  const meanDifference = mean(differences);
  const sdDifference = sampleStandardDeviation(differences);
  const standardError = sdDifference === 0 ? 0 : sdDifference / Math.sqrt(n);
  const tStatistic = standardError === 0
    ? (meanDifference === 0 ? 0 : Number.POSITIVE_INFINITY)
    : meanDifference / standardError;
  const degreesOfFreedom = n - 1;
  const pValue = Number.isFinite(tStatistic)
    ? 2 * (1 - studentsTCdf(Math.abs(tStatistic), degreesOfFreedom))
    : 0;
  const alpha = 0.05;
  const tCritical = inverseStudentsTCdf(1 - (alpha / 2), degreesOfFreedom);
  const marginOfError = standardError === 0 ? 0 : tCritical * standardError;
  const effectSize = sdDifference === 0 ? null : meanDifference / sdDifference;

  return {
    n,
    beforeMean: mean(cleanBefore),
    beforeSd: sampleStandardDeviation(cleanBefore),
    afterMean: mean(cleanAfter),
    afterSd: sampleStandardDeviation(cleanAfter),
    meanDifference,
    tStatistic,
    degreesOfFreedom,
    pValue,
    confidenceInterval: [meanDifference - marginOfError, meanDifference + marginOfError],
    effectSize,
    significant: pValue < alpha,
    insufficientSample: false,
  };
}

export default function PerformancePage({
  user,
  lang,
  onBack,
  onSignOut,
  showPersonalStats = true,
  showPairedTest = false,
}) {
  const { setLang } = useLanguage();
  const [attempts, setAttempts] = useState([]);
  const [assessmentRows, setAssessmentRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isZh = lang === 'zh';

  const text = {
    back: isZh ? '返回' : 'Back',
    signOut: isZh ? '登出' : 'Sign out',
    badge: isZh ? '個人表現紀錄' : 'Personal performance',
    title: isZh ? '表現統計' : 'Performance Stats',
    subtitle: isZh
      ? '依耳科、鼻科、喉科整理你的作答紀錄與平均表現。'
      : 'Review your attempt history and average scores across otology, rhinology, and laryngology.',
    attempts: isZh ? '完成次數' : 'Attempts',
    average: isZh ? '平均表現' : 'Average',
    noRecord: isZh ? '尚無紀錄' : 'No records yet',
    noData: isZh ? '完成案例後，這裡會出現你的主題表現。' : 'Complete a case to see topic performance here.',
    pairedTitle: isZh ? '耳鼻喉三科前後測配對 t 檢定' : 'ENT pre/post paired t-test',
    pairedDescription: isZh
      ? '輸入來源：所有帳號在耳科、鼻科、喉科的前後測分數；同一使用者同一科別取前測最高分與後測最高分，自動排除缺失 pair。'
      : 'Input source: all users\' pre/post domain assessment scores. Each user-domain pair uses highest pre-test and post-test scores. Missing pairs are excluded automatically.',
    pairedInput: isZh ? '分析輸入' : 'Analysis input',
    pairedPairCount: isZh ? '有效 pair' : 'Valid pairs',
    pairedBeforeAverage: isZh ? 'before 平均' : 'Before average',
    pairedAfterAverage: isZh ? 'after 平均' : 'After average',
    metric: isZh ? '指標' : 'Metric',
    value: isZh ? '數值' : 'Value',
    n: isZh ? '有效樣本數 n' : 'Effective sample size n',
    beforeMeanSd: isZh ? 'before mean ± SD' : 'before mean ± SD',
    afterMeanSd: isZh ? 'after mean ± SD' : 'after mean ± SD',
    meanDiff: isZh ? '差值 mean difference' : 'Mean difference',
    tStatistic: isZh ? 't statistic' : 't statistic',
    dof: isZh ? 'degrees of freedom' : 'degrees of freedom',
    pValue: isZh ? 'p-value' : 'p-value',
    ci95: isZh ? '95% confidence interval' : '95% confidence interval',
    effectSize: isZh ? 'effect size (paired Cohen\'s d)' : 'effect size (paired Cohen\'s d)',
    significant: isZh ? '是否達統計顯著（alpha = 0.05）' : 'Statistically significant (alpha = 0.05)',
    yes: isZh ? '是' : 'Yes',
    no: isZh ? '否' : 'No',
    insufficient: isZh ? '有效樣本不足（n < 2），無法完成 t 檢定。' : 'Insufficient effective samples (n < 2), unable to run t-test.',
    loading: isZh ? '讀取表現紀錄中...' : 'Loading performance records...',
    error: isZh ? '讀取紀錄失敗' : 'Failed to load records',
  };

  useEffect(() => {
    let cancelled = false;

    async function loadAttempts() {
      setLoading(true);
      setError('');

      const [attemptsRes, assessmentsRes] = await Promise.all([
        showPersonalStats
          ? supabase
            .from('case_attempts')
            .select('case_id, domain, pre_test_score, interactive_score, post_test_score')
            .eq('user_id', user.id)
          : Promise.resolve({ data: [], error: null }),
        showPairedTest
          ? supabase
            .from('domain_assessments')
            .select('user_id, domain_id, assessment_type, score, completed_at')
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (cancelled) return;

      const queryError = attemptsRes.error || assessmentsRes.error;

      if (queryError) {
        setError(queryError.message);
        setAttempts([]);
        setAssessmentRows([]);
      } else {
        setAttempts(attemptsRes.data ?? []);
        setAssessmentRows(assessmentsRes.data ?? []);
      }

      setLoading(false);
    }

    loadAttempts();

    return () => {
      cancelled = true;
    };
  }, [showPairedTest, showPersonalStats, user.id]);

  const topicStats = useMemo(() => domains.map((topic) => {
    const topicAttempts = attempts.filter((attempt) => (
      attempt.domain === topic.id || topic.cases.some((caseItem) => caseItem.id === attempt.case_id)
    ));
    const scores = topicAttempts.map((attempt) => average([
      attempt.pre_test_score,
      attempt.interactive_score,
      attempt.post_test_score,
    ].filter((score) => typeof score === 'number')));

    return {
      ...topic,
      attempts: topicAttempts.length,
      score: average(scores.filter((score) => score !== null)),
    };
  }), [attempts]);

  const overallAverage = average(topicStats
    .map((topic) => topic.score)
    .filter((score) => score !== null));

  const pairedTest = useMemo(() => {
    const pairsByUserDomain = assessmentRows.reduce((acc, row) => {
      if (!row.user_id || !row.domain_id || !Number.isFinite(row.score)) return acc;

      const key = `${row.user_id}::${row.domain_id}`;
      const current = acc[key] ?? {
        userId: row.user_id,
        topicId: row.domain_id,
        before: null,
        after: null,
      };

      if (row.assessment_type === 'preTest') {
        current.before = current.before === null ? row.score : Math.max(current.before, row.score);
      }

      if (row.assessment_type === 'postTest') {
        current.after = current.after === null ? row.score : Math.max(current.after, row.score);
      }

      acc[key] = current;
      return acc;
    }, {});

    const pairs = Object.values(pairsByUserDomain);
    const inputRows = domains.map((topic) => {
      const topicPairs = pairs.filter((pair) => pair.topicId === topic.id);
      const validPairs = topicPairs.filter((pair) => (
        Number.isFinite(pair.before) && Number.isFinite(pair.after)
      ));
      const beforeValues = validPairs.map((pair) => pair.before);
      const afterValues = validPairs.map((pair) => pair.after);

      return {
        topicId: topic.id,
        topicTitle: topic[lang].title,
        pairCount: validPairs.length,
        before: mean(beforeValues),
        after: mean(afterValues),
      };
    });

    const beforeValues = pairs.map((item) => item.before);
    const afterValues = pairs.map((item) => item.after);

    try {
      const result = computePairedTTest(beforeValues, afterValues);
      return {
        inputRows,
        ...result,
        error: '',
      };
    } catch (computeError) {
      return {
        inputRows,
        error: computeError.message,
      };
    }
  }, [assessmentRows, lang]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFEF8 40%, #F0F5EC 100%)' }}
    >
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="nav-pill"
        >
          <ArrowLeft className="inline w-3 h-3 mr-1" />
          {text.back}
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={onSignOut}
          className="nav-pill"
        >
          {text.signOut}
        </button>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value)}
          className="nav-select"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="relative z-10 min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-4 py-1.5 rounded-full">
              <BarChart2 className="w-3.5 h-3.5" />
              {text.badge}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-warm-900 font-serif leading-tight">
              {text.title}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-warm-500 font-light leading-relaxed">
              {text.subtitle}
            </p>
          </motion.div>

          {showPersonalStats && (
            <div className="glass-card p-5 sm:p-6 mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-warm-500">{text.average}</div>
                <div className="text-xs text-warm-400 mt-1">{user.email ?? user.id}</div>
              </div>
              <div className="text-4xl font-bold text-sage-600">
                {overallAverage === null ? '--' : `${overallAverage}%`}
              </div>
            </div>
          )}

          {loading && (
            <div className="glass-card p-5 text-sm font-semibold text-warm-600">{text.loading}</div>
          )}

          {!loading && error && (
            <div className="glass-card p-5 text-sm font-semibold text-warm-600">
              {text.error}：{error}
            </div>
          )}

          {!loading && !error && (
            <>
              {showPersonalStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {topicStats.map((topic, index) => {
                    const topicText = topic[lang];

                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.05 }}
                        className="glass-card p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-lg font-bold text-warm-900">{topicText.title}</h2>
                            <p className="text-xs text-warm-400 mt-1">{topicText.subtitle}</p>
                            <p className="text-xs text-warm-400 mt-2">
                              {text.attempts}：{topic.attempts}
                            </p>
                          </div>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[topic.color]}`}>
                            {topic.score === null ? text.noRecord : `${topic.score}%`}
                          </span>
                        </div>

                        <div className="mt-5 h-2 rounded-full bg-warm-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sage-500 transition-all duration-500"
                            style={{ width: `${topic.score ?? 0}%` }}
                          />
                        </div>

                        {topic.score !== null ? (
                          <p className="mt-4 text-xs text-sage-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {text.average} {topic.score}%
                          </p>
                        ) : (
                          <p className="mt-4 text-xs text-warm-400">{text.noData}</p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {showPairedTest && (
                <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="glass-card p-5 sm:p-6 mt-5"
              >
                <h2 className="text-xl font-bold text-warm-900">{text.pairedTitle}</h2>
                <p className="text-sm text-warm-500 mt-1">{text.pairedDescription}</p>

                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-warm-500 border-b border-warm-200">
                        <th className="py-2 pr-3">{text.pairedInput}</th>
                        <th className="py-2 pr-3">{text.pairedPairCount}</th>
                        <th className="py-2 pr-3">{text.pairedBeforeAverage}</th>
                        <th className="py-2">{text.pairedAfterAverage}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pairedTest.inputRows.map((row) => (
                        <tr key={row.topicId} className="border-b border-warm-100 text-warm-700">
                          <td className="py-2 pr-3 font-semibold">{row.topicTitle}</td>
                          <td className="py-2 pr-3">{row.pairCount}</td>
                          <td className="py-2 pr-3">{formatNumber(row.before)}</td>
                          <td className="py-2">{formatNumber(row.after)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pairedTest.error ? (
                  <p className="mt-4 text-sm font-semibold text-rose-600">{pairedTest.error}</p>
                ) : (
                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-warm-500 border-b border-warm-200">
                          <th className="py-2 pr-3">{text.metric}</th>
                          <th className="py-2">{text.value}</th>
                        </tr>
                      </thead>
                      <tbody className="text-warm-700">
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.n}</td>
                          <td className="py-2">{pairedTest.n ?? '--'}</td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.beforeMeanSd}</td>
                          <td className="py-2">
                            {`${formatNumber(pairedTest.beforeMean)} ± ${formatNumber(pairedTest.beforeSd)}`}
                          </td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.afterMeanSd}</td>
                          <td className="py-2">
                            {`${formatNumber(pairedTest.afterMean)} ± ${formatNumber(pairedTest.afterSd)}`}
                          </td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.meanDiff}</td>
                          <td className="py-2">{formatNumber(pairedTest.meanDifference)}</td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.tStatistic}</td>
                          <td className="py-2">{formatNumber(pairedTest.tStatistic)}</td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.dof}</td>
                          <td className="py-2">{pairedTest.degreesOfFreedom ?? '--'}</td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.pValue}</td>
                          <td className="py-2">{formatNumber(pairedTest.pValue)}</td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.ci95}</td>
                          <td className="py-2">
                            {`[${formatNumber(pairedTest.confidenceInterval?.[0])}, ${formatNumber(pairedTest.confidenceInterval?.[1])}]`}
                          </td>
                        </tr>
                        <tr className="border-b border-warm-100">
                          <td className="py-2 pr-3">{text.effectSize}</td>
                          <td className="py-2">{formatNumber(pairedTest.effectSize)}</td>
                        </tr>
                        <tr>
                          <td className="py-2 pr-3">{text.significant}</td>
                          <td className="py-2 font-semibold">
                            {pairedTest.significant ? text.yes : text.no}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {pairedTest.insufficientSample && (
                      <p className="mt-4 text-sm font-semibold text-rose-600">{text.insufficient}</p>
                    )}
                  </div>
                )}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
