import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getAllSettings, setSetting, isSeeded, seedData } from '../utils/db';
import { words } from '../data/words';
import { sentences } from '../data/sentences';
import { grammarPoints } from '../data/grammar';
import { collocations } from '../data/collocations';

// Combine all word lists; extended files loaded dynamically
async function getAllWords() {
  let allWords = [...words];
  try {
    const ext = await import('../data/words-extended.js');
    if (ext.wordsExtended) allWords = allWords.concat(ext.wordsExtended);
  } catch (e) { /* extended list not available yet */ }
  try {
    const top = await import('../data/words-topics.js');
    if (top.wordsTopics) allWords = allWords.concat(top.wordsTopics);
  } catch (e) { /* topics list not available yet */ }
  return allWords;
}

// ──── Actions ────────────────────────────────────────────────────────────────
const ACTIONS = {
  SET_TAB: 'SET_TAB',
  SET_SUB_TAB: 'SET_SUB_TAB',
  SET_SHOW_SETTINGS: 'SET_SHOW_SETTINGS',
  UPDATE_SETTING: 'UPDATE_SETTING',
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  SET_INSTALL_PROMPT: 'SET_INSTALL_PROMPT',
  SET_SEEDED: 'SET_SEEDED',
  SET_DB_READY: 'SET_DB_READY'
};

// ──── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  activeTab: 0,
  activeSubTab: 0,
  showSettings: false,
  settings: {
    dailyWordQuota: 20,
    dailySentenceQuota: 10,
    dailyCollocationQuota: 10,
    quizQuota: 20,
    speechRate: 0.7,
    grammarProgress: 0,
    wordbook: [],
    theme: 'auto',
    anthropic_api_key: '',
    ai_enabled: true
  },
  installPrompt: null,
  dbReady: false,
  seeded: false,
  loading: true
};

// ──── Reducer ────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TAB:
      return { ...state, activeTab: action.payload };
    case ACTIONS.SET_SUB_TAB:
      return { ...state, activeSubTab: action.payload };
    case ACTIONS.SET_SHOW_SETTINGS:
      return { ...state, showSettings: action.payload };
    case ACTIONS.LOAD_SETTINGS:
      return { ...state, settings: { ...state.settings, ...action.payload }, loading: false };
    case ACTIONS.UPDATE_SETTING:
      return {
        ...state,
        settings: { ...state.settings, [action.payload.key]: action.payload.value }
      };
    case ACTIONS.SET_INSTALL_PROMPT:
      return { ...state, installPrompt: action.payload };
    case ACTIONS.SET_SEEDED:
      return { ...state, seeded: action.payload };
    case ACTIONS.SET_DB_READY:
      return { ...state, dbReady: action.payload, loading: false };
    default:
      return state;
  }
}

// ──── Context ────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize database and load settings
  useEffect(() => {
    async function init() {
      try {
        // Check if data needs seeding
        const seeded = await isSeeded();
        if (!seeded) {
          const allWords = await getAllWords();
          await seedData({
            words: allWords,
            sentences,
            grammar: grammarPoints,
            collocations
          });
        }
        dispatch({ type: ACTIONS.SET_SEEDED, payload: true });
        dispatch({ type: ACTIONS.SET_DB_READY, payload: true });

        // Load persisted settings
        const settings = await getAllSettings();
        dispatch({ type: ACTIONS.LOAD_SETTINGS, payload: settings });
      } catch (err) {
        console.error('Failed to initialize database:', err);
        dispatch({ type: ACTIONS.SET_DB_READY, payload: true });
      }
    }
    init();
  }, []);

  // Capture install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      dispatch({ type: ACTIONS.SET_INSTALL_PROMPT, payload: e });
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Listen for app installed event
  useEffect(() => {
    const handler = () => {
      dispatch({ type: ACTIONS.SET_INSTALL_PROMPT, payload: null });
    };
    window.addEventListener('appinstalled', handler);
    return () => window.removeEventListener('appinstalled', handler);
  }, []);

  // ── Action creators ──
  const setActiveTab = useCallback((tab) => {
    dispatch({ type: ACTIONS.SET_TAB, payload: tab });
  }, []);

  const setActiveSubTab = useCallback((tab) => {
    dispatch({ type: ACTIONS.SET_SUB_TAB, payload: tab });
  }, []);

  const setShowSettings = useCallback((show) => {
    dispatch({ type: ACTIONS.SET_SHOW_SETTINGS, payload: show });
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    dispatch({ type: ACTIONS.UPDATE_SETTING, payload: { key, value } });
    try {
      await setSetting(key, value);
    } catch (err) {
      console.error('Failed to persist setting:', err);
    }
  }, []);

  const dismissInstallPrompt = useCallback(() => {
    dispatch({ type: ACTIONS.SET_INSTALL_PROMPT, payload: null });
  }, []);

  const value = {
    state,
    dispatch,
    setActiveTab,
    setActiveSubTab,
    setShowSettings,
    updateSetting,
    dismissInstallPrompt
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// ──── Hook ───────────────────────────────────────────────────────────────────
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export { ACTIONS };
