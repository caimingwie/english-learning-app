import { useState, useCallback, useRef } from 'react';
import { speak as speakUtil, stopSpeech, isSpeechAvailable, isOnline } from '../utils/speech';

/**
 * Hook for speech synthesis with loading/error state.
 *
 * @param {number} rate - Speech rate (0.1 - 10, default 0.7)
 * @returns {{ speak: Function, stop: Function, speaking: boolean, error: string|null, available: boolean, online: boolean }}
 */
export function useSpeech(rate = 0.7) {
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const rateRef = useRef(rate);
  rateRef.current = rate;

  const available = isSpeechAvailable();
  const online = isOnline();

  const speak = useCallback(async (text) => {
    if (!text || speaking) return;

    setSpeaking(true);
    setError(null);

    try {
      await speakUtil(text, { rate: rateRef.current });
    } catch (e) {
      setError(e.message || '发音失败');
    } finally {
      setSpeaking(false);
    }
  }, [speaking]);

  const stop = useCallback(() => {
    stopSpeech();
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, error, available, online };
}
