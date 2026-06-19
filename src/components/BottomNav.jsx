import React from 'react';
import { useAppContext } from '../context/AppContext';

const TABS = [
  { icon: '🧠', label: '单词', key: 'words' },
  { icon: '📖', label: '句子', key: 'sentences' },
  { icon: '❌', label: '错题', key: 'mistakes' },
  { icon: '🔤', label: '音标', key: 'phonetics' },
  { icon: '📚', label: '语法', key: 'grammar' },
  { icon: '📝', label: '测验', key: 'quiz' },
  { icon: '📑', label: '词汇库', key: 'vocabulary' },
  { icon: '🔗', label: '搭配', key: 'collocations' }
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
