/**
 * IndexedDB wrapper using the 'idb' library.
 *
 * Database: EnglishLearningDB
 * Object stores:
 *   words          — keyPath: "id",         indexes: status, nextReview, type
 *   sentences      — keyPath: "id",         indexes: nextReview, status
 *   collocations   — keyPath: "id",         indexes: nextReview, status
 *   grammar        — keyPath: "id",         indexes: order
 *   mistakes       — autoIncrement key,     indexes: timestamp, itemType, itemId
 *   settings       — keyPath: "key"
 *   studyLogs      — autoIncrement key,     indexes: date, itemType
 */

import { openDB as idbOpen } from 'idb';

const DB_NAME = 'EnglishLearningDB';
const DB_VERSION = 1;

let dbPromise = null;

export async function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = idbOpen(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Words store
      if (!db.objectStoreNames.contains('words')) {
        const wordStore = db.createObjectStore('words', { keyPath: 'id' });
        wordStore.createIndex('status', 'status');
        wordStore.createIndex('nextReview', 'nextReview');
        wordStore.createIndex('type', 'type');
      }

      // Sentences store
      if (!db.objectStoreNames.contains('sentences')) {
        const sentStore = db.createObjectStore('sentences', { keyPath: 'id' });
        sentStore.createIndex('nextReview', 'nextReview');
        sentStore.createIndex('status', 'status');
      }

      // Collocations store
      if (!db.objectStoreNames.contains('collocations')) {
        const collStore = db.createObjectStore('collocations', { keyPath: 'id' });
        collStore.createIndex('nextReview', 'nextReview');
        collStore.createIndex('status', 'status');
      }

      // Grammar store
      if (!db.objectStoreNames.contains('grammar')) {
        const gramStore = db.createObjectStore('grammar', { keyPath: 'id' });
        gramStore.createIndex('order', 'order');
      }

      // Mistakes store
      if (!db.objectStoreNames.contains('mistakes')) {
        const mistStore = db.createObjectStore('mistakes', {
          keyPath: 'id',
          autoIncrement: true
        });
        mistStore.createIndex('timestamp', 'timestamp');
        mistStore.createIndex('itemType', 'itemType');
        mistStore.createIndex('itemId', 'itemId');
      }

      // Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // Study logs store
      if (!db.objectStoreNames.contains('studyLogs')) {
        const logStore = db.createObjectStore('studyLogs', {
          keyPath: 'id',
          autoIncrement: true
        });
        logStore.createIndex('date', 'date');
        logStore.createIndex('itemType', 'itemType');
      }
    }
  });

  return dbPromise;
}

// ──── Words ──────────────────────────────────────────────────────────────────

export async function getAllWords() {
  const db = await openDB();
  return db.getAll('words');
}

export async function getWordById(id) {
  const db = await openDB();
  return db.get('words', id);
}

export async function getWordsByStatus(statuses) {
  const db = await openDB();
  const all = await db.getAll('words');
  if (Array.isArray(statuses)) {
    return all.filter(w => statuses.includes(w.status));
  }
  return all.filter(w => w.status === statuses);
}

export async function getWordsDueForReview(today) {
  const db = await openDB();
  const all = await db.getAll('words');
  return all.filter(w => {
    if (!w.nextReview) return false;
    return w.nextReview.split('T')[0] <= today;
  });
}

export async function getNewWords(limit) {
  const db = await openDB();
  const all = await db.getAll('words');
  const newWords = all.filter(w => w.status === 'new');
  // Return in shuffled order up to limit
  const shuffled = [...newWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export async function getWordsByFirstLetter(letter) {
  const db = await openDB();
  const all = await db.getAll('words');
  return all.filter(w => w.word.toLowerCase().startsWith(letter.toLowerCase()));
}

export async function updateWord(id, changes) {
  const db = await openDB();
  const existing = await db.get('words', id);
  if (!existing) return;
  const updated = { ...existing, ...changes };
  await db.put('words', updated);
  return updated;
}

export async function getWordCount() {
  const db = await openDB();
  return db.count('words');
}

/**
 * Add a custom word (user-created) to the database.
 * @param {object} wordData - { word, phonetic, meaning, type }
 * @returns {object} The saved word with generated ID
 */
export async function addCustomWord(wordData) {
  const db = await openDB();
  const all = await db.getAll('words');
  // Generate next ID in the custom range (cw001+)
  const customWords = all.filter(w => w.id && w.id.startsWith('cw'));
  const nextNum = customWords.length + 1;
  const id = `cw${String(nextNum).padStart(4, '0')}`;

  const newWord = {
    id,
    word: wordData.word,
    phonetic: wordData.phonetic || '',
    meaning: wordData.meaning,
    type: wordData.type || 'noun',
    status: 'new',
    nextReview: null,
    interval: -1,
    mistakes: 0,
    learnedDate: null,
    isCustom: true
  };

  await db.add('words', newWord);
  return newWord;
}

/**
 * Delete a custom word from the database.
 */
export async function deleteCustomWord(id) {
  const db = await openDB();
  const word = await db.get('words', id);
  if (word && word.isCustom) {
    await db.delete('words', id);
    return true;
  }
  return false;
}

/**
 * Update a custom word's details.
 */
export async function updateCustomWord(id, changes) {
  const db = await openDB();
  const word = await db.get('words', id);
  if (word && word.isCustom) {
    const updated = { ...word, ...changes };
    await db.put('words', updated);
    return updated;
  }
  return null;
}

// ──── Sentences ──────────────────────────────────────────────────────────────

export async function getAllSentences() {
  const db = await openDB();
  return db.getAll('sentences');
}

export async function getSentenceById(id) {
  const db = await openDB();
  return db.get('sentences', id);
}

export async function getSentencesDueForReview(today) {
  const db = await openDB();
  const all = await db.getAll('sentences');
  return all.filter(s => {
    if (!s.nextReview) return false;
    return s.nextReview.split('T')[0] <= today;
  });
}

export async function getNewSentences(limit) {
  const db = await openDB();
  const all = await db.getAll('sentences');
  const newSentences = all.filter(s => s.status === 'new');
  const shuffled = [...newSentences].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export async function updateSentence(id, changes) {
  const db = await openDB();
  const existing = await db.get('sentences', id);
  if (!existing) return;
  const updated = { ...existing, ...changes };
  await db.put('sentences', updated);
  return updated;
}

export async function getSentencesByStatus(statuses) {
  const db = await openDB();
  const all = await db.getAll('sentences');
  if (Array.isArray(statuses)) {
    return all.filter(s => statuses.includes(s.status));
  }
  return all.filter(s => s.status === statuses);
}

// ──── Collocations ───────────────────────────────────────────────────────────

export async function getAllCollocations() {
  const db = await openDB();
  return db.getAll('collocations');
}

export async function getCollocationsDueForReview(today) {
  const db = await openDB();
  const all = await db.getAll('collocations');
  return all.filter(c => {
    if (!c.nextReview) return false;
    return c.nextReview.split('T')[0] <= today;
  });
}

export async function getNewCollocations(limit) {
  const db = await openDB();
  const all = await db.getAll('collocations');
  const newColls = all.filter(c => c.status === 'new');
  const shuffled = [...newColls].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

export async function updateCollocation(id, changes) {
  const db = await openDB();
  const existing = await db.get('collocations', id);
  if (!existing) return;
  const updated = { ...existing, ...changes };
  await db.put('collocations', updated);
  return updated;
}

export async function getCollocationsByStatus(statuses) {
  const db = await openDB();
  const all = await db.getAll('collocations');
  if (Array.isArray(statuses)) {
    return all.filter(c => statuses.includes(c.status));
  }
  return all.filter(c => c.status === statuses);
}

// ──── Grammar ────────────────────────────────────────────────────────────────

export async function getAllGrammar() {
  const db = await openDB();
  return db.getAll('grammar');
}

export async function getGrammarSorted() {
  const db = await openDB();
  const all = await db.getAll('grammar');
  return all.sort((a, b) => a.order - b.order);
}

// ──── Mistakes ───────────────────────────────────────────────────────────────

export async function addMistake(entry) {
  const db = await openDB();
  return db.add('mistakes', {
    ...entry,
    timestamp: entry.timestamp || new Date().toISOString()
  });
}

export async function getAllMistakes() {
  const db = await openDB();
  const all = await db.getAll('mistakes');
  // Sort by timestamp descending (newest first)
  return all.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return b.timestamp.localeCompare(a.timestamp);
  });
}

export async function deleteMistake(id) {
  const db = await openDB();
  await db.delete('mistakes', id);
}

export async function clearAllMistakes() {
  const db = await openDB();
  await db.clear('mistakes');
}

export async function getMistakeCount() {
  const db = await openDB();
  return db.count('mistakes');
}

// ──── Settings ───────────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS = {
  dailyWordQuota: 20,
  dailySentenceQuota: 10,
  dailyCollocationQuota: 10,
  quizQuota: 20,
  speechRate: 0.7,
  grammarProgress: 0,
  seeded: true,
  wordbook: [] // Array of word IDs saved to 生词本
};

export async function getSetting(key) {
  const db = await openDB();
  const record = await db.get('settings', key);
  if (record) return record.value;
  return DEFAULT_SETTINGS[key] ?? null;
}

export async function setSetting(key, value) {
  const db = await openDB();
  await db.put('settings', { key, value });
}

export async function getAllSettings() {
  const db = await openDB();
  const records = await db.getAll('settings');
  const settings = { ...DEFAULT_SETTINGS };
  for (const rec of records) {
    settings[rec.key] = rec.value;
  }
  return settings;
}

export async function isSeeded() {
  const seeded = await getSetting('seeded');
  return !!seeded;
}

// ──── Study Logs ─────────────────────────────────────────────────────────────

export async function addStudyLog(entry) {
  const db = await openDB();
  return db.add('studyLogs', {
    ...entry,
    date: entry.date || new Date().toISOString().split('T')[0],
    timestamp: entry.timestamp || new Date().toISOString()
  });
}

export async function getTodayStudyCount(itemType, today) {
  const db = await openDB();
  const all = await db.getAll('studyLogs');
  return all.filter(log => {
    const logDate = log.date || (log.timestamp ? log.timestamp.split('T')[0] : '');
    return logDate === today && log.itemType === itemType;
  }).length;
}

export async function getStudyStreak() {
  const db = await openDB();
  const all = await db.getAll('studyLogs');
  const dates = [...new Set(all.map(log =>
    log.date || (log.timestamp ? log.timestamp.split('T')[0] : '')
  ))].sort().reverse();

  if (dates.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < dates.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = `${expected.getFullYear()}-${String(expected.getMonth() + 1).padStart(2, '0')}-${String(expected.getDate()).padStart(2, '0')}`;
    if (dates[i] === expectedStr) {
      streak++;
    } else if (i === 0) {
      // Check if yesterday (missed today but did yesterday)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      if (dates[i] === yesterdayStr) {
        streak++;
        continue;
      }
      break;
    } else {
      break;
    }
  }
  return streak;
}

// ──── Seeding ────────────────────────────────────────────────────────────────

/**
 * Seed all static data into IndexedDB. Idempotent — checks `seeded` flag first.
 */
export async function seedData({ words, sentences, grammar, collocations }) {
  if (await isSeeded()) return false;

  const db = await openDB();

  // Use separate transactions for each store to avoid idb multi-store restriction
  const wordsTx = db.transaction('words', 'readwrite');
  for (const word of words) {
    await wordsTx.store.put(word);
  }
  await wordsTx.done;

  const sentTx = db.transaction('sentences', 'readwrite');
  for (const sentence of sentences) {
    await sentTx.store.put(sentence);
  }
  await sentTx.done;

  const gramTx = db.transaction('grammar', 'readwrite');
  for (const gp of grammar) {
    await gramTx.store.put(gp);
  }
  await gramTx.done;

  const collTx = db.transaction('collocations', 'readwrite');
  for (const coll of collocations) {
    await collTx.store.put(coll);
  }
  await collTx.done;

  // Set default settings
  const settingsTx = db.transaction('settings', 'readwrite');
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await settingsTx.store.put({ key, value });
  }
  await settingsTx.done;

  await tx.done;
  return true;
}
