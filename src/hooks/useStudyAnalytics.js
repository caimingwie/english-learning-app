import { useState, useEffect } from 'react';
import { getAllWords, getAllSentences, getAllCollocations, getAllMistakes, getAllSettings } from '../utils/db';
import { computeStudyAnalytics } from '../utils/helpers';

/**
 * Hook that aggregates all study data from IndexedDB into a structured
 * analytics object suitable for AI recommendation prompts.
 *
 * @param {boolean} enabled - Whether to load data (e.g., only when API key exists)
 * @returns {{ analytics: object|null, isLoading: boolean, error: string|null, refresh: function }}
 */
export function useStudyAnalytics({ enabled = true } = {}) {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadAnalytics = async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const [words, sentences, collocations, mistakes, settings] = await Promise.all([
        getAllWords(),
        getAllSentences(),
        getAllCollocations(),
        getAllMistakes(),
        getAllSettings()
      ]);

      // Get study logs
      const { openDB } = await import('../utils/db');
      const db = await openDB();
      const studyLogs = await db.getAll('studyLogs');

      // Get streak
      const { getStudyStreak } = await import('../utils/db');
      const streak = await getStudyStreak();

      const result = computeStudyAnalytics({
        words, sentences, collocations, mistakes, studyLogs, settings
      });
      result.student_profile.study_streak_days = streak;

      setAnalytics(result);
    } catch (err) {
      setError(err.message || '加载学习数据失败');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAnalytics();
  }, [enabled]);

  return { analytics, isLoading, error, refresh: loadAnalytics };
}
