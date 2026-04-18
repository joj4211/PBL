import { motion } from 'framer-motion';
import { BookOpen, Clock, Stethoscope, Brain, Tag, Timer } from 'lucide-react';
import Button from '../ui/Button';
import PhaseTransition from '../ui/PhaseTransition';

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  { icon: Clock, label: '前測評估', desc: '了解初始知識基礎' },
  { icon: BookOpen, label: '臨床案例', desc: '沉浸式敘事呈現' },
  { icon: Stethoscope, label: '互動問答', desc: '即時引導式回饋' },
  { icon: Brain, label: '學習成效', desc: '前後測對比分析' },
];

export default function Intro({ caseData, advancePhase }) {
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
              醫學 PBL 互動學習系統
            </span>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp}>
            <h1 className="text-5xl sm:text-6xl font-bold text-warm-900 font-serif leading-tight">
              {caseData.title}
            </h1>
            <p className="mt-3 text-xl text-warm-600 font-light">{caseData.subtitle}</p>
          </motion.div>

          {/* Cover description */}
          <motion.p
            variants={fadeUp}
            className="text-warm-500 italic max-w-md leading-relaxed whitespace-pre-line"
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
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-2"
          >
            {features.map(({ icon: Icon, label, desc }) => (
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
            ))}
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="w-20 h-px bg-warm-200" />

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
            <Button onClick={advancePhase} size="lg" variant="primary">
              開始案例學習
            </Button>
            <p className="text-xs text-warm-400">
              建議在安靜的環境下進行，預留充足時間細讀案例
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
