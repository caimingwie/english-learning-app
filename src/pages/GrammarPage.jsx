import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { getGrammarSorted } from '../data/grammar';
import SpeakerButton from '../components/SpeakerButton';
import StickyButtons from '../components/StickyButtons';

/**
 * Sequential grammar lesson reader.
 */
export default function GrammarPage() {
  const { state, updateSetting } = useAppContext();
  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load grammar in sorted order
    const sorted = getGrammarSorted();
    setLessons(sorted);
    // Resume from saved progress
    const savedProgress = state.settings.grammarProgress || 0;
    setCurrentIndex(Math.min(savedProgress, sorted.length - 1));
    setLoading(false);
  }, [state.settings.grammarProgress]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      const newIdx = currentIndex - 1;
      setCurrentIndex(newIdx);
      updateSetting('grammarProgress', newIdx);
    }
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      const newIdx = currentIndex + 1;
      setCurrentIndex(newIdx);
      updateSetting('grammarProgress', newIdx);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <h2 className="page__title">📚 语法</h2>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="page">
        <h2 className="page__title">📚 语法</h2>
        <div className="empty-state">
          <p>暂无语法课程数据</p>
        </div>
      </div>
    );
  }

  const lesson = lessons[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === lessons.length - 1;

  return (
    <div className="page">
      <h2 className="page__title">📚 语法</h2>

      <div className="grammar-progress">
        <span>课程进度：{currentIndex + 1}/{lessons.length}</span>
        <div className="grammar-progress__bar">
          <div
            className="grammar-progress__fill"
            style={{ width: `${((currentIndex + 1) / lessons.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grammar-lesson">
        <div className="grammar-lesson__header">
          <span className="grammar-lesson__number">第 {lesson.order} 课</span>
          <h3 className="grammar-lesson__title">{lesson.title}</h3>
          <span className="grammar-lesson__title-en">{lesson.titleEn}</span>
        </div>

        <div className="grammar-lesson__content">
          {lesson.content.split('\n\n').map((para, i) => (
            <p key={i} className="grammar-para">{para}</p>
          ))}
        </div>

        <div className="grammar-lesson__examples">
          <h4>例句</h4>
          {lesson.examples.map((ex, i) => (
            <div key={i} className="grammar-example">
              <div className="grammar-example__sentence">
                <span className="example-en">{ex.english}</span>
                <SpeakerButton text={ex.english} label="朗读例句" small />
              </div>
              <p className="example-cn">{ex.chinese}</p>
              <div className="example-analysis">
                <span className="analysis-highlight">{ex.highlight}</span>
                <p className="analysis-text">{ex.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StickyButtons
        variant="prev-next"
        leftLabel="上一课"
        rightLabel="下一课"
        onLeft={handlePrev}
        onRight={handleNext}
        disabled={false}
      />

      {isLast && (
        <div className="grammar-complete-notice">
          🎉 你已经学完了全部语法课程！
        </div>
      )}
    </div>
  );
}
