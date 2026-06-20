/**
 * Web Speech API wrapper for TTS pronunciation.
 * Uses American English (en-US) voice with configurable rate.
 *
 * Features:
 * - Prefers high-quality en-US voices
 * - Pronunciation override map for commonly mispronounced words
 * - Voice cache for performance
 */

// Cache for loaded voices
let cachedVoices = null;
let voicesLoaded = false;

// Pronunciation corrections for words that TTS commonly mispronounces.
// Maps the original word/text to a phonetically spelled version that TTS can read correctly.
// These are applied before speaking to ensure correct American pronunciation.
const PRONUNCIATION_OVERRIDES = {
  // Commonly mispronounced words - these phonetic spellings guide TTS
  'the': 'thuh',
  'a': 'uh',
  'an': 'an',
  'live': 'lihv',
  'read': 'reed',
  'lead': 'leed',
  'tear': 'tair',
  'bow': 'bou',
  'wind': 'wind',
  'wound': 'woond',
  'minute': 'min-it',
  'present': 'prez-ent',
  'record': 'rek-ord',
  'object': 'ob-jekt',
  'subject': 'sub-jekt',
  'content': 'kon-tent',
  'contract': 'kon-trakt',
  'desert': 'dez-ert',
  'refuse': 'ref-yoos',
  'close': 'klohs',
  'use': 'yooz',
  'used': 'yoozd',
  'separate': 'sep-uh-rayt',
  'moderate': 'mod-uh-rayt',
  'estimate': 'es-tuh-mayt',
  'appropriate': 'uh-pro-pree-ayt',
  'associate': 'uh-soh-shee-ayt',
  'deliberate': 'duh-lib-uh-rayt',
  'graduate': 'graj-oo-ayt',
  'intimate': 'in-tuh-mayt',
  'perfect': 'pur-fikt',
  'permit': 'pur-mit',
  'progress': 'prog-ress',
  'project': 'proj-ekt',
  'rebel': 'reb-ul',
  'suspect': 'sus-pekt',
  'survey': 'sur-vay',
  'transfer': 'trans-fur',
  'transport': 'trans-port',
  'update': 'up-dayt',
  'upgrade': 'up-grayd',
  'import': 'im-port',
  'export': 'eks-port',
  'increase': 'in-krees',
  'decrease': 'dee-krees',
  'address': 'ad-ress',
  'combat': 'kom-bat',
  'compound': 'kom-pound',
  'conduct': 'kon-dukt',
  'conflict': 'kon-flikt',
  'contest': 'kon-test',
  'contrast': 'kon-trast',
  'convert': 'kon-vert',
  'convict': 'kon-vikt',
  'decrease': 'dee-krees',
  'defect': 'dee-fekt',
  'detail': 'dee-tayl',
  'discount': 'dis-count',
  'escort': 'es-kort',
  'exploit': 'eks-ployt',
  'extract': 'eks-trakt',
  'impact': 'im-pakt',
  'insult': 'in-sult',
  'insult': 'in-sult',
  'produce': 'pro-doos',
  'protest': 'pro-test',
  'rebel': 'reb-ul',
  'recall': 'ree-kawl',
  'reject': 'ree-jekt',
  'research': 'ree-surch',
  'segment': 'seg-ment',
  'torment': 'tor-ment',
  'transform': 'trans-form',
};

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
 * Load available voices and cache them.
 * Should be called once on app init or first speak.
 */
export function loadVoices() {
  if (!isSpeechAvailable()) return [];

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    cachedVoices = voices;
    voicesLoaded = true;
  }
  return voices;
}

/**
 * Get the best available en-US voice.
 * Priority: Google US English > Microsoft en-US > Apple en-US > any en-US > any English
 */
export function getBestUSVoice() {
  if (!cachedVoices) {
    cachedVoices = loadVoices();
  }

  if (!cachedVoices || cachedVoices.length === 0) return null;

  // Premium voice name patterns (ordered by quality)
  const premiumPatterns = [
    'Google US English',
    'Google en-US',
    'Microsoft David',
    'Microsoft Zira',
    'Microsoft Mark',
    'Microsoft en-US',
    'Samantha',
    'Alex',
    'Karen',
    'en-US',
    'en_US',
    'English (United States)',
  ];

  for (const pattern of premiumPatterns) {
    const voice = cachedVoices.find(v =>
      v.name.includes(pattern) || v.lang === pattern
    );
    if (voice) return voice;
  }

  // Fallback: first en-US voice
  const enVoice = cachedVoices.find(v => v.lang.startsWith('en-US'));
  if (enVoice) return enVoice;

  // Last fallback: any English voice
  const anyEn = cachedVoices.find(v => v.lang.startsWith('en-'));
  return anyEn || cachedVoices[0];
}

/**
 * Apply pronunciation overrides to fix commonly mispronounced words.
 * Replaces words in the text with their corrected phonetic spellings.
 */
export function applyPronunciationFixes(text) {
  if (!text) return text;

  let result = text;

  // Apply overrides for known problematic words
  for (const [word, correction] of Object.entries(PRONUNCIATION_OVERRIDES)) {
    // Match whole word only, case insensitive
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, (match) => {
      // Preserve capitalization
      if (match[0] === match[0].toUpperCase()) {
        return correction.charAt(0).toUpperCase() + correction.slice(1);
      }
      return correction;
    });
  }

  return result;
}

/**
 * Speak text using Web Speech API with American English pronunciation.
 *
 * @param {string} text - English text to speak
 * @param {object} options
 * @param {number} options.rate - Speech rate (0.1 - 10, default 0.7)
 * @param {string} options.lang - Language code (default 'en-US')
 * @param {number} options.pitch - Pitch (0 - 2, default 1.0)
 * @param {boolean} options.applyFixes - Apply pronunciation fixes (default true)
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

    // Apply pronunciation fixes if enabled
    const applyFixes = options.applyFixes !== false;
    const textToSpeak = applyFixes ? applyPronunciationFixes(text) : text;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate ?? 0.7;
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = 1.0;

    // Try to select the best en-US voice
    const bestVoice = getBestUSVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (e) => {
      // Don't reject on 'canceled' — we cancel intentionally
      if (e.error === 'canceled' || e.error === 'interrupted') {
        resolve();
      } else {
        reject(new Error(`Speech error: ${e.error}`));
      }
    };

    // Handle the case where voices load asynchronously (Chrome)
    if (!voicesLoaded) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
        const voice = getBestUSVoice();
        if (voice) {
          utterance.voice = voice;
        }
      };
    }

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

/**
 * Preload voices. Call this early (e.g., on user interaction).
 */
export function preloadVoices() {
  if (isSpeechAvailable()) {
    loadVoices();
    // Chrome loads voices asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}
