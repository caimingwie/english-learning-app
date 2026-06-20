import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getAllWords, getSetting, setSetting, addCustomWord, deleteCustomWord } from '../utils/db';
import SpeakerButton from '../components/SpeakerButton';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const STATUS_LABELS = {
  new: '未学',
  learning: '学习中',
  review: '复习中',
  mastered: '已掌握'
};

const WORD_TYPES = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'interjection', 'article', 'number'];

export default function VocabularyPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [letterFilter, setLetterFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [wordbook, setWordbook] = useState([]);
  const [showWordbook, setShowWordbook] = useState(false);

  // File upload state
  const [showUpload, setShowUpload] = useState(false);
  const [uploadLog, setUploadLog] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const allWords = await getAllWords();
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

  const reloadWords = async () => {
    const allWords = await getAllWords();
    allWords.sort((a, b) => a.word.localeCompare(b.word));
    setWords(allWords);
  };

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
      await addCustomWord({
        word: newWord.word.trim(),
        phonetic: newWord.phonetic.trim() || `/${newWord.word.trim()}/`,
        meaning: newWord.meaning.trim(),
        type: newWord.type
      });
      await reloadWords();
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
      await reloadWords();
    } catch (err) {
      console.error('Failed to delete word:', err);
    }
  };

  // ── File Upload / Import ──
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadLog([]);
    const logs = [];

    try {
      const text = await file.text();
      const ext = file.name.split('.').pop().toLowerCase();

      let parsedWords = [];

      if (ext === 'json') {
        // JSON format: array of word objects or { words: [...] }
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : (data.words || data.vocabulary || data.data || []);
        parsedWords = arr.map(item => ({
          word: item.word || item.english || item.en || '',
          phonetic: item.phonetic || item.pronunciation || '',
          meaning: item.meaning || item.chinese || item.cn || item.translation || '',
          type: item.type || item.pos || item.partOfSpeech || 'noun'
        }));
      } else if (ext === 'csv') {
        // CSV format: word,meaning[,phonetic[,type]]
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const header = lines[0].toLowerCase();
        const hasHeader = header.includes('word') || header.includes('english') || header.includes('单词');

        const startIdx = hasHeader ? 1 : 0;
        for (let i = startIdx; i < lines.length; i++) {
          const cols = parseCSVLine(lines[i]);
          if (cols.length >= 2) {
            parsedWords.push({
              word: (cols[0] || '').trim(),
              meaning: (cols[1] || '').trim(),
              phonetic: cols[2] ? cols[2].trim() : '',
              type: cols[3] ? cols[3].trim().toLowerCase() : 'noun'
            });
          }
        }
      } else {
        // Plain text: one word per line, "word  meaning" or "word,meaning"
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        for (const line of lines) {
          // Try comma separator
          let parts;
          if (line.includes(',')) {
            parts = line.split(',').map(s => s.trim());
          } else if (line.includes('\t')) {
            parts = line.split('\t').map(s => s.trim());
          } else {
            // Space separator: "word meaning"
            const match = line.match(/^(\S+)\s+(.+)$/);
            if (match) {
              parts = [match[1], match[2]];
            } else {
              parts = [line.trim(), ''];
            }
          }
          if (parts[0]) {
            parsedWords.push({
              word: parts[0],
              meaning: parts[1] || '',
              phonetic: parts[2] || '',
              type: parts[3] ? parts[3].toLowerCase() : 'noun'
            });
          }
        }
      }

      // Filter invalid entries and normalize
      parsedWords = parsedWords.filter(w => w.word && w.meaning);

      if (parsedWords.length === 0) {
        logs.push('❌ 未能从文件中解析出有效单词。请检查格式。');
        setUploadLog(logs);
        setUploading(false);
        return;
      }

      logs.push(`📄 文件: ${file.name}`);
      logs.push(`📊 解析到 ${parsedWords.length} 个单词`);

      // Normalize types
      parsedWords = parsedWords.map(w => ({
        ...w,
        type: WORD_TYPES.includes(w.type) ? w.type : guessWordType(w.type || w.word),
        phonetic: w.phonetic || generatePhonetic(w.word)
      }));

      // Add words to database
      let added = 0;
      let skipped = 0;
      const existingWords = await getAllWords();
      const existingWordTexts = new Set(existingWords.map(w => w.word.toLowerCase()));

      for (const pw of parsedWords) {
        if (existingWordTexts.has(pw.word.toLowerCase())) {
          skipped++;
          continue;
        }
        try {
          await addCustomWord(pw);
          existingWordTexts.add(pw.word.toLowerCase());
          added++;
        } catch (err) {
          logs.push(`⚠️ 添加 "${pw.word}" 失败: ${err.message}`);
        }
      }

      logs.push(`✅ 成功添加 ${added} 个单词`);
      if (skipped > 0) logs.push(`⏭️ 跳过 ${skipped} 个重复单词`);

      await reloadWords();
    } catch (err) {
      logs.push(`❌ 文件处理失败: ${err.message}`);
    }

    setUploadLog(logs);
    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ── Filtered words ──
  const filteredWords = useMemo(() => {
    let result = showWordbook
      ? words.filter(w => wordbook.includes(w.id))
      : words;

    if (letterFilter) {
      result = result.filter(w =>
        w.word.toLowerCase().startsWith(letterFilter.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.includes(q)
      );
    }

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

      {/* Filter bar */}
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
        <button
          className="filter-chip filter-chip--upload"
          onClick={() => setShowUpload(!showUpload)}
        >
          📤 导入文件
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
                <option value="article">冠词</option>
                <option value="number">数词</option>
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

      {/* File Upload Section */}
      {showUpload && (
        <div className="add-word-form upload-section">
          <h4>📤 导入单词文件</h4>
          <p style={{fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.75rem'}}>
            支持 JSON、CSV、TXT 格式。自动识别字段并适配格式。
          </p>

          <div className="upload-formats">
            <details>
              <summary>📋 支持的格式说明</summary>
              <div style={{fontSize: '0.75rem', marginTop: '0.5rem', lineHeight: 1.6}}>
                <p><strong>JSON 格式:</strong></p>
                <pre style={{background: 'var(--color-bg-secondary)', padding: '0.5rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.7rem'}}>
{`[
  {"word": "apple", "meaning": "苹果", "phonetic": "/ˈæpəl/", "type": "noun"},
  {"word": "run", "meaning": "跑", "type": "verb"}
]`}
                </pre>

                <p><strong>CSV 格式:</strong></p>
                <pre style={{background: 'var(--color-bg-secondary)', padding: '0.5rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.7rem'}}>
{`word,meaning,phonetic,type
apple,苹果,/ˈæpəl/,noun
run,跑,,verb`}
                </pre>

                <p><strong>TXT 格式 (每行一个词):</strong></p>
                <pre style={{background: 'var(--color-bg-secondary)', padding: '0.5rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.7rem'}}>
{`apple 苹果
run 跑
book 书, /bʊk/, noun`}
                </pre>
              </div>
            </details>
          </div>

          <div className="upload-actions" style={{marginTop: '0.75rem'}}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv,.txt,.text"
              onChange={handleFileUpload}
              style={{display: 'none'}}
              id="word-file-upload"
            />
            <label htmlFor="word-file-upload" className="btn btn--primary btn--small" style={{cursor: 'pointer'}}>
              {uploading ? '导入中...' : '选择文件'}
            </label>
            <span style={{fontSize: '0.75rem', marginLeft: '0.5rem', color: 'var(--color-text-secondary)'}}>
              自动去重，跳过已存在的单词
            </span>
          </div>

          {uploadLog.length > 0 && (
            <div className="upload-log" style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: 'var(--color-bg-secondary)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              lineHeight: 1.6
            }}>
              {uploadLog.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          )}
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

/**
 * Parse a CSV line that may contain quoted fields.
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Guess word type from type string or word.
 */
function guessWordType(typeStr) {
  const t = typeStr.toLowerCase();
  if (t.includes('名') || t.includes('noun') || t === 'n') return 'noun';
  if (t.includes('动') || t.includes('verb') || t === 'v') return 'verb';
  if (t.includes('形容') || t.includes('adj') || t === 'a') return 'adjective';
  if (t.includes('副') || t.includes('adv')) return 'adverb';
  if (t.includes('介') || t.includes('prep')) return 'preposition';
  if (t.includes('连') || t.includes('conj')) return 'conjunction';
  if (t.includes('代') || t.includes('pron')) return 'pronoun';
  return 'noun';
}

/**
 * Generate a simple phonetic transcription for a word.
 * This is a fallback when no phonetic is provided.
 */
function generatePhonetic(word) {
  if (!word) return '';
  // Simple mapping - just a fallback notation
  return `/${word}/`;
}
