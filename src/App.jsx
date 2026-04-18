import { AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useCase } from './hooks/useCase';
import { PHASES } from './logic/stateMachine';
import { defaultCaseId } from './cases/index';
import AppShell from './components/layout/AppShell';
import Intro from './components/phases/Intro';
import PreTest from './components/phases/PreTest';
import ChiefComplaint from './components/phases/ChiefComplaint';
import PhysicalExam from './components/phases/PhysicalExam';
import Workup from './components/phases/Workup';
import Management from './components/phases/Management';
import InteractiveSession from './components/phases/InteractiveSession';
import PostTest from './components/phases/PostTest';
import Analytics from './components/phases/Analytics';

const PhaseComponents = {
  [PHASES.INTRO]:           Intro,
  [PHASES.PRE_TEST]:        PreTest,
  [PHASES.CHIEF_COMPLAINT]: ChiefComplaint,
  [PHASES.PHYSICAL_EXAM]:   PhysicalExam,
  [PHASES.WORKUP]:          Workup,
  [PHASES.MANAGEMENT]:      Management,
  [PHASES.INTERACTIVE]:     InteractiveSession,
  [PHASES.POST_TEST]:       PostTest,
  [PHASES.ANALYTICS]:       Analytics,
};

function AppContent() {
  const { lang } = useLanguage();
  const caseState = useCase(defaultCaseId, lang);
  const { currentPhase, goBackPhase, exitToIntro } = caseState;
  const CurrentPhase = PhaseComponents[currentPhase];

  return (
    <AppShell
      showCaseControls={currentPhase !== PHASES.INTRO}
      showBackControl={currentPhase !== PHASES.PRE_TEST}
      onBack={goBackPhase}
      onExit={exitToIntro}
    >
      <AnimatePresence mode="wait">
        <CurrentPhase key={currentPhase} {...caseState} />
      </AnimatePresence>
    </AppShell>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
