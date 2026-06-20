import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useStudy } from '../hooks/useStudy';
import ProgressBar from '../components/ProgressBar';
import SpeakerButton from '../components/SpeakerButton';
import StickyButtons from '../components/StickyButtons';

/**
 * Collocation (固定搭配) learning page.
 * Flow: See phrase → Click 认识/不认识 → See meaning + phonetic → Click 下一题 → Next
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
    advance,
    goBack,
    canGoBack,
    canGoNext,
    answered,
    sessionStats,
    reset,
    isLoading,
    error
  } = useStudy({ itemType: 'collocation', dailyQuota });

  const [quotaSelector, setQuotaSelector] = useState(false);

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
  if (isComplete) {
    return (
      <div className="page">
        <h2 className="page__title">🔗 搭配学习</h2>
        <div className="completion-state">
          <div className="completion-icon">🎉</div>
          <h3>今日搭配任务已完成！</h3>
          <p>认识：{sessionStats.known} 个</p>
          <p>不认识：{sessionStats.unknown} 个</p>
          <div className="completion-actions">
            <button className="btn btn--primary" onClick={reset}>
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
          <button className="btn btn--primary" onClick={reset}>刷新</button>
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

        {/* Phonetic display */}
        {currentItem.phonetic && (
          <div className="collocation-card__phonetic">
            <span className="phonetic-text">{currentItem.phonetic}</span>
            <SpeakerButton text={currentItem.phrase} label="听发音" small />
          </div>
        )}

        <div className={`collocation-card__meaning ${answered ? 'meaning--revealed' : ''}`}>
          {answered ? (
            <span className="meaning-text">{currentItem.meaning}</span>
          ) : (
            <span className="meaning-hint">作答后将显示释义</span>
          )}
        </div>

        {/* Example sentence (shown after answer revealed) */}
        {answered && currentItem.example && (
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
        onLeft={() => respond(false)}
        onRight={() => respond(true)}
        leftLabel="不认识"
        rightLabel="认识"
        disabled={answered}
        showLeftRight={true}
        onPrev={goBack}
        onNext={advance}
        prevDisabled={!canGoBack}
        nextDisabled={!answered}
        nextLabel={progress.done + 1 >= progress.total && answered ? '完成' : '下一题'}
        answered={answered}
      />
    </div>
  );
}
