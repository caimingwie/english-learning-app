import React, { useState } from 'react';
import MistakesPage from './MistakesPage';
import QuizPage from './QuizPage';
import GrammarPage from './GrammarPage';

const SUB_TABS = [
  { key: 'mistakes', label: '❌ 错题', component: MistakesPage },
  { key: 'quiz', label: '📝 测验', component: QuizPage },
  { key: 'grammar', label: '📚 语法', component: GrammarPage }
];

export default function ReviewPage() {
  const [subTab, setSubTab] = useState('mistakes');
  const ActiveComponent = SUB_TABS.find(t => t.key === subTab)?.component || MistakesPage;

  return (
    <div className="page">
      <div className="sub-tabs">
        {SUB_TABS.map(tab => (
          <button
            key={tab.key}
            className={`sub-tab ${subTab === tab.key ? 'sub-tab--active' : ''}`}
            onClick={() => setSubTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ActiveComponent />
    </div>
  );
}
