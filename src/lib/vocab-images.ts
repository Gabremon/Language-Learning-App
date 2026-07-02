/**
 * Visual associations for vocabulary — emoji for quick recognition,
 * SVG paths in /public/vocab/ for key illustrated words.
 */
export const VOCAB_EMOJI: Record<string, string> = {
  "v-wo": "🙋",
  "v-ni": "👆",
  "v-ta-he": "👨",
  "v-ta-she": "👩",
  "v-shi": "✅",
  "v-hao": "👍",
  "v-ma": "❓",
  "v-bu": "🚫",
  "v-jiao": "📛",
  "v-guo": "🌍",
  "v-ren": "🧑",
  "v-kou": "👄",
  "v-nv": "♀️",
  "v-zi": "👶",
  "v-xuesheng": "🎓",
  "v-laoshi": "👩‍🏫",
  "v-tongxue": "🤝",
  "v-xuexiao": "🏫",
  "v-yi": "1️⃣",
  "v-er": "2️⃣",
  "v-san": "3️⃣",
  "v-si": "4️⃣",
  "v-wu": "5️⃣",
  "v-liu": "6️⃣",
  "v-qi": "7️⃣",
  "v-ba": "8️⃣",
  "v-jiu": "9️⃣",
  "v-shi-num": "🔟",
  "v-zhongguo": "🇨🇳",
  "v-meiguo": "🇺🇸",
  "v-zhongguoren": "🧑‍🤝‍🧑",
  "v-baba": "👨",
  "v-mama": "👩",
  "v-gege": "👦",
  "v-meimei": "👧",
  "v-pengyou": "👫",
  "v-jiaren": "👨‍👩‍👧‍👦",
  "v-gongzuo": "💼",
  "v-jia": "🏠",
  "v-de": "🔗",
  "v-nian": "📅",
  "v-yue": "🗓️",
  "v-ri": "☀️",
  "v-dian": "🕐",
  "v-fen": "⏱️",
  "v-shijian": "⏰",
  "v-qichuang": "🛏️",
  "v-shui": "💧",
  "v-cha": "🍵",
  "v-mifan": "🍚",
  "v-miantiao": "🍜",
  "v-fan": "🍚",
  "v-cai": "🥬",
  "v-chi": "🍽️",
  "v-he": "🥤",
  "v-bao": "🥟",
  "v-jiao-dumpling": "🥟",
  "v-xihuan": "❤️",
  "v-buxihuan": "💔",
  "v-qing": "🙏",
  "v-yao": "🙋",
  "v-qian": "💰",
  "v-mai": "🛒",
  "v-dian-shop": "🏪",
  "v-che": "🚗",
  "v-tianqi": "🌤️",
  "v-leng": "🥶",
  "v-re": "🔥",
  "v-zhe": "👉",
  "v-na": "👈",
  "v-hen": "💯",
  "v-da": "🐘",
  "v-xiao": "🐜",
  "v-you": "✔️",
  "v-meiyou": "❌",
  "v-duoshao": "💲",
  "v-nali": "📍",
  "v-zai": "📌",
};

/** SVG illustrations for high-value visual vocabulary. */
export const VOCAB_SVG: Record<string, string> = {
  "v-shui": "/vocab/water.svg",
  "v-cha": "/vocab/tea.svg",
  "v-mifan": "/vocab/rice.svg",
  "v-mama": "/vocab/mom.svg",
  "v-baba": "/vocab/dad.svg",
  "v-jia": "/vocab/home.svg",
  "v-xuexiao": "/vocab/school.svg",
  "v-zhongguo": "/vocab/china.svg",
  "v-che": "/vocab/car.svg",
  "v-qian": "/vocab/money.svg",
};

export function getVocabImageUrl(vocabId: string): string | undefined {
  return VOCAB_SVG[vocabId];
}

export function getVocabEmoji(vocabId: string): string | undefined {
  return VOCAB_EMOJI[vocabId];
}

export function getVocabVisual(vocabId: string): { emoji?: string; imageUrl?: string } {
  return {
    emoji: VOCAB_EMOJI[vocabId],
    imageUrl: VOCAB_SVG[vocabId],
  };
}
