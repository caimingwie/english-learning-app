/**
 * Web Speech API wrapper for TTS pronunciation.
 * Uses en-US voice with configurable rate (default 0.7 for slow, clear speech).
 */

/**
 * Check if speech synthesis is available.
 */
export function isSpeechAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/**
 * Check if the browser is online (network-dependent TTS voices are higher quality).
 */
export function isOnline() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Speak text using Web Speech API.
 *
 * @param {string} text - English text to speak
 * @param {object} options
 * @param {number} options.rate - Speech rate (0.1 - 10, default 0.7)
 * @param {string} options.lang - Language code (default 'en-US')
 * @param {number} options.pitch - Pitch (0 - 2, default 1.0)
 * @returns {Promise<void>} Resolves when speech completes, rejects on error
 */
export function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!isSpeechAvailable()) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate ?? 0.7;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = 1.0;

    // Try to select an en-US voice for consistency
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const enVoice = voices.find(v => v.lang.startsWith('en-US')) ||
                       voices.find(v => v.lang.startsWith('en-'));
      if (enVoice) {
        utterance.voice = enVoice;
      }
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      // Don't reject on 'canceled' — we cancel intentionally
      if (e.error === 'canceled' || e.error === 'interrupted') {
        resolve();
      } else {
        reject(new Error(`Speech error: ${e.error}`));
      }
    };

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any ongoing speech.
 */
export function stopSpeech() {
  if (isSpeechAvailable()) {
    window.speechSynthesis.cancel();
  }
}
