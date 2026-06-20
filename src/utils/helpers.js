/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Format an ISO date string to YYYY-MM-DD.
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Format a timestamp for display (e.g., "06-18 14:30").
 */
export function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${m}-${day} ${h}:${min}`;
}

/**
 * Generate a short unique ID.
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce a function call.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Group an array by a key function.
 */
export function groupBy(array, keyFn) {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Compute study analytics from IndexedDB data for AI recommendation.
 *
 * @param {object} options
 * @param {Array} options.words - All word records
 * @param {Array} options.sentences - All sentence records
 * @param {Array} options.collocations - All collocation records
 * @param {Array} options.mistakes - All mistake records
 * @param {Array} options.studyLogs - All study log records
 * @param {object} options.settings - User settings
 * @returns {object} Analytics payload for AI prompt
 */
export function computeStudyAnalytics({ words, sentences, collocations, mistakes, studyLogs, settings }) {
  const today = getTodayStr();

  // Count items by status
  const countByStatus = (items) => ({
    new: items.filter(i => i.status === 'new').length,
    learning: items.filter(i => i.status === 'learning').length,
    review: items.filter(i => i.status === 'review').length,
    mastered: items.filter(i => i.status === 'mastered').length
  });

  const wordStatus = countByStatus(words);
  const sentStatus = countByStatus(sentences);
  const collStatus = countByStatus(collocations);

  // Recent study logs (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentLogs = studyLogs.filter(l => {
    const d = l.date || (l.timestamp ? l.timestamp.split('T')[0] : '');
    return d >= thirtyDaysAgo.toISOString().split('T')[0];
  });

  // Mistake analysis
  const wordMistakes = {};
  for (const m of mistakes) {
    if (m.itemType === 'word' && m.content) {
      wordMistakes[m.content] = (wordMistakes[m.content] || 0) + 1;
    }
  }
  const topMistakeWords = Object.entries(wordMistakes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => {
      const found = words.find(w => w.word === word);
      return { word, mistakes: count, meaning: found?.meaning || '' };
    });

  // Recent mistakes last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentMistakes = mistakes.filter(m => {
    const ts = m.timestamp || '';
    return ts >= sevenDaysAgo.toISOString();
  });

  // Average daily study
  const daysWithActivity = [...new Set(recentLogs.map(l => l.date || l.timestamp?.split('T')[0]))].filter(Boolean);
  const avgDailyWords = daysWithActivity.length > 0
    ? Math.round(recentLogs.filter(l => l.itemType === 'word').length / daysWithActivity.length)
    : 0;

  // Items due today
  const itemsDueToday = (items) => items.filter(i => {
    if (!i.nextReview) return false;
    return i.nextReview.split('T')[0] <= today;
  }).length;

  return {
    student_profile: {
      study_streak_days: 0, // computed elsewhere
      total_words: words.length,
      words_new: wordStatus.new,
      words_learning: wordStatus.learning,
      words_review: wordStatus.review,
      words_mastered: wordStatus.mastered,
      sentences_mastered: sentStatus.mastered,
      sentences_learning: sentStatus.learning + sentStatus.review,
      collocations_mastered: collStatus.mastered,
      collocations_learning: collStatus.learning + collStatus.review,
      grammar_progress: `${(settings.grammarProgress || 0) + 1}/18`
    },
    mistake_analysis: {
      total_mistakes: mistakes.length,
      by_type: {
        word: mistakes.filter(m => m.itemType === 'word').length,
        sentence: mistakes.filter(m => m.itemType === 'sentence').length,
        collocation: mistakes.filter(m => m.itemType === 'collocation').length,
        quiz: mistakes.filter(m => m.errorType === 'quiz').length
      },
      top_mistake_words: topMistakeWords,
      recent_mistakes_last_7d: recentMistakes.length
    },
    study_patterns: {
      avg_daily_words: avgDailyWords,
      total_study_days: daysWithActivity.length,
      words_due_today: itemsDueToday(words),
      sentences_due_today: itemsDueToday(sentences),
      collocations_due_today: itemsDueToday(collocations)
    },
    current_settings: {
      daily_word_quota: settings.dailyWordQuota || 20,
      daily_sentence_quota: settings.dailySentenceQuota || 10,
      daily_collocation_quota: settings.dailyCollocationQuota || 10
    }
  };
}
