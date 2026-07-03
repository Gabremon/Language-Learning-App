const PREFERRED_ZH_VOICE_NAMES = [
  "Tingting",
  "Sinji",
  "Meijia",
  "Google 普通话",
  "Microsoft Yaoyao",
  "Microsoft Huihui",
  "Lili",
  "Chinese",
];

export interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

let cachedVoices: SpeechSynthesisVoice[] | null = null;
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;
/** Bumps on each new speak request so stale delayed callbacks are ignored. */
let speakGeneration = 0;

function pickMandarinVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const zhVoices = voices.filter(
    (v) => v.lang.startsWith("zh-CN") || v.lang.startsWith("zh-Hans") || v.lang.startsWith("zh")
  );
  if (zhVoices.length === 0) return undefined;

  for (const name of PREFERRED_ZH_VOICE_NAMES) {
    const match = zhVoices.find((v) => v.name.includes(name));
    if (match) return match;
  }

  return zhVoices.find((v) => v.lang.startsWith("zh-CN")) ?? zhVoices[0];
}

function ensureVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }

  if (cachedVoices && cachedVoices.length > 0) {
    return Promise.resolve(cachedVoices);
  }

  if (!voicesReady) {
    voicesReady = new Promise((resolve) => {
      const synth = window.speechSynthesis;

      const load = () => {
        const voices = synth.getVoices();
        if (voices.length > 0) {
          cachedVoices = voices;
          resolve(voices);
          return true;
        }
        return false;
      };

      if (load()) return;

      const onVoicesChanged = () => {
        if (load()) {
          synth.removeEventListener("voiceschanged", onVoicesChanged);
        }
      };

      synth.addEventListener("voiceschanged", onVoicesChanged);
      // Some browsers never fire voiceschanged; resolve with whatever we have.
      window.setTimeout(() => {
        synth.removeEventListener("voiceschanged", onVoicesChanged);
        const voices = synth.getVoices();
        cachedVoices = voices.length > 0 ? voices : null;
        resolve(voices);
      }, 300);
    });
  }

  return voicesReady;
}

/**
 * Speak Mandarin text via the browser TTS engine.
 * Handles Chrome/Safari quirks: cancel+speak race, paused queue, async voice loading.
 */
export function speakMandarin(text: string, options: SpeakOptions = {}): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const trimmed = text.trim();
  if (!trimmed) return;

  const generation = ++speakGeneration;
  const synth = window.speechSynthesis;

  synth.cancel();

  const doSpeak = async () => {
    if (generation !== speakGeneration) return;

    if (synth.paused) synth.resume();

    const voices = await ensureVoices();
    if (generation !== speakGeneration) return;

    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = "zh-CN";
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    const zhVoice = pickMandarinVoice(voices);
    if (zhVoice) utterance.voice = zhVoice;

    utterance.onstart = () => {
      if (generation === speakGeneration) options.onStart?.();
    };
    utterance.onend = () => {
      if (generation === speakGeneration) options.onEnd?.();
    };
    utterance.onerror = () => {
      if (generation === speakGeneration) options.onError?.();
    };

    synth.speak(utterance);

    // Chrome sometimes leaves the queue paused after cancel/speak.
    window.setTimeout(() => {
      if (generation === speakGeneration && synth.paused) {
        synth.resume();
      }
    }, 100);
  };

  // Delay after cancel — without this Chrome often drops the new utterance.
  window.setTimeout(doSpeak, 100);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  speakGeneration++;
  window.speechSynthesis.cancel();
}

/** Preload voices on first user interaction for better TTS quality. */
export function preloadVoices(): void {
  if (typeof window === "undefined") return;
  void ensureVoices();
}
