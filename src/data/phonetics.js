/**
 * Full IPA (International Phonetic Alphabet) chart for English.
 * Grouped into vowels (monophthongs + diphthongs) and consonants.
 */

export const phonetics = {
  vowels: [
    // ── Long vowels (Monophthongs) ──
    { symbol: 'iː', speakText: 'eee', description: '长元音，前闭不圆唇。舌尖抵下齿，舌前部抬高，嘴角向两边拉开。', exampleWord: 'see /siː/' },
    { symbol: 'ɜː', speakText: 'errr', description: '长元音，中开不圆唇。舌身平放，舌中部稍抬起，双唇扁平。', exampleWord: 'bird /bɜːd/' },
    { symbol: 'ɑː', speakText: 'ahh', description: '长元音，后开不圆唇。口张大，舌身压低后缩，双唇呈中性。', exampleWord: 'car /kɑːr/' },
    { symbol: 'ɔː', speakText: 'aww', description: '长元音，后半开圆唇。双唇收圆并向前突出，舌后部抬起。', exampleWord: 'door /dɔːr/' },
    { symbol: 'uː', speakText: 'ooo', description: '长元音，后闭圆唇。双唇收圆且向前突出，舌后部抬得很高。', exampleWord: 'blue /bluː/' },

    // ── Short vowels (Monophthongs) ──
    { symbol: 'ɪ', speakText: 'ih', description: '短元音，前闭不圆唇。比 /iː/ 更短更放松，嘴角微微拉开。', exampleWord: 'sit /sɪt/' },
    { symbol: 'e', speakText: 'eh', description: '短元音，前半开不圆唇。舌尖抵下齿，舌前部稍抬起，上下齿间可容一指。', exampleWord: 'bed /bed/' },
    { symbol: 'æ', speakText: 'aah', description: '短元音，前开不圆唇。口张大，嘴角向两边拉开，舌前部压低。', exampleWord: 'cat /kæt/' },
    { symbol: 'ʌ', speakText: 'uh', description: '短元音，中开不圆唇。舌中部抬起，舌尖轻触下齿龈，双唇扁平。', exampleWord: 'cup /kʌp/' },
    { symbol: 'ɒ', speakText: 'oh', description: '短元音，后开圆唇。口张大，舌身压低后缩，双唇稍圆。', exampleWord: 'hot /hɒt/' },
    { symbol: 'ʊ', speakText: 'oo', description: '短元音，后闭圆唇。双唇收圆但不如 /uː/ 突出，舌后部抬起。', exampleWord: 'book /bʊk/' },
    { symbol: 'ə', speakText: 'uh', description: '短元音，中开不圆唇。最放松的元音，舌身平放，口半开。英语中最常见的弱读元音 (schwa)。', exampleWord: 'about /əˈbaʊt/' },

    // ── Diphthongs (双元音) ──
    { symbol: 'eɪ', speakText: 'ay', description: '合口双元音。从 /e/ 滑向 /ɪ/，类似中文"诶"的音。', exampleWord: 'day /deɪ/' },
    { symbol: 'aɪ', speakText: 'eye', description: '合口双元音。从 /a/ 滑向 /ɪ/，口形由大变小，类似中文"爱"。', exampleWord: 'my /maɪ/' },
    { symbol: 'ɔɪ', speakText: 'oy', description: '合口双元音。从 /ɔ/ 滑向 /ɪ/，从圆唇变为扁唇。', exampleWord: 'boy /bɔɪ/' },
    { symbol: 'aʊ', speakText: 'ow', description: '合口双元音。从 /a/ 滑向 /ʊ/，双唇逐渐变圆。', exampleWord: 'now /naʊ/' },
    { symbol: 'əʊ', speakText: 'oh', description: '合口双元音。从 /ə/ 滑向 /ʊ/，双唇从不圆到圆。', exampleWord: 'go /ɡəʊ/' },
    { symbol: 'ɪə', speakText: 'ear', description: '集中双元音。从 /ɪ/ 滑向 /ə/，从闭口到半开。', exampleWord: 'ear /ɪər/' },
    { symbol: 'eə', speakText: 'air', description: '集中双元音。从 /e/ 滑向 /ə/，口形变化较小。', exampleWord: 'air /eər/' },
    { symbol: 'ʊə', speakText: 'oor', description: '集中双元音。从 /ʊ/ 滑向 /ə/，双唇从圆到不圆。', exampleWord: 'tour /tʊər/' }
  ],

  consonants: [
    // ── Plosives (爆破音) — 需要加最小元音释放才能被 TTS 读出 ──
    { symbol: 'p', speakText: 'puh', description: '清辅音 / 双唇爆破音。双唇紧闭，然后突然分开，气流冲出。声带不振动。', exampleWord: 'pen /pen/' },
    { symbol: 'b', speakText: 'buh', description: '浊辅音 / 双唇爆破音。与 /p/ 口型相同，但声带振动。', exampleWord: 'bed /bed/' },
    { symbol: 't', speakText: 'tuh', description: '清辅音 / 齿龈爆破音。舌尖抵住上齿龈，然后突然离开。声带不振动。', exampleWord: 'time /taɪm/' },
    { symbol: 'd', speakText: 'duh', description: '浊辅音 / 齿龈爆破音。与 /t/ 口型相同，但声带振动。', exampleWord: 'dog /dɒɡ/' },
    { symbol: 'k', speakText: 'kuh', description: '清辅音 / 软腭爆破音。舌后部抵住软腭，然后突然离开。声带不振动。', exampleWord: 'cat /kæt/' },
    { symbol: 'ɡ', speakText: 'guh', description: '浊辅音 / 软腭爆破音。与 /k/ 口型相同，但声带振动。', exampleWord: 'go /ɡəʊ/' },

    // ── Fricatives (摩擦音) — 可持续发音，用延长音 ──
    { symbol: 'f', speakText: 'fff', description: '清辅音 / 唇齿摩擦音。上齿轻咬下唇，气流从缝隙中挤出。声带不振动。', exampleWord: 'fish /fɪʃ/' },
    { symbol: 'v', speakText: 'vvv', description: '浊辅音 / 唇齿摩擦音。与 /f/ 口型相同，但声带振动。', exampleWord: 'very /ˈveri/' },
    { symbol: 'θ', speakText: 'thhh', description: '清辅音 / 齿间摩擦音。舌尖放在上下齿之间，气流挤出。声带不振动。', exampleWord: 'think /θɪŋk/' },
    { symbol: 'ð', speakText: 'thhh', description: '浊辅音 / 齿间摩擦音。与 /θ/ 口型相同，但声带振动。', exampleWord: 'this /ðɪs/' },
    { symbol: 's', speakText: 'sss', description: '清辅音 / 齿龈摩擦音。舌尖靠近上齿龈，气流从缝隙挤出。声带不振动。', exampleWord: 'sun /sʌn/' },
    { symbol: 'z', speakText: 'zzz', description: '浊辅音 / 齿龈摩擦音。与 /s/ 口型相同，但声带振动。', exampleWord: 'zoo /zuː/' },
    { symbol: 'ʃ', speakText: 'shhh', description: '清辅音 / 腭龈摩擦音。舌尖接近上齿龈后部，双唇稍圆。声带不振动。', exampleWord: 'she /ʃiː/' },
    { symbol: 'ʒ', speakText: 'zhhh', description: '浊辅音 / 腭龈摩擦音。与 /ʃ/ 口型相同，但声带振动。', exampleWord: 'vision /ˈvɪʒən/' },
    { symbol: 'h', speakText: 'huh', description: '清辅音 / 声门摩擦音。气流通过声门时产生轻微摩擦。声带不振动。', exampleWord: 'hat /hæt/' },

    // ── Affricates (破擦音) ──
    { symbol: 'tʃ', speakText: 'chuh', description: '清辅音 / 腭龈破擦音。舌尖抵住上齿龈后部，然后慢慢离开形成摩擦。声带不振动。', exampleWord: 'chair /tʃeər/' },
    { symbol: 'dʒ', speakText: 'juh', description: '浊辅音 / 腭龈破擦音。与 /tʃ/ 口型相同，但声带振动。', exampleWord: 'joy /dʒɔɪ/' },

    // ── Nasals (鼻音) — 可用延长音 ──
    { symbol: 'm', speakText: 'mmm', description: '浊辅音 / 双唇鼻音。双唇紧闭，气流从鼻腔流出。声带振动。', exampleWord: 'man /mæn/' },
    { symbol: 'n', speakText: 'nnn', description: '浊辅音 / 齿龈鼻音。舌尖抵住上齿龈，气流从鼻腔流出。声带振动。', exampleWord: 'no /nəʊ/' },
    { symbol: 'ŋ', speakText: 'ngng', description: '浊辅音 / 软腭鼻音。舌后部抵住软腭，气流从鼻腔流出。类似中文"ng"。', exampleWord: 'sing /sɪŋ/' },

    // ── Liquids (流音/舌侧音) — 可用延长音 ──
    { symbol: 'l', speakText: 'lll', description: '浊辅音 / 齿龈舌侧音。舌尖抵住上齿龈，气流从舌两侧流出。', exampleWord: 'like /laɪk/' },
    { symbol: 'r', speakText: 'rrr', description: '浊辅音 / 齿龈近音。舌尖卷起靠近上齿龈后部，但不接触。声带振动。', exampleWord: 'red /red/' },

    // ── Glides (滑音/半元音) ──
    { symbol: 'w', speakText: 'wuh', description: '浊辅音 / 双唇软腭滑音。双唇收圆且向前突出，然后迅速滑向后面的元音。', exampleWord: 'we /wiː/' },
    { symbol: 'j', speakText: 'yuh', description: '浊辅音 / 硬腭滑音。舌前部向硬腭抬起，然后迅速滑向后面的元音。类似中文"y"。', exampleWord: 'yes /jes/' }
  ]
};

// Flatten all phonetic symbols with their type
export function getAllPhoneticSymbols() {
  const result = [];
  for (const v of phonetics.vowels) {
    result.push({ ...v, type: 'vowel' });
  }
  for (const c of phonetics.consonants) {
    result.push({ ...c, type: 'consonant' });
  }
  return result;
}
