import React, { useState, useEffect, useCallback } from 'react';
import { getAllMistakes, deleteMistake, clearAllMistakes } from '../utils/db';
import { formatDateTime, groupBy } from '../utils/helpers';
import SpeakerButton from '../components/SpeakerButton';

const TYPE_LABELS = {
  word: '单词',
  sentence: '句子',
  collocation: '搭配',
  quiz: '测验'
};

const TYPE_ICONS = {
  word: '🧠',
  sentence: '📖',
  collocation: '🔗',
  quiz: '📝'
};

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadMistakes = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllMistakes();
      setMistakes(all);
    } catch (err) {
      console.error('Failed to load mistakes:', err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMistakes();
  }, [loadMistakes]);

  const handleDelete = async (id) => {
    await deleteMistake(id);
    setMistakes(prev => prev.filter(m => m.id !== id));
  };

  const handleClearAll = async () => {
    await clearAllMistakes();
    setMistakes([]);
    setShowClearConfirm(false);
  };

  const filtered = filter === 'all'
    ? mistakes
    : mistakes.filter(m => m.itemType === filter);

  // Group by date
  const grouped = groupBy(filtered, m => {
    if (!m.timestamp) return '未知时间';
    const d = new Date(m.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return '今天';
    if (d.toDateString() === yesterday.toDateString()) return '昨天';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  const dateOrder = Object.keys(grouped).sort((a, b) => {
    if (a === '今天') return -1;
    if (b === '今天') return 1;
    if (a === '昨天') return -1;
    if (b === '昨天') return 1;
    return b.localeCompare(a);
  });

  if (loading) {
    return (
      <div className="page">
        <h2 className="page__title">❌ 错题集</h2>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page__title">❌ 错题集</h2>

      {/* Filter bar */}
      <div className="filter-bar">
        {['all', 'word', 'sentence', 'collocation', 'quiz'].map(type => (
          <button
            key={type}
            className={`filter-chip ${filter === type ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter(type)}
          >
            {type === 'all' ? '全部' : TYPE_LABELS[type]}
          </button>
        ))}
        {mistakes.length > 0 && (
          <button
            className="btn btn--small btn--danger-text"
            onClick={() => setShowClearConfirm(true)}
          >
            清空全部
          </button>
        )}
      </div>

      {/* Clear confirmation */}
      {showClearConfirm && (
        <div className="confirm-dialog">
          <p>确定要清空所有错题记录吗？此操作不可恢复。</p>
          <div className="confirm-dialog__actions">
            <button className="btn btn--secondary" onClick={() => setShowClearConfirm(false)}>
              取消
            </button>
            <button className="btn btn--danger" onClick={handleClearAll}>
              确认清空
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">✨</div>
          <h3>没有错题记录</h3>
          <p>继续加油！做错的题目会自动记录在这里。</p>
        </div>
      )}

      {/* Mistakes list grouped by date */}
      {dateOrder.map(date => (
        <div key={date} className="mistake-group">
          <h3 className="mistake-group__date">{date}</h3>
          {grouped[date].map(mistake => (
            <div key={mistake.id} className="mistake-item">
              <div className="mistake-item__header">
                <span className="mistake-type-badge">
                  {TYPE_ICONS[mistake.itemType]} {TYPE_LABELS[mistake.itemType] || mistake.itemType}
                </span>
                <span className="mistake-time">{formatDateTime(mistake.timestamp)}</span>
              </div>
              <div className="mistake-item__content">
                <span>{mistake.content}</span>
                <SpeakerButton
                  text={mistake.content}
                  label={`朗读 ${mistake.content}`}
                  small
                />
              </div>
              <button
                className="mistake-item__delete"
                onClick={() => handleDelete(mistake.id)}
                aria-label="删除"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
