/** Unit definitions for HSK 2–6 bands (from curriculum/COURSE_PLAN.md + HSK 5/6 extensions). */

export interface HskUnitPlan {
  id: string;
  hskLevel: 2 | 3 | 4 | 5 | 6;
  title: string;
  orderIndex: number;
  keywords: string[];
  isFinal?: boolean;
}

export const HSK2_UNITS: HskUnitPlan[] = [
  {
    id: "unit-h2-dla",
    hskLevel: 2,
    title: "Home & Directions",
    orderIndex: 22,
    keywords: [
      "room", "home", "house", "bed", "door", "window", "chair", "table", "desk", "phone",
      "left", "right", "front", "back", "inside", "outside", "above", "below", "near", "far",
      "direction", "location", "park", "bank", "hospital", "restaurant", "building", "floor",
      "road", "street", "neighbor", "furniture", "kitchen", "bathroom", "wall", "key",
    ],
  },
  {
    id: "unit-h2-dlb",
    hskLevel: 2,
    title: "Health & Hobbies",
    orderIndex: 23,
    keywords: [
      "tired", "happy", "sad", "angry", "feel", "emotion", "headache", "fever", "cold", "sick",
      "health", "body", "doctor", "medicine", "rest", "weekend", "invite", "together", "free",
      "basketball", "swim", "run", "sport", "exercise", "play", "music", "sing", "dance",
      "fast", "slow", "tall", "short", "compare", "than", "ability", "can", "able",
    ],
  },
  {
    id: "unit-h2-dlc",
    hskLevel: 2,
    title: "Travel & Movement",
    orderIndex: 24,
    keywords: [
      "ticket", "train", "plane", "airport", "passport", "luggage", "bag", "station",
      "arrive", "leave", "enter", "exit", "return", "come", "go", "travel", "trip",
      "distance", "near", "far", "from", "to", "road", "way", "visit", "photo", "tour",
      "depart", "reach", "journey", "bus", "subway", "taxi", "drive", "walk",
    ],
  },
  {
    id: "unit-h2-dld",
    hskLevel: 2,
    title: "School, Work & Opinion",
    orderIndex: 25,
    keywords: [
      "classroom", "class", "exam", "test", "homework", "question", "answer", "study",
      "office", "colleague", "meeting", "busy", "work", "job", "because", "so", "although",
      "but", "meaning", "understand", "know", "tell", "hope", "prepare", "should", "maybe",
      "review", "practice", "score", "grade", "effort", "time", "reason", "think", "believe",
    ],
    isFinal: true,
  },
];

export const HSK3_UNITS: HskUnitPlan[] = [
  {
    id: "unit-h3-ca",
    hskLevel: 3,
    title: "Neighborhood & Services",
    orderIndex: 26,
    keywords: [
      "community", "neighbor", "environment", "rent", "apartment", "house", "contract",
      "bill", "pay", "utility", "water", "electric", "help", "trouble", "please", "service",
      "window", "queue", "number", "problem", "broken", "repair", "replace", "need", "should",
      "express", "post", "bank", "supermarket", "borrow", "return", "polite", "kind",
    ],
  },
  {
    id: "unit-h3-cb",
    hskLevel: 3,
    title: "Experience & Past Events",
    orderIndex: 27,
    keywords: [
      "yesterday", "did", "done", "ever", "been", "experience", "change", "become", "original",
      "finish", "complete", "end", "start", "continue", "stop", "again", "travel", "visit",
      "impression", "unforgettable", "errand", "pick up", "send", "handle", "habit", "adapt",
      "just", "already", "then", "later", "suddenly", "finally", "story", "past", "before",
    ],
  },
  {
    id: "unit-h3-cc",
    hskLevel: 3,
    title: "Plans & Arrangements",
    orderIndex: 28,
    keywords: [
      "plan", "intend", "weekend", "arrange", "prepare", "abroad", "study", "appointment",
      "schedule", "late", "on time", "punctual", "change", "cancel", "postpone", "advance",
      "goal", "achieve", "effort", "week", "month", "year", "meet", "calendar", "free", "busy",
    ],
  },
  {
    id: "unit-h3-cd",
    hskLevel: 3,
    title: "Preferences & Reasons",
    orderIndex: 29,
    keywords: [
      "choose", "select", "prefer", "better", "best", "rather", "reason", "why", "cause",
      "compare", "same", "think", "believe", "agree", "disagree", "therefore", "since",
      "decide", "suggest", "opinion", "however", "but", "maybe", "perhaps", "advantage",
      "disadvantage", "benefit", "drawback", "pro", "con",
    ],
  },
  {
    id: "unit-h3-ce",
    hskLevel: 3,
    title: "Media, Rules & Culture",
    orderIndex: 30,
    keywords: [
      "rule", "regulation", "forbid", "allow", "must", "please", "don't", "news", "report",
      "happen", "message", "activity", "join", "organize", "festival", "tradition", "custom",
      "celebrate", "match", "team", "win", "lose", "cheer", "sign", "danger", "exit",
      "polite", "queue", "culture", "history", "art", "tea", "behavior", "public",
    ],
    isFinal: true,
  },
];

export const HSK4_UNITS: HskUnitPlan[] = [
  {
    id: "unit-h4-ia",
    hskLevel: 4,
    title: "Housing & Home Life",
    orderIndex: 31,
    keywords: [
      "rent", "apartment", "room", "floor", "contract", "sign", "deposit", "lease", "move",
      "neighbor", "broken", "repair", "fix", "electricity", "water", "gas", "bill", "pay",
      "kitchen", "bathroom", "washer", "fridge", "furniture", "sofa", "lamp", "clean",
      "landlord", "tenant", "discuss", "leak", "noise", "solve", "put", "place", "take",
    ],
  },
  {
    id: "unit-h4-ib",
    hskLevel: 4,
    title: "Work & Career",
    orderIndex: 32,
    keywords: [
      "office", "environment", "task", "efficiency", "resume", "apply", "education",
      "interview", "advantage", "disadvantage", "experience", "responsible", "cooperate",
      "meeting", "discuss", "suggest", "decide", "feedback", "evaluate", "improve",
      "performance", "ability", "level", "improve", "train", "email", "attach", "reply",
      "pressure", "overtime", "resign", "promote", "passive", "career", "develop", "opportunity",
    ],
  },
  {
    id: "unit-h4-ic",
    hskLevel: 4,
    title: "Technology & Society",
    orderIndex: 33,
    keywords: [
      "health", "exercise", "diet", "sleep", "app", "download", "install", "update",
      "internet", "network", "connect", "signal", "technology", "smart", "convenient",
      "dictionary", "translate", "record", "note", "data", "information", "security",
      "password", "crash", "restart", "virus", "backup", "regular", "stay up", "stress",
      "relax", "share", "follow", "comment", "live", "influence", "progress", "challenge",
    ],
  },
  {
    id: "unit-h4-id",
    hskLevel: 4,
    title: "Narration & Problem-Solving",
    orderIndex: 34,
    keywords: [
      "happen", "process", "detail", "reason", "cause", "result", "effect", "solve",
      "method", "handle", "decide", "consider", "accident", "injure", "police", "responsibility",
      "solution", "compare", "first", "then", "next", "finally", "if", "mistake", "apologize",
      "explain", "forgive", "persuade", "advise", "might as well",
    ],
  },
  {
    id: "unit-h4-ie",
    hskLevel: 4,
    title: "Culture, Travel & Integration",
    orderIndex: 35,
    keywords: [
      "history", "dynasty", "ancient", "modern", "tradition", "etiquette", "polite", "respect",
      "safety", "careful", "keep", "lose", "report", "news", "comment", "view", "summarize",
      "main", "however", "besides", "not only", "trip", "travel", "abroad", "life", "culture",
    ],
    isFinal: true,
  },
];

export const HSK5_UNITS: HskUnitPlan[] = [
  {
    id: "unit-h5-aa",
    hskLevel: 5,
    title: "Business & Economics",
    orderIndex: 36,
    keywords: [
      "business", "company", "market", "economy", "trade", "invest", "profit", "loss",
      "finance", "stock", "industry", "manage", "negotiate", "contract", "client",
      "compete", "strategy", "budget", "tax", "income", "expense", "commercial", "enterprise",
    ],
  },
  {
    id: "unit-h5-ab",
    hskLevel: 5,
    title: "Society & Politics",
    orderIndex: 37,
    keywords: [
      "society", "politics", "government", "policy", "law", "right", "duty", "citizen",
      "democracy", "election", "reform", "welfare", "justice", "freedom", "security",
      "conflict", "peace", "war", "army", "diplomacy", "international", "global",
    ],
  },
  {
    id: "unit-h5-ac",
    hskLevel: 5,
    title: "Science & Environment",
    orderIndex: 38,
    keywords: [
      "science", "research", "experiment", "discover", "theory", "technology", "innovation",
      "environment", "pollution", "climate", "energy", "resource", "protect", "nature",
      "ecology", "species", "sustainable", "recycle", "emission", "disaster", "earthquake",
    ],
  },
  {
    id: "unit-h5-ad",
    hskLevel: 5,
    title: "Arts & Literature",
    orderIndex: 39,
    keywords: [
      "art", "literature", "poetry", "novel", "drama", "film", "music", "painting",
      "sculpture", "performance", "creative", "aesthetic", "style", "masterpiece", "author",
      "character", "plot", "theme", "inspire", "express", "culture", "heritage", "classic",
    ],
  },
  {
    id: "unit-h5-ae",
    hskLevel: 5,
    title: "Advanced Communication",
    orderIndex: 40,
    keywords: [
      "debate", "argue", "persuade", "emphasize", "clarify", "summarize", "conclude",
      "formal", "informal", "rhetoric", "tone", "imply", "sarcasm", "irony", "metaphor",
      "abstract", "concept", "principle", "logic", "evidence", "assume", "conclude",
    ],
    isFinal: true,
  },
];

export const HSK6_UNITS: HskUnitPlan[] = [
  {
    id: "unit-h6-aa",
    hskLevel: 6,
    title: "Academic & Research",
    orderIndex: 41,
    keywords: [
      "academic", "scholar", "thesis", "dissertation", "hypothesis", "methodology",
      "analysis", "statistics", "publish", "journal", "conference", "peer", "citation",
      "discipline", "specialize", "profound", "rigorous", "empirical", "theoretical",
    ],
  },
  {
    id: "unit-h6-ab",
    hskLevel: 6,
    title: "Law & Administration",
    orderIndex: 42,
    keywords: [
      "legal", "legislation", "regulation", "court", "judge", "lawyer", "trial", "verdict",
      "penalty", "crime", "violate", "comply", "administration", "bureaucracy", "authority",
      "license", "permit", "prosecute", "defend", "constitutional", "jurisdiction",
    ],
  },
  {
    id: "unit-h6-ac",
    hskLevel: 6,
    title: "Media & Journalism",
    orderIndex: 43,
    keywords: [
      "journalism", "reporter", "editor", "headline", "broadcast", "interview", "investigate",
      "expose", "censor", "propaganda", "publicity", "rumor", "source", "verify", "bias",
      "coverage", "documentary", "editorial", "circulation", "subscriber",
    ],
  },
  {
    id: "unit-h6-ad",
    hskLevel: 6,
    title: "Philosophy & Abstract Thought",
    orderIndex: 44,
    keywords: [
      "philosophy", "ethics", "morality", "virtue", "wisdom", "existence", "consciousness",
      "perception", "essence", "phenomenon", "dialectic", "paradox", "transcend", "metaphysics",
      "ideology", "doctrine", "enlighten", "contemplate", "profound", "abstract",
    ],
  },
  {
    id: "unit-h6-ae",
    hskLevel: 6,
    title: "HSK 6 Mastery",
    orderIndex: 45,
    keywords: [
      "integrate", "synthesize", "comprehensive", "proficient", "fluent", "mastery",
      "graduation", "achievement", "excellence", "advanced", "sophisticated", "nuance",
      "eloquent", "articulate", "discourse", "rhetoric", "culminate",
    ],
    isFinal: true,
  },
];

export const ALL_HSK_UNIT_PLANS: HskUnitPlan[] = [
  ...HSK2_UNITS,
  ...HSK3_UNITS,
  ...HSK4_UNITS,
  ...HSK5_UNITS,
  ...HSK6_UNITS,
];

export const WORDS_PER_LESSON: Record<number, number> = {
  2: 8,
  3: 9,
  4: 10,
  5: 10,
  6: 10,
};

/** Max lessons per unit on the course map (includes optional unit review). */
export const MAX_LESSONS_PER_UNIT = 12;
