import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllWords, getSetting, setSetting, addCustomWord, deleteCustomWord, updateCustomWord } from '../utils/db';
import SpeakerButton from '../components/SpeakerButton';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STATUS_LABELS = {
  new: '未学',
  learning: '学习中',
  review: '复习中',
  mastered: '已掌握'
};

export default function VocabularyPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [letterFilter, setLetterFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [wordbook, setWordbook] = useState([]);
  const [showWordbook, setShowWordbook] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const allWords = await getAllWords();
        // Sort alphabetically
        allWords.sort((a, b) => a.word.localeCompare(b.word));
        setWords(allWords);

        const wb = (await getSetting('wordbook')) || [];
        setWordbook(wb);
      } catch (err) {
        console.error('Failed to load vocabulary:', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  const toggleWordbook = useCallback(async (wordId) => {
    const updated = wordbook.includes(wordId)
      ? wordbook.filter(id => id !== wordId)
      : [...wordbook, wordId];
    setWordbook(updated);
    await setSetting('wordbook', updated);
  }, [wordbook]);

  // ── Add custom word form ──
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', phonetic: '', meaning: '', type: 'noun' });
  const [addingWord, setAddingWord] = useState(false);

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!newWord.word.trim() || !newWord.meaning.trim()) return;
    setAddingWord(true);
    try {
      const saved = await addCustomWord({
        word: newWord.word.trim(),
        phonetic: newWord.phonetic.trim() || `/${newWord.word.trim()}/`,
        meaning: newWord.meaning.trim(),
        type: newWord.type
      });
      // Reload word list
      const allWords = await getAllWords();
      allWords.sort((a, b) => a.word.localeCompare(b.word));
      setWords(allWords);
      setNewWord({ word: '', phonetic: '', meaning: '', type: 'noun' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add word:', err);
      alert('添加单词失败：' + err.message);
    }
    setAddingWord(false);
  };

  const handleDeleteWord = async (wordId) => {
    if (!confirm('确定要删除这个单词吗？')) return;
    try {
      await deleteCustomWord(wordId);
      const allWords = await getAllWords();
      allWords.sort((a, b) => a.word.localeCompare(b.word));
      setWords(allWords);
    } catch (err) {
      console.error('Failed to delete word:', err);
    }
  };

  const filteredWords = useMemo(() => {
    let result = showWordbook
      ? words.filter(w => wordbook.includes(w.id))
      : words;

    // Letter filter
    if (letterFilter) {
      result = result.filter(w =>
        w.word.toLowerCase().startsWith(letterFilter.toLowerCase())
      );
    }

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(w => w.status === statusFilter);
    }

    return result;
  }, [words, search, letterFilter, statusFilter, wordbook, showWordbook]);

  if (loading) {
    return (
      <div className="page">
        <h2 className="page__title">📑 词汇库</h2>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2 className="page__title">📑 词汇库</h2>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="搜索单词或中文释义..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Status filter */}
      <div className="filter-bar">
        <button
          className={`filter-chip ${statusFilter === 'all' ? 'filter-chip--active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          全部
        </button>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <button
            key={key}
            className={`filter-chip filter-chip--${key} ${statusFilter === key ? 'filter-chip--active' : ''}`}
            onClick={() => setStatusFilter(key)}
          >
            {label}
          </button>
        ))}
        <button
          className={`filter-chip ${showWordbook ? 'filter-chip--active' : ''}`}
          onClick={() => setShowWordbook(!showWordbook)}
        >
          📑 生词本 {wordbook.length > 0 && `(${wordbook.length})`}
        </button>
        <button
          className="filter-chip filter-chip--add"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          ＋ 添加单词
        </button>
      </div>

      {/* Add Word Form */}
      {showAddForm && (
        <div className="add-word-form">
          <h4>添加自定义单词</h4>
          <form onSubmit={handleAddWord}>
            <div className="form-row">
              <input
                type="text"
                placeholder="英文单词 *"
                value={newWord.word}
                onChange={e => setNewWord({ ...newWord, word: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="音标 (如 /ˈæpl/)"
                value={newWord.phonetic}
                onChange={e => setNewWord({ ...newWord, phonetic: e.target.value })}
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="中文释义 *"
                value={newWord.meaning}
                onChange={e => setNewWord({ ...newWord, meaning: e.target.value })}
                required
              />
              <select
                value={newWord.type}
                onChange={e => setNewWord({ ...newWord, type: e.target.value })}
              >
                <option value="noun">名词</option>
                <option value="verb">动词</option>
                <option value="adjective">形容词</option>
                <option value="adverb">副词</option>
                <option value="preposition">介词</option>
                <option value="conjunction">连词</option>
                <option value="pronoun">代词</option>
                <option value="interjection">感叹词</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn--primary btn--small" disabled={addingWord}>
                {addingWord ? '添加中...' : '确认添加'}
              </button>
              <button type="button" className="btn btn--secondary btn--small" onClick={() => setShowAddForm(false)}>
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Alphabet filter */}
      <div className="letter-filter">
        <button
          className={`letter-btn ${letterFilter === null ? 'letter-btn--active' : ''}`}
          onClick={() => setLetterFilter(null)}
        >
          全部
        </button>
        {ALPHABET.map(letter => (
          <button
            key={letter}
            className={`letter-btn ${letterFilter === letter ? 'letter-btn--active' : ''}`}
            onClick={() => setLetterFilter(letter)}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Word count */}
      <div className="vocab-count">
        共 {filteredWords.length} 个单词
      </div>

      {/* Word list */}
      {filteredWords.length === 0 ? (
        <div className="empty-state">
          <p>没有找到匹配的单词</p>
        </div>
      ) : (
        <div className="word-list">
          {filteredWords.map(word => (
            <div key={word.id} className={`word-list-item word-status--${word.status}`}>
              <div className="word-list-item__main">
                <div className="word-list-item__word">
                  <span className="word-text">{word.word}</span>
                  <span className="word-phonetic">{word.phonetic}</span>
                </div>
                <div className="word-list-item__meaning">{word.meaning}</div>
              </div>
              <div className="word-list-item__actions">
                <span className={`status-badge status-badge--${word.status}`}>
                  {STATUS_LABELS[word.status] || word.status}
                </span>
                <SpeakerButton text={word.word} label={`朗读 ${word.word}`} small />
                <button
                  className={`btn-bookmark ${wordbook.includes(word.id) ? 'btn-bookmark--active' : ''}`}
                  onClick={() => toggleWordbook(word.id)}
                  aria-label={wordbook.includes(word.id) ? '从生词本移除' : '加入生词本'}
                  title={wordbook.includes(word.id) ? '从生词本移除' : '加入生词本'}
                >
                  {wordbook.includes(word.id) ? '📌' : '📑'}
                </button>
                {word.isCustom && (
                  <button
                    className="btn-delete-word"
                    onClick={() => handleDeleteWord(word.id)}
                    aria-label="删除单词"
                    title="删除自定义单词"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
