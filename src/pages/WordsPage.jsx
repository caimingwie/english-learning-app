import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useStudy } from '../hooks/useStudy';
import ProgressBar from '../components/ProgressBar';
import SpeakerButton from '../components/SpeakerButton';
import StickyButtons from '../components/StickyButtons';

/**
 * Word learning/review page.
 * Uses the useStudy hook for the spaced-repetition study session.
 */
export default function WordsPage() {
  const { state, updateSetting } = useAppContext();
  const { settings } = state;
  const dailyQuota = settings.dailyWordQuota || 20;

  const {
    currentItem,
    progress,
    isComplete,
    respond,
    reset,
    isLoading,
    error
  } = useStudy({ itemType: 'word', dailyQuota });

  const [meaningRevealed, setMeaningRevealed] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [quotaSelector, setQuotaSelector] = useState(false);

  // Track session stats for summary
  const sessionStats = React.useRef({ known: 0, unknown: 0 });
  const lastProgressRef = React.useRef(0);

  // Reset meaning reveal when item changes
  React.useEffect(() => {
    setMeaningRevealed(false);
  }, [currentItem?.id]);

  // Track stats
  React.useEffect(() => {
    const current = progress.done;
    if (current > lastProgressRef.current) {
      lastProgressRef.current = current;
    }
  }, [progress.done]);

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
    lastProgressRef.current = 0;
    setSessionSummary(null);
    setMeaningRevealed(false);
    reset();
  };

  const handleQuotaChange = (val) => {
    updateSetting('dailyWordQuota', val);
    setQuotaSelector(false);
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="page">
        <h2 className="page__title">🧠 单词学习</h2>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="page">
        <h2 className="page__title">🧠 单词学习</h2>
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn--primary" onClick={reset}>重试</button>
        </div>
      </div>
    );
  }

  // ── Completion state ──
  if (isComplete || sessionSummary) {
    return (
      <div className="page">
        <h2 className="page__title">🧠 单词学习</h2>
        <div className="completion-state">
          <div className="completion-icon">🎉</div>
          <h3>今日任务已完成！</h3>
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

  // ── Empty state (no items to study) ──
  if (!currentItem) {
    return (
      <div className="page">
        <h2 className="page__title">🧠 单词学习</h2>
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>今日没有需要复习的单词</h3>
          <p>所有单词都已掌握，或者还没有新单词可学。</p>
          <div className="empty-actions">
            <button className="btn btn--primary" onClick={handleReset}>
              刷新
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active study state ──
  return (
    <div className="page">
      <h2 className="page__title">🧠 单词学习</h2>

      {/* Quota selector */}
      <div className="quota-selector">
        <button
          className="btn btn--small btn--text"
          onClick={() => setQuotaSelector(!quotaSelector)}
        >
          每日：{dailyQuota} 词 ▾
        </button>
        {quotaSelector && (
          <div className="quota-dropdown">
            {[10, 20, 30, 40, 50].map(n => (
              <button
                key={n}
                className={`quota-option ${n === dailyQuota ? 'quota-option--active' : ''}`}
                onClick={() => handleQuotaChange(n)}
              >
                {n} 词/天
              </button>
            ))}
          </div>
        )}
      </div>

      <ProgressBar done={progress.done} total={progress.total} />

      {/* Word card */}
      <div className="word-card">
        <div className="word-card__word">
          {currentItem.word}
          <SpeakerButton text={currentItem.word} label={`朗读 ${currentItem.word}`} />
        </div>

        <div className="word-card__phonetic">
          <span className="phonetic-text">{currentItem.phonetic}</span>
          <SpeakerButton
            text={currentItem.word}
            label={`对照音标听 ${currentItem.word}`}
            small
          />
        </div>

        <div
          className={`word-card__meaning ${meaningRevealed ? 'meaning--revealed' : ''}`}
          onClick={() => setMeaningRevealed(true)}
        >
          {meaningRevealed ? (
            <span className="meaning-text">{currentItem.meaning}</span>
          ) : (
            <span className="meaning-hint">点击查看释义</span>
          )}
        </div>

        {currentItem.type && (
          <div className="word-card__type">
            <span className="type-badge">{currentItem.type}</span>
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
