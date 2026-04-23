import { motion } from 'framer-motion';
import { Archive, ArrowLeft, LayoutGrid } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MaintenancePage({ onBack, onShowGallery, onSelectArchivedCase }) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const text = {
    back: isZh ? '返回首頁' : 'Back',
    title: isZh ? '互動設計預覽' : 'Interactive design preview',
    description: isZh
      ? '查看 10 個互動式醫學情境頁面。'
      : 'View 10 interactive medical scenario pages.',
    button: isZh ? '進入互動設計預覽' : 'Open interactive preview',
    archiveTitle: isZh ? '範例保存' : 'Archived examples',
    archiveDescription: isZh
      ? '保留早期完整 phase flow 範例，不放在正式案例清單。'
      : 'Preserved early full phase-flow examples, outside the formal case list.',
    archiveCase: isZh ? '前庭神經炎範例' : 'Vestibular neuritis example',
    openArchive: isZh ? '開啟範例' : 'Open example',
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
        <section className="glass-card p-4">
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

        <section className="glass-card p-4">
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
      </motion.div>
    </div>
  );
}
