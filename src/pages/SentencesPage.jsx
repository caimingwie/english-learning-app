import React, { useState, useMemo, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { useStudy } from '../hooks/useStudy';
import ProgressBar from '../components/ProgressBar';
import SpeakerButton from '../components/SpeakerButton';
import SentenceRenderer from '../components/SentenceRenderer';
import StickyButtons from '../components/StickyButtons';

// Build a simple word dictionary look-up from common words
// This avoids importing the full words data module
const WORD_MEANINGS = {
  'I': '我', 'you': '你/你们', 'he': '他', 'she': '她', 'it': '它', 'we': '我们', 'they': '他们',
  'me': '我(宾)', 'him': '他(宾)', 'her': '她/她的', 'us': '我们(宾)', 'them': '他们(宾)',
  'my': '我的', 'your': '你的', 'his': '他的', 'its': '它的', 'our': '我们的', 'their': '他们的',
  'am': '是', 'is': '是', 'are': '是', 'was': '是(过去)', 'were': '是(过去)', 'be': '是',
  'have': '有', 'has': '有', 'had': '有(过去)', 'do': '做', 'does': '做', 'did': '做(过去)',
  'can': '能', 'could': '能(过去)', 'will': '将要', 'would': '将会', 'shall': '应当', 'should': '应该',
  'may': '可能', 'might': '可能(过去)', 'must': '必须',
  'not': '不', "don't": '不', "doesn't": '不', "didn't": '不', "can't": '不能', "won't": '将不',
  "couldn't": '不能', "shouldn't": '不应该', "isn't": '不是', "aren't": '不是', "wasn't": '不是',
  'to': '到/向', 'of': '…的', 'in': '在…里', 'on': '在…上', 'at': '在', 'for': '为了', 'with': '和…一起',
  'from': '从', 'by': '由/通过', 'about': '关于', 'into': '进入', 'over': '在…上方', 'under': '在…下方',
  'and': '和', 'or': '或者', 'but': '但是', 'so': '所以/如此', 'because': '因为', 'if': '如果',
  'when': '什么时候', 'where': '在哪里', 'why': '为什么', 'how': '怎么/多么', 'what': '什么',
  'which': '哪一个', 'who': '谁', 'that': '那个', 'this': '这个', 'these': '这些', 'those': '那些',
  'a': '一个', 'an': '一个', 'the': '这/那',
  'love': '爱', 'like': '喜欢', 'hate': '恨', 'want': '想要', 'need': '需要', 'know': '知道',
  'think': '想/认为', 'believe': '相信', 'feel': '感觉', 'see': '看见', 'look': '看', 'watch': '观看',
  'hear': '听见', 'listen': '听', 'say': '说', 'tell': '告诉', 'ask': '问', 'answer': '回答',
  'speak': '说', 'talk': '谈论', 'give': '给', 'take': '拿/带', 'get': '得到', 'make': '制作/使',
  'go': '去', 'come': '来', 'eat': '吃', 'drink': '喝', 'sleep': '睡觉', 'walk': '走', 'run': '跑',
  'play': '玩', 'work': '工作', 'study': '学习', 'learn': '学习', 'teach': '教', 'read': '读',
  'write': '写', 'sing': '唱', 'dance': '跳舞', 'sit': '坐', 'stand': '站',
  'good': '好的', 'bad': '坏的', 'big': '大的', 'small': '小的', 'beautiful': '漂亮的',
  'happy': '快乐的', 'sad': '悲伤的', 'old': '老的/旧的', 'new': '新的', 'young': '年轻的',
  'tall': '高的', 'kind': '善良的', 'clever': '聪明的', 'diligent': '勤奋的',
  'best': '最好的', 'little': '小的/少的', 'great': '伟大的', 'difficult': '困难的',
  'strong': '强壮的', 'experienced': '有经验的', 'famous': '著名的', 'interesting': '有趣的',
  'warm': '温暖的', 'modern': '现代的', 'lovely': '可爱的', 'whole': '整个的',
  'daily': '日常的', 'outdoor': '户外的',
  'time': '时间', 'day': '天/日', 'year': '年', 'people': '人们', 'way': '方式/路',
  'thing': '东西/事情', 'man': '男人', 'woman': '女人', 'child': '孩子', 'world': '世界',
  'life': '生活/生命', 'hand': '手', 'eye': '眼', 'home': '家', 'school': '学校',
  'book': '书', 'water': '水', 'music': '音乐', 'gift': '礼物', 'friend': '朋友',
  'teacher': '老师', 'student': '学生', 'doctor': '医生', 'nurse': '护士',
  'mother': '妈妈', 'father': '爸爸', 'sister': '姐妹', 'brother': '兄弟',
  'grandma': '奶奶', 'grandfather': '爷爷', 'family': '家庭', 'parent': '父母',
  'boy': '男孩', 'girl': '女孩', 'man': '男人', 'police': '警察', 'driver': '司机',
  'writer': '作家', 'scientist': '科学家', 'volunteer': '志愿者', 'leader': '领导者',
  'baby': '婴儿', 'patient': '病人/耐心的', 'neighbor': '邻居',
  'cat': '猫', 'dog': '狗', 'bird': '鸟', 'fish': '鱼', 'horse': '马',
  'tree': '树', 'flower': '花', 'sun': '太阳', 'moon': '月亮', 'star': '星星',
  'apple': '苹果', 'banana': '香蕉', 'food': '食物', 'breakfast': '早餐', 'lunch': '午餐',
  'dinner': '晚餐', 'milk': '牛奶', 'bread': '面包', 'egg': '蛋', 'rice': '米饭',
  'football': '足球', 'game': '游戏/比赛', 'sport': '运动', 'ball': '球',
  'car': '车', 'bus': '公交车', 'train': '火车', 'plane': '飞机', 'bike': '自行车',
  'house': '房子', 'room': '房间', 'door': '门', 'window': '窗户', 'table': '桌子',
  'chair': '椅子', 'bed': '床', 'key': '钥匙', 'phone': '电话', 'computer': '电脑',
  'TV': '电视', 'radio': '收音机', 'light': '灯/光', 'picture': '图画',
  'city': '城市', 'country': '国家', 'street': '街道', 'park': '公园', 'shop': '商店',
  'restaurant': '餐厅', 'hospital': '医院', 'hotel': '酒店', 'airport': '机场',
  'beach': '海滩', 'mountain': '山', 'river': '河', 'sea': '海',
  'movie': '电影', 'story': '故事', 'song': '歌', 'news': '新闻', 'message': '消息',
  'letter': '信/字母', 'paper': '纸/报纸', 'money': '钱', 'question': '问题',
  'problem': '问题', 'mistake': '错误', 'decision': '决定',
  'progress': '进步', 'difference': '区别', 'sense': '感觉/意义',
  'homework': '作业', 'exam': '考试', 'test': '测试', 'class': '班级/课',
  'lesson': '课', 'grammar': '语法', 'rule': '规则', 'word': '单词',
  'English': '英语', 'math': '数学', 'science': '科学', 'history': '历史',
  'weather': '天气', 'rain': '雨', 'snow': '雪', 'wind': '风', 'noise': '噪音',
  'earthquake': '地震', 'building': '建筑', 'technology': '技术',
  'sunlight': '阳光', 'joy': '喜悦', 'postcard': '明信片',
  'honesty': '诚实', 'policy': '政策', 'reason': '原因',
  'meeting': '会议', 'trip': '旅行', 'party': '派对', 'test': '测试',
  'result': '结果', 'team': '团队', 'company': '公司', 'business': '生意',
  'dream': '梦/梦想', 'idea': '想法', 'fact': '事实', 'example': '例子',
  'part': '部分/参加', 'care': '关心/照顾', 'break': '休息', 'photo': '照片',
  'note': '笔记', 'rest': '休息', 'fun': '乐趣',
  'first': '第一', 'last': '最后', 'next': '下一个', 'every': '每个', 'some': '一些',
  'any': '任何', 'all': '所有的', 'many': '许多', 'more': '更多', 'most': '最多',
  'few': '很少', 'much': '很多', 'little': '少/小', 'other': '其他的',
  'one': '一', 'two': '二', 'three': '三', 'four': '四', 'five': '五',
  'now': '现在', 'then': '然后', 'yesterday': '昨天', 'today': '今天', 'tomorrow': '明天',
  'always': '总是', 'never': '从不', 'often': '经常', 'usually': '通常', 'sometimes': '有时',
  'already': '已经', 'still': '仍然', 'just': '刚刚/只是', 'only': '仅仅/只有',
  'also': '也', 'too': '也/太', 'very': '非常', 'really': '真正地', 'quite': '相当',
  'well': '好地', 'carefully': '仔细地', 'quickly': '快速地', 'finally': '终于',
  'successfully': '成功地', 'greatly': '极大地', 'early': '早', 'late': '晚',
  'here': '这里', 'there': '那里', 'up': '向上', 'down': '向下', 'out': '出去', 'back': '回来',
  'ago': '以前',
  'enjoy': '享受', 'finish': '完成', 'start': '开始', 'stop': '停止', 'keep': '保持',
  'find': '找到', 'lose': '失去', 'buy': '买', 'sell': '卖', 'pay': '支付', 'cost': '花费',
  'send': '发送', 'receive': '收到', 'bring': '带来', 'carry': '携带', 'put': '放',
  'pick': '捡起/接', 'set': '设置/放置', 'turn': '转动/变成', 'fill': '充满',
  'save': '挽救/保存', 'change': '改变', 'build': '建造', 'destroy': '摧毁',
  'happen': '发生', 'die': '死', 'live': '生活/住', 'grow': '成长', 'become': '变成',
  'seem': '似乎', 'appear': '出现', 'happen': '发生',
  'consider': '认为', 'explain': '解释', 'publish': '出版', 'discover': '发现',
  'surprise': '使惊讶', 'impress': '留下印象', 'encourage': '鼓励',
  'remember': '记住', 'forget': '忘记', 'understand': '理解', 'realize': '意识到',
  'decide': '决定', 'agree': '同意', 'refuse': '拒绝', 'accept': '接受',
  'offer': '提供', 'help': '帮助', 'allow': '允许', 'promise': '承诺',
  'visit': '访问/看望', 'meet': '遇见', 'call': '打电话', 'invite': '邀请',
  'join': '加入', 'leave': '离开', 'arrive': '到达', 'return': '返回',
  'move': '移动', 'travel': '旅行', 'fly': '飞', 'drive': '驾驶',
  'catch': '抓住', 'throw': '扔', 'push': '推', 'pull': '拉', 'open': '打开', 'close': '关闭',
  'begin': '开始', 'continue': '继续', 'practice': '练习', 'prepare': '准备',
  'clean': '清洁', 'wash': '洗', 'cook': '烹饪', 'cut': '切', 'break': '打破',
  'choose': '选择', 'follow': '跟随', 'lead': '领导', 'win': '赢', 'lose': '输',
  'fail': '失败', 'pass': '通过', 'try': '尝试', 'check': '检查', 'wait': '等待',
  'hope': '希望', 'wish': '希望', 'mean': '意思是', 'matter': '重要',
  'sound': '听起来', 'stay': '停留', 'remain': '保持', 'seem': '似乎',
  'using': '使用', 'enjoy': '享受', 'cleaned': '清洁(过)', 'turned': '转动(过)',
  'kites': '风筝', 'mice': '老鼠(复)', 'himself': '他自己',
  'whether': '是否', 'everyone': '每个人', 'everything': '一切',
};

/**
 * Sentence learning/review page.
 * Flow: See sentence → Click correct/wrong → See translation → Click 下一题 → Next
 * Click any word in the sentence to see its Chinese meaning.
 */
export default function SentencesPage() {
  const { state, updateSetting } = useAppContext();
  const { settings } = state;
  const dailyQuota = settings.dailySentenceQuota || 10;

  const {
    currentItem,
    progress,
    isComplete,
    respond,
    advance,
    goBack,
    canGoBack,
    canGoNext,
    answered,
    sessionStats,
    reset,
    isLoading,
    error
  } = useStudy({ itemType: 'sentence', dailyQuota });

  const [showExplanation, setShowExplanation] = useState(false);
  const [quotaSelector, setQuotaSelector] = useState(false);
  const [clickedWord, setClickedWord] = useState(null); // { word, meaning }

  // Look up a word's meaning
  const lookupWord = useCallback((word) => {
    const cleaned = word.replace(/[.,!?;:'"()]/g, '').trim().toLowerCase();
    const meaning = WORD_MEANINGS[cleaned] || WORD_MEANINGS[word] || null;
    if (meaning) {
      setClickedWord({ word: word.replace(/[.,!?;:'"()]/g, '').trim(), meaning });
    } else {
      setClickedWord({ word: word.replace(/[.,!?;:'"()]/g, '').trim(), meaning: '(未收录)' });
    }
  }, []);

  const handleWordClick = useCallback((word) => {
    lookupWord(word);
  }, [lookupWord]);

  const handleWrong = async () => {
    if (!currentItem || answered) return;
    setShowExplanation(true);
    await respond(false);
  };

  const handleCorrect = async () => {
    if (!currentItem || answered) return;
    await respond(true);
  };

  const handleReset = () => {
    setSessionSummary(null);
    setShowExplanation(false);
    setClickedWord(null);
    reset();
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="page">
        <h2 className="page__title">📖 句子学习</h2>
        <div className="loading-state">加载中...</div>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="page">
        <h2 className="page__title">📖 句子学习</h2>
        <div className="error-state">
          <p>{error}</p>
          <button className="btn btn--primary" onClick={reset}>重试</button>
        </div>
      </div>
    );
  }

  // ── Completion state ──
  if (isComplete) {
    return (
      <div className="page">
        <h2 className="page__title">📖 句子学习</h2>
        <div className="completion-state">
          <div className="completion-icon">🎉</div>
          <h3>今日句子任务已完成！</h3>
          <p>正确：{sessionStats.known} 句</p>
          <p>错误：{sessionStats.unknown} 句</p>
          <div className="completion-actions">
            <button className="btn btn--primary" onClick={handleReset}>
              再来一组
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ──
  if (!currentItem) {
    return (
      <div className="page">
        <h2 className="page__title">📖 句子学习</h2>
        <div className="empty-state">
          <div className="empty-icon">✅</div>
          <h3>今日没有需要复习的句子</h3>
          <button className="btn btn--primary" onClick={reset}>刷新</button>
        </div>
      </div>
    );
  }

  // ── Active study state ──
  return (
    <div className="page">
      <h2 className="page__title">📖 句子学习</h2>

      {/* Quota selector */}
      <div className="quota-selector">
        <button
          className="btn btn--small btn--text"
          onClick={() => setQuotaSelector(!quotaSelector)}
        >
          每日：{dailyQuota} 句 ▾
        </button>
        {quotaSelector && (
          <div className="quota-dropdown">
            {[5, 10, 15].map(n => (
              <button
                key={n}
                className={`quota-option ${n === dailyQuota ? 'quota-option--active' : ''}`}
                onClick={() => {
                  updateSetting('dailySentenceQuota', n);
                  setQuotaSelector(false);
                }}
              >
                {n} 句/天
              </button>
            ))}
          </div>
        )}
      </div>

      <ProgressBar done={progress.done} total={progress.total} />

      {/* Sentence card */}
      <div className="sentence-card">
        <div className="sentence-card__header">
          <SpeakerButton
            text={currentItem.english}
            label="朗读句子"
          />
        </div>

        {/* Clickable word sentence renderer */}
        <SentenceRenderer
          sentence={currentItem}
          showChinese={false}
          onWordClick={handleWordClick}
        />

        {/* Word meaning popover */}
        {clickedWord && (
          <div className="word-meaning-popover">
            <span className="word-meaning-popover__word">{clickedWord.word}</span>
            <span className="word-meaning-popover__arrow">→</span>
            <span className="word-meaning-popover__meaning">{clickedWord.meaning}</span>
            <button
              className="word-meaning-popover__close"
              onClick={() => setClickedWord(null)}
            >
              ✕
            </button>
          </div>
        )}

        <div className={`sentence-card__translation ${answered ? 'translation--revealed' : ''}`}>
          {answered ? (
            <p>{currentItem.chinese}</p>
          ) : (
            <span className="meaning-hint">作答后将显示中文翻译</span>
          )}
        </div>

        {showExplanation && answered && currentItem.structure && (
          <div className="sentence-card__explanation">
            <h4>📝 句子分析</h4>
            <p>
              <strong>主语 (S):</strong> {currentItem.structure.S || '无'}<br />
              <strong>谓语 (V):</strong> {currentItem.structure.V || '无'}<br />
              <strong>宾语 (O):</strong> {currentItem.structure.O || '无'}
            </p>
            <p className="explanation-text">
              英文句子结构通常是：<strong>主语 + 谓语 + 宾语</strong> (SVO)。<br />
              试着多读几遍，感受这种结构。
            </p>
          </div>
        )}
      </div>

      <StickyButtons
        variant="correct-wrong"
        onLeft={handleWrong}
        onRight={handleCorrect}
        leftLabel="不认识"
        rightLabel="认识"
        disabled={answered}
        showLeftRight={true}
        onPrev={goBack}
        onNext={advance}
        prevDisabled={!canGoBack}
        nextDisabled={!answered}
        nextLabel={progress.done + 1 >= progress.total && answered ? '完成' : '下一题'}
        answered={answered}
      />
    </div>
  );
}
