import React from 'react';
import { useAppContext } from './context/AppContext';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import WordsPage from './pages/WordsPage';
import SentencesPage from './pages/SentencesPage';
import MistakesPage from './pages/MistakesPage';
import PhoneticsPage from './pages/PhoneticsPage';
import GrammarPage from './pages/GrammarPage';
import QuizPage from './pages/QuizPage';
import VocabularyPage from './pages/VocabularyPage';
import CollocationsPage from './pages/CollocationsPage';

const PAGES = [
  WordsPage,
  SentencesPage,
  MistakesPage,
  PhoneticsPage,
  GrammarPage,
  QuizPage,
  VocabularyPage,
  CollocationsPage
];

export default function App() {
  const { state } = useAppContext();
  const ActivePage = PAGES[state.activeTab];

  if (state.loading) {
    return (
      <div className="app-container">
        <div className="app-loading">
          <div className="loading-spinner" />
          <p>正在初始化...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <InstallPrompt />
      <main className="page-content">
        <ActivePage />
      </main>
      <BottomNav />
    </div>
  );
}
