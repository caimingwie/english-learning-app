import React from 'react';
import { useAppContext } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import BottomNav from './components/BottomNav';
import InstallPrompt from './components/InstallPrompt';
import PageTransition from './components/PageTransition';
import HomePage from './pages/HomePage';
import StudyHubPage from './pages/StudyHubPage';
import ReviewPage from './pages/ReviewPage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';

const PAGES = [
  HomePage,       // 0 — Dashboard
  StudyHubPage,   // 1 — Study (words + sentences + collocations)
  ReviewPage,     // 2 — Review (mistakes + quiz + grammar)
  LibraryPage     // 3 — Library (vocabulary + phonetics)
];

export default function App() {
  const { state, setShowSettings } = useAppContext();

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

  // Settings page is a full-screen overlay
  if (state.showSettings) {
    return (
      <ThemeProvider>
        <SettingsPage onClose={() => setShowSettings(false)} />
      </ThemeProvider>
    );
  }

  const ActivePage = PAGES[state.activeTab];

  return (
    <ThemeProvider>
      <div className="app-container">
        <InstallPrompt />
        <header className="app-header">
          <span className="app-header__title">英语学习助手</span>
          <div className="app-header__actions">
            <button
              className="header-btn"
              onClick={() => setShowSettings(true)}
              aria-label="设置"
              title="设置"
            >
              ⚙️
            </button>
          </div>
        </header>
        <main className="page-content" id="main-content">
          <PageTransition pageKey={state.activeTab}>
            <ActivePage />
          </PageTransition>
        </main>
        <BottomNav />
      </div>
    </ThemeProvider>
  );
}
