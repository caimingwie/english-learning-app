import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useStudy } from '../hooks/useStudy';
import ProgressBar from '../components/ProgressBar';
import SpeakerButton from '../components/SpeakerButton';
import SentenceRenderer from '../components/SentenceRenderer';
import StickyButtons from '../components/StickyButtons';

/**
 * Sentence learning/review page.
 */
export default function SentencesPage() {
  const { state, updateSetting } = useAppContext();
  const { settings } = state;
  const dailyQuota = settings.dailySentenceQuota || 10;

  const {
    currentItem,
    progress,
    isComplete,
    respond,
    reset,
    isLoading,
    error
  } = useStudy({ itemType: 'sentence', dailyQuota });

  const [translationRevealed, setTranslationRevealed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [quotaSelector, setQuotaSelector] = useState(false);

  const sessionStats = React.useRef({ correct: 0, wrong: 0 });

  // Reset when item changes
  React.useEffect(() => {
    setTranslationRevealed(false);
    setShowExplanation(false);
  }, [currentItem?.id]);

  const handleCorrect = async () => {
    if (!currentItem) return;
    sessionStats.current.correct++;
    await respond(true);
    if (progress.done + 1 >= progress.total && progress.total > 0) {
      setSessionSummary({ ...sessionStats.current });
    }
  };

  const handleWrong = async () => {
    if (!currentItem) return;
    sessionStats.current.wrong++;
    setShowExplanation(true);
    // Small delay so user sees the explanation before advancing
    await respond(false);
    if (progress.done + 1 >= progress.total && progress.total > 0) {
      setSessionSummary({ ...sessionStats.current });
    }
  };

  const handleReset = () => {
    sessionStats.current = { correct: 0, wrong: 0 };
    setSessionSummary(null);
    setTranslationRevealed(false);
    setShowExplanation(false);
    reset();
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="page">
        <h2 className="page__title">📖 句子学习</h2>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="page">
        <h2 className="page__title">📖 句子学习</h2>
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
        <h2 className="page__title">📖 句子学习</h2>
        <div className="completion-state">
          <div className="completion-icon">🎉</div>
          <h3>今日句子任务已完成！</h3>
          <p>正确：{sessionSummary?.correct || 0} 句</p>
          <p>错误：{sessionSummary?.wrong || 0} 句</p>
          <div className="completion-actions">
            <button className="btn btn--primary" onClick={handleReset}>
              再来一组
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (!currentItem) {
    return (
      <div className="page">
        <h2 className="page__title">📖 句子学习</h2>
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>今日没有需要复习的句子</h3>
          <button className="btn btn--primary" onClick={handleReset}>刷新</button>
        </div>
      </div>
    );
  }

  // ── Active study state ──
  return (
    <div className="page">
      <h2 className="page__title">📖 句子学习</h2>

      {/* Quota selector */}
      <div className="quota-selector">
        <button
          className="btn btn--small btn--text"
          onClick={() => setQuotaSelector(!quotaSelector)}
        >
          每日：{dailyQuota} 句 ▾
        </button>
        {quotaSelector && (
          <div className="quota-dropdown">
            {[5, 10, 15].map(n => (
              <button
                key={n}
                className={`quota-option ${n === dailyQuota ? 'quota-option--active' : ''}`}
                onClick={() => {
                  updateSetting('dailySentenceQuota', n);
                  setQuotaSelector(false);
                }}
              >
                {n} 句/天
              </button>
            ))}
          </div>
        )}
      </div>

      <ProgressBar done={progress.done} total={progress.total} />

      {/* Sentence card */}
      <div className="sentence-card">
        <div className="sentence-card__header">
          <SpeakerButton
            text={currentItem.english}
            label="朗读句子"
          />
        </div>

        <SentenceRenderer sentence={currentItem} showChinese={false} />

        <div
          className={`sentence-card__translation ${translationRevealed ? 'translation--revealed' : ''}`}
          onClick={() => setTranslationRevealed(true)}
        >
          {translationRevealed ? (
            <p>{currentItem.chinese}</p>
          ) : (
            <span className="meaning-hint">点击查看中文翻译</span>
          )}
        </div>

        {showExplanation && currentItem.structure && (
          <div className="sentence-card__explanation">
            <h4>📝 句子分析</h4>
            <p>
              <strong>主语 (S):</strong> {currentItem.structure.S || '无'}<br />
              <strong>谓语 (V):</strong> {currentItem.structure.V || '无'}<br />
              <strong>宾语 (O):</strong> {currentItem.structure.O || '无'}
            </p>
            <p className="explanation-text">
              英文句子结构通常是：<strong>主语 + 谓语 + 宾语</strong> (SVO)。<br />
              试着多读几遍，感受这种结构。
            </p>
          </div>
        )}
      </div>

      <StickyButtons
        variant="correct-wrong"
        onLeft={handleWrong}
        onRight={handleCorrect}
      />
    </div>
  );
}
