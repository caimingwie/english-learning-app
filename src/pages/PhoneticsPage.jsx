import React, { useState } from 'react';
import { phonetics } from '../data/phonetics';
import SpeakerButton from '../components/SpeakerButton';

/**
 * Full IPA phonetics reference chart.
 * Click the speaker icon to hear the phoneme sound (not the example word).
 */
export default function PhoneticsPage() {
  const [activeTab, setActiveTab] = useState('vowels'); // 'vowels' | 'consonants'

  const currentList = activeTab === 'vowels' ? phonetics.vowels : phonetics.consonants;

  return (
    <div className="page">
      <h2 className="page__title">🔤 音标表</h2>

      <div className="phonetics-tabs">
        <button
          className={`tab-btn ${activeTab === 'vowels' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('vowels')}
        >
          元音 ({phonetics.vowels.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'consonants' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('consonants')}
        >
          辅音 ({phonetics.consonants.length})
        </button>
      </div>

      <div className="phonetics-grid">
        {currentList.map((item, index) => (
          <div key={index} className="phonetic-card">
            <div className="phonetic-card__symbol">
              <span className="phonetic-symbol-text">/{item.symbol}/</span>
              <SpeakerButton
                text={item.speakText}
                label={`听 /${item.symbol}/ 的发音`}
                small
              />
            </div>
            <div className="phonetic-card__example">{item.exampleWord}</div>
            <div className="phonetic-card__desc">{item.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
