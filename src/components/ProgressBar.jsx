import React from 'react';

/**
 * Progress bar showing done/total with a fill animation.
 *
 * Props:
 *   done: number of completed items
 *   total: total number of items
 *   label: custom label (default: "已完成")
 */
export default function ProgressBar({ done = 0, total = 0, label = '已完成' }) {
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

  if (total === 0) return null;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar__text">
        {label}：{done}/{total}
      </div>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
