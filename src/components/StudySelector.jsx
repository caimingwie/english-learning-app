import React from 'react';

/**
 * Segmented control for switching between study types.
 *
 * Props:
 *  - options:    array of { key, label } for each segment
 *  - activeKey:  currently selected key
 *  - onChange:   callback (key) when selection changes
 */
export default function StudySelector({ options, activeKey, onChange }) {
  return (
    <div className="segmented-control">
      {options.map((opt) => (
        <button
          key={opt.key}
          className={`segmented-control__option ${activeKey === opt.key ? 'segmented-control__option--active' : ''}`}
          onClick={() => onChange(opt.key)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
