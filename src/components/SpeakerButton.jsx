import React from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useAppContext } from '../context/AppContext';

/**
 * Button that triggers TTS pronunciation of the given text.
 *
 * Props:
 *   text: string to speak
 *   label: optional accessible label
 *   small: use smaller size
 *   className: additional CSS class
 */
export default function SpeakerButton({ text, label, small = false, className = '' }) {
  const { state } = useAppContext();
  const rate = state.settings.speechRate || 0.7;
  const { speak, speaking, online } = useSpeech(rate);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!online) return;
    speak(text);
  };

  const isDisabled = !online;

  return (
    <button
      className={`speaker-btn ${small ? 'speaker-btn--small' : ''} ${speaking ? 'speaker-btn--speaking' : ''} ${isDisabled ? 'speaker-btn--offline' : ''} ${className}`}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={label || (isDisabled ? '需网络' : '发音')}
      title={isDisabled ? '离线模式，发音需要网络连接' : (label || '点击发音')}
    >
      {isDisabled ? '🚫' : speaking ? '🔊' : '🔈'}
    </button>
  );
}
