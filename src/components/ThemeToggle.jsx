import React from 'react';
import { useTheme } from '../context/ThemeContext';

const OPTIONS = [
  { value: 'light', icon: '☀️', label: '浅色' },
  { value: 'dark', icon: '🌙', label: '深色' },
  { value: 'auto', icon: '🔄', label: '自动' },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className={`theme-toggle__btn ${theme === opt.value ? 'theme-toggle__btn--active' : ''}`}
          onClick={() => setTheme(opt.value)}
          title={opt.label}
          aria-label={opt.label}
        >
          <span className="theme-toggle__icon">{opt.icon}</span>
          <span className="theme-toggle__label">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
