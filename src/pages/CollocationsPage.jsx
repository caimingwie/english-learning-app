import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useStudy } from '../hooks/useStudy';
import ProgressBar from '../components/ProgressBar';
import SpeakerButton from '../components/SpeakerButton';
import StickyButtons from '../components/StickyButtons';

/**
 * Collocation (固定搭配) learning page.
 * Uses the same useStudy hook pattern as WordsPage.
 */
export default function CollocationsPage() {
  const { state, updateSetting } = useAppContext();
  const { settings } = state;
  const dailyQuota = settings.dailyCollocationQuota || 10;

  const {
    currentItem,
    progress,
    isComplete,
    respond,
    reset,
    isLoading,
    error
  } = useStudy({ itemType: 'collocation', dailyQuota });

  const [meaningRevealed, setMeaningRevealed] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [quotaSelector, setQuotaSelector] = useState(false);

  const sessionStats = React.useRef({ known: 0, unknown: 0 });

  React.useEffect(() => {
    setMeaningRevealed(false);
  }, [currentItem?.id]);

  const handleKnow = async () => {
    if (!currentItem) return;
    sessionStats.current.known++;
    setMeaningRevealed(true);
    await respond(true);
    if (progress.done + 1 >= progress.total && progress.total > 0) {
      setSessionSummary({ ...sessionStats.current });
    }
  };

  const handleDontKnow = async () => {
    if (!currentItem) return;
    sessionStats.current.unknown++;
    setMeaningRevealed(true);
    await respond(false);
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

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="page">
        <h2 className="page__title">🔗 搭配学习</h2>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  // ── Error ──
  if (error) {
    return (
      <div className="page">
        <h2 className="page__title">🔗 搭配学习</h2>
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
        <h2 className="page__title">🔗 搭配学习</h2>
        <div className="completion-state">
          <div className="completion-icon">🎉</div>
          <h3>今日搭配任务已完成！</h3>
          <p>认识：{sessionSummary?.known || 0} 个</p>
          <p>不认识：{sessionSummary?.unknown || 0} 个</p>
          <div className="completion-actions">
            <button className="btn btn--primary" onClick={handleReset}>
              再来一组
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty ──
  if (!currentItem) {
    return (
      <div className="page">
        <h2 className="page__title">🔗 搭配学习</h2>
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>今日没有需要复习的搭配</h3>
          <button className="btn btn--primary" onClick={handleReset}>刷新</button>
        </div>
      </div>
    );
  }

  // ── Active study ──
  return (
    <div className="page">
      <h2 className="page__title">🔗 搭配学习</h2>

      {/* Quota selector */}
      <div className="quota-selector">
        <button
          className="btn btn--small btn--text"
          onClick={() => setQuotaSelector(!quotaSelector)}
        >
          每日：{dailyQuota} 组 ▾
        </button>
        {quotaSelector && (
          <div className="quota-dropdown">
            {[10, 20, 30, 40, 50].map(n => (
              <button
                key={n}
                className={`quota-option ${n === dailyQuota ? 'quota-option--active' : ''}`}
                onClick={() => {
                  updateSetting('dailyCollocationQuota', n);
                  setQuotaSelector(false);
                }}
              >
                {n} 组/天
              </button>
            ))}
          </div>
        )}
      </div>

      <ProgressBar done={progress.done} total={progress.total} />

      {/* Collocation card */}
      <div className="collocation-card">
        <div className="collocation-card__phrase">
          <span className="phrase-text">{currentItem.phrase}</span>
          <SpeakerButton text={currentItem.phrase} label={`朗读 ${currentItem.phrase}`} />
        </div>

        <div
          className={`collocation-card__meaning ${meaningRevealed ? 'meaning--revealed' : ''}`}
          onClick={() => setMeaningRevealed(true)}
        >
          {meaningRevealed ? (
            <span className="meaning-text">{currentItem.meaning}</span>
          ) : (
            <span className="meaning-hint">点击查看释义</span>
          )}
        </div>

        {/* Example sentence (shown after meaning revealed) */}
        {meaningRevealed && currentItem.example && (
          <div className="collocation-card__example">
            <div className="example-header">
              <span>📖 例句</span>
              <SpeakerButton text={currentItem.example} label="朗读例句" small />
            </div>
            <p className="example-en">{currentItem.example}</p>
            <p className="example-cn">{currentItem.exampleMeaning}</p>
          </div>
        )}
      </div>

      <StickyButtons
        variant="know-dontknow"
        onLeft={handleDontKnow}
        onRight={handleKnow}
      />
    </div>
  );
}
