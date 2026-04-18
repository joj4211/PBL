import { AnimatePresence } from 'framer-motion';
import { useCase } from './hooks/useCase';
import { PHASES } from './logic/stateMachine';
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
import PostPearls from './components/phases/PostPearls';

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
  [PHASES.POST_PEARLS]:     PostPearls,
};

export default function App() {
  const caseState = useCase();
  const { currentPhase } = caseState;
  const CurrentPhase = PhaseComponents[currentPhase];

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <CurrentPhase key={currentPhase} {...caseState} />
      </AnimatePresence>
    </AppShell>
  );
}
