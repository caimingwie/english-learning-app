import React from 'react';
import { useAppContext } from '../context/AppContext';

const TABS = [
  { icon: '📊', label: '首页', key: 'home' },
  { icon: '📖', label: '学习', key: 'study' },
  { icon: '🔍', label: '复习', key: 'review' },
  { icon: '📑', label: '词库', key: 'library' }
];

export default function BottomNav() {
  const { state, setActiveTab } = useAppContext();
  const { activeTab } = state;

  return (
    <nav className="bottom-nav">
      {TABS.map((tab, index) => (
        <button
          key={tab.key}
          className={`nav-tab ${activeTab === index ? 'nav-tab--active' : ''}`}
          onClick={() => setActiveTab(index)}
          aria-label={tab.label}
          title={tab.label}
        >
          <span className="nav-tab__icon">{tab.icon}</span>
          <span className="nav-tab__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
