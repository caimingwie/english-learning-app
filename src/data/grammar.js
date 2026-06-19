/**
 * Grammar points ordered from easy to hard.
 * Each point has: title, content (detailed explanation), and 3 example sentences with analysis.
 */

export const grammarPoints = [
  {
    id: 'g001',
    title: '人称代词与 Be 动词',
    titleEn: 'Personal Pronouns & Be-Verb',
    order: 1,
    content: `Be 动词是英语中最基本的动词，表示"是、在、成为"等含义。它有三种形式：am、is、are。

I 搭配 am，he/she/it 和单数名词搭配 is，you/we/they 和复数名词搭配 are。

例句中可以看到，主语不同，be 动词也会相应变化。这是英语句子最基本的构成方式。`,
    examples: [
      {
        english: 'I am a student.',
        chinese: '我是一个学生。',
        highlight: 'I → am',
        explanation: '第一人称单数 I 必须搭配 am'
      },
      {
        english: 'She is my friend.',
        chinese: '她是我的朋友。',
        highlight: 'She → is',
        explanation: '第三人称单数 she 搭配 is'
      },
      {
        english: 'They are happy.',
        chinese: '他们很开心。',
        highlight: 'They → are',
        explanation: '复数主语 they 搭配 are'
      }
    ]
  },
  {
    id: 'g002',
    title: '名词的单复数',
    titleEn: 'Singular & Plural Nouns',
    order: 2,
    content: `英语名词分为可数名词和不可数名词。可数名词有单数和复数形式。

复数构成规则：
1. 一般情况在词尾加 -s：book → books
2. 以 s/x/ch/sh 结尾加 -es：box → boxes
3. 以辅音 + y 结尾，变 y 为 i 加 -es：city → cities
4. 以 f/fe 结尾，变 f/fe 为 v 加 -es：knife → knives
5. 不规则变化：child → children, man → men, foot → feet

不可数名词没有复数形式，如 water, rice, information。`,
    examples: [
      {
        english: 'I have two books.',
        chinese: '我有两本书。',
        highlight: 'two books (复数)',
        explanation: '可数名词 book 在数量大于1时用复数形式加 -s'
      },
      {
        english: 'The children are playing.',
        chinese: '孩子们在玩。',
        highlight: 'children (不规则复数)',
        explanation: 'child 的不规则复数形式是 children，不是 childs'
      },
      {
        english: 'There is some water.',
        chinese: '有一些水。',
        highlight: 'water (不可数)',
        explanation: 'water 是不可数名词，没有复数形式，用 some 修饰'
      }
    ]
  },
  {
    id: 'g003',
    title: '不定冠词与定冠词',
    titleEn: 'Articles: a/an & the',
    order: 3,
    content: `英语中有三个冠词：a、an（不定冠词）和 the（定冠词）。

不定冠词 a/an：
- 泛指某一类人或事物中的"一个"
- a 用于辅音音素开头的词前：a book, a university
- an 用于元音音素开头的词前：an apple, an hour

定冠词 the：
- 特指某个或某些特定的人或事物
- 双方都知道的事物：Close the door.
- 上文提到过的事物：I saw a dog. The dog was big.
- 世界上独一无二的事物：the sun, the moon
- 序数词和最高级前：the first, the best`,
    examples: [
      {
        english: 'I ate an apple this morning.',
        chinese: '我今天早上吃了一个苹果。',
        highlight: 'an apple',
        explanation: 'apple 以元音音素 /æ/ 开头，用 an 而不是 a'
      },
      {
        english: 'The apple you gave me was delicious.',
        chinese: '你给我的那个苹果很好吃。',
        highlight: 'The apple',
        explanation: '特指"你给我的"那个苹果，所以用 the'
      },
      {
        english: 'The sun rises in the east.',
        chinese: '太阳从东方升起。',
        highlight: 'The sun',
        explanation: 'sun 是世界上独一无二的事物，必须用 the'
      }
    ]
  },
  {
    id: 'g004',
    title: '一般现在时',
    titleEn: 'Simple Present Tense',
    order: 4,
    content: `一般现在时表示经常发生的动作、客观事实、普遍真理或现在的状态。

基本结构：
- 主语 + 动词原形（主语为 I/you/we/they 或复数）
- 主语 + 动词第三人称单数（主语为 he/she/it 或单数名词）

第三人称单数动词变化规则：
1. 一般加 -s：play → plays
2. 以 s/x/ch/sh/o 结尾加 -es：go → goes, watch → watches
3. 以辅音 + y 结尾，变 y 为 i 加 -es：study → studies

否定和疑问需要助动词 do/does：
- I don't like coffee. / He doesn't like coffee.
- Do you like coffee? / Does he like coffee?`,
    examples: [
      {
        english: 'She goes to school every day.',
        chinese: '她每天去上学。',
        highlight: 'goes (第三人称单数)',
        explanation: '主语 she 是第三人称单数，go 需要加 -es 变成 goes'
      },
      {
        english: 'Water boils at 100 degrees.',
        chinese: '水在100度沸腾。',
        highlight: 'boils (客观真理)',
        explanation: '表达客观事实/真理时用一般现在时，不受时间限制'
      },
      {
        english: 'He doesn\'t speak French.',
        chinese: '他不说法语。',
        highlight: 'doesn\'t speak',
        explanation: '第三人称单数的否定，用 doesn\'t + 动词原形 speak'
      }
    ]
  },
  {
    id: 'g005',
    title: '现在进行时',
    titleEn: 'Present Continuous Tense',
    order: 5,
    content: `现在进行时表示正在发生的动作或现阶段正在进行的动作。

基本结构：主语 + be (am/is/are) + 动词-ing

动词-ing 变化规则：
1. 一般直接加 -ing：play → playing
2. 以不发音的 e 结尾，去掉 e 加 -ing：make → making
3. 以重读闭音节结尾且末尾只有一个辅音字母，双写辅音字母加 -ing：run → running

常见时间状语：now, right now, at the moment, Look!, Listen!

注意：有些动词不能用于进行时（状态动词），如 know, like, want, believe 等。`,
    examples: [
      {
        english: 'She is reading a book now.',
        chinese: '她正在读一本书。',
        highlight: 'is reading (be + 动词 ing)',
        explanation: '表达正在进行的动作，用 be 动词 + 动词现在分词'
      },
      {
        english: 'Look! The boys are running in the park.',
        chinese: '看！男孩们正在公园里跑步。',
        highlight: 'are running (双写 n)',
        explanation: 'run 是重读闭音节，需要双写末尾辅音 n 再加 -ing'
      },
      {
        english: 'I am learning English these days.',
        chinese: '这些天我在学英语。',
        highlight: 'am learning',
        explanation: '表示现阶段正在进行的动作，不一定是此刻正在做'
      }
    ]
  },
  {
    id: 'g006',
    title: '一般过去时',
    titleEn: 'Simple Past Tense',
    order: 6,
    content: `一般过去时表示过去某个时间发生的动作或存在的状态。

基本结构：主语 + 动词过去式

动词过去式变化规则：
1. 一般加 -ed：work → worked
2. 以 e 结尾加 -d：like → liked
3. 以辅音 + y 结尾，变 y 为 i 加 -ed：study → studied
4. 重读闭音节，双写辅音字母加 -ed：stop → stopped

不规则动词需要单独记忆，如 go → went, eat → ate, see → saw。

否定和疑问需要助动词 did（动词恢复原形）：
- I didn't go. / Did you go?

常见时间状语：yesterday, last week, ago, in 2020`,
    examples: [
      {
        english: 'I visited my grandma yesterday.',
        chinese: '我昨天看望了我的奶奶。',
        highlight: 'visited (规则变化)',
        explanation: 'visit 是规则动词，过去式直接加 -ed'
      },
      {
        english: 'She went to Beijing last year.',
        chinese: '她去年去了北京。',
        highlight: 'went (不规则变化)',
        explanation: 'go 的过去式是 went，是不规则变化，需要单独记忆'
      },
      {
        english: 'They didn\'t finish their homework.',
        chinese: '他们没有完成作业。',
        highlight: 'didn\'t finish',
        explanation: '过去时的否定用 didn\'t，后面的动词用原形 finish'
      }
    ]
  },
  {
    id: 'g007',
    title: '一般将来时',
    titleEn: 'Simple Future Tense',
    order: 7,
    content: `一般将来时表示将来某个时间要发生的动作或存在的状态。

三种常见表达方式：

1. will + 动词原形（最常用）
   - 表示预测、意愿、承诺
   - I will help you.

2. be going to + 动词原形
   - 表示计划、打算，或根据现有迹象判断将要发生的事
   - It's going to rain.

3. 现在进行时表将来
   - 用于表示已安排好的近期计划（通常与时间状语连用）
   - I'm meeting her tomorrow.

否定：will not = won't, is/are not going to`,
    examples: [
      {
        english: 'I will call you tomorrow.',
        chinese: '我明天会给你打电话。',
        highlight: 'will call',
        explanation: 'will + 动词原形表示将来的意愿或承诺'
      },
      {
        english: 'We are going to visit the museum this weekend.',
        chinese: '我们打算这个周末去参观博物馆。',
        highlight: 'are going to visit',
        explanation: 'be going to 表示事先计划好的安排'
      },
      {
        english: 'It won\'t rain this afternoon.',
        chinese: '今天下午不会下雨。',
        highlight: 'won\'t rain',
        explanation: 'won\'t = will not，将来时的否定形式'
      }
    ]
  },
  {
    id: 'g008',
    title: '现在完成时',
    titleEn: 'Present Perfect Tense',
    order: 8,
    content: `现在完成时连接过去和现在，表示过去发生的动作对现在造成的影响或结果。

基本结构：主语 + have/has + 过去分词

主要用法：
1. 已完成的事（对现在有影响）：I have lost my key. (现在找不到)
2. 经历（曾经做过）：I have been to Japan.
3. 持续到现在的动作/状态：I have lived here for 10 years.

时间状语：already, yet, just, ever, never, since, for

与一般过去时的区别：
- 一般过去时：强调过去发生的动作（I lost my key yesterday.）
- 现在完成时：强调对现在的影响（I have lost my key. 所以现在开不了门）`,
    examples: [
      {
        english: 'I have finished my homework.',
        chinese: '我已经完成了我的作业。',
        highlight: 'have finished',
        explanation: '使用 have + 过去分词，强调"作业已完成"这一结果对现在的影响'
      },
      {
        english: 'She has never been to China.',
        chinese: '她从未去过中国。',
        highlight: 'has never been',
        explanation: '表示"至今为止从未有过"的经历，用现在完成时'
      },
      {
        english: 'We have lived here since 2018.',
        chinese: '我们从2018年起就住在这里。',
        highlight: 'have lived ... since',
        explanation: 'since + 时间点，表示从过去某个时间持续到现在的动作'
      }
    ]
  },
  {
    id: 'g009',
    title: '形容词比较级与最高级',
    titleEn: 'Comparative & Superlative Adjectives',
    order: 9,
    content: `形容词的比较级和最高级用于进行比较。

变化规则：
1. 单音节词：加 -er / -est
   tall → taller → tallest

2. 以 e 结尾：加 -r / -st
   nice → nicer → nicest

3. 重读闭音节：双写辅音字母
   big → bigger → biggest

4. 辅音 + y 结尾：变 y 为 i
   happy → happier → happiest

5. 多音节词：前面加 more / most
   beautiful → more beautiful → most beautiful

6. 不规则变化：
   good → better → best
   bad → worse → worst
   many/much → more → most

句型：
- 比较级 + than：A is taller than B.
- as + 原级 + as：A is as tall as B.
- the + 最高级 + 范围：A is the tallest in the class.`,
    examples: [
      {
        english: 'My room is bigger than yours.',
        chinese: '我的房间比你的大。',
        highlight: 'bigger than (比较级)',
        explanation: 'big 是重读闭音节，双写 g 加 -er；than 引出被比较对象'
      },
      {
        english: 'This is the most interesting book I have ever read.',
        chinese: '这是我读过的最有趣的书。',
        highlight: 'the most interesting (最高级)',
        explanation: '多音节词 interesting 用 most 构成最高级，前面加 the'
      },
      {
        english: 'She runs as fast as her brother.',
        chinese: '她跑得和她哥哥一样快。',
        highlight: 'as fast as (同级比较)',
        explanation: 'as + 原级 + as 表示"和……一样……"'
      }
    ]
  },
  {
    id: 'g010',
    title: '情态动词',
    titleEn: 'Modal Verbs',
    order: 10,
    content: `情态动词表示说话人对动作的态度和看法，如能力、可能性、必要性等。

常用情态动词：
- can/could：能力、许可、可能性
- may/might：可能性、许可（比 can 更正式）
- must：必须（主观）、肯定推测
- have to：不得不（客观要求）
- should：应该（建议）
- will/would：意愿、请求
- need：需要

注意：
1. 情态动词后接动词原形
2. 情态动词没有人称和数的变化
3. 否定直接加 not：cannot → can't, must not → mustn't`,
    examples: [
      {
        english: 'You must wear a seatbelt in the car.',
        chinese: '你在车上必须系安全带。',
        highlight: 'must wear',
        explanation: 'must 表示强烈的必要性/义务，后接动词原形 wear'
      },
      {
        english: 'She can speak three languages.',
        chinese: '她会说三种语言。',
        highlight: 'can speak',
        explanation: 'can 表示能力，后接动词原形 speak'
      },
      {
        english: 'You should see a doctor.',
        chinese: '你应该去看医生。',
        highlight: 'should see',
        explanation: 'should 表示建议，语气比 must 委婉，后接动词原形'
      }
    ]
  },
  {
    id: 'g011',
    title: '被动语态',
    titleEn: 'Passive Voice',
    order: 11,
    content: `被动语态强调动作的承受者，而不是执行者。

基本结构：主语 + be + 过去分词 (+ by + 动作执行者)

各时态的被动语态：
- 一般现在时：am/is/are + done
- 一般过去时：was/were + done
- 一般将来时：will be + done
- 现在进行时：am/is/are being + done
- 现在完成时：have/has been + done

使用场景：
1. 不知道或不需要指出动作执行者
2. 强调动作的承受者
3. 客观描述（科学、新闻）`,
    examples: [
      {
        english: 'English is spoken all over the world.',
        chinese: '全世界都说英语。',
        highlight: 'is spoken (被动语态)',
        explanation: '一般现在时的被动语态：is + 过去分词 spoken，强调英语"被说"'
      },
      {
        english: 'The bridge was built in 2010.',
        chinese: '这座桥建于2010年。',
        highlight: 'was built (过去被动)',
        explanation: '一般过去时的被动语态：was + 过去分词 built，强调桥"被建"'
      },
      {
        english: 'The homework must be finished by Friday.',
        chinese: '作业必须在周五之前完成。',
        highlight: 'must be finished (情态动词被动)',
        explanation: '情态动词的被动语态：must + be + 过去分词'
      }
    ]
  },
  {
    id: 'g012',
    title: '定语从句',
    titleEn: 'Relative Clauses',
    order: 12,
    content: `定语从句用于修饰名词或代词，放在被修饰词（先行词）的后面。

关系代词：
- who：指人，作主语或宾语
- whom：指人，作宾语（正式，口语中常用 who 代替）
- which：指物
- that：指人或物（限制性定语从句中可代替 who/which）
- whose：表示所属关系

关系副词：
- when：时间
- where：地点
- why：原因

限制性 vs 非限制性：
- 限制性：不可省略，不用逗号隔开（用 that）
- 非限制性：补充说明，用逗号隔开（不能用 that）`,
    examples: [
      {
        english: 'The girl who is wearing a red dress is my sister.',
        chinese: '那个穿红裙子的女孩是我妹妹。',
        highlight: 'who is wearing a red dress',
        explanation: 'who 引导的定语从句修饰 the girl，who 在从句中作主语'
      },
      {
        english: 'This is the book that I bought yesterday.',
        chinese: '这就是我昨天买的那本书。',
        highlight: 'that I bought yesterday',
        explanation: 'that 引导的定语从句修饰 the book，that 在从句中作宾语'
      },
      {
        english: 'The house where I grew up has been sold.',
        chinese: '我长大的那所房子已被卖掉。',
        highlight: 'where I grew up',
        explanation: 'where 是关系副词，表示地点，修饰 the house'
      }
    ]
  },
  {
    id: 'g013',
    title: '条件状语从句 (if)',
    titleEn: 'Conditional Clauses (if)',
    order: 13,
    content: `条件状语从句由 if（如果）引导，表示"如果……就……"。

主要类型：
1. 真实条件句（主将从现）：if + 一般现在时，主句用一般将来时
   If it rains, I will stay home.

2. 虚拟条件句（与现在事实相反）：if + 一般过去时，主句用 would + 动词原形
   If I were you, I would go. (be 动词全部用 were)

3. 虚拟条件句（与过去事实相反）：if + 过去完成时，主句用 would have + 过去分词
   If I had known, I would have helped.

4. unless = if...not（除非）
   I won't go unless you come. = I won't go if you don't come.`,
    examples: [
      {
        english: 'If it is sunny tomorrow, we will go to the park.',
        chinese: '如果明天天晴，我们就去公园。',
        highlight: 'If ... is ..., ... will go (主将从现)',
        explanation: '真实条件句：if 从句用一般现在时，主句用一般将来时'
      },
      {
        english: 'If I were rich, I would travel around the world.',
        chinese: '如果我有钱，我会环游世界。',
        highlight: 'If I were ..., I would travel (虚拟)',
        explanation: '与现在事实相反的虚拟条件句：if 从句用过去时，主句用 would + 动词原形'
      },
      {
        english: 'You won\'t pass the exam unless you study hard.',
        chinese: '除非你努力学习，否则你不会通过考试。',
        highlight: 'unless you study',
        explanation: 'unless = if...not，表示"除非/如果不"'
      }
    ]
  },
  {
    id: 'g014',
    title: '宾语从句',
    titleEn: 'Object Clauses',
    order: 14,
    content: `宾语从句在句中充当宾语的成分，通常由 that/whether/if/wh- 等词引导。

三种类型：
1. that 引导（陈述句变来的从句）
   I think (that) he is right.（口语中 that 可省略）

2. whether/if 引导（一般疑问句变来的从句）
   I don't know if/whether he will come.

3. wh- 词引导（特殊疑问句变来的从句）
   Can you tell me where the station is?

重要规则：
- 宾语从句必须用陈述句语序（主语在前，谓语在后）
- ❌ Can you tell me where is the station?
- ✅ Can you tell me where the station is?
- 主句过去时，从句也要用相应的过去时态（时态呼应）`,
    examples: [
      {
        english: 'I think that he is a good teacher.',
        chinese: '我认为他是一个好老师。',
        highlight: '(that) he is a good teacher',
        explanation: 'that 引导的宾语从句作 think 的宾语，that 可以省略'
      },
      {
        english: 'Do you know where he lives?',
        chinese: '你知道他住在哪里吗？',
        highlight: 'where he lives',
        explanation: 'wh- 词引导的宾语从句，注意是陈述句语序 he lives，不是 where does he live'
      },
      {
        english: 'She asked me if I liked the movie.',
        chinese: '她问我是否喜欢这部电影。',
        highlight: 'if I liked the movie',
        explanation: 'if 引导的宾语从句，主句 asked 是过去时，从句用过去时 liked'
      }
    ]
  },
  {
    id: 'g015',
    title: '状语从句',
    titleEn: 'Adverbial Clauses',
    order: 15,
    content: `状语从句在句中充当状语，表示时间、原因、目的、结果等。

常见类型：
1. 时间状语从句：when, while, as, before, after, since, until
2. 原因状语从句：because, since, as
3. 目的状语从句：so that, in order that
4. 结果状语从句：so...that, such...that
5. 让步状语从句：although, though, even though
6. 方式状语从句：as, as if, as though

重要规则：时间状语从句中，用一般现在时代替一般将来时（主将从现）`,
    examples: [
      {
        english: 'Call me when you arrive at the station.',
        chinese: '你到车站时给我打电话。',
        highlight: 'when you arrive (主将从现)',
        explanation: '时间状语从句中用一般现在时 arrive 代替将来时 will arrive'
      },
      {
        english: 'He was late because the traffic was heavy.',
        chinese: '他迟到是因为交通拥堵。',
        highlight: 'because the traffic was heavy',
        explanation: 'because 引导原因状语从句，说明迟到的原因'
      },
      {
        english: 'She is so kind that everyone likes her.',
        chinese: '她如此友善，以至于每个人都喜欢她。',
        highlight: 'so...that...',
        explanation: 'so + 形容词 + that 引导结果状语从句，表示"如此……以至于……"'
      }
    ]
  },
  {
    id: 'g016',
    title: '直接引语与间接引语',
    titleEn: 'Direct & Indirect Speech',
    order: 16,
    content: `引述别人的话有两种方式：直接引语（原话引用）和间接引语（转述）。

直接引语 → 间接引语的变化规则：
1. 时态后退（主句过去时）：现在→过去、过去→过去完成
2. 人称变化：I → he/she, we → they, my → his/her 等
3. 时间/地点变化：now→then, today→that day, here→there
4. 指示代词变化：this→that, these→those

疑问句的转述：
- 一般疑问句：用 if/whether + 陈述句语序
- 特殊疑问句：用 wh- 词 + 陈述句语序

祈使句的转述：用 tell/ask + (not) to do`,
    examples: [
      {
        english: 'He said that he was tired.',
        chinese: '他说他累了。',
        highlight: 'said that ... was (时态后退)',
        explanation: '直接引语 "I am tired" → 间接引语 he was tired，现在时变为过去时'
      },
      {
        english: 'She asked me where I lived.',
        chinese: '她问我住在哪里。',
        highlight: 'asked ... where I lived (陈述语序)',
        explanation: '特殊疑问句的转述：where do you live → where I lived，用陈述语序'
      },
      {
        english: 'The teacher told us to be quiet.',
        chinese: '老师叫我们安静。',
        highlight: 'told us to be quiet',
        explanation: '祈使句的转述：用 tell + sb + to do，否定用 not to do'
      }
    ]
  },
  {
    id: 'g017',
    title: '倒装句',
    titleEn: 'Inversion',
    order: 17,
    content: `倒装句是指将谓语的一部分或全部放在主语之前的句子结构。

部分倒装（助动词/情态动词 + 主语 + 动词原形）：

1. 否定词/半否定词开头：
   Never have I seen such a beautiful sunset.
   Hardly had we arrived when it started to rain.
   Not only does he speak English, but he also speaks French.

2. Only + 状语开头：
   Only then did I realize my mistake.
   Only by working hard can you succeed.

3. So/Neither 表示"也"：
   He can swim. So can I. / He doesn't like it. Neither do I.

完全倒装（谓语全部在主语前）：
Here comes the bus. / There goes the bell.`,
    examples: [
      {
        english: 'Never have I seen such a beautiful sunset.',
        chinese: '我从未见过如此美丽的日落。',
        highlight: 'Never have I seen (倒装)',
        explanation: '否定词 Never 放在句首，助动词 have 提到主语 I 之前'
      },
      {
        english: 'Only by practicing every day can you improve.',
        chinese: '只有每天练习，你才能提高。',
        highlight: 'Only by ... can you (倒装)',
        explanation: '"Only + 方式状语"放在句首时，主句需要部分倒装'
      },
      {
        english: 'He likes coffee. So do I.',
        chinese: '他喜欢咖啡。我也是。',
        highlight: 'So do I (倒装)',
        explanation: 'So + 助动词 + 主语 表示"……也如此"，助动词 do 代替 like'
      }
    ]
  },
  {
    id: 'g018',
    title: '强调句',
    titleEn: 'Emphatic Sentences',
    order: 18,
    content: `强调句用于突出句子中的某个成分。

1. It is/was ... that/who ...（最常用的强调结构）
   将需要强调的部分放在 It is/was 和 that 之间：
   - 原句：I met her at the park yesterday.
   - 强调主语：It was I who met her at the park yesterday.
   - 强调宾语：It was her that I met at the park yesterday.
   - 强调地点：It was at the park that I met her yesterday.
   - 强调时间：It was yesterday that I met her at the park.

2. do/does/did + 动词原形（强调谓语动词）
   - I do like it! (我真的喜欢！)
   - She does work hard. (她确实很努力。)
   - He did come. (他确实来了。)

3. What 引导的强调句
   - What I need is a good rest. (我所需要的是好好休息。)`,
    examples: [
      {
        english: 'It was Tom who broke the window.',
        chinese: '是汤姆打破了窗户。',
        highlight: 'It was Tom who...',
        explanation: '强调结构 It was + 主语 (Tom) + who，强调"是Tom而不是别人"'
      },
      {
        english: 'I do believe you.',
        chinese: '我确实相信你。',
        highlight: 'do believe',
        explanation: '在动词原形前加 do/does/did 加强语气，相当于"确实/真的"'
      },
      {
        english: 'What she wants is a new phone.',
        chinese: '她想要的是一部新手机。',
        highlight: 'What she wants is...',
        explanation: 'What + 主语 + 动词 结构可以强调"所……的东西"'
      }
    ]
  }
];

// Get grammar points sorted by order
export function getGrammarSorted() {
  return [...grammarPoints].sort((a, b) => a.order - b.order);
}
