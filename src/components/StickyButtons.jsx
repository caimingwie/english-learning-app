import React from 'react';

/**
 * Sticky action buttons that sit above the bottom nav.
 *
 * Props:
 *   variant: 'know-dontknow' | 'correct-wrong' | 'prev-next' | 'start'
 *   onLeft:  handler for left button
 *   onRight: handler for right button
 *   onCenter: handler for center button (start variant)
 *   leftLabel: custom label for left button
 *   rightLabel: custom label for right button
 *   centerLabel: custom label for center button
 *   disabled: disable all buttons
 *   showLeftRight: show prev/next buttons
 *   onPrev: handler for previous button
 *   onNext: handler for next button
 */
export default function StickyButtons({
  variant = 'know-dontknow',
  onLeft,
  onRight,
  onCenter,
  leftLabel,
  rightLabel,
  centerLabel,
  disabled = false,
  showLeftRight = false,
  onPrev,
  onNext
}) {
  const renderMainButtons = () => {
    switch (variant) {
      case 'know-dontknow':
        return (
          <>
            <button
              className="btn btn--secondary btn--large"
              onClick={onLeft}
              disabled={disabled}
            >
              {leftLabel || '不认识'}
            </button>
            <button
              className="btn btn--primary btn--large"
              onClick={onRight}
              disabled={disabled}
            >
              {rightLabel || '认识'}
            </button>
          </>
        );

      case 'correct-wrong':
        return (
          <>
            <button
              className="btn btn--danger btn--large"
              onClick={onLeft}
              disabled={disabled}
            >
              {leftLabel || '错误'}
            </button>
            <button
              className="btn btn--success btn--large"
              onClick={onRight}
              disabled={disabled}
            >
              {rightLabel || '正确'}
            </button>
          </>
        );

      case 'prev-next':
        return (
          <>
            <button
              className="btn btn--secondary btn--large"
              onClick={onLeft}
              disabled={disabled}
            >
              {leftLabel || '上一题'}
            </button>
            <button
              className="btn btn--primary btn--large"
              onClick={onRight}
              disabled={disabled}
            >
              {rightLabel || '下一题'}
            </button>
          </>
        );

      case 'start':
        return (
          <button
            className="btn btn--primary btn--large btn--full"
            onClick={onCenter}
            disabled={disabled}
          >
            {centerLabel || '开始学习'}
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="sticky-buttons">
      {showLeftRight && (
        <div className="sticky-buttons__nav">
          <button
            className="btn btn--small btn--secondary"
            onClick={onPrev}
            disabled={disabled}
          >
            ← 上一题
          </button>
          <button
            className="btn btn--small btn--secondary"
            onClick={onNext}
            disabled={disabled}
          >
            下一题 →
          </button>
        </div>
      )}
      <div className="sticky-buttons__main">
        {renderMainButtons()}
      </div>
    </div>
  );
}
