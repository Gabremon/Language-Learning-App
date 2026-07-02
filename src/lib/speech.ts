export function speakMandarin(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.75;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const zhVoice =
    voices.find((v) => v.lang.startsWith("zh-CN") || v.lang.startsWith("zh")) ??
    voices.find((v) => v.name.includes("Tingting") || v.name.includes("Chinese"));
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
