import { motion } from 'framer-motion';
import { Star, RefreshCw, CheckCircle2 } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import Button from '../ui/Button';

const stagger = {
  animate: { transition: { staggerChildren: 0.2, delayChildren: 0.4 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function PostPearls({ caseData, currentPhase, restart }) {
  const { title, finalReview } = caseData.postPearls;

  return (
    <PhaseTransition>
      <ProgressIndicator currentPhase={currentPhase} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-sage-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">{title}</h2>
            <p className="text-warm-400 text-sm mt-1">
              Consolidate what you've learned from this case.
            </p>
          </div>
        </motion.div>

        {/* Completion badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-6 text-center mb-6"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8 text-sage-500" />
          </div>
          <h3 className="text-xl font-bold text-warm-900 font-serif">Case Complete</h3>
          <p className="text-warm-400 text-sm mt-1">
            {caseData.title}
          </p>
        </motion.div>

        {/* Key Learning Pearls */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-3 mb-10"
        >
          {finalReview.map((pearl, idx) => (
            <motion.div key={idx} variants={fadeUp}>
              <div className="glass-card p-5 flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-sage-600">{idx + 1}</span>
                </div>
                <p className="text-warm-800 text-sm leading-relaxed">{pearl}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Restart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center pb-12"
        >
          <Button onClick={restart} variant="secondary">
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Restart Case
          </Button>
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
