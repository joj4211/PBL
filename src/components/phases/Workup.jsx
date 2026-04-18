import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, ChevronRight, ChevronDown, CheckCircle2 } from 'lucide-react';
import PhaseTransition from '../ui/PhaseTransition';
import ProgressIndicator from '../ui/ProgressIndicator';
import ImagePlaceholder from '../ui/ImagePlaceholder';
import Button from '../ui/Button';
import { useLanguage } from '../../contexts/LanguageContext';

// ── PTA Card ──────────────────────────────────────────────────

function PTACard({ inv }) {
  const { ui } = useLanguage();
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-4">
      <ImagePlaceholder
        filename={inv.image}
        label={inv.name}
        aspectRatio={inv.aspectRatio}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-warm-800">{inv.question}</p>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="text-xs font-semibold text-sage-600 hover:text-sage-700 underline underline-offset-2 transition-colors"
          >
            {ui.workup.viewAnswer}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 bg-sage-50/80 border border-sage-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-sage-500 mt-0.5" />
              <p className="text-sm text-sage-700 leading-relaxed">{inv.answer}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Caloric Card ──────────────────────────────────────────────

function CaloricCard({ inv }) {
  const { ui } = useLanguage();
  const [revealed, setRevealed] = useState(false);
  const [input, setInput] = useState('');

  return (
    <div className="space-y-4">
      {inv.images.map((img, idx) => (
        <ImagePlaceholder
          key={idx}
          filename={img}
          label={`${inv.name} — Image ${idx + 1}`}
          aspectRatio={inv.aspectRatio}
        />
      ))}
      <div className="glass-card-sage px-4 py-3">
        <p className="text-xs font-semibold text-sage-600 mb-1">{ui.workup.observationLabel}</p>
        <p className="text-sm text-warm-700">{inv.observation}</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-warm-800">
          {ui.workup.taskPrefix}{inv.task}
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={ui.workup.inputPlaceholder}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border-2 border-warm-200 bg-white/50 text-warm-800 text-sm
            placeholder:text-warm-300 focus:outline-none focus:border-sage-300 resize-none transition-colors"
        />
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="text-xs font-semibold text-sage-600 hover:text-sage-700 underline underline-offset-2 transition-colors"
          >
            {ui.workup.viewResult}
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 bg-sage-50/80 border border-sage-200 rounded-xl px-4 py-3">
              <CheckCircle2 className="flex-shrink-0 w-4 h-4 text-sage-500 mt-0.5" />
              <p className="text-sm text-sage-700 leading-relaxed">{inv.result}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── VEMP Card ─────────────────────────────────────────────────

function VEMPCard({ inv }) {
  const { ui } = useLanguage();
  return (
    <div className="space-y-4">
      <ImagePlaceholder
        filename={inv.image}
        label={inv.name}
        aspectRatio={inv.aspectRatio}
      />
      {/* Color code rules */}
      <div className="glass-card-warm px-4 py-3 space-y-1">
        {inv.rules.map((rule, idx) => (
          <p key={idx} className="text-sm text-warm-700 leading-relaxed">
            {rule}
          </p>
        ))}
      </div>
      {/* Task (no answer in JSON — students interpret the image) */}
      <div className="px-4 py-3 rounded-xl border-2 border-dashed border-warm-200 bg-warm-50/40">
        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wider mb-1">
          {ui.workup.thinkingTask}
        </p>
        <p className="text-sm font-medium text-warm-800">{inv.task}</p>
        <p className="text-xs text-warm-400 mt-2 italic">{ui.workup.colorCodeHint}</p>
      </div>
    </div>
  );
}

// ── Investigation Accordion ───────────────────────────────────

function InvestigationPanel({ inv, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/20 transition-colors"
      >
        <span className="font-semibold text-warm-800">{inv.name}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="w-5 h-5 text-warm-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2">
              {inv.id === 'pta'    && <PTACard    inv={inv} />}
              {inv.id === 'caloric'&& <CaloricCard inv={inv} />}
              {inv.id === 'vemp'  && <VEMPCard   inv={inv} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────

export default function Workup({ caseData, currentPhase, advancePhase }) {
  const { ui } = useLanguage();
  const { title, investigations } = caseData.workup;

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
            <FlaskConical className="w-6 h-6 text-warm-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif">{title}</h2>
            <p className="text-warm-400 text-sm mt-1">{ui.workup.subtitle}</p>
          </div>
        </motion.div>

        {/* Investigations */}
        <div className="space-y-4 mb-10">
          {investigations.map((inv, idx) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }}
            >
              <InvestigationPanel inv={inv} defaultOpen={idx === 0} />
            </motion.div>
          ))}
        </div>

        {/* Proceed */}
        <div className="flex flex-col items-center gap-3 pb-12">
          <Button onClick={advancePhase} size="lg">
            {ui.workup.proceed}
            <ChevronRight className="inline ml-1.5 w-4 h-4" />
          </Button>
        </div>
      </div>
    </PhaseTransition>
  );
}
