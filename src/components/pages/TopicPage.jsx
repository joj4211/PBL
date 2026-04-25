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
}) {
  const { setLang } = useLanguage();
  const isZh = lang === 'zh';
  const t = topic[lang];
  const hasCases = topic.cases.length > 0;

  const preDone = Boolean(progress?.pretest_completed || assessmentStats?.preTestLatest != null);
  const postDone = Boolean(progress?.posttest_completed || assessmentStats?.postTestLatest != null);
  const allCasesDone = topic.cases.every((caseItem) => (caseAttempts?.[caseItem.id] ?? 0) >= 1);
  const showPostPanel = preDone && allCasesDone;

  const text = {
    preGateTitle: isZh ? '需先完成前測才能進入案例' : 'Complete pre-test to unlock cases',
    preGateBody: isZh ? '前測完成並成功寫入成績後，才會顯示案例入口。' : 'Case entry unlocks only after pre-test submission is saved.',
    enterPre: isZh ? '進入前測' : 'Start pre-test',
    enterPost: isZh ? '進入後測' : 'Start post-test',
    retakePre: isZh ? '再次作答前測' : 'Retake pre-test',
    retakePost: isZh ? '再次作答後測' : 'Retake post-test',
    postReady: isZh ? '你已完成本主題所有案例，現在可進行後測。' : 'All cases are completed. You can now take the post-test.',
    postCompleted: isZh ? '您已完成後測，可再次作答。' : 'You have completed the post-test and may retake it.',
    attempts: isZh ? '完成次數' : 'Attempts',
    preScore: isZh ? '前測分數' : 'Pre-test score',
    postScore: isZh ? '後測分數' : 'Post-test score',
    latest: isZh ? '最新' : 'Latest',
    best: isZh ? '最高' : 'Best',
    assessmentCount: isZh ? '完成次數' : 'Completed attempts',
    noScore: '--',
  };

  const formatScore = (score) => (score == null ? text.noScore : `${score}分`);
  const preLatest = formatScore(assessmentStats?.preTestLatest);
  const preBest = formatScore(assessmentStats?.preTestBest);
  const postLatest = formatScore(assessmentStats?.postTestLatest);
  const postBest = formatScore(assessmentStats?.postTestBest);
  const preCount = assessmentStats?.preTestCount ?? 0;
  const postCount = assessmentStats?.postTestCount ?? 0;

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
          className="nav-pill"
        >
          {isZh ? '← 返回' : '← Back'}
        </button>
      </div>

      <div className="absolute top-4 right-5 z-20 flex items-center gap-2">
        <button
          onClick={onSignOut}
          className="nav-pill"
        >
          {isZh ? '登出' : 'Sign out'}
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
          <div className="glass-card p-5 grid grid-cols-2 gap-4 text-sm items-start">
            <div className="min-w-0">
              <p className="text-xs text-warm-400 uppercase tracking-wider">{text.preScore}</p>
              <p className="text-lg font-bold text-sage-700 mt-1">{text.latest}：{preLatest}</p>
              <p className="text-xs text-warm-500 mt-1">{text.best}：{preBest}</p>
              <p className="text-xs text-warm-500 mt-1">{text.assessmentCount}：{preCount}</p>
              <button
                onClick={onStartPreTest}
                className="action-pill mt-3 px-4"
              >
                {preDone ? text.retakePre : text.enterPre}
              </button>
            </div>
            <div className="min-w-0 self-start justify-self-end text-left">
              <p className="text-xs text-warm-400 uppercase tracking-wider">{text.postScore}</p>
              <p className="text-lg font-bold text-sage-700 mt-1">{text.latest}：{postLatest}</p>
              <p className="text-xs text-warm-500 mt-1">{text.best}：{postBest}</p>
              <p className="text-xs text-warm-500 mt-1">{text.assessmentCount}：{postCount}</p>
              {showPostPanel && (
                <button
                  onClick={onStartPostTest}
                  className="action-pill mt-3 px-4"
                >
                  {postDone ? text.retakePost : text.enterPost}
                </button>
              )}
            </div>
          </div>

          {!preDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 text-center">
              <p className="text-base font-semibold text-warm-800">{text.preGateTitle}</p>
              <p className="text-sm text-warm-500 mt-2">{text.preGateBody}</p>
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
                      className="action-pill flex-shrink-0"
                    >
                      {isZh ? '開始學習' : 'Start'}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {loading && (
            <div className="glass-card p-5 text-sm text-warm-500">{isZh ? '讀取進度中...' : 'Loading progress...'}</div>
          )}
        </div>
      </div>
    </div>
  );
}
