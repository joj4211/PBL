import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import Button from '../ui/Button';

const stagger = {
  animate: { transition: { staggerChildren: 0.7, delayChildren: 0.3 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

function NarrativeSlide({ slide }) {
  return (
    <motion.div variants={fadeUp} className="glass-card-warm p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-4 h-4 text-warm-500" />
        <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
          Chief Complaint & Clinical History
        </span>
      </div>
      <p className="narrative-text text-base sm:text-lg leading-loose">{slide.content}</p>
    </motion.div>
  );
}

function HistoryTakingSlide({ slide }) {
  const [revealed, setRevealed] = useState([]);

  const toggle = (idx) => {
    setRevealed((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <motion.div variants={fadeUp} className="space-y-4">
      {/* Instruction banner */}
      <div className="glass-card-sage px-5 py-3">
        <p className="text-xs font-semibold text-sage-600 uppercase tracking-wider mb-1">
          {slide.title}
        </p>
        <p className="text-sm text-warm-700 leading-relaxed">{slide.instruction}</p>
      </div>

      {/* Flip cards */}
      <div className="space-y-2">
        {slide.questionsAndRationales.map((item, idx) => {
          const isOpen = revealed.includes(idx);
          return (
            <div key={idx} className="rounded-xl overflow-hidden border border-warm-200">
              {/* Question button */}
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white/50 hover:bg-white/70 transition-colors duration-150"
              >
                <span className="text-sm font-medium text-warm-800 leading-snug pr-4">
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-warm-400" />
                </motion.div>
              </button>

              {/* Rationale reveal */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-3 bg-sage-50/70 border-t border-sage-200/60 flex items-start gap-2">
                      <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-sage-500 mt-0.5" />
                      <p className="text-sm text-sage-700 leading-relaxed">{item.rationale}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function ChiefComplaint({ caseData, currentPhase, advancePhase }) {
  const { slides } = caseData.chiefComplaint;
  const [done, setDone] = useState(false);

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
          <div className="w-12 h-12 rounded-2xl bg-warm-100 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-warm-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">
              Chief Complaint & Clinical History
            </h2>
            <p className="text-warm-400 text-sm mt-1">
              Read the case carefully, then explore the history-taking questions below.
            </p>
          </div>
        </motion.div>

        {/* Slides with stagger */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="animate"
          onAnimationComplete={() => setDone(true)}
          className="space-y-6 mb-8"
        >
          {slides.map((slide) =>
            slide.type === 'narrative' ? (
              <NarrativeSlide key={slide.slideIndex} slide={slide} />
            ) : (
              <HistoryTakingSlide key={slide.slideIndex} slide={slide} />
            )
          )}
        </motion.div>

        {/* Proceed */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 pb-12"
            >
              <p className="text-warm-400 text-sm italic text-center">
                Ready to proceed to the physical examination?
              </p>
              <Button onClick={advancePhase} size="lg">
                Proceed to Physical Exam
                <ChevronRight className="inline ml-1.5 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhaseTransition>
  );
}
