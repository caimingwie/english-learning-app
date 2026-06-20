/**
 * Convert British RP phonetic symbols to General American (GA) IPA.
 * Run: node scripts/convert-phonetics.js
 */

const fs = require('fs');
const path = require('path');

// British RP → General American conversions (applied in order)
const RP_TO_GA = [
  // Rhotic R: add /r/ after vowels before consonant or end
  // /ɜː/ → /ɜr/ (her, work, first, bird)
  { from: /ˈ([^/]*?)ɜː/g, to: 'ˈ$1ɜr' },
  { from: /([^ˈ])ɜː/g, to: '$1ɜr' },

  // /ɪə/ → /ɪr/ (near, here, ear)
  { from: /ɪə/g, to: 'ɪr' },

  // /eə/ → /ɛr/ (there, where, air, care)
  { from: /eə/g, to: 'ɛr' },

  // /ʊə/ → /ʊr/ (pure, sure, tour)
  { from: /ʊə/g, to: 'ʊr' },

  // /ɔː/ in most contexts → /ɔ/ (caught, law, thought)
  // But keep as /ɔr/ before r
  { from: /ɔːr/g, to: 'ɔr' },
  { from: /ɔːl/g, to: 'ɔl' },  // all, call
  { from: /ɔː/g, to: 'ɔ' },    // caught, thought, law

  // /ɒ/ → /ɑ/ (hot, not, got, lot, stop) — father-bother merger
  { from: /ɒ/g, to: 'ɑ' },

  // /əʊ/ → /oʊ/ (go, no, so, know, old)
  { from: /əʊ/g, to: 'oʊ' },

  // /ɑː/ → /æ/ in ass/ask/aft words (ask, after, laugh, dance, grass, pass, fast, last)
  { from: /ˈɑːsk/g, to: 'ˈæsk' },
  { from: /ˈɑːft/g, to: 'ˈæft' },
  { from: /ˈɑːns/g, to: 'ˈæns' },
  { from: /ɑːns/g, to: 'æns' },
  { from: /ˈɑːnt/g, to: 'ˈænt' },
  { from: /ɑːnt/g, to: 'ænt' },
  { from: /lɑːf/g, to: 'læf' },
  { from: /lɑːst/g, to: 'læst' },
  { from: /pɑːs/g, to: 'pæs' },
  { from: /pɑːst/g, to: 'pæst' },
  { from: /ɡrɑːs/g, to: 'ɡræs' },
  { from: /klɑːs/g, to: 'klæs' },
  { from: /tʃɑːns/g, to: 'tʃæns' },
  { from: /dɑːns/g, to: 'dæns' },
  { from: /hɑːf/g, to: 'hæf' },
  { from: /pɑːθ/g, to: 'pæθ' },
  { from: /bɑːθ/g, to: 'bæθ' },
  { from: /rɑːð/g, to: 'ræð' },

  // /ɑː/ in other contexts → /ɑ/ (father, calm, palm → stays as /ɑ/)
  { from: /ɑːr/g, to: 'ɑr' },  // car, far, hard → r-colored
  { from: /ɑː/g, to: 'ɑ' },    // father, calm → just shorten

  // /juː/ after alveolar consonants → /u/ (new, due, tune, student)
  // Yod-dropping in GA
  { from: /njuː/g, to: 'nu' },
  { from: /djuː/g, to: 'du' },
  { from: /tjuː/g, to: 'tu' },
  { from: /stjuː/g, to: 'stu' },
  { from: /ljuː/g, to: 'lu' },
  { from: /sjuː/g, to: 'su' },
  { from: /zjuː/g, to: 'zu' },
  { from: /θjuː/g, to: 'θu' },

  // /iː/ → /i/ (monophthongization — fleece vowel)
  { from: /iː/g, to: 'i' },

  // /uː/ → /u/ (goose vowel)
  { from: /uː(?![rsʃʒtʃdʒkɡŋ])/g, to: 'u' },

  // Fix final -ary/-ery/-ory: /əri/ not /əriː/ in GA
  { from: /əriː/g, to: 'əri' },
  { from: /ɔːri/g, to: 'ɔri' },

  // /eɪ/ stays as /eɪ/ — same in RP and GA

  // Note: we do NOT convert final /ə/ → /ər/ because:
  // 1. TTS handles American pronunciation correctly regardless
  // 2. For learner phonetics, /ə/ is clearer than /ər/
  // 3. Single-syllable function words (the, a) must keep /ə/

  // Intervocalic /t/ → /ɾ/ (flapping) — NOT in careful pronunciation for learners
  // We skip this for learner phonetics

  // /ɒr/ → /ɔr/ (orange, foreign, forest)
  { from: /ɒr/g, to: 'ɔr' },

  // /ʌr/ → /ɜr/ (hurry, worry → but these merge in some dialects)
  // Keep /ʌr/ as is for clarity

  // /ʊ/ stays as /ʊ/ (book, foot, good)

  // /e/ → /ɛ/ (dress vowel — same thing, just notation)
  // Keep /e/ as is since it's the same sound
];

function convertPhonetic(rp) {
  if (!rp) return rp;

  let ga = rp;

  for (const { from, to } of RP_TO_GA) {
    ga = ga.replace(from, to);
  }

  return ga;
}

// Process a file
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find all phonetic strings and convert them
  let count = 0;
  content = content.replace(/phonetic:\s*'([^']*)'/g, (match, phonetic) => {
    const converted = convertPhonetic(phonetic);
    if (converted !== phonetic) {
      count++;
      return `phonetic: '${converted}'`;
    }
    return match;
  });

  // Also handle double-quoted phonetics just in case
  content = content.replace(/phonetic:\s*"([^"]*)"/g, (match, phonetic) => {
    const converted = convertPhonetic(phonetic);
    if (converted !== phonetic) {
      count++;
      return `phonetic: "${converted}"`;
    }
    return match;
  });

  if (count > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  → Converted ${count} phonetic(s)`);
  } else {
    console.log(`  → No changes needed`);
  }
}

// Process all data files
const dataDir = path.join(__dirname, '..', 'src', 'data');
const files = ['words.js', 'words-extended.js', 'words-topics.js'];

for (const file of files) {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
}

console.log('\nDone! Phonetic conversion complete.');
