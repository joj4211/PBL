import { motion } from 'framer-motion';
import { PHASE_ORDER, PHASES, getPhaseIndex } from '../../logic/stateMachine';

const visiblePhases = PHASE_ORDER.filter((p) => p !== PHASES.INTRO);

export default function ProgressIndicator({ currentPhase }) {
  const currentIndex = getPhaseIndex(currentPhase);

  if (currentPhase === PHASES.INTRO) return null;

  return (
    <div className="w-full px-4 pt-16 sm:pt-5 pb-1 flex justify-center">
      <div className="flex items-center gap-0.5 sm:gap-1">
        {visiblePhases.map((phase, i) => {
          const phaseIndex = getPhaseIndex(phase);
          const isDone = phaseIndex < currentIndex;
          const isCurrent = phase === currentPhase;
          const meta = ui.phases[phase];

          return (
            <div key={phase} className="flex items-start gap-0.5 sm:gap-1">
              {/* Step */}
              <div className="flex flex-col items-center gap-1 w-7">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isDone ? '#5E8847' : isCurrent ? '#87AE73' : '#DFC99E',
                  }}
                  transition={{ duration: 0.3 }}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                  style={{ color: isDone || isCurrent ? '#fff' : '#9A7A4A' }}
                >
                  {isDone ? '✓' : i + 1}
                </motion.div>
              </div>

              {/* Connector */}
              {i < visiblePhases.length - 1 && (
                <motion.div
                  className="h-0.5 w-4 sm:w-7 rounded-full mt-3 sm:mt-3.5"
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
