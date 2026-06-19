import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getWordsDueForReview, getNewWords, updateWord,
  getSentencesDueForReview, getNewSentences, updateSentence,
  getCollocationsDueForReview, getNewCollocations, updateCollocation,
  addStudyLog, addMistake
} from '../utils/db';
import { calculateNextReview, getToday } from '../utils/ebbinghaus';
import { shuffleArray } from '../utils/helpers';

/**
 * Core study session hook. Manages the queue, progress, and user responses
 * for any item type (word, sentence, collocation).
 *
 * @param {object} options
 * @param {string} options.itemType - 'word' | 'sentence' | 'collocation'
 * @param {number} options.dailyQuota - Maximum items per session
 * @returns {{ currentItem, progress, isComplete, respond, reset, isLoading, error }}
 */
export function useStudy({ itemType, dailyQuota }) {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const processingRef = useRef(false); // Prevent double-tap

  // Build the session queue
  const buildSession = useCallback(async () => {
    const today = getToday();
    let reviewItems = [];
    let newItems = [];

    switch (itemType) {
      case 'word':
        reviewItems = await getWordsDueForReview(today);
        newItems = await getNewWords(Math.max(0, dailyQuota - reviewItems.length));
        break;
      case 'sentence':
        reviewItems = await getSentencesDueForReview(today);
        newItems = await getNewSentences(Math.max(0, dailyQuota - reviewItems.length));
        break;
      case 'collocation':
        reviewItems = await getCollocationsDueForReview(today);
        newItems = await getNewCollocations(Math.max(0, dailyQuota - reviewItems.length));
        break;
    }

    // Shuffle both queues independently, then concatenate (reviews first)
    return [...shuffleArray(reviewItems), ...shuffleArray(newItems)];
  }, [itemType, dailyQuota]);

  // Initialize session
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    buildSession()
      .then(queue => {
        setQueue(queue);
        setCurrentIndex(0);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message || '加载学习数据失败');
        setIsLoading(false);
      });
  }, [buildSession]);

  const currentItem = queue[currentIndex] || null;

  const progress = {
    done: Math.min(currentIndex, queue.length),
    total: queue.length
  };

  const isComplete = queue.length > 0 && currentIndex >= queue.length;

  /**
   * Respond to current item: known (true) or not known (false).
   * Debounced internally to prevent double-tap issues.
   */
  const respond = useCallback(async (known) => {
    if (!currentItem || processingRef.current || isComplete) return;

    processingRef.current = true;

    try {
      const today = getToday();
      const { nextReview, interval, status } = calculateNextReview(
        currentItem.interval,
        known
      );

      const updates = {
        nextReview,
        interval,
        status,
        mistakes: known ? (currentItem.mistakes || 0) : (currentItem.mistakes || 0) + 1,
        learnedDate: status === 'mastered' ? today : (currentItem.learnedDate || today)
      };

      // Update in IndexedDB
      switch (itemType) {
        case 'word':
          await updateWord(currentItem.id, updates);
          break;
        case 'sentence':
          await updateSentence(currentItem.id, updates);
          break;
        case 'collocation':
          await updateCollocation(currentItem.id, updates);
          break;
      }

      // Log study event
      await addStudyLog({
        date: today,
        itemType,
        itemId: currentItem.id,
        known,
        timestamp: new Date().toISOString()
      });

      // If wrong, add to mistakes
      if (!known) {
        const content = currentItem.word ||
                        currentItem.english ||
                        currentItem.phrase ||
                        '';
        await addMistake({
          itemId: currentItem.id,
          itemType,
          content,
          errorType: 'study_session',
          timestamp: new Date().toISOString()
        });
      }

      // Advance to next item
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Failed to save study progress:', err);
      setError('保存学习进度失败');
    } finally {
      // Small delay to prevent accidental double-tap
      setTimeout(() => { processingRef.current = false; }, 300);
    }
  }, [currentItem, itemType, isComplete]);

  /**
   * Reset the session (re-build the queue).
   */
  const reset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newQueue = await buildSession();
      setQueue(newQueue);
      setCurrentIndex(0);
    } catch (err) {
      setError(err.message || '重新加载失败');
    }
    setIsLoading(false);
  }, [buildSession]);

  return {
    currentItem,
    progress,
    isComplete,
    respond,
    reset,
    isLoading,
    error
  };
}
