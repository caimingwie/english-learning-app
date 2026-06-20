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
 * Flow:
 *   1. User sees item, clicks "认识" or "不认识" → meaning is revealed (answered=true)
 *   2. User clicks "下一题" → advance to next item
 *   3. User can click "上一题" → go back to any previous item (history preserved)
 *
 * @param {object} options
 * @param {string} options.itemType - 'word' | 'sentence' | 'collocation'
 * @param {number} options.dailyQuota - Maximum items per session
 * @returns {{ currentItem, progress, isComplete, respond, advance, goToItem, canGoBack, canGoNext, answered, sessionStats, isLoading, error, reset }}
 */
export function useStudy({ itemType, dailyQuota }) {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState({}); // { index: { known: boolean, timestamp: string } }
  const processingRef = useRef(false);

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
    setAnswers({});
    setAnswered(false);
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

  const canGoBack = currentIndex > 0;
  const canGoNext = answered && currentIndex < queue.length - 1;

  // Session stats derived from answers
  const sessionStats = {
    known: Object.values(answers).filter(a => a.known).length,
    unknown: Object.values(answers).filter(a => !a.known).length
  };

  /**
   * Respond to current item: known (true) or not known (false).
   * This marks the answer but does NOT advance to next item.
   */
  const respond = useCallback(async (known) => {
    if (!currentItem || processingRef.current || isComplete) return;
    if (answers[currentIndex] !== undefined) return; // Already answered

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

      // Store answer in history
      setAnswers(prev => ({
        ...prev,
        [currentIndex]: { known, timestamp: new Date().toISOString() }
      }));
      setAnswered(true);
    } catch (err) {
      console.error('Failed to save study progress:', err);
      setError('保存学习进度失败');
    } finally {
      setTimeout(() => { processingRef.current = false; }, 300);
    }
  }, [currentItem, itemType, isComplete, answers, currentIndex]);

  /**
   * Advance to the next item. Only allowed after answering.
   */
  const advance = useCallback(() => {
    if (currentIndex < queue.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAnswered(answers[nextIndex] !== undefined);
    }
  }, [currentIndex, queue.length, answers]);

  /**
   * Go to a specific item in the queue. Restore answer state if available.
   */
  const goToItem = useCallback((index) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index);
      setAnswered(answers[index] !== undefined);
    }
  }, [queue.length, answers]);

  /**
   * Go back to the previous item.
   */
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setAnswered(answers[prevIndex] !== undefined);
    }
  }, [currentIndex, answers]);

  /**
   * Reset the session (re-build the queue).
   */
  const reset = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAnswers({});
    setAnswered(false);
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
    advance,
    goToItem,
    goBack,
    canGoBack,
    canGoNext,
    answered,
    answers,
    sessionStats,
    reset,
    isLoading,
    error
  };
}
