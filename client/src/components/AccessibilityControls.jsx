import React from 'react';
import { Minus, Plus, Contrast } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext.jsx';

const AccessibilityControls = ({ className = '' }) => {
  const { fontScale, setFontScale, highContrast, toggleHighContrast } = useAccessibility();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center border border-gray-300 rounded-md">
        <button
          type="button"
          aria-label="Decrease font size"
          onClick={() => setFontScale(Math.max(0.85, +(fontScale - 0.1).toFixed(2)))}
          className="p-1.5 hover:bg-gray-100"
        >
          <Minus size={14} />
        </button>
        <span className="text-xs px-1 select-none" aria-hidden="true">
          A
        </span>
        <button
          type="button"
          aria-label="Increase font size"
          onClick={() => setFontScale(Math.min(1.5, +(fontScale + 0.1).toFixed(2)))}
          className="p-1.5 hover:bg-gray-100"
        >
          <Plus size={14} />
        </button>
      </div>
      <button
        type="button"
        onClick={toggleHighContrast}
        aria-pressed={highContrast}
        aria-label="Toggle high contrast mode"
        className={`p-1.5 rounded-md border ${
          highContrast ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 hover:bg-gray-100'
        }`}
      >
        <Contrast size={16} />
      </button>
    </div>
  );
};

export default AccessibilityControls;
