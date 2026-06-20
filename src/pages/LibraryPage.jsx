import React, { useState } from 'react';
import VocabularyPage from './VocabularyPage';
import PhoneticsPage from './PhoneticsPage';

const SUB_TABS = [
  { key: 'vocabulary', label: '📑 词汇库', component: VocabularyPage },
  { key: 'phonetics', label: '🔤 音标', component: PhoneticsPage }
];

export default function LibraryPage() {
  const [subTab, setSubTab] = useState('vocabulary');
  const ActiveComponent = SUB_TABS.find(t => t.key === subTab)?.component || VocabularyPage;

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
