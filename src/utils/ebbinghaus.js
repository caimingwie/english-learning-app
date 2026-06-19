/**
 * Ebbinghaus spaced repetition algorithm.
 *
 * Review intervals (in days):
 *   Stage 0 → 1 day
 *   Stage 1 → 2 days
 *   Stage 2 → 4 days
 *   Stage 3 → 7 days
 *   Stage 4 → 15 days
 *   Stage 5 → 30 days
 *   Stage 6 → mastered (no more reviews)
 *
 * On wrong answer: reset to stage 0 (1 day).
 * On correct answer: advance to next stage.
 */

const INTERVALS = [1, 2, 4, 7, 15, 30];

/**
 * Get today's date as YYYY-MM-DD string.
 */
export function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Add N days to a Date and return ISO string.
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  // Set to noon to avoid timezone edge cases
  result.setHours(12, 0, 0, 0);
  return result.toISOString();
}

/**
 * Calculate next review date based on current state.
 *
 * @param {number} currentInterval - Current interval index (-1 for new items, 0-5 for INTERVALS)
 * @param {boolean} known - Whether the user knew/correctly answered the item
 * @returns {{ nextReview: string|null, interval: number, status: string }}
 *   nextReview: ISO date string for next review, or null if mastered
 *   interval: new interval index
 *   status: 'new' | 'learning' | 'review' | 'mastered'
 */
export function calculateNextReview(currentInterval, known) {
  if (!known) {
    // Reset to first interval on failure
    return {
      nextReview: addDays(new Date(), INTERVALS[0]),
      interval: 0,
      status: 'learning'
    };
  }

  const nextIndex = (currentInterval >= 0 ? currentInterval : -1) + 1;

  if (nextIndex >= INTERVALS.length) {
    // Completed all intervals — mastered
    return {
      nextReview: null,
      interval: nextIndex,
      status: 'mastered'
    };
  }

  const days = INTERVALS[nextIndex];
  return {
    nextReview: addDays(new Date(), days),
    interval: nextIndex,
    status: nextIndex >= 3 ? 'review' : 'learning'
  };
}

/**
 * Check if an item is due for review (nextReview date <= today).
 */
export function isDue(nextReview) {
  if (!nextReview) return false;
  const reviewDate = nextReview.split('T')[0];
  return reviewDate <= getToday();
}

/**
 * Get all interval values (for display/reference).
 */
export function getIntervals() {
  return [...INTERVALS];
}
