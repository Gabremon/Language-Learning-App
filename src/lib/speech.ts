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

export function speakMandarin(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.75;
  utterance.pitch = 1.0;

  const zhVoice = pickMandarinVoice(window.speechSynthesis.getVoices());
  if (zhVoice) utterance.voice = zhVoice;

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

/** Preload voices on first user interaction for better TTS quality. */
export function preloadVoices(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}
