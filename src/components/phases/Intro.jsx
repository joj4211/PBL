import { motion } from 'framer-motion';
import { Stethoscope, Search, FlaskConical, Pill, Star, Tag, Timer } from 'lucide-react';
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
  { icon: Search,      label: 'Chief Complaint',    desc: 'History taking & reasoning' },
  { icon: Stethoscope, label: 'Physical Exam',       desc: 'HINTS exam step-by-step' },
  { icon: FlaskConical,label: 'Vestibular Workup',   desc: 'PTA, Caloric, VEMP' },
  { icon: Pill,        label: 'Management',          desc: 'Clinical decision tree' },
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
              Medical PBL Interactive Learning
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

          <motion.div variants={fadeUp} className="w-20 h-px bg-warm-200" />

          {/* CTA */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3">
            <Button onClick={advancePhase} size="lg" variant="primary">
              Begin Case
            </Button>
            <p className="text-xs text-warm-400">
              Find a quiet space and allow yourself enough time to read carefully.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PhaseTransition>
  );
}
