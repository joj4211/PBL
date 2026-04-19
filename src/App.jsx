import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import EntryPage from './components/auth/EntryPage';
import { useCase } from './hooks/useCase';
import { useAuth } from './hooks/useAuth';
import { PHASES } from './logic/stateMachine';
import { defaultCaseId } from './cases/index';
import AppShell from './components/layout/AppShell';
import LandingPage from './components/pages/LandingPage';
import TopicPage from './components/pages/TopicPage';
import PerformancePage from './components/pages/PerformancePage';
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
  const [screen, setScreen]               = useState('landing'); // 'landing' | 'topic' | 'performance' | 'case'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(defaultCaseId);
  const caseState = useCase(selectedCaseId, lang);
  const { currentPhase, goBackPhase, exitToIntro } = caseState;

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setScreen('topic');
  };

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setScreen('case');
  };

  const handleSelectPerformance = () => {
    setScreen('performance');
  };

  const handleBackToLanding = () => {
    setScreen('landing');
    setSelectedTopic(null);
  };

  const handleExitCase = () => {
    exitToIntro();
    setScreen('topic');
  };

  const handleSignOut = async () => {
    setScreen('landing');
    setSelectedTopic(null);
    await auth.signOut();
  };

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

  if (screen === 'landing') {
    return (
      <LandingPage
        lang={lang}
        onSelectTopic={handleSelectTopic}
        onSelectPerformance={handleSelectPerformance}
        onSignOut={handleSignOut}
      />
    );
  }

  if (screen === 'topic') {
    return (
      <TopicPage
        topic={selectedTopic}
        lang={lang}
        onSelectCase={handleSelectCase}
        onBack={handleBackToLanding}
        onSignOut={handleSignOut}
      />
    );
  }

  if (screen === 'performance') {
    return (
      <PerformancePage
        user={auth.user}
        lang={lang}
        onBack={handleBackToLanding}
        onSignOut={handleSignOut}
      />
    );
  }

  const CurrentPhase = PhaseComponents[currentPhase];

  return (
    <AppShell
      showCaseControls={true}
      showBackControl={currentPhase !== PHASES.INTRO && currentPhase !== PHASES.PRE_TEST}
      showExitControl={currentPhase !== PHASES.ANALYTICS}
      onBack={goBackPhase}
      onExit={handleExitCase}
      onSignOut={handleSignOut}
    >
      <AnimatePresence mode="wait">
        <CurrentPhase key={currentPhase} {...caseState} user={auth.user} onExit={handleExitCase} />
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
