import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, ArrowLeft, BarChart2, ChevronDown, Download, LayoutGrid } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabaseClient';

export default function MaintenancePage({
  onBack,
  onShowGallery,
  onSelectArchivedCase,
  onSelectPerformance,
}) {
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [exportState, setExportState] = useState('idle');
  const isZh = lang === 'zh';

  const text = {
    back: isZh ? '返回首頁' : 'Back',
    tabLabel: isZh ? '測試功能' : 'Test tools',
    tabHint: isZh ? '集中放置互動預覽、統計、資料輸出與舊版範例入口。' : 'Centralized access to preview, stats, exports, and archived examples.',
    hoverHint: isZh ? '滑鼠移入展開功能' : 'Hover to expand tools',
    title: isZh ? '互動設計預覽' : 'Interactive design preview',
    description: isZh
      ? '查看 10 個互動式醫學情境頁面。'
      : 'View 10 interactive medical scenario pages.',
    button: isZh ? '進入互動設計預覽' : 'Open interactive preview',
    statsTitle: isZh ? '表現統計' : 'Performance Stats',
    statsDescription: isZh
      ? '查看所有帳號的前後測配對 t 檢定與主題表現統計。'
      : 'Review all-user pre/post paired t-test and topic performance stats.',
    openStats: isZh ? '開啟統計' : 'Open stats',
    archiveTitle: isZh ? '範例保存' : 'Archived examples',
    archiveDescription: isZh
      ? '保留早期完整 phase flow 範例，不放在正式案例清單。'
      : 'Preserved early full phase-flow examples, outside the formal case list.',
    archiveCase: isZh ? '前庭神經炎範例' : 'Vestibular neuritis example',
    openArchive: isZh ? '開啟範例' : 'Open example',
    exportTitle: isZh ? '輸出統計資料' : 'Export stats data',
    exportDescription: isZh
      ? '下載 app_users、case_attempts、domain_assessments 三張原始資料表的 Excel 檔。'
      : 'Download a raw Excel workbook for app_users, case_attempts, and domain_assessments.',
    exportButton: isZh ? '下載 Excel' : 'Download Excel',
    exporting: isZh ? '輸出中...' : 'Exporting...',
    exportDone: isZh ? '已下載 Excel 統計資料。' : 'Excel statistics downloaded.',
    exportFailed: isZh ? '輸出失敗' : 'Export failed',
  };

  const handleExportStats = async () => {
    if (exportState === 'loading') return;

    setExportState('loading');

    try {
      const { downloadStatisticsWorkbook } = await import('../../utils/statisticsWorkbook');
      const [usersRes, assessmentsRes, attemptsRes] = await Promise.all([
        supabase
          .from('app_users')
          .select('*'),
        supabase
          .from('domain_assessments')
          .select('*'),
        supabase
          .from('case_attempts')
          .select('*'),
      ]);

      const nextError = usersRes.error || assessmentsRes.error || attemptsRes.error;

      if (nextError) {
        setExportState('error');
        window.alert(`${text.exportFailed}：${nextError.message}`);
        return;
      }

      await downloadStatisticsWorkbook({
        appUsers: usersRes.data ?? [],
        caseAttempts: attemptsRes.data ?? [],
        domainAssessments: assessmentsRes.data ?? [],
      });

      setExportState('done');
    } catch (error) {
      setExportState('error');
      window.alert(`${text.exportFailed}：${error.message}`);
    }
  };

  return (
    <div className="min-h-screen px-4 pt-16 pb-10">
      <button
        type="button"
        onClick={onBack}
        className="nav-pill absolute top-4 left-4 z-20"
      >
        <ArrowLeft className="inline w-3 h-3 mr-1" />
        {text.back}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xs space-y-4"
      >
        <div
          className="glass-card p-3"
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="w-full rounded-2xl border border-sage-200 bg-sage-50/80 p-1.5 text-left"
          >
            <div className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-sage-700 shadow-sm">
              <span>{text.tabLabel}</span>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.span>
            </div>
          </button>

          {!isExpanded && (
            <p className="px-1 pt-3 text-xs text-warm-500 leading-relaxed">
              {text.hoverHint}
            </p>
          )}

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="px-1 pt-3 text-xs text-warm-500 leading-relaxed">
                  {text.tabHint}
                </p>

                <div className="mt-4 space-y-4">
                  <section className="rounded-2xl border border-white/70 bg-white/45 p-4 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-warm-100 flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-4 h-4 text-warm-600" />
                      </div>
                      <div>
                        <h1 className="text-base font-bold text-warm-900 leading-tight">
                          {text.title}
                        </h1>
                        <p className="text-xs text-warm-500 mt-1 leading-relaxed">{text.description}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full mt-4"
                      onClick={onShowGallery}
                    >
                      {text.button}
                    </Button>
                  </section>

                  <section className="rounded-2xl border border-white/70 bg-white/45 p-4 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
                        <BarChart2 className="w-4 h-4 text-sage-600" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-warm-900 leading-tight">
                          {text.statsTitle}
                        </h2>
                        <p className="text-xs text-warm-500 mt-1 leading-relaxed">{text.statsDescription}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full mt-4"
                      onClick={onSelectPerformance}
                    >
                      {text.openStats}
                    </Button>
                  </section>

                  <section className="rounded-2xl border border-white/70 bg-white/45 p-4 shadow-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Archive className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-warm-900 leading-tight">
                          {text.archiveTitle}
                        </h2>
                        <p className="text-xs text-warm-500 mt-1 leading-relaxed">{text.archiveDescription}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-xl border border-warm-200 bg-white/35 px-3 py-3">
                      <p className="text-sm font-semibold text-warm-800">{text.archiveCase}</p>
                      <p className="text-xs text-warm-400 mt-0.5">
                        {isZh ? '案例 01：天旋地轉的世界' : 'Case 01: The Spinning World'}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => onSelectArchivedCase('ear_vestibular_neuritis')}
                    >
                      {text.openArchive}
                    </Button>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <section className="glass-card p-4">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
              <Download className="w-4 h-4 text-sky-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-warm-900 leading-tight">
                {text.exportTitle}
              </h2>
              <p className="text-xs text-warm-500 mt-1 leading-relaxed">{text.exportDescription}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full mt-4"
            onClick={handleExportStats}
          >
            {exportState === 'loading' ? text.exporting : text.exportButton}
          </Button>
          {exportState === 'done' && (
            <p className="mt-2 text-xs text-sage-600">{text.exportDone}</p>
          )}
        </section>
      </motion.div>
    </div>
  );
}
