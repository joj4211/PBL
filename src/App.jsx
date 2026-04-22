import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import EntryPage from './components/auth/EntryPage';
import { useCase } from './hooks/useCase';
import { useAuth } from './hooks/useAuth';
import { PHASES } from './logic/stateMachine';
import { defaultCaseId, getStepCase } from './cases/index';
import AppShell from './components/layout/AppShell';
import LandingPage from './components/pages/LandingPage';
import TopicPage from './components/pages/TopicPage';
import PerformancePage from './components/pages/PerformancePage';
import MaintenancePage from './components/pages/MaintenancePage';
import NoseCasePage from './components/pages/NoseCasePage';
import Intro from './components/phases/Intro';
import PreTest from './components/phases/PreTest';
import ChiefComplaint from './components/phases/ChiefComplaint';
import PhysicalExam from './components/phases/PhysicalExam';
import Workup from './components/phases/Workup';
import Management from './components/phases/Management';
import InteractiveSession from './components/phases/InteractiveSession';
import PostTest from './components/phases/PostTest';
import Analytics from './components/phases/Analytics';
import InteractiveGallery from './components/interactive/InteractiveGallery';
import HistoryTaking from './components/interactive/HistoryTaking';
import PhysicalExamInteractive from './components/interactive/PhysicalExam';
import ImagingViewer from './components/interactive/ImagingViewer';
import DifferentialDiagnosis from './components/interactive/DifferentialDiagnosis';
import LabResults from './components/interactive/LabResults';
import TreatmentDecision from './components/interactive/TreatmentDecision';
import AnatomyLabeling from './components/interactive/AnatomyLabeling';
import DrugSelection from './components/interactive/DrugSelection';
import CaseTimeline from './components/interactive/CaseTimeline';
import CaseReport from './components/interactive/CaseReport';

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

const InteractivePages = {
  history:     HistoryTaking,
  physical:    PhysicalExamInteractive,
  imaging:     ImagingViewer,
  differential: DifferentialDiagnosis,
  labs:        LabResults,
  treatment:   TreatmentDecision,
  anatomy:     AnatomyLabeling,
  drugs:       DrugSelection,
  timeline:    CaseTimeline,
  report:      CaseReport,
};

function ArchivedCaseDemo({ caseId, onBackToMaintenance }) {
  const { lang } = useLanguage();
  const caseState = useCase(caseId, lang);
  const { currentPhase, goBackPhase } = caseState;
  const CurrentPhase = PhaseComponents[currentPhase];

  return (
    <AppShell
      showCaseControls={true}
      showBackControl={currentPhase !== PHASES.INTRO && currentPhase !== PHASES.PRE_TEST}
      showExitControl={true}
      onBack={goBackPhase}
      onExit={onBackToMaintenance}
    >
      <AnimatePresence mode="wait">
        <CurrentPhase
          key={currentPhase}
          {...caseState}
          user={null}
          onExit={onBackToMaintenance}
        />
      </AnimatePresence>
    </AppShell>
  );
}

function AppContent({ onShowMaintenance }) {
  const { lang } = useLanguage();
  const auth = useAuth();
  const [screen, setScreen]               = useState('landing'); // 'landing' | 'topic' | 'performance' | 'case' | 'stepCase'
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(defaultCaseId);
  const caseState = useCase(selectedCaseId, lang);
  const { currentPhase, goBackPhase, exitToIntro } = caseState;

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setScreen('topic');
  };

  const handleSelectCase = (caseId) => {
    const isStepCase = Boolean(getStepCase(caseId, lang));

    setSelectedCaseId(caseId);

    if (!isStepCase) {
      caseState.startAtPhase(PHASES.PRE_TEST);
    }

    setScreen(isStepCase ? 'stepCase' : 'case');
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
      <AppShell onShowMaintenance={onShowMaintenance}>
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

  if (screen === 'stepCase') {
    const stepCase = getStepCase(selectedCaseId, lang);

    return (
      <NoseCasePage
        caseData={stepCase}
        user={auth.user}
        lang={lang}
        onBack={() => setScreen('topic')}
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
        <CurrentPhase
          key={currentPhase}
          {...caseState}
          user={auth.user}
          onExit={handleExitCase}
        />
      </AnimatePresence>
    </AppShell>
  );
}

function AppRouter() {
  const [screen,       setScreen]       = useState('main');
  const [selectedPage, setSelectedPage] = useState(null);
  const [archivedCaseId, setArchivedCaseId] = useState(null);

  const handleShowGallery = () => setScreen('interactive-gallery');
  const handleShowMaintenance = () => setScreen('maintenance');

  const handleSelectPage  = (pageId) => {
    setSelectedPage(pageId);
    setScreen('interactive-page');
  };

  const handleSelectArchivedCase = (caseId) => {
    setArchivedCaseId(caseId);
    setScreen('archived-case');
  };

  const handleBackToGallery = () => setScreen('interactive-gallery');
  const handleBackToMaintenance = () => setScreen('maintenance');
  const handleBackToMain    = () => setScreen('main');

  if (screen === 'maintenance') {
    return (
      <AppShell>
        <MaintenancePage
          onBack={handleBackToMain}
          onShowGallery={handleShowGallery}
          onSelectArchivedCase={handleSelectArchivedCase}
        />
      </AppShell>
    );
  }

  if (screen === 'archived-case' && archivedCaseId) {
    return (
      <ArchivedCaseDemo
        caseId={archivedCaseId}
        onBackToMaintenance={handleBackToMaintenance}
      />
    );
  }

  if (screen === 'interactive-gallery') {
    return <InteractiveGallery onSelectPage={handleSelectPage} onBack={handleBackToMaintenance} />;
  }

  if (screen === 'interactive-page' && selectedPage) {
    const PageComponent = InteractivePages[selectedPage];
    if (PageComponent) {
      return <PageComponent onBack={handleBackToGallery} />;
    }
  }

  return <AppContent onShowMaintenance={handleShowMaintenance} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  );
}
