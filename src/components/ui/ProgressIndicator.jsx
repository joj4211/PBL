import { motion } from 'framer-motion';
import { PHASE_ORDER, PHASE_META, PHASES, getPhaseIndex } from '../../logic/stateMachine';

const visiblePhases = PHASE_ORDER.filter((p) => p !== PHASES.INTRO);

export default function ProgressIndicator({ currentPhase }) {
  const currentIndex = getPhaseIndex(currentPhase);

  if (currentPhase === PHASES.INTRO) return null;

  return (
    <div className="w-full px-4 pt-6 pb-2 flex justify-center">
      <div className="flex items-center gap-1 sm:gap-2">
        {visiblePhases.map((phase, i) => {
          const phaseIndex = getPhaseIndex(phase);
          const isDone = phaseIndex < currentIndex;
          const isCurrent = phase === currentPhase;
          const meta = PHASE_META[phase];

          return (
            <div key={phase} className="flex items-center gap-1 sm:gap-2">
              {/* Step dot */}
              <div className="flex flex-col items-center gap-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isDone
                      ? '#5E8847'
                      : isCurrent
                      ? '#87AE73'
                      : '#DFC99E',
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ color: isDone || isCurrent ? '#fff' : '#9A7A4A' }}
                >
                  {isDone ? '✓' : i + 1}
                </motion.div>
                <span
                  className={`hidden sm:block text-xs font-medium transition-colors duration-300 ${
                    isCurrent ? 'text-sage-600' : isDone ? 'text-sage-400' : 'text-warm-400'
                  }`}
                >
                  {meta.shortLabel}
                </span>
              </div>

              {/* Connector line (not after last) */}
              {i < visiblePhases.length - 1 && (
                <motion.div
                  className="h-0.5 w-6 sm:w-10 rounded-full"
                  initial={false}
                  animate={{ backgroundColor: isDone ? '#87AE73' : '#EDE0C4' }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
