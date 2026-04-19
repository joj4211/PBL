import { motion } from 'framer-motion';
import { Stethoscope, Search, FlaskConical, Pill, Tag, Timer } from 'lucide-react';
import Button from '../ui/Button';
import PhaseTransition from '../ui/PhaseTransition';
import { useLanguage } from '../../contexts/LanguageContext';

const featureIcons = [Search, Stethoscope, FlaskConical, Pill];

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export default function Intro({ caseData, advancePhase, onShowGallery }) {
  const { ui } = useLanguage();
  const features = ui.intro.features;

  return (
    <PhaseTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="w-full max-w-2xl flex flex-col items-center text-center gap-6"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="text-xs font-semibold tracking-widest uppercase text-sage-600 bg-sage-50 border border-sage-200 px-4 py-1.5 rounded-full">
              {ui.intro.badge}
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp}>
            <h1 className="text-4xl sm:text-5xl font-bold text-warm-900 font-serif leading-tight">
              {caseData.title}
            </h1>
            <p className="mt-3 text-lg text-warm-600 font-light">{caseData.subtitle}</p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="text-warm-500 text-sm text-left max-w-lg leading-relaxed bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl px-5 py-4 whitespace-pre-line"
          >
            {caseData.coverDescription}
          </motion.p>

          {/* Meta tags */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-2">
            {caseData.tags?.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs font-medium text-warm-600 bg-warm-100 border border-warm-200 px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
            {caseData.estimatedTime && (
              <span className="flex items-center gap-1 text-xs font-medium text-warm-600 bg-warm-100 border border-warm-200 px-3 py-1 rounded-full">
                <Timer className="w-3 h-3" />
                {caseData.estimatedTime}
              </span>
            )}
          </motion.div>

          {/* Feature grid */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full"
          >
            {features.map(({ label, desc }, idx) => {
              const Icon = featureIcons[idx];
              return (
                <div
                  key={label}
                  className="glass-card p-4 text-center flex flex-col items-center gap-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-sage-500" />
                  </div>
                  <div className="text-sm font-semibold text-warm-800">{label}</div>
                  <div className="text-xs text-warm-400 leading-snug">{desc}</div>
                </div>
              );
            })}
          </motion.div>

          <motion.div variants={fadeUp} className="w-20 h-px bg-warm-200" />

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
            <Button onClick={advancePhase} size="lg" variant="primary">
              {ui.intro.beginCase}
            </Button>
            <p className="text-xs text-warm-400">{ui.intro.quietSpace}</p>
          </motion.div>

          {onShowGallery && (
            <motion.div variants={fadeUp}>
              <button
                onClick={onShowGallery}
                className="text-xs text-warm-400/70 hover:text-warm-600 transition-colors underline underline-offset-2 opacity-60 hover:opacity-100">
                🧪 互動頁面預覽
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
