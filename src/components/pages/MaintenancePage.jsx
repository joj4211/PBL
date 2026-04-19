import { motion } from 'framer-motion';
import { ArrowLeft, LayoutGrid } from 'lucide-react';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

export default function MaintenancePage({ onBack, onShowGallery }) {
  const { lang } = useLanguage();
  const isZh = lang === 'zh';

  const text = {
    back: isZh ? '返回首頁' : 'Back',
    title: isZh ? '互動設計預覽' : 'Interactive design preview',
    description: isZh
      ? '查看 10 個互動式醫學情境頁面。'
      : 'View 10 interactive medical scenario pages.',
    button: isZh ? '進入互動設計預覽' : 'Open interactive preview',
  };

  return (
    <div className="min-h-screen px-4 pt-16 pb-10">
      <button
        type="button"
        onClick={onBack}
        className="absolute top-4 left-4 z-20 text-xs font-semibold px-3 py-1.5 rounded-full border border-warm-300 bg-white/60 backdrop-blur-sm text-warm-600 hover:bg-white/80 hover:border-warm-400 transition-all duration-200"
      >
        <ArrowLeft className="inline w-3 h-3 mr-1" />
        {text.back}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xs"
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
      </motion.div>
    </div>
  );
}
