import { useState } from 'react';
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

function AppContent({ onShowGallery }) {
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
        <CurrentPhase key={currentPhase} {...caseState} onShowGallery={onShowGallery} />
      </AnimatePresence>
    </AppShell>
  );
}

function AppRouter() {
  const [screen,       setScreen]       = useState('main');
  const [selectedPage, setSelectedPage] = useState(null);

  const handleShowGallery = () => setScreen('interactive-gallery');

  const handleSelectPage  = (pageId) => {
    setSelectedPage(pageId);
    setScreen('interactive-page');
  };

  const handleBackToGallery = () => setScreen('interactive-gallery');
  const handleBackToMain    = () => setScreen('main');

  if (screen === 'interactive-gallery') {
    return <InteractiveGallery onSelectPage={handleSelectPage} onBack={handleBackToMain} />;
  }

  if (screen === 'interactive-page' && selectedPage) {
    const PageComponent = InteractivePages[selectedPage];
    if (PageComponent) {
      return <PageComponent onBack={handleBackToGallery} />;
    }
  }

  return <AppContent onShowGallery={handleShowGallery} />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  );
}
