import React from 'react';
import { Languages } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext.jsx';

const OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी' },
  { value: 'hinglish', label: 'Hinglish' },
];

const LanguageSelector = ({ className = '' }) => {
  const { language, setLanguage } = useAccessibility();

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Languages size={16} className="text-gray-500" aria-hidden="true" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Select language"
        className="text-sm border border-gray-300 rounded-md px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-400"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
