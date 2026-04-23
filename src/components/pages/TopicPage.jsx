import { motion } from 'framer-motion';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCase } from '../../cases/index';

const container = {
  animate: { transition: { delayChildren: 0.1, staggerChildren: 0.08 } },
};
const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function TopicPage({
  topic,
  lang,
  onSelectCase,
  onBack,
  onSignOut,
  onStartPreTest,
  onStartPostTest,
  progress,
  assessmentStats,
  caseAttempts,
  loading,
  onResetAssessments,
  resettingAssessments,
}) {
  const { setLang } = useLanguage();
  const isZh = lang === 'zh';
  const t = topic[lang];
  const hasCases = topic.cases.length > 0;

  const preDone = Boolean(progress?.pretest_completed);
  const allCasesDone = topic.cases.every((caseItem) => (caseAttempts?.[caseItem.id] ?? 0) >= 1);
  const showPostButton = preDone && allCasesDone;

  const text = {
    preGateTitle: isZh ? '需先完成前測才能進入案例' : 'Complete pre-test to unlock cases',
    preGateBody: isZh ? '前測完成並成功寫入成績後，才會顯示案例入口。' : 'Case entry unlocks only after pre-test submission is saved.',
    enterPre: isZh ? '進入前測' : 'Start pre-test',
    enterPost: isZh ? '進入後測' : 'Start post-test',
    attempts: isZh ? '完成次數' : 'Attempts',
    latestBest: isZh ? '最新 / 最佳' : 'Latest / Best',
    noScore: '--',
    resetAssessments: isZh ? '重置前後測紀錄' : 'Reset assessment records',
    resetConfirm: isZh ? '確定要重置此科別前後測紀錄嗎？此動作無法復原。' : 'Reset pre/post assessment records for this domain? This cannot be undone.',
  };

  const preStats = `${assessmentStats?.preTestLatest ?? text.noScore} / ${assessmentStats?.preTestBest ?? text.noScore}`;
  const postStats = `${assessmentStats?.postTestLatest ?? text.noScore} / ${assessmentStats?.postTestBest ?? text.noScore}`;

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FAF7F0 0%, #FFFEF8 40%, #F0F5EC 100%)' }}
    >
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-25 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #B8D0A8, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20 animate-float pointer-events-none"
        style={{ background: 'radial-gradient(circle, #DFC99E, transparent 70%)', animationDelay: '2s' }}
      />

      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={onBack}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {isZh ? '← 返回' : '← Back'}
        </button>
      </div>

      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={onSignOut}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
        >
          {isZh ? '登出' : 'Sign out'}
        </button>
        <select
          value={lang}
          onChange={(event) => setLang(event.target.value)}
          className="text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200 outline-none"
        >
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8"
        >
          <div className="text-4xl mb-3">{topic.icon}</div>
          <h1 className="text-3xl font-bold text-warm-900 font-serif">{t.title}</h1>
          <p className="text-warm-400 text-sm mt-1">{t.subtitle}</p>
        </motion.div>

        <div className="w-full max-w-2xl space-y-4">
          <div className="glass-card p-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wider">Pre-test {text.latestBest}</p>
              <p className="text-lg font-bold text-sage-700 mt-1">{preStats}</p>
            </div>
            <div>
              <p className="text-xs text-warm-400 uppercase tracking-wider">Post-test {text.latestBest}</p>
              <p className="text-lg font-bold text-sage-700 mt-1">{postStats}</p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                if (!onResetAssessments) return;
                if (!window.confirm(text.resetConfirm)) return;
                onResetAssessments();
              }}
              disabled={loading || resettingAssessments}
              className="text-xs font-semibold px-4 py-2 rounded-full border border-red-300 bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {resettingAssessments
                ? (isZh ? '重置中...' : 'Resetting...')
                : text.resetAssessments}
            </button>
          </div>

          {!preDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 text-center">
              <p className="text-base font-semibold text-warm-800">{text.preGateTitle}</p>
              <p className="text-sm text-warm-500 mt-2 mb-4">{text.preGateBody}</p>
              <button
                onClick={onStartPreTest}
                className="text-sm font-semibold px-5 py-2 rounded-full bg-sage-500 text-white hover:bg-sage-600 transition-colors duration-200"
              >
                {text.enterPre}
              </button>
            </motion.div>
          )}

          {preDone && hasCases && (
            <motion.div
              variants={container}
              initial="initial"
              animate="animate"
              className="flex flex-col gap-4"
            >
              {topic.cases.map((c) => {
                const caseContent = getCase(c.id, lang);
                const title = caseContent?.title ?? c[lang];
                const subtitle = caseContent?.subtitle ?? '';
                const attempts = caseAttempts?.[c.id] ?? 0;

                return (
                  <motion.div
                    key={c.id}
                    variants={item}
                    className="glass-card p-5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-semibold text-warm-900">{title}</div>
                      {subtitle && (
                        <div className="text-xs text-warm-400 mt-0.5">
                          {subtitle}
                        </div>
                      )}
                      <div className="text-xs text-sage-600 mt-2">{text.attempts}：{attempts}</div>
                    </div>
                    <button
                      onClick={() => onSelectCase(c.id)}
                      className="flex-shrink-0 text-sm font-semibold px-4 py-2 rounded-full bg-sage-500 text-white hover:bg-sage-600 transition-colors duration-200"
                    >
                      {isZh ? '開始學習' : 'Start'}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {preDone && showPostButton && (
            <div className="glass-card p-5 text-center">
              <p className="text-sm text-warm-500 mb-3">
                {isZh ? '你已完成本主題所有案例，現在可進行後測。' : 'All cases are completed. You can now take the post-test.'}
              </p>
              <button
                onClick={onStartPostTest}
                className="text-sm font-semibold px-5 py-2 rounded-full bg-sage-500 text-white hover:bg-sage-600 transition-colors duration-200"
              >
                {text.enterPost}
              </button>
            </div>
          )}

          {loading && (
            <div className="glass-card p-5 text-sm text-warm-500">{isZh ? '讀取進度中...' : 'Loading progress...'}</div>
          )}
        </div>
      </div>
    </div>
  );
}
