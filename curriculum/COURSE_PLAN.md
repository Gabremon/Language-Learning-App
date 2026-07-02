# Mandarin Chinese Course Plan
## Personal Duolingo-Like App — Full Curriculum Outline

**Version:** 1.0  
**Based on:** *High-Quality Chinese Course Plan for a Personal Duolingo-Like App.pdf*  
**Scope:** Starter band + HSK 1–4 equivalence (186 core lessons, 20 units)  
**Audience:** Adult English speakers · Simplified Chinese · Mainland Putonghua · Typing-first

---

## How to Read This Document

This is the **authoring blueprint** for the full course. Lessons are listed in **learning order** (top to bottom). Units are grouped into **HSK bands** — the official syllabus level where their vocabulary and characters belong.

| Symbol | Meaning |
|--------|---------|
| ✅ | Already implemented in the app (`src/data/course-content.ts`) |
| 📋 | Planned — not yet authored |
| 🔁 | Review / checkpoint lesson (no new vocabulary) |
| 🎓 | Band graduation exam |

**Vocabulary example:** 爸爸 (bàba, dad) appears in **HSK 1 → Foundation A → Lesson 5** because family vocabulary is HSK 1 scope.

---

## Course at a Glance

| HSK Band | Units | Lessons | Cumulative Vocab | Cumulative Characters | Est. Duration* |
|----------|-------|---------|------------------|----------------------|----------------|
| **Starter** | 2 | 12 | (included in HSK 1) | (included in HSK 1) | ~3 weeks |
| **HSK 1** | 4 | 32 | 300 words | 246 characters | ~7 weeks |
| **HSK 2** | 4 | 32 | 500 words | 371 characters | ~7 weeks |
| **HSK 3** | 5 | 50 | 1,000 words | 655 characters | ~12 weeks |
| **HSK 4** | 5 | 60 | 2,000 words | 1,096 characters | ~14 weeks |
| **TOTAL** | **20** | **186** | **2,000** | **1,096** | **~43 weeks** |

\*At the recommended pace of **5 new lessons/week** (4–5/week for HSK 3–4), plus 2 weekly review blocks. At a casual 3 lessons/week, the full path takes roughly **2–2.5 years**.

### Proficiency Targets (approximate)

| Band | ACTFL | CEFR |
|------|-------|------|
| Starter | Pre-Novice → Novice Low | — |
| HSK 1 | Novice Mid → early Novice High | early A1 |
| HSK 2 | Novice High | A1 → A2 bridge |
| HSK 3 | Intermediate Low | ~A2 |
| HSK 4 | Intermediate Mid | strong A2 → B1 bridge |

### Pacing Defaults

| Band | New lessons/week | Lesson length | Review cadence |
|------|------------------|---------------|----------------|
| Starter | 5 | 8–10 min | Daily micro-review + weekly checkpoint |
| HSK 1 | 5 | 8–12 min | Daily SRS + weekly review lesson |
| HSK 2 | 5 | 10–12 min | Daily SRS + biweekly cumulative review |
| HSK 3 | 4–5 | 12–14 min | Daily SRS + review every 4–5 lessons |
| HSK 4 | 4–5 | 12–15 min | Daily SRS + cumulative review every 4–5 lessons |

### New Words per Lesson

| Band | New lexical items per lesson |
|------|------------------------------|
| Starter / HSK 1 | 6–10 |
| HSK 2 | 8–12 |
| HSK 3 | 10–14 |
| HSK 4 | 12–16 |

---

## Lesson Architecture (every authored lesson)

Each lesson follows the same internal flow:

1. **Preview** — Can-do objective + tone/character preview  
2. **Input** — Dialogue or micro-reading (80–90% known-word coverage)  
3. **Guided practice** — Recognition exercises  
4. **Productive practice** — Typing / sentence building (70–80% known words)  
5. **Memory check** — SRS-eligible retrieval  
6. **Exit ticket** — 2–3 mixed-skill items  

Exercise types: listening, speaking (future), reading, typing, character, tone, grammar.

---

# ═══════════════════════════════════════════
# STARTER BAND
# Sound system, pinyin, tones, IME, survival phrases
# Lexical content drawn from HSK 1 inventory
# ═══════════════════════════════════════════

## Unit 1 — Starter A: Sounds & Greetings
**Band:** Starter  
**Communicative focus:** Pinyin, initials/finals, four tones, greetings, names  
**Grammar:** SVO basics; yes/no questions with 吗  
**Character focus:** 你 我 好 是 吗 叫 国  
**Key vocabulary:** pronouns, greetings, country/name forms  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 1 | `lesson-sa-1` | Meet Pinyin | ✅ | Pinyin system, syllable structure | No characters required yet |
| 2 | `lesson-sa-2` | Tone One and Tone Four | 📋 | Tone perception drills | High-frequency tone pairs |
| 3 | `lesson-sa-3` | Tone Two and Tone Three | 📋 | Tone perception drills | Third-tone sandhi preview |
| 4 | `lesson-sa-4` | Hello and Goodbye | ✅ | 你好 再见 谢谢 不客气 | Greeting formulas |
| 5 | `lesson-sa-5` | What's Your Name? | ✅ | 叫 什么 名字 我 你 | 叫…名字 pattern |
| 6 | `lesson-sa-6` | Greeting Review | 🔁 ✅ | (review) | Unit checkpoint: tone discrimination + greeting role-play |

---

## Unit 2 — Starter B: Numbers & Identity
**Band:** Starter  
**Communicative focus:** Numbers, classroom language, Chinese IME typing, simple identity  
**Grammar:** Measure word 个; basic negation 不  
**Character focus:** 人 口 女 子 学 生 老 师  
**Key vocabulary:** numbers, age, nationality, basic nouns  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 7 | `lesson-sb-1` | I Am from ___ | ✅ | 是 来自 国 中国 美国 | 我是… / 我来自… |
| 8 | `lesson-sb-2` | Are You a Student? | ✅ | 吗 学生 老师 不 | 吗-questions; 不 negation |
| 9 | `lesson-sb-3` | Numbers 1–5 | ✅ | 一 二 三 四 五 | Number + 个 |
| 10 | `lesson-sb-4` | Numbers 6–10 | ✅ | 六 七 八 九 十 | Counting objects |
| 11 | `lesson-sb-5` | Chinese Input Basics | 📋 | IME setup, pinyin-to-hanzi | Typing workflow |
| 12 | `lesson-sb-6` | Starter B Checkpoint | 🔁 📋 | (review) | 45-second self-introduction; includes 这/那/谁 from follow-up drills |

> **Starter band complete →** Learner can greet, introduce name/nationality, count to 10, type basic pinyin, and form simple 吗-questions.

---

# ═══════════════════════════════════════════
# HSK 1 BAND
# Personal info, daily objects, food, routine, simple transactions
# Target: 300 words · 246 characters
# ═══════════════════════════════════════════

## Unit 3 — Foundation A: Family & Work
**Band:** HSK 1  
**Communicative focus:** Self-introduction, family, occupations  
**Grammar:** 是 sentences; possessive 的  
**Character focus:** 爸 妈 朋 友 家 人 工 作  
**Key vocabulary:** family members, student/work roles  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 13 | `lesson-fa-1` | How Old Are You? | ✅ | 岁 几 多大 | 几岁 / 多大 |
| 14 | `lesson-fa-2` | One Teacher, Two Students | ✅ | 个 人 男 女 | 一个老师两个学生 |
| 15 | `lesson-fa-3` | This and That | ✅ | 这 那 谁 他 她 | Demonstratives |
| 16 | `lesson-fa-4` | Who Is He? | ✅ | 谁 他 她 同学 | Identity questions |
| 17 | `lesson-fa-5` | My Family | ✅ | **爸爸** 妈妈 家 的 | 我的爸爸 — possessive 的 |
| 18 | `lesson-fa-6` | Older Brother, Younger Sister | ✅ | 哥哥 姐姐 弟弟 妹妹 | Family hierarchy terms |
| 19 | `lesson-fa-7` | My Mom Works Here | ✅ | 工作 在这儿 医生 护士 | 是 + occupation; 在 |
| 20 | `lesson-fa-8` | Foundation A Checkpoint | 🔁 📋 | (review) | Family-tree speaking prompt |

---

## Unit 4 — Foundation B: Time & Routine
**Band:** HSK 1  
**Communicative focus:** Dates, time, days, daily routine  
**Grammar:** Time expressions; 在 for location/time  
**Character focus:** 年 月 日 点 分 时 间 起 床  
**Key vocabulary:** numbers (dates), daily routine verbs  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 21 | `lesson-fb-1` | Who Is in Your Family? | ✅ | 家人 朋友 有 | 我家有… |
| 22 | `lesson-fb-2` | What Time Is It? | ✅ | 点 分 现在 几 | 现在几点？ |
| 23 | `lesson-fb-3` | Today, Tomorrow, Yesterday | 📋 | 今天 明天 昨天 星期 | Calendar words |
| 24 | `lesson-fb-4` | Get Up and Go | ✅ | 起床 睡觉 上学 下班 | Daily routine verbs |
| 25 | `lesson-fb-5` | Morning Class | ✅ | 早上 中午 晚上 课 | Time-of-day phrases |
| 26 | `lesson-fb-6` | What's the Date? | 📋 | 年 月 日 号 生日 | 今天是几月几号？ |
| 27 | `lesson-fb-7` | My Daily Schedule | 📋 | 时候 从 到 每 | 从…到… time range |
| 28 | `lesson-fb-8` | Foundation B Checkpoint | 🔁 📋 | (review) | Short routine timeline task |

---

## Unit 5 — Foundation C: Food & Drink
**Band:** HSK 1  
**Communicative focus:** Food, drink, ordering, likes/dislikes  
**Grammar:** 想 / 要 / 喜欢; simple questions  
**Character focus:** 水 饭 茶 菜 吃 喝 包 饺  
**Key vocabulary:** meals, drinks, food, restaurant phrases  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 29 | `lesson-fc-1` | Tea or Water? | ✅ | 茶 水 咖啡 牛奶 | 你要茶还是水？ |
| 30 | `lesson-fc-2` | I Want Dumplings | ✅ | 要 饺子 包子 面条 | 我要… |
| 31 | `lesson-fc-3` | Do You Like Rice? | ✅ | 喜欢 米饭 菜 水果 | 你喜欢…吗？ |
| 32 | `lesson-fc-4` | At the Restaurant | ✅ | 请 菜单 服务员 买单 | Restaurant survival |
| 33 | `lesson-fc-5` | What's for Breakfast? | 📋 | 早饭 午饭 晚饭 鸡蛋 | Meal names |
| 34 | `lesson-fc-6` | Hungry and Thirsty | 📋 | 饿 渴 饱 想 | 我饿了 / 我想吃 |
| 35 | `lesson-fc-7` | Cooking at Home | 📋 | 做 好吃 多 少 | 我来做饭 |
| 36 | `lesson-fc-8` | Foundation C Checkpoint | 🔁 📋 | (review) | Audio-based ordering role-play |

---

## Unit 6 — Foundation D: Shopping & Places
**Band:** HSK 1  
**Communicative focus:** Shopping, places, transport, weather  
**Grammar:** 有 / 没有; 多少钱; 这 / 那  
**Character focus:** 钱 买 卖 店 车 天 气 冷 热  
**Key vocabulary:** stores, transport, prices, weather  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 37 | `lesson-fd-1` | How Much Is It? | ✅ | 钱 多少 块 贵 | 多少钱？ |
| 38 | `lesson-fd-2` | Too Expensive | 📋 | 便宜 太 了 便宜点儿 | Bargaining basics |
| 39 | `lesson-fd-3` | At the Supermarket | ✅ | 买 卖 超市 东西 | 我买这个 |
| 40 | `lesson-fd-4` | Which One Do You Want? | 📋 | 哪 个 些 还是 | Choice questions |
| 41 | `lesson-fd-5` | By Bus or Taxi | 📋 | 公共汽车 出租车 地铁 | Transport modes |
| 42 | `lesson-fd-6` | It's Cold Today | 📋 | 天气 冷 热 下雨 | Weather descriptions |
| 43 | `lesson-fd-7` | Where Is the Station? | 📋 | 站 路 走 怎么 | 怎么去？ |
| 44 | `lesson-fd-8` | HSK 1 Band Graduation | 🎓 📋 | (cumulative) | Self-intro + transaction + 300-word coverage exam |

> **HSK 1 complete →** Learner can introduce self, talk about family (爸爸, 妈妈…), tell time, order food, shop, ask directions, discuss weather, and type short phrases.

---

# ═══════════════════════════════════════════
# HSK 2 BAND
# Expanded daily life, directions, health, hobbies, comparisons, school/work
# Target: 500 words · 371 characters
# ═══════════════════════════════════════════

## Unit 7 — Daily Life A: Home & Directions
**Band:** HSK 2  
**Communicative focus:** Home, location, directions, nearby places  
**Grammar:** 里面 / 外面 / 上面 / 下面; locatives  
**Character focus:** 房 门 楼 路 旁 边 里 外 上 下  
**Key vocabulary:** furniture, rooms, city places  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 45 | `lesson-dla-1` | Where Is My Phone? | 📋 | 在 哪儿 手机 桌子 | 在 + location |
| 46 | `lesson-dla-2` | There Is a Store Nearby | 📋 | 有 没有 附近 旁边 | 有/没有 existence |
| 47 | `lesson-dla-3` | My Room | 📋 | 房间 床 椅子 窗户 | Room furniture |
| 48 | `lesson-dla-4` | On the Left, On the Right | 📋 | 左 右 前 后 | Direction words |
| 49 | `lesson-dla-5` | Inside and Outside | 📋 | 里面 外面 上面 下面 | Locative compounds |
| 50 | `lesson-dla-6` | Finding Your Way | 📋 | 一直 拐 离 远 | Direction complements |
| 51 | `lesson-dla-7` | Around the Neighborhood | 📋 | 公园 银行 医院 饭店 | City places |
| 52 | `lesson-dla-8` | Daily Life A Checkpoint | 🔁 📋 | (review) | Map-following listening task |

---

## Unit 8 — Daily Life B: Health & Hobbies
**Band:** HSK 2  
**Communicative focus:** Health, feelings, invitations, hobbies  
**Grammar:** 会 / 能 / 可以; comparisons with 比  
**Character focus:** 身 体 病 医 药 乐 球 快 慢  
**Key vocabulary:** body, sports, invitations, feelings  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 53 | `lesson-dlb-1` | I Feel Tired | 📋 | 累 高兴 难过 生气 | Emotion adjectives |
| 54 | `lesson-dlb-2` | Headache and Fever | 📋 | 头疼 发烧 感冒 身体 | Health complaints |
| 55 | `lesson-dlb-3` | See a Doctor | 📋 | 医院 医生 药 休息 | 看病 dialogue |
| 56 | `lesson-dlb-4` | Are You Free This Weekend? | 📋 | 有空 周末 邀请 一起 | Making invitations |
| 57 | `lesson-dlb-5` | Let's Play Basketball | 📋 | 打篮球 游泳 跑步 运动 | 会 / 想 + activity |
| 58 | `lesson-dlb-6` | Faster and Slower | 📋 | 比 快 慢 高 矮 | 比-comparisons |
| 59 | `lesson-dlb-7` | Can You Swim? | 📋 | 能 可以 不行 当然 | Ability with 能/可以 |
| 60 | `lesson-dlb-8` | Daily Life B Checkpoint | 🔁 📋 | (review) | Health + invitation role-play |

---

## Unit 9 — Daily Life C: Travel & Movement
**Band:** HSK 2  
**Communicative focus:** Travel planning, tickets, arriving/leaving  
**Grammar:** 来 / 去 compounds; direction complements  
**Character focus:** 机 票 站 进 出 回 到 离 近 远  
**Key vocabulary:** station, airport, travel logistics  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 61 | `lesson-dlc-1` | Buying a Ticket | 📋 | 票 火车 飞机 多少钱 | Ticket purchase |
| 62 | `lesson-dlc-2` | At the Airport | 📋 | 机场 登机 行李 护照 | Airport vocabulary |
| 63 | `lesson-dlc-3` | Arriving and Leaving | 📋 | 到 离开 进 出 | Direction verbs |
| 64 | `lesson-dlc-4` | Come Back Soon | 📋 | 回来 回去 来了 去了 | 来/去 complements |
| 65 | `lesson-dlc-5` | Near and Far | 📋 | 近 远 离 从…到… | Distance expressions |
| 66 | `lesson-dlc-6` | Let's Go Tomorrow | 📋 | 明天 出发 到达 路上 | Travel planning |
| 67 | `lesson-dlc-7` | A Short Trip | 📋 | 旅游 参观 照片 玩 | Travel narrative |
| 68 | `lesson-dlc-8` | Daily Life C Checkpoint | 🔁 📋 | (review) | Transit + ticket mini-task |

---

## Unit 10 — Daily Life D: School, Work & Opinion
**Band:** HSK 2  
**Communicative focus:** School/work basics, simple opinion, simple narratives  
**Grammar:** 因为…所以…; 虽然…但是…  
**Character focus:** 课 教 室 考 试 意 思 希 望 准 备  
**Key vocabulary:** class, office, simple abstract words  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 69 | `lesson-dld-1` | In the Classroom | 📋 | 教室 考试 作业 问题 | School vocabulary |
| 70 | `lesson-dld-2` | At the Office | 📋 | 办公室 同事 开会 忙 | Work vocabulary |
| 71 | `lesson-dld-3` | Because It's Raining | 📋 | 因为 所以 下雨 没带伞 | 因为…所以… |
| 72 | `lesson-dld-4` | Although I'm Busy | 📋 | 虽然 但是 努力 时间 | 虽然…但是… |
| 73 | `lesson-dld-5` | What's the Meaning? | 📋 | 意思 明白 懂 告诉 | Comprehension verbs |
| 74 | `lesson-dld-6` | I Hope So | 📋 | 希望 准备 应该 可能 | Modal expressions |
| 75 | `lesson-dld-7` | Getting Ready for the Test | 📋 | 复习 练习 考 成绩 | Study vocabulary |
| 76 | `lesson-dld-8` | HSK 2 Band Graduation | 🎓 📋 | (cumulative) | Directions + health + 500-word coverage exam |

> **HSK 2 complete →** Learner can navigate, discuss health/hobbies, plan travel, and express simple reasons and contrasts.

---

# ═══════════════════════════════════════════
# HSK 3 BAND
# Familiar-topic conversation, experience, plans, opinions, community, travel, services
# Target: 1,000 words · 655 characters
# ═══════════════════════════════════════════

## Unit 11 — Community A: Neighborhood & Services
**Band:** HSK 3  
**Communicative focus:** Neighborhood, services, asking for help  
**Grammar:** Existence/possession patterns; serial verbs  
**Character focus:** 社 区 服 务 帮 助 问 题 需 要  
**Key vocabulary:** rent, community, service encounters  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 77 | `lesson-ca-1` | Welcome to the Neighborhood | 📋 | 社区 邻居 环境 附近 | Community intro |
| 78 | `lesson-ca-2` | Renting an Apartment | 📋 | 租 房子 房租 合同 | Housing rental |
| 79 | `lesson-ca-3` | Paying the Bills | 📋 | 水费 电费 交钱 一共 | Utility payments |
| 80 | `lesson-ca-4` | Asking for Help | 📋 | 帮助 麻烦 请问 谢谢 | Service requests |
| 81 | `lesson-ca-5` | At the Service Desk | 📋 | 服务 窗口 排队 号码 | Service counter |
| 82 | `lesson-ca-6` | Reporting a Problem | 📋 | 问题 坏了 修理 换 | Problem reporting |
| 83 | `lesson-ca-7` | What Do You Need? | 📋 | 需要 应该 得 把 | 需要 + verb |
| 84 | `lesson-ca-8` | Community Services | 📋 | 快递 邮局 银行 超市 | Local services |
| 85 | `lesson-ca-9` | Helping a Neighbor | 📋 | 帮忙 借 还 客气 | Neighbor interactions |
| 86 | `lesson-ca-10` | Community A Checkpoint | 🔁 📋 | (review) | Service encounter role-play |

---

## Unit 12 — Community B: Experience & Past Events
**Band:** HSK 3  
**Communicative focus:** Completed experience, past events, changes  
**Grammar:** 了, 过, 着; result complements intro  
**Character focus:** 经 历 完 成 开 始 结 束 变 化  
**Key vocabulary:** travel, errands, experiences  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 87 | `lesson-cb-1` | What Did You Do? | 📋 | 昨天 做了 了 | Verb + 了 (completed) |
| 88 | `lesson-cb-2` | Have You Ever Been to Beijing? | 📋 | 过 去过 看过 吃过 | Verb + 过 (experience) |
| 89 | `lesson-cb-3` | Something Changed | 📋 | 变化 变成 原来 现在 | Change expressions |
| 90 | `lesson-cb-4` | It's Finished | 📋 | 完成 结束 完 做好 | Result complements |
| 91 | `lesson-cb-5` | Let's Get Started | 📋 | 开始 继续 停 再 | Verb aspect |
| 92 | `lesson-cb-6` | Travel Experiences | 📋 | 经历 参观 印象 难忘 | Narrating experiences |
| 93 | `lesson-cb-7` | Running Errands | 📋 | 办事 取 寄 办理 | Errand vocabulary |
| 94 | `lesson-cb-8` | Life in a New City | 📋 | 习惯 适应 刚 已经 | Adaptation narrative |
| 95 | `lesson-cb-9` | Telling a Short Story | 📋 | 然后 后来 突然 最后 | Narrative sequencing |
| 96 | `lesson-cb-10` | Community B Checkpoint | 🔁 📋 | (review) | Past-events narration task |

---

## Unit 13 — Community C: Plans & Arrangements
**Band:** HSK 3  
**Communicative focus:** Plans, intentions, arrangements  
**Grammar:** 要 / 打算 / 准备; future time framing  
**Character focus:** 计 划 安 排 约 定 准 时 迟 到  
**Key vocabulary:** scheduling, goals, appointments  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 97 | `lesson-cc-1` | My Weekend Plans | 📋 | 打算 计划 周末 安排 | 打算 + verb |
| 98 | `lesson-cc-2` | I'm Going to Study Abroad | 📋 | 准备 要 出国 留学 | 准备 + verb |
| 99 | `lesson-cc-3` | Making an Appointment | 📋 | 预约 约定 时间 地点 | Scheduling |
| 100 | `lesson-cc-4` | Don't Be Late | 📋 | 迟到 准时 准 点 | Punctuality |
| 101 | `lesson-cc-5` | Schedule Changes | 📋 | 改 取消 推迟 提前 | Changing plans |
| 102 | `lesson-cc-6` | Setting Goals | 📋 | 目标 希望 实现 努力 | Goal language |
| 103 | `lesson-cc-7` | This Week and Next Week | 📋 | 这周 下周 上个月 明年 | Extended time refs |
| 104 | `lesson-cc-8` | Arranging to Meet | 📋 | 见面 碰头 到时候 见 | Meeting arrangements |
| 105 | `lesson-cc-9` | What's on Your Calendar? | 📋 | 日历 空 忙 有空儿 | Availability |
| 106 | `lesson-cc-10` | Community C Checkpoint | 🔁 📋 | (review) | Plan-making dialogue |

---

## Unit 14 — Community D: Preferences & Reasons
**Band:** HSK 3  
**Communicative focus:** Preferences, reasons, soft opinion  
**Grammar:** 比较; 觉得; 因为 / 所以; 还是  
**Character focus:** 选 择 理 由 比 较 更 最 觉 得  
**Key vocabulary:** preferences, choices, reasons  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 107 | `lesson-cd-1` | Which One Do You Like? | 📋 | 选择 哪个 更 最好 | Comparative preference |
| 108 | `lesson-cd-2` | I Prefer Tea | 📋 | Prefer 还是 不如 | 还是 for choices |
| 109 | `lesson-cd-3` | Why Not? | 📋 | 理由 为什么 原因 | Giving reasons |
| 110 | `lesson-cd-4` | Comparing Two Cities | 📋 | 比较 更 最 一样 | 比 / 更 / 最 |
| 111 | `lesson-cd-5` | I Think You're Right | 📋 | 觉得 认为 同意 不同意 | Opinion with 觉得 |
| 112 | `lesson-cd-6` | Because of the Weather | 📋 | 由于 因此 所以 既然 | Formal connectors |
| 113 | `lesson-cd-7` | Making a Decision | 📋 | 决定 选 建议 意见 | Decision language |
| 114 | `lesson-cd-8` | Soft Disagreement | 📋 | 不过 可是 也许 可能 | Softening opinions |
| 115 | `lesson-cd-9` | Pros and Cons | 📋 | 优点 缺点 好处 坏处 | Evaluative language |
| 116 | `lesson-cd-10` | Community D Checkpoint | 🔁 📋 | (review) | Opinion + reason task |

---

## Unit 15 — Community E: Media, Rules & Culture
**Band:** HSK 3  
**Communicative focus:** Media, rules, public behavior, culture entry  
**Grammar:** Passive intro; imperative / polite softening  
**Character focus:** 规 则 比 赛 新 闻 活 动 文 化  
**Key vocabulary:** signs, rules, sports, events, culture  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 117 | `lesson-ce-1` | Reading the Rules | 📋 | 规则 规定 禁止 允许 | Rules vocabulary |
| 118 | `lesson-ce-2` | No Smoking Please | 📋 | 请 别 不要 必须 | Imperatives + softening |
| 119 | `lesson-ce-3` | Watching the News | 📋 | 新闻 报道 发生 消息 | Media vocabulary |
| 120 | `lesson-ce-4` | Community Activities | 📋 | 活动 参加 组织 举办 | Event participation |
| 121 | `lesson-ce-5` | Festival Traditions | 📋 | 节日 传统 习俗 庆祝 | Cultural festivals |
| 122 | `lesson-ce-6` | At a Sports Event | 📋 | 比赛 队 赢 输 加油 | Sports culture |
| 123 | `lesson-ce-7` | Understanding Signs | 📋 | 标志 注意 危险 出口 | Public signage |
| 124 | `lesson-ce-8` | Public Behavior | 📋 | 礼貌 素质 排队 让座 | Social norms |
| 125 | `lesson-ce-9` | Chinese Culture Basics | 📋 | 文化 历史 艺术 茶 | Culture overview |
| 126 | `lesson-ce-10` | HSK 3 Band Graduation | 🎓 📋 | (cumulative) | 1,000-word coverage + 80–120 char typed message |

> **HSK 3 complete →** Learner can discuss community life, narrate experiences, make plans, express opinions with reasons, and handle familiar service situations.

---

# ═══════════════════════════════════════════
# HSK 4 BAND
# Explanation, narration, comparison, problem-solving, housing, work, society, culture
# Target: 2,000 words · 1,096 characters
# ═══════════════════════════════════════════

## Unit 16 — Independent A: Housing & Home Life
**Band:** HSK 4  
**Communicative focus:** Housing, moving, repairs, utilities  
**Grammar:** 把 construction intro; resultative verbs  
**Character focus:** 房 租 搬 修 理 费 电 水 厨 房  
**Key vocabulary:** housing, contracts, repairs  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 127 | `lesson-ia-1` | Looking for an Apartment | 📋 | 租 房子 房间 楼层 | Housing search |
| 128 | `lesson-ia-2` | Signing a Lease | 📋 | 合同 签字 押金 租期 | Rental contracts |
| 129 | `lesson-ia-3` | Moving Day | 📋 | 搬 搬家 行李 邻居 | Moving vocabulary |
| 130 | `lesson-ia-4` | Something Is Broken | 📋 | 坏 修理 师傅 换 | Repair requests |
| 131 | `lesson-ia-5` | Calling a Repair Person | 📋 | 打电话 上门 检查 修好 | Service call dialogue |
| 132 | `lesson-ia-6` | Electricity and Water Bills | 📋 | 电费 水费 燃气 交费 | Utility management |
| 133 | `lesson-ia-7` | The Kitchen and Bathroom | 📋 | 厨房 卫生间 洗衣机 冰箱 | Home appliances |
| 134 | `lesson-ia-8` | Put It There | 📋 | 把 放 拿 收拾 | 把 construction |
| 135 | `lesson-ia-9` | Furnishing a Room | 📋 | 家具 沙发 灯 干净 | Home setup |
| 136 | `lesson-ia-10` | Talking to the Landlord | 📋 | 房东 租客 商量 意见 | Landlord dialogue |
| 137 | `lesson-ia-11` | Housing Problems | 📋 | 漏水 噪音 维修 解决 | Problem-solving |
| 138 | `lesson-ia-12` | Independent A Checkpoint | 🔁 📋 | (review) | Housing scenario task |

---

## Unit 17 — Independent B: Work & Career
**Band:** HSK 4  
**Communicative focus:** Work life, meetings, applications, feedback  
**Grammar:** Formal connectors; 把 / 被 expansions  
**Character focus:** 办 公 申 请 面 试 经 验 能 力  
**Key vocabulary:** office, CV, interview, meetings  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 139 | `lesson-ib-1` | Office Life | 📋 | 办公 环境 任务 效率 | Workplace culture |
| 140 | `lesson-ib-2` | Writing a Resume | 📋 | 简历 申请 学历 经验 | Job application |
| 141 | `lesson-ib-3` | The Interview | 📋 | 面试 自我介绍 优势 缺点 | Interview language |
| 142 | `lesson-ib-4` | Work Experience | 📋 | 经历 负责 合作 完成 | Describing experience |
| 143 | `lesson-ib-5` | Team Meetings | 📋 | 讨论 意见 建议 决定 | Meeting vocabulary |
| 144 | `lesson-ib-6` | Giving Feedback | 📋 | 反馈 评价 改进 表现 | Performance language |
| 145 | `lesson-ib-7` | Skills and Ability | 📋 | 能力 水平 提高 培训 | Competency language |
| 146 | `lesson-ib-8` | Formal Email Basics | 📋 | 邮件 附件 回复 通知 | Written workplace comms |
| 147 | `lesson-ib-9` | Workplace Challenges | 📋 | 压力 加班 辞职 升职 | Career challenges |
| 148 | `lesson-ib-10` | Passive Voice in Context | 📋 | 被 让 叫 由 | 被 construction |
| 149 | `lesson-ib-11` | Career Goals | 📋 | 目标 发展 机会 成功 | Career planning |
| 150 | `lesson-ib-12` | Independent B Checkpoint | 🔁 📋 | (review) | Interview simulation |

---

## Unit 18 — Independent C: Technology & Society
**Band:** HSK 4  
**Communicative focus:** Health, technology, study tools, society  
**Grammar:** Complements of degree; relative clauses intro  
**Character focus:** 网 络 技 术 系 统 数 据 健 康  
**Key vocabulary:** apps, devices, study/work tech  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 151 | `lesson-ic-1` | Health and Wellness | 📋 | 健康 锻炼 饮食 睡眠 | Wellness vocabulary |
| 152 | `lesson-ic-2` | Using Apps | 📋 | 手机 下载 安装 更新 | App vocabulary |
| 153 | `lesson-ic-3` | Internet and Networks | 📋 | 网络 上网 连接 信号 | Internet terms |
| 154 | `lesson-ic-4` | Technology in Daily Life | 📋 | 技术 科技 智能 方便 | Tech in society |
| 155 | `lesson-ic-5` | Study Tools | 📋 | 词典 翻译 录音 笔记 | Learning tools |
| 156 | `lesson-ic-6` | Data and Privacy | 📋 | 数据 信息 安全 密码 | Digital literacy |
| 157 | `lesson-ic-7` | Phone and Computer Problems | 📋 | 死机 重启 病毒 备份 | Tech troubleshooting |
| 158 | `lesson-ic-8` | Healthy Lifestyle Choices | 📋 | 规律 熬夜 压力 放松 | Health advice |
| 159 | `lesson-ic-9` | Social Media | 📋 | 分享 关注 评论 直播 | Social media terms |
| 160 | `lesson-ic-10` | Relative Clauses | 📋 | 的 (relative) …的 + noun | 我认识的人 |
| 161 | `lesson-ic-11` | Technology and Society | 📋 | 影响 变化 进步 挑战 | Society + tech |
| 162 | `lesson-ic-12` | Independent C Checkpoint | 🔁 📋 | (review) | Tech + health scenario |

---

## Unit 19 — Independent D: Narration & Problem-Solving
**Band:** HSK 4  
**Communicative focus:** Storytelling, explanation, comparison, problem-solving  
**Grammar:** Sequence markers; cause-effect; conditional forms  
**Character focus:** 原 因 结 果 影 响 办 法 解 决  
**Key vocabulary:** accidents, decisions, explanations  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 163 | `lesson-id-1` | Telling What Happened | 📋 | 发生 过程 细节 经过 | Event narration |
| 164 | `lesson-id-2` | Explaining the Reason | 📋 | 原因 为什么 导致 造成 | Causal explanation |
| 165 | `lesson-id-3` | Cause and Effect | 📋 | 结果 影响 因此 于是 | Cause-effect chains |
| 166 | `lesson-id-4` | Solving a Problem | 📋 | 办法 解决 处理 应对 | Problem-solving |
| 167 | `lesson-id-5` | Making a Decision | 📋 | 决定 考虑 权衡 选择 | Decision narrative |
| 168 | `lesson-id-6` | Accident Report | 📋 | 事故 受伤 报警 责任 | Emergency narrative |
| 169 | `lesson-id-7` | Comparing Solutions | 📋 | 方案 优点 缺点 不如 | Solution comparison |
| 170 | `lesson-id-8` | First This, Then That | 📋 | 首先 然后 接着 最后 | Sequence markers |
| 171 | `lesson-id-9` | If… Then… | 📋 | 如果 就 要是 的话 | Conditional forms |
| 172 | `lesson-id-10` | Explaining a Mistake | 📋 | 误会 道歉 解释 原谅 | Error recovery |
| 173 | `lesson-id-11` | Persuading Someone | 📋 | 说服 建议 不如 干脆 | Persuasion language |
| 174 | `lesson-id-12` | Independent D Checkpoint | 🔁 📋 | (review) | Problem-solving narrative |

---

## Unit 20 — Independent E: Culture, Travel & Integration
**Band:** HSK 4  
**Communicative focus:** Culture, travel, media-lite, integrated tasks  
**Grammar:** Discourse connectors; opinion support; summarizing  
**Character focus:** 历 史 传 统 礼 节 旅 行 安 全  
**Key vocabulary:** history-lite, customs, news-lite, travel contingencies  

| # | Lesson ID | Title | Status | New vocab themes | Grammar / notes |
|---|-----------|-------|--------|------------------|-----------------|
| 175 | `lesson-ie-1` | Chinese History Lite | 📋 | 历史 朝代 古代 现代 | Historical overview |
| 176 | `lesson-ie-2` | Traditions and Customs | 📋 | 传统 礼节 礼貌 尊重 | Cultural customs |
| 177 | `lesson-ie-3` | Travel Etiquette and Safety | 📋 | 安全 注意 保管 丢失 | Travel safety |
| 178 | `lesson-ie-4` | News and Media Lite | 📋 | 报道 消息 评论 观点 | Media comprehension |
| 179 | `lesson-ie-5` | Summarizing Information | 📋 | 总结 概括 主要 总之 | Summary language |
| 180 | `lesson-ie-6` | Discourse Connectors | 📋 | 然而 此外 另外 不仅…而且 | Advanced connectors |
| 181 | `lesson-ie-7` | Integrated Scenario: The Full Trip | 📋 | (mixed) | Multi-skill travel task |
| 182 | `lesson-ie-8` | Integrated Scenario: Life Abroad | 📋 | (mixed) | Multi-skill daily-life task |
| 183 | `lesson-ie-9` | HSK 4 Cumulative Review | 🔁 📋 | (review) | Mixed-skill review |
| 184 | `lesson-ie-10` | HSK 4 Integrated Exam | 📋 | (cumulative) | Listening + reading + production |
| 185 | `lesson-ie-11` | HSK 4 Final Review | 🔁 📋 | (review) | Full-band retrieval practice |
| 186 | `lesson-ie-12` | HSK 4 Graduation | 🎓 📋 | (cumulative) | 2,000-word coverage + 180–250 char response |

---

# Appendix A: HSK Vocabulary Placement Guide

Words are placed by **HSK band**, then ordered by **frequency and communicative utility** within each unit. Examples:

| Word | Pinyin | English | HSK Band | Unit | Lesson |
|------|--------|---------|----------|------|--------|
| 爸爸 | bàba | dad | HSK 1 | Foundation A | Lesson 17 — My Family |
| 妈妈 | māma | mom | HSK 1 | Foundation A | My Family |
| 老师 | lǎoshī | teacher | HSK 1 | Starter B | One Teacher, Two Students |
| 喜欢 | xǐhuān | to like | HSK 1 | Foundation C | Do You Like Rice? |
| 比 | bǐ | to compare | HSK 2 | Daily Life B | Faster and Slower |
| 了 | le | completed action | HSK 3 | Community B | What Did You Do? |
| 把 | bǎ | disposal marker | HSK 4 | Independent A | Put It There |

Full per-lesson vocabulary whitelists will be defined when each lesson is authored (in lesson metadata per the PDF schema).

---

# Appendix B: Optional Side Tracks

The core path above is the **required Core Path**. Two optional branches reconverge at checkpoint nodes:

| Track | Purpose | When available |
|-------|---------|----------------|
| **Hanzi Track** | Extra radical analysis, stroke order, handwriting for 200–300 high-value characters | From HSK 1 onward |
| **Challenge Track** | Freer production, cultural mini-projects, lower scaffolding | From HSK 2 onward |

---

# Appendix C: Implementation Status

| HSK Band | Units | Lessons planned | Lessons implemented |
|----------|-------|-----------------|---------------------|
| Starter | 2 | 12 | 10 |
| HSK 1 | 4 | 32 | 24 |
| HSK 2 | 4 | 32 | 0 |
| HSK 3 | 5 | 50 | 0 |
| HSK 4 | 5 | 60 | 0 |

**Currently in app:** 34 lessons across Units 1–6 (Starter A/B + Foundation A–D partial). This plan expands HSK 1 units to 8 lessons each and adds tone/IME lessons to Starter per the PDF design.

---

# Appendix D: Authoring Rollout Order

Recommended production sequence (from PDF rollout plan):

1. ✅ Lesson schema + review engine (app foundation)
2. 🔄 Starter + HSK 1 authoring (in progress — 34/48 lessons)
3. 📋 Core human audio + tone minimal-pair bank
4. 📋 Placement test + analytics
5. 📋 HSK 2 authoring
6. 📋 Video/story assets
7. 📋 Pilot testing + difficulty tuning
8. 📋 HSK 3 authoring
9. 📋 HSK 4 authoring
10. 📋 Graduation calibration + retention tuning

---

# Appendix E: Lesson Metadata Schema (for future authoring)

Each lesson will be stored as structured metadata:

```
lesson_id, band, unit, path_position, can_do_targets, hsk_scope,
vocab_new, vocab_review, characters_new, characters_review,
grammar_tags, tone_focus, known_word_ratio, exercise_mix,
media_refs, accepted_answers, error_model, review_policy
```

---

*Next step: Author individual lessons starting with remaining Starter + HSK 1 content, then proceed band by band.*
