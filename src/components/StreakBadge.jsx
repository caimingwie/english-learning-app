import React from 'react';
import GlassCard from './GlassCard';

/**
 * Displays the current study streak with an icon.
 *
 * Props:
 *  - streak: number of consecutive study days
 */
export default function StreakBadge({ streak = 0 }) {
  // Choose icon based on streak length
  const icon = streak >= 30 ? '🔥' : streak >= 7 ? '⚡' : streak >= 3 ? '💪' : '🌱';

  return (
    <GlassCard className="streak-badge">
      <span className="streak-badge__icon">{icon}</span>
      <div className="streak-badge__info">
        <div className="streak-badge__count">{streak} 天</div>
        <div className="streak-badge__label">连续学习</div>
      </div>
    </GlassCard>
  );
}
