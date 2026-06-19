/**
 * Graded English sentences for learning, with S/V/O structure annotation.
 * Roughly ordered by difficulty: simple → complex.
 */

export const sentences = [
  // ── Level 1: Simple S+V+O (3-4 words) ──
  { id: 's001', english: 'I love you.', chinese: '我爱你。', structure: { S: 'I', V: 'love', O: 'you' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's002', english: 'She likes music.', chinese: '她喜欢音乐。', structure: { S: 'She', V: 'likes', O: 'music' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's003', english: 'He plays football.', chinese: '他踢足球。', structure: { S: 'He', V: 'plays', O: 'football' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's004', english: 'We eat dinner.', chinese: '我们吃晚饭。', structure: { S: 'We', V: 'eat', O: 'dinner' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's005', english: 'They watch TV.', chinese: '他们看电视。', structure: { S: 'They', V: 'watch', O: 'TV' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's006', english: 'My father drives a car.', chinese: '我父亲开一辆车。', structure: { S: 'My father', V: 'drives', O: 'a car' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's007', english: 'The cat catches mice.', chinese: '猫抓老鼠。', structure: { S: 'The cat', V: 'catches', O: 'mice' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's008', english: 'I read a book.', chinese: '我读一本书。', structure: { S: 'I', V: 'read', O: 'a book' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's009', english: 'Tom drinks water.', chinese: '汤姆喝水。', structure: { S: 'Tom', V: 'drinks', O: 'water' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's010', english: 'My mother cooks breakfast.', chinese: '我妈妈做早餐。', structure: { S: 'My mother', V: 'cooks', O: 'breakfast' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 2: S+V+O with adjectives ──
  { id: 's011', english: 'The little boy eats an apple.', chinese: '那个小男孩吃了一个苹果。', structure: { S: 'The little boy', V: 'eats', O: 'an apple' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's012', english: 'A beautiful girl sings a song.', chinese: '一个漂亮的女孩唱了一首歌。', structure: { S: 'A beautiful girl', V: 'sings', O: 'a song' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's013', english: 'The old man tells a story.', chinese: '那位老人讲了一个故事。', structure: { S: 'The old man', V: 'tells', O: 'a story' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's014', english: 'Happy children play games.', chinese: '快乐的孩子们玩游戏。', structure: { S: 'Happy children', V: 'play', O: 'games' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's015', english: 'The young teacher writes a letter.', chinese: '那位年轻的老师写了一封信。', structure: { S: 'The young teacher', V: 'writes', O: 'a letter' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's016', english: 'A big dog chases the ball.', chinese: '一只大狗追球。', structure: { S: 'A big dog', V: 'chases', O: 'the ball' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's017', english: 'The tall student answers questions.', chinese: '那个高个子学生回答问题。', structure: { S: 'The tall student', V: 'answers', O: 'questions' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's018', english: 'My best friend sends a message.', chinese: '我最好的朋友发了一条信息。', structure: { S: 'My best friend', V: 'sends', O: 'a message' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's019', english: 'The kind nurse helps patients.', chinese: '那位善良的护士帮助病人。', structure: { S: 'The kind nurse', V: 'helps', O: 'patients' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's020', english: 'A clever student solves problems.', chinese: '一个聪明的学生解决问题。', structure: { S: 'A clever student', V: 'solves', O: 'problems' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 3: S+V+O with time/place ──
  { id: 's021', english: 'I saw a movie yesterday.', chinese: '我昨天看了一部电影。', structure: { S: 'I', V: 'saw', O: 'a movie' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's022', english: 'She visits her grandma every week.', chinese: '她每周看望她的奶奶。', structure: { S: 'She', V: 'visits', O: 'her grandma' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's023', english: 'He bought a gift in the shop.', chinese: '他在商店里买了一份礼物。', structure: { S: 'He', V: 'bought', O: 'a gift' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's024', english: 'We had lunch at the restaurant.', chinese: '我们在餐厅吃了午饭。', structure: { S: 'We', V: 'had', O: 'lunch' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's025', english: 'The children are flying kites in the park.', chinese: '孩子们正在公园里放风筝。', structure: { S: 'The children', V: 'are flying', O: 'kites' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's026', english: 'I will finish my homework tonight.', chinese: '我今晚会完成我的作业。', structure: { S: 'I', V: 'will finish', O: 'my homework' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's027', english: 'My sister found her keys under the table.', chinese: '我姐姐在桌子下面找到了她的钥匙。', structure: { S: 'My sister', V: 'found', O: 'her keys' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's028', english: 'The students have learned English for three years.', chinese: '学生们已经学了三年英语了。', structure: { S: 'The students', V: 'have learned', O: 'English' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's029', english: 'Mr. Smith teaches math at our school.', chinese: '史密斯先生在我们学校教数学。', structure: { S: 'Mr. Smith', V: 'teaches', O: 'math' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's030', english: 'I met an old friend on the street.', chinese: '我在街上遇见了一位老朋友。', structure: { S: 'I', V: 'met', O: 'an old friend' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 4: Complex S+V+O ──
  { id: 's031', english: 'The teacher explained the grammar rule carefully.', chinese: '老师仔细地解释了语法规则。', structure: { S: 'The teacher', V: 'explained', O: 'the grammar rule' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's032', english: 'My mother bought me a birthday gift.', chinese: '我妈妈给我买了一份生日礼物。', structure: { S: 'My mother', V: 'bought', O: 'me a birthday gift' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's033', english: 'The police officer asked the driver many questions.', chinese: '警察问了司机很多问题。', structure: { S: 'The police officer', V: 'asked', O: 'the driver many questions' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's034', english: 'Everyone considers him a great leader.', chinese: '每个人都认为他是一位伟大的领导者。', structure: { S: 'Everyone', V: 'considers', O: 'him a great leader' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's035', english: 'The noise kept me awake all night.', chinese: '噪音让我整夜没睡。', structure: { S: 'The noise', V: 'kept', O: 'me awake' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's036', english: 'Scientists have discovered a new planet.', chinese: '科学家们发现了一颗新的行星。', structure: { S: 'Scientists', V: 'have discovered', O: 'a new planet' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's037', english: 'The famous writer published his first novel.', chinese: '那位著名作家出版了他的第一部小说。', structure: { S: 'The famous writer', V: 'published', O: 'his first novel' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's038', english: 'She finally made a difficult decision.', chinese: '她终于做了一个艰难的决定。', structure: { S: 'She', V: 'made', O: 'a difficult decision' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's039', english: 'The company will offer him a good job.', chinese: '公司将给他提供一份好工作。', structure: { S: 'The company', V: 'will offer', O: 'him a good job' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's040', english: 'My grandfather told us an interesting story.', chinese: '我爷爷给我们讲了一个有趣的故事。', structure: { S: 'My grandfather', V: 'told', O: 'us an interesting story' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 5: Longer sentences ──
  { id: 's041', english: 'The little girl drew a beautiful picture for her mother.', chinese: '那个小女孩为她妈妈画了一幅漂亮的画。', structure: { S: 'The little girl', V: 'drew', O: 'a beautiful picture' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's042', english: 'More and more people enjoy outdoor activities on weekends.', chinese: '越来越多的人周末享受户外活动。', structure: { S: 'More and more people', V: 'enjoy', O: 'outdoor activities' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's043', english: 'The warm sunlight filled the whole room with joy.', chinese: '温暖的阳光让整个房间充满喜悦。', structure: { S: 'The warm sunlight', V: 'filled', O: 'the whole room' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's044', english: 'Modern technology has changed our daily lives greatly.', chinese: '现代技术极大地改变了我们的日常生活。', structure: { S: 'Modern technology', V: 'has changed', O: 'our daily lives' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's045', english: 'My best friend sent me a lovely postcard from Paris.', chinese: '我最好的朋友从巴黎给我寄了一张可爱的明信片。', structure: { S: 'My best friend', V: 'sent', O: 'me a lovely postcard' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's046', english: 'The experienced doctor saved the patient\'s life successfully.', chinese: '那位经验丰富的医生成功地挽救了病人的生命。', structure: { S: 'The experienced doctor', V: 'saved', O: "the patient's life" }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's047', english: 'A strong earthquake destroyed many buildings in the city.', chinese: '一场强烈的地震摧毁了城市里的许多建筑。', structure: { S: 'A strong earthquake', V: 'destroyed', O: 'many buildings' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's048', english: 'The young volunteers cleaned up the beach last Saturday.', chinese: '年轻的志愿者们上周六清理了海滩。', structure: { S: 'The young volunteers', V: 'cleaned up', O: 'the beach' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's049', english: 'Our English teacher always encourages us to speak more.', chinese: '我们的英语老师总是鼓励我们多说。', structure: { S: 'Our English teacher', V: 'encourages', O: 'us to speak more' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's050', english: 'The diligent student completed her homework quickly.', chinese: '那个勤奋的学生很快完成了她的作业。', structure: { S: 'The diligent student', V: 'completed', O: 'her homework' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 6: S+V+O with clauses ──
  { id: 's051', english: 'I believe that honesty is the best policy.', chinese: '我相信诚实是最好的策略。', structure: { S: 'I', V: 'believe', O: 'that honesty is the best policy' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's052', english: 'She forgot where she had put the keys.', chinese: '她忘了她把钥匙放在哪里了。', structure: { S: 'She', V: 'forgot', O: 'where she had put the keys' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's053', english: 'The teacher told us why the sky is blue.', chinese: '老师告诉我们为什么天空是蓝色的。', structure: { S: 'The teacher', V: 'told', O: 'us why the sky is blue' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's054', english: 'He asked me if I could help him.', chinese: '他问我是否能帮他。', structure: { S: 'He', V: 'asked', O: 'me if I could help him' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's055', english: 'I don\'t know whether she will come or not.', chinese: '我不知道她是否会来。', structure: { S: 'I', V: 'don\'t know', O: 'whether she will come or not' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's056', english: 'The news that our team won surprised everyone.', chinese: '我们队获胜的消息让每个人都很惊讶。', structure: { S: 'The news that our team won', V: 'surprised', O: 'everyone' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's057', english: 'Can you tell me how I can get to the station?', chinese: '你能告诉我怎么去车站吗？', structure: { S: 'you', V: 'tell', O: 'me how I can get to the station' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's058', english: 'The reason why he was late is still unknown.', chinese: '他迟到的原因仍然未知。', structure: { S: 'The reason why he was late', V: 'is', O: 'still unknown' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's059', english: 'What she said at the meeting impressed everyone.', chinese: '她在会上说的话给每个人留下了深刻印象。', structure: { S: 'What she said at the meeting', V: 'impressed', O: 'everyone' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's060', english: 'I will always remember the day when we first met.', chinese: '我将永远记得我们初次见面的那一天。', structure: { S: 'I', V: 'will remember', O: 'the day when we first met' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 7: Compound/complex ──
  { id: 's061', english: 'Tom finished his work and then went home.', chinese: '汤姆完成了工作然后就回家了。', structure: { S: 'Tom', V: 'finished', O: 'his work' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's062', english: 'She opened the door and welcomed the guests warmly.', chinese: '她打开门热情地欢迎了客人。', structure: { S: 'She', V: 'opened', O: 'the door' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's063', english: 'Although it was raining, they still went out.', chinese: '虽然在下雨，他们还是出去了。', structure: { S: 'they', V: 'went out', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's064', english: 'If you study hard, you will pass the exam.', chinese: '如果你努力学习，你就会通过考试。', structure: { S: 'you', V: 'will pass', O: 'the exam' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's065', english: 'He was so tired that he fell asleep immediately.', chinese: '他太累了以至于立刻就睡着了。', structure: { S: 'He', V: 'fell asleep', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's066', english: 'I waited for her until the sun went down.', chinese: '我等她一直等到太阳下山。', structure: { S: 'I', V: 'waited for', O: 'her' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's067', english: 'Since you are here, let\'s start the meeting.', chinese: '既然你来了，我们开始开会吧。', structure: { S: 'we', V: 'start', O: 'the meeting' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's068', english: 'The more you practice, the better you will become.', chinese: '你练习得越多，你就会变得越好。', structure: { S: 'you', V: 'will become', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's069', english: 'He not only speaks English but also writes it well.', chinese: '他不仅会说英语，而且写得也很好。', structure: { S: 'He', V: 'speaks', O: 'English' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's070', english: 'What they need most is a good rest.', chinese: '他们最需要的是好好休息。', structure: { S: 'What they need most', V: 'is', O: 'a good rest' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 8: Advanced ──
  { id: 's071', english: 'It is important that everyone should follow the rules.', chinese: '重要的是每个人都应该遵守规则。', structure: { S: 'everyone', V: 'should follow', O: 'the rules' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's072', english: 'The book which I borrowed from the library is very interesting.', chinese: '我从图书馆借的那本书非常有趣。', structure: { S: 'The book which I borrowed from the library', V: 'is', O: 'very interesting' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's073', english: 'Never have I seen such a beautiful sunset.', chinese: '我从未见过如此美丽的日落。', structure: { S: 'I', V: 'have seen', O: 'such a beautiful sunset' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's074', english: 'Only by working together can we solve this problem.', chinese: '只有共同努力，我们才能解决这个问题。', structure: { S: 'we', V: 'can solve', O: 'this problem' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's075', english: 'It was not until midnight that he finally arrived.', chinese: '直到半夜，他才终于到达。', structure: { S: 'he', V: 'arrived', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's076', english: 'The more books you read, the wider your knowledge becomes.', chinese: '你读的书越多，你的知识面就越广。', structure: { S: 'you', V: 'read', O: 'books' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's077', english: 'Whether we will go depends on the weather.', chinese: '我们是否去取决于天气。', structure: { S: 'Whether we will go', V: 'depends on', O: 'the weather' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's078', english: 'He insisted that the plan should be carried out immediately.', chinese: '他坚持计划应该立即执行。', structure: { S: 'He', V: 'insisted', O: 'that the plan should be carried out immediately' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's079', english: 'So fast does light travel that we cannot imagine its speed.', chinese: '光传播得如此之快，以至于我们无法想象它的速度。', structure: { S: 'light', V: 'travel', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's080', english: 'It is generally believed that practice makes perfect.', chinese: '人们普遍认为熟能生巧。', structure: { S: 'practice', V: 'makes', O: 'perfect' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },

  // ── Level 9: More practical daily sentences ──
  { id: 's081', english: 'The movie was so boring that I fell asleep.', chinese: '电影太无聊了，以至于我睡着了。', structure: { S: 'I', V: 'fell asleep', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's082', english: 'Could you tell me where the nearest bank is?', chinese: '你能告诉我最近的银行在哪里吗？', structure: { S: 'you', V: 'tell', O: 'me where the nearest bank is' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's083', english: 'I wish I could fly like a bird.', chinese: '我希望我能像鸟一样飞翔。', structure: { S: 'I', V: 'could fly', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's084', english: 'She couldn\'t help laughing when she heard the joke.', chinese: '她听到那个笑话时忍不住笑了。', structure: { S: 'She', V: "couldn't help laughing", O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's085', english: 'It took me two hours to finish the report.', chinese: '我花了两个小时完成这份报告。', structure: { S: 'me', V: 'to finish', O: 'the report' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's086', english: 'You had better take an umbrella with you.', chinese: '你最好带一把伞。', structure: { S: 'You', V: 'take', O: 'an umbrella' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's087', english: 'I would rather stay at home than go out.', chinese: '我宁愿待在家里也不愿出去。', structure: { S: 'I', V: 'stay', O: 'at home' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's088', english: 'The more you learn, the more you realize how little you know.', chinese: '你学得越多，就越意识到自己知道的有多少。', structure: { S: 'you', V: 'learn', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's089', english: 'It is no use crying over spilt milk.', chinese: '覆水难收（打翻的牛奶哭也没用）。', structure: { S: 'crying', V: 'is', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's090', english: 'He is said to have been a famous actor.', chinese: '据说他曾是一位著名的演员。', structure: { S: 'He', V: 'is said to have been', O: 'a famous actor' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's091', english: 'There is no doubt that hard work leads to success.', chinese: '毫无疑问，努力会带来成功。', structure: { S: 'hard work', V: 'leads to', O: 'success' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's092', english: 'The food tasted so good that I ate too much.', chinese: '食物味道太好了，以至于我吃太多了。', structure: { S: 'I', V: 'ate', O: 'too much' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's093', english: 'As soon as she arrives, I will let you know.', chinese: '她一到我就告诉你。', structure: { S: 'I', V: 'will let', O: 'you know' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's094', english: 'I am looking forward to hearing from you soon.', chinese: '我期待很快收到你的来信。', structure: { S: 'I', V: 'am looking forward to', O: 'hearing from you' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's095', english: 'This is the most delicious cake I have ever eaten.', chinese: '这是我吃过的最美味的蛋糕。', structure: { S: 'I', V: 'have eaten', O: 'the most delicious cake' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's096', english: 'She suggested that we should take a different approach.', chinese: '她建议我们应该采取不同的方法。', structure: { S: 'She', V: 'suggested', O: 'that we should take a different approach' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's097', english: 'You cannot be too careful when crossing the road.', chinese: '过马路时，你再怎么小心也不为过。', structure: { S: 'You', V: 'crossing', O: 'the road' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's098', english: 'No matter how hard it is, I will never give up.', chinese: '不管有多难，我永远不会放弃。', structure: { S: 'I', V: 'will give up', O: '' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's099', english: 'The reason for his absence is that he is ill.', chinese: '他缺席的原因是他病了。', structure: { S: 'he', V: 'is', O: 'ill' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 },
  { id: 's100', english: 'I will never forget the moment when I first saw the ocean.', chinese: '我永远不会忘记我第一次看到大海的那一刻。', structure: { S: 'I', V: 'saw', O: 'the ocean' }, status: 'new', nextReview: null, interval: -1, mistakes: 0 }
];
