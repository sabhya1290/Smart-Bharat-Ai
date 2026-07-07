import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AccessibilityContext = createContext(null);

const STORAGE_KEY = 'sb_accessibility_prefs';

const loadPrefs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { language: 'en', fontScale: 1, highContrast: false };
    return { language: 'en', fontScale: 1, highContrast: false, ...JSON.parse(raw) };
  } catch {
    return { language: 'en', fontScale: 1, highContrast: false };
  }
};

export const AccessibilityProvider = ({ children }) => {
  const [prefs, setPrefs] = useState(loadPrefs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    document.documentElement.style.setProperty('--font-scale', String(prefs.fontScale));
    document.documentElement.classList.toggle('high-contrast', prefs.highContrast);
  }, [prefs]);

  const setLanguage = useCallback((language) => setPrefs((p) => ({ ...p, language })), []);
  const setFontScale = useCallback((fontScale) => setPrefs((p) => ({ ...p, fontScale })), []);
  const toggleHighContrast = useCallback(
    () => setPrefs((p) => ({ ...p, highContrast: !p.highContrast })),
    []
  );

  return (
    <AccessibilityContext.Provider value={{ ...prefs, setLanguage, setFontScale, toggleHighContrast }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
};
