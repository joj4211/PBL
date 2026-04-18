import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight, Activity, User } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import Button from '../ui/Button';

// Staggered reveal for the narrative
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.9, delayChildren: 0.3 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

function SceneText({ text }) {
  return (
    <motion.p
      variants={itemVariants}
      className="text-center text-2xl sm:text-3xl font-serif text-warm-400 tracking-widest"
    >
      {text}
    </motion.p>
  );
}

function NarrationText({ text }) {
  return (
    <motion.p variants={itemVariants} className="narrative-text text-lg leading-loose">
      {text}
    </motion.p>
  );
}

function PatientInfoCard({ label, data }) {
  return (
    <motion.div variants={itemVariants}>
      <div className="glass-card-warm p-5 space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-warm-500" />
          <h3 className="text-sm font-semibold text-warm-600 uppercase tracking-wider">{label}</h3>
        </div>
        <div className="divide-y divide-warm-100">
          {data.map(({ label: l, value }) => (
            <div key={l} className="flex py-2 gap-4">
              <dt className="w-20 flex-shrink-0 text-xs font-semibold text-warm-400 pt-0.5">{l}</dt>
              <dd className="text-sm text-warm-800 leading-snug">{value}</dd>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const vitalStatusStyles = {
  high: 'text-orange-500 bg-orange-50 border-orange-200',
  borderline: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  normal: 'text-sage-600 bg-sage-50 border-sage-200',
};

function VitalsCard({ label, data }) {
  return (
    <motion.div variants={itemVariants}>
      <div className="glass-card-sage p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4 text-sage-500" />
          <h3 className="text-sm font-semibold text-sage-600 uppercase tracking-wider">{label}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {data.map(({ label: l, value, status }) => (
            <div
              key={l}
              className={`rounded-xl border px-3 py-2.5 text-center ${vitalStatusStyles[status] ?? vitalStatusStyles.normal}`}
            >
              <div className="text-xs font-semibold opacity-70 mb-0.5">{l}</div>
              <div className="text-sm font-bold leading-snug">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function NarrativeItem({ item }) {
  switch (item.type) {
    case 'scene':
      return <SceneText text={item.text} />;
    case 'narration':
      return <NarrationText text={item.text} />;
    case 'patient-info':
      return <PatientInfoCard label={item.label} data={item.data} />;
    case 'vitals':
      return <VitalsCard label={item.label} data={item.data} />;
    default:
      return null;
  }
}

export default function CaseStudy({ caseData, currentPhase, advancePhase }) {
  const [revealed, setRevealed] = useState(false);
  const narrative = caseData.caseStudy.narrative;

  return (
    <PhaseTransition>
      <ProgressIndicator currentPhase={currentPhase} />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-sage-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">臨床案例</h2>
            <p className="text-warm-400 text-sm mt-1">請仔細閱讀以下資訊，為互動問答做好準備</p>
          </div>
        </motion.div>

        {/* Narrative content with staggered reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setRevealed(true)}
          className="space-y-8 mb-10"
        >
          {narrative.map((item) => (
            <NarrativeItem key={item.id} item={item} />
          ))}
        </motion.div>

        {/* Proceed button — appears after stagger completes */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-3 pb-12"
            >
              <p className="text-warm-400 text-sm text-center italic">
                您已閱讀完整案例資訊，可以開始互動問答了
              </p>
              <Button onClick={advancePhase} size="lg">
                進入互動問答
                <ChevronRight className="inline ml-1.5 w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PhaseTransition>
  );
}
