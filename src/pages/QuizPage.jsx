import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  getWordsByStatus,
  getSentencesByStatus,
  getCollocationsByStatus,
  updateWord,
  updateSentence,
  updateCollocation,
  addMistake,
  addStudyLog
} from '../utils/db';
import { calculateNextReview, getToday } from '../utils/ebbinghaus';
import { shuffleArray } from '../utils/helpers';
import ProgressBar from '../components/ProgressBar';
import StickyButtons from '../components/StickyButtons';

/**
 * Mixed quiz page — generates questions from all learned items.
 * Supports re-selecting answers and previous/next navigation.
 */
export default function QuizPage() {
  const { state, updateSetting } = useAppContext();
  const quizQuota = state.settings.quizQuota || 20;

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState('setup'); // 'setup' | 'active' | 'complete'
  const [loading, setLoading] = useState(false);
  const [quotaSelector, setQuotaSelector] = useState(false);

  // Track answers per question: { questionId: { selectedAnswer, isCorrect } }
  const [questionAnswers, setQuestionAnswers] = useState({});

  // Generate quiz questions
  const generateQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const allWords = await getWordsByStatus(['learning', 'review']);
      const allSentences = await getSentencesByStatus(['learning', 'review']);
      const allCollocations = await getCollocationsByStatus(['learning', 'review']);

      const questions = [];
      const shuffledWords = shuffleArray(allWords);
      const shuffledSentences = shuffleArray(allSentences);
      const shuffledCollocations = shuffleArray(allCollocations);

      // 60% word→meaning
      const wordQuota = Math.floor(quizQuota * 0.6);
      const wordPool = shuffledWords
        .filter(w => w && w.word && w.meaning)
        .slice(0, Math.min(wordQuota + 3, shuffledWords.length));

      for (let i = 0; i < Math.min(wordQuota, wordPool.length); i++) {
        const correct = wordPool[i];
        const distractors = wordPool
          .filter(w => w.id !== correct.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        if (distractors.length < 3) continue;

        questions.push({
          id: `q_wm_${correct.id}`,
          type: 'word_meaning',
          prompt: `"${correct.word}" 的中文意思是？`,
          correctAnswer: correct.meaning,
          options: shuffleArray([correct.meaning, ...distractors.map(d => d.meaning)]),
          itemId: correct.id,
          itemType: 'word',
          correctItem: correct
        });
      }

      // 20% meaning→word
      const reverseQuota = Math.floor(quizQuota * 0.2);
      for (let i = wordQuota; i < Math.min(wordQuota + reverseQuota, wordPool.length); i++) {
        const correct = wordPool[i];
        if (!correct) continue;
        const distractors = wordPool
          .filter(w => w.id !== correct.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        if (distractors.length < 3) continue;

        questions.push({
          id: `q_rv_${correct.id}`,
          type: 'word_reverse',
          prompt: `"${correct.meaning}" 对应的英文单词是？`,
          correctAnswer: correct.word,
          options: shuffleArray([correct.word, ...distractors.map(d => d.word)]),
          itemId: correct.id,
          itemType: 'word',
          correctItem: correct
        });
      }

      // 10% sentence gap-fill
      const sentQuota = Math.floor(quizQuota * 0.1);
      for (let i = 0; i < Math.min(sentQuota, shuffledSentences.length); i++) {
        const sent = shuffledSentences[i];
        if (!sent || !sent.structure || !sent.structure.V) continue;

        const blanked = sent.english.replace(sent.structure.V, '_____');
        const verbOptions = shuffledSentences
          .filter(s => s.id !== sent.id && s.structure && s.structure.V && s.structure.V !== sent.structure.V)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
          .map(s => s.structure.V);

        if (verbOptions.length < 3) continue;

        questions.push({
          id: `q_sg_${sent.id}`,
          type: 'sentence_gap',
          prompt: `完成句子: "${blanked}"`,
          hint: sent.chinese,
          correctAnswer: sent.structure.V,
          options: shuffleArray([sent.structure.V, ...verbOptions]),
          itemId: sent.id,
          itemType: 'sentence',
          correctItem: sent
        });
      }

      // 10% collocation gap-fill
      const collQuota = Math.floor(quizQuota * 0.1);
      for (let i = 0; i < Math.min(collQuota, shuffledCollocations.length); i++) {
        const coll = shuffledCollocations[i];
        if (!coll || !coll.phrase) continue;

        const words = coll.phrase.split(' ');
        const blankIndex = words.length > 1 ? words.length - 1 : 0;
        const blanked = words.map((w, idx) => idx === blankIndex ? '_____' : w).join(' ');

        const allPhraseWords = shuffledCollocations
          .filter(c => c.id !== coll.id && c.phrase)
          .map(c => c.phrase.split(' ').pop())
          .filter(w => w !== words[blankIndex])
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);

        if (allPhraseWords.length < 3) continue;

        questions.push({
          id: `q_cg_${coll.id}`,
          type: 'collocation_gap',
          prompt: `完成搭配: "${blanked}"`,
          hint: coll.meaning,
          correctAnswer: words[blankIndex],
          options: shuffleArray([words[blankIndex], ...allPhraseWords]),
          itemId: coll.id,
          itemType: 'collocation',
          correctItem: coll
        });
      }

      return shuffleArray(questions);
    } finally {
      setLoading(false);
    }
  }, [quizQuota]);

  const handleStart = async () => {
    const qs = await generateQuiz();
    if (qs.length === 0) {
      alert('没有足够的已学内容来生成测验。请先学习一些单词、句子或搭配。');
      return;
    }
    setQuestions(qs);
    setCurrentIndex(0);
    setScore(0);
    setQuestionAnswers({});
    setPhase('active');
  };

  // Save answer to IndexedDB
  const saveAnswerToDB = useCallback(async (question, correct) => {
    try {
      const today = getToday();
      const { nextReview, interval, status } = calculateNextReview(
        question.correctItem.interval,
        correct
      );
      const updates = {
        nextReview,
        interval,
        status,
        mistakes: correct ? (question.correctItem.mistakes || 0) : (question.correctItem.mistakes || 0) + 1
      };

      switch (question.itemType) {
        case 'word': await updateWord(question.itemId, updates); break;
        case 'sentence': await updateSentence(question.itemId, updates); break;
        case 'collocation': await updateCollocation(question.itemId, updates); break;
      }

      await addStudyLog({
        date: today,
        itemType: question.itemType,
        itemId: question.itemId,
        known: correct,
        timestamp: new Date().toISOString()
      });

      if (!correct) {
        await addMistake({
          itemId: question.itemId,
          itemType: question.itemType,
          content: question.correctItem.word || question.correctItem.english || question.correctItem.phrase || '',
          errorType: 'quiz',
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Failed to save quiz result:', err);
    }
  }, []);

  const handleSelectAnswer = async (answer) => {
    const question = questions[currentIndex];
    const correct = answer === question.correctAnswer;
    const prevAnswer = questionAnswers[question.id];

    // If this question was already answered, we're changing the answer
    if (prevAnswer) {
      // Update the answer
      const newAnswers = { ...questionAnswers, [question.id]: { selectedAnswer: answer, isCorrect: correct } };
      setQuestionAnswers(newAnswers);

      // Recalculate score
      const newScore = Object.values(newAnswers).filter(a => a.isCorrect).length;
      setScore(newScore);

      // Save the updated answer to DB
      await saveAnswerToDB(question, correct);
      return;
    }

    // First time answering this question
    const newAnswers = { ...questionAnswers, [question.id]: { selectedAnswer: answer, isCorrect: correct } };
    setQuestionAnswers(newAnswers);

    if (correct) {
      setScore(prev => prev + 1);
    }

    await saveAnswerToDB(question, correct);
  };

  const handleAdvance = () => {
    if (currentIndex + 1 >= questions.length) {
      setPhase('complete');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleGoBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRetry = () => {
    setPhase('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setQuestionAnswers({});
  };

  const currentAnswer = questions[currentIndex] ? questionAnswers[questions[currentIndex].id] : null;

  // ── Setup phase ──
  if (phase === 'setup') {
    return (
      <div className="page">
        <h2 className="page__title">📝 测验</h2>
        <div className="quiz-setup">
          <div className="quiz-setup__icon">📝</div>
          <h3>综合测验</h3>
          <p>从已学内容中随机出题，测试你的掌握程度。</p>
          <p style={{fontSize: '0.85rem', color: 'var(--color-text-secondary)'}}>可以重新选择答案，支持上一题/下一题导航。</p>

          <div className="quiz-setup__quota">
            <label>题数设置：</label>
            <div className="quota-selector">
              <button
                className="btn btn--small btn--text"
                onClick={() => setQuotaSelector(!quotaSelector)}
              >
                {quizQuota} 题 ▾
              </button>
              {quotaSelector && (
                <div className="quota-dropdown">
                  {[10, 20, 30].map(n => (
                    <button
                      key={n}
                      className={`quota-option ${n === quizQuota ? 'quota-option--active' : ''}`}
                      onClick={() => {
                        updateSetting('quizQuota', n);
                        setQuotaSelector(false);
                      }}
                    >
                      {n} 题
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="btn btn--primary btn--large"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? '生成题目中...' : '开始测验'}
          </button>
        </div>
      </div>
    );
  }

  // ── Complete phase ──
  if (phase === 'complete') {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="page">
        <h2 className="page__title">📝 测验结果</h2>
        <div className="completion-state">
          <div className="completion-icon">{percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '💪'}</div>
          <h3>测验完成！</h3>
          <div className="quiz-score">
            <span className="quiz-score__number">{score}</span>
            <span className="quiz-score__total">/{questions.length}</span>
          </div>
          <p className="quiz-percentage">正确率：{percentage}%</p>
          <div className="completion-actions">
            <button className="btn btn--primary" onClick={handleRetry}>
              再来一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active quiz phase ──
  const question = questions[currentIndex];
  const totalAnswered = Object.keys(questionAnswers).length;

  return (
    <div className="page">
      <h2 className="page__title">📝 测验</h2>
      <ProgressBar
        done={currentIndex + 1}
        total={questions.length}
        label="进度"
      />

      <div style={{textAlign: 'center', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)'}}>
        已作答：{totalAnswered}/{questions.length} 题 | 正确：{score} 题
      </div>

      <div className="quiz-card">
        <div className="quiz-card__prompt">
          <span className="quiz-type-badge">
            {question.type === 'word_meaning' && '看词选义'}
            {question.type === 'word_reverse' && '看义选词'}
            {question.type === 'sentence_gap' && '句子填空'}
            {question.type === 'collocation_gap' && '搭配填空'}
          </span>
          <p>{question.prompt}</p>
          {question.hint && <p className="quiz-hint">提示：{question.hint}</p>}
        </div>

        <div className="quiz-options">
          {question.options.map((option, i) => {
            let className = 'quiz-option';
            if (currentAnswer) {
              if (option === question.correctAnswer) {
                className += ' quiz-option--correct';
              } else if (option === currentAnswer.selectedAnswer && !currentAnswer.isCorrect) {
                className += ' quiz-option--wrong';
              } else {
                className += ' quiz-option--dimmed';
              }
            }
            return (
              <button
                key={i}
                className={className}
                onClick={() => handleSelectAnswer(option)}
              >
                <span className="quiz-option__letter">{'ABCD'[i]}</span>
                <span className="quiz-option__text">{option}</span>
                {currentAnswer && option === currentAnswer.selectedAnswer && (
                  <span className="quiz-option__mark">{currentAnswer.isCorrect ? ' ✓' : ' ✗'}</span>
                )}
              </button>
            );
          })}
        </div>

        {currentAnswer && (
          <div className={`quiz-feedback ${currentAnswer.isCorrect ? 'quiz-feedback--correct' : 'quiz-feedback--wrong'}`}>
            {currentAnswer.isCorrect
              ? '✅ 正确！'
              : `❌ 错误！正确答案是：${question.correctAnswer}`}
            <span style={{fontSize: '0.75rem', marginLeft: '0.5rem', opacity: 0.7}}>（可重新选择）</span>
          </div>
        )}
      </div>

      <StickyButtons
        variant="prev-next"
        onLeft={handleGoBack}
        onRight={handleAdvance}
        leftLabel="上一题"
        rightLabel={currentIndex + 1 >= questions.length ? '完成' : '下一题'}
        prevDisabled={currentIndex === 0}
      />
    </div>
  );
}
