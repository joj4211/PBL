import { AnimatePresence } from 'framer-motion';
import { useCase } from './hooks/useCase';
import { PHASES } from './logic/stateMachine';
import AppShell from './components/layout/AppShell';
import Intro from './components/phases/Intro';
import PreTest from './components/phases/PreTest';
import CaseStudy from './components/phases/CaseStudy';
import InteractiveSession from './components/phases/InteractiveSession';
import PostTest from './components/phases/PostTest';
import Analytics from './components/phases/Analytics';

const PhaseComponents = {
  [PHASES.INTRO]: Intro,
  [PHASES.PRE_TEST]: PreTest,
  [PHASES.CASE_STUDY]: CaseStudy,
  [PHASES.INTERACTIVE]: InteractiveSession,
  [PHASES.POST_TEST]: PostTest,
  [PHASES.ANALYTICS]: Analytics,
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
