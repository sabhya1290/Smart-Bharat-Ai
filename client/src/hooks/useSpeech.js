import { useCallback, useState } from 'react';

const LANGUAGE_TO_LOCALE = { en: 'en-IN', hi: 'hi-IN', hinglish: 'en-IN' };

export const useSpeech = () => {
  const [speakingId, setSpeakingId] = useState(null);

  const speak = useCallback((text, id, language = 'en') => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_TO_LOCALE[language] || 'en-IN';
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  return { speak, stop, speakingId };
};
