import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useStudy } from '../hooks/useStudy';
import ProgressBar from '../components/ProgressBar';
import SpeakerButton from '../components/SpeakerButton';
import SentenceRenderer from '../components/SentenceRenderer';
import StickyButtons from '../components/StickyButtons';
import StudySelector from '../components/StudySelector';

const STUDY_TYPES = [
  { key: 'word', label: '单词' },
  { key: 'sentence', label: '句子' },
  { key: 'collocation', label: '搭配' }
];

const QUOTAS = {
  word: { setting: 'dailyWordQuota', default: 20, options: [10, 20, 30, 40, 50] },
  sentence: { setting: 'dailySentenceQuota', default: 10, options: [5, 10, 15, 20] },
  collocation: { setting: 'dailyCollocationQuota', default: 10, options: [5, 10, 15, 20, 30] }
};

export default function StudyHubPage() {
  const { state, updateSetting } = useAppContext();
  const { settings } = state;

  const [itemType, setItemType] = useState('word');
  const [meaningRevealed, setMeaningRevealed] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [quotaSelector, setQuotaSelector] = useState(false);

  const quotaKey = QUOTAS[itemType];
  const dailyQuota = settings[quotaKey.setting] || quotaKey.default;

  const {
    currentItem,
    progress,
    isComplete,
    respond,
    reset,
    isLoading,
    error
  } = useStudy({ itemType, dailyQuota });

  const sessionStats = React.useRef({ known: 0, unknown: 0 });

  // Reset meaning reveal when item changes
  React.useEffect(() => {
    setMeaningRevealed(false);
  }, [currentItem?.id]);

  const handlePositive = async () => {
    if (!currentItem) return;
    sessionStats.current.known++;
    setMeaningRevealed(true);
    await respond(true);
    checkCompletion();
  };

  const handleNegative = async () => {
    if (!currentItem) return;
    sessionStats.current.unknown++;
    setMeaningRevealed(true);
    await respond(false);
    checkCompletion();
  };

  const checkCompletion = () => {
    if (progress.done + 1 >= progress.total && progress.total > 0) {
      setSessionSummary({ ...sessionStats.current });
    }
  };

  const handleReset = () => {
    sessionStats.current = { known: 0, unknown: 0 };
    setSessionSummary(null);
    setMeaningRevealed(false);
    reset();
  };

  const handleTypeChange = (key) => {
    setItemType(key);
    setMeaningRevealed(false);
    setSessionSummary(null);
    sessionStats.current = { known: 0, unknown: 0 };
  };

  const handleQuotaChange = (val) => {
    updateSetting(quotaKey.setting, val);
    setQuotaSelector(false);
  };

  // ── Render: Title ──
  const titleMap = { word: '单词学习', sentence: '句子学习', collocation: '搭配学习' };
  const iconMap = { word: '🧠', sentence: '📖', collocation: '🔗' };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="page">
        <h2 className="page__title">{iconMap[itemType]} {titleMap[itemType]}</h2>
        <StudySelector options={STUDY_TYPES} activeKey={itemType} onChange={handleTypeChange} />
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="page">
        <h2 className="page__title">{iconMap[itemType]} {titleMap[itemType]}</h2>
        <StudySelector options={STUDY_TYPES} activeKey={itemType} onChange={handleTypeChange} />
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn--primary" onClick={reset}>重试</button>
        </div>
      </div>
    );
  }

  // ── Completion ──
  if (isComplete || sessionSummary) {
    return (
      <div className="page">
        <h2 className="page__title">{iconMap[itemType]} {titleMap[itemType]}</h2>
        <StudySelector options={STUDY_TYPES} activeKey={itemType} onChange={handleTypeChange} />
        <div className="completion-state">
          <div className="completion-icon">🎉</div>
          <h3>今日任务已完成！</h3>
          <p>认识/正确：{sessionSummary?.known || 0} 个</p>
          <p>不认识/错误：{sessionSummary?.unknown || 0} 个</p>
          <div className="completion-actions">
            <button className="btn btn--primary" onClick={handleReset}>再来一组</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (!currentItem) {
    return (
      <div className="page">
        <h2 className="page__title">{iconMap[itemType]} {titleMap[itemType]}</h2>
        <StudySelector options={STUDY_TYPES} activeKey={itemType} onChange={handleTypeChange} />
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>今日没有需要复习的内容</h3>
          <p>所有内容都已掌握，或者还没有新内容可学。</p>
          <div className="empty-actions">
            <button className="btn btn--primary" onClick={handleReset}>刷新</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active study ── renders different cards per type
  return (
    <div className="page">
      <h2 className="page__title">{iconMap[itemType]} {titleMap[itemType]}</h2>

      <StudySelector options={STUDY_TYPES} activeKey={itemType} onChange={handleTypeChange} />

      {/* Quota selector */}
      <div className="quota-selector">
        <button
          className="btn btn--small btn--text"
          onClick={() => setQuotaSelector(!quotaSelector)}
        >
          每日：{dailyQuota} {itemType === 'word' ? '词' : itemType === 'sentence' ? '句' : '条'} ▾
        </button>
        {quotaSelector && (
          <div className="quota-dropdown">
            {quotaKey.options.map(n => (
              <button
                key={n}
                className={`quota-option ${n === dailyQuota ? 'quota-option--active' : ''}`}
                onClick={() => handleQuotaChange(n)}
              >
                {n} {itemType === 'word' ? '词' : itemType === 'sentence' ? '句' : '条'}/天
              </button>
            ))}
          </div>
        )}
      </div>

      <ProgressBar done={progress.done} total={progress.total} />

      {/* ── Word card ── */}
      {itemType === 'word' && (
        <div className="word-card">
          <div className="word-card__word">
            {currentItem.word}
            <SpeakerButton text={currentItem.word} label={`朗读 ${currentItem.word}`} />
          </div>
          <div className="word-card__phonetic">
            <span className="phonetic-text">{currentItem.phonetic}</span>
            <SpeakerButton text={currentItem.word} label="听发音" small />
          </div>
          <div
            className={`word-card__meaning ${meaningRevealed ? 'meaning--revealed' : ''}`}
            onClick={() => setMeaningRevealed(true)}
          >
            {meaningRevealed
              ? <span className="meaning-text">{currentItem.meaning}</span>
              : <span className="meaning-hint">点击查看释义</span>}
          </div>
          {currentItem.type && (
            <div className="word-card__type">
              <span className="type-badge">{currentItem.type}</span>
            </div>
          )}
        </div>
      )}

      {/* ── Sentence card ── */}
      {itemType === 'sentence' && (
        <div className="sentence-card">
          <div className="sentence-card__header">
            <SpeakerButton text={currentItem.english} label="朗读句子" />
          </div>
          <div className="sentence-display">
            <SentenceRenderer english={currentItem.english} structure={currentItem.structure} />
          </div>
          <div
            className={`sentence-card__translation ${meaningRevealed ? 'translation--revealed' : ''}`}
            onClick={() => setMeaningRevealed(true)}
          >
            {meaningRevealed
              ? currentItem.chinese
              : <span className="meaning-hint">点击查看翻译</span>}
          </div>
          {meaningRevealed && !sessionStats.current.lastItemKnown && (
            <div className="sentence-card__explanation">
              <h4>句子结构分析</h4>
              <SentenceRenderer english={currentItem.english} structure={currentItem.structure} showLegend />
            </div>
          )}
        </div>
      )}

      {/* ── Collocation card ── */}
      {itemType === 'collocation' && (
        <div className="collocation-card">
          <div className="collocation-card__phrase">
            {currentItem.phrase}
            <SpeakerButton text={currentItem.phrase} label="朗读搭配" />
          </div>
          <div
            className={`collocation-card__meaning ${meaningRevealed ? 'meaning--revealed' : ''}`}
            onClick={() => setMeaningRevealed(true)}
          >
            {meaningRevealed
              ? <span className="meaning-text">{currentItem.meaning}</span>
              : <span className="meaning-hint">点击查看释义</span>}
          </div>
          {meaningRevealed && currentItem.example && (
            <div className="collocation-card__example">
              <div className="example-header">
                <span>例句</span>
                <SpeakerButton text={currentItem.example} label="朗读例句" small />
              </div>
              <p className="example-en">{currentItem.example}</p>
              {currentItem.exampleMeaning && (
                <p className="example-cn">{currentItem.exampleMeaning}</p>
              )}
            </div>
          )}
        </div>
      )}

      <StickyButtons
        variant={itemType === 'sentence' ? 'correct-wrong' : 'know-dontknow'}
        onLeft={handleNegative}
        onRight={handlePositive}
      />
    </div>
  );
}
