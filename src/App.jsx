import { AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import EntryPage from './components/auth/EntryPage';
import { useCase } from './hooks/useCase';
import { useAuth } from './hooks/useAuth';
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
  const auth = useAuth();
  const caseState = useCase(defaultCaseId, lang);
  const { currentPhase, goBackPhase, exitToIntro } = caseState;
  const CurrentPhase = PhaseComponents[currentPhase];

  if (auth.loading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glass-card px-6 py-4 text-sm font-semibold text-warm-600">
            載入中...
          </div>
        </div>
      </AppShell>
    );
  }

  if (!auth.user) {
    return (
      <AppShell>
        <EntryPage
          onSignIn={auth.signIn}
          onSignUp={auth.signUp}
          loading={auth.loading}
        />
      </AppShell>
    );
  }

  return (
    <AppShell
      showCaseControls={currentPhase !== PHASES.INTRO}
      showBackControl={currentPhase !== PHASES.PRE_TEST}
      onBack={goBackPhase}
      onExit={exitToIntro}
      onSignOut={auth.signOut}
    >
      <AnimatePresence mode="wait">
        <CurrentPhase key={currentPhase} {...caseState} user={auth.user} />
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
