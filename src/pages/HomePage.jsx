import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import GlassCard from '../components/GlassCard';
import StreakBadge from '../components/StreakBadge';
import AIRecommendation from '../components/AIRecommendation';

/**
 * AI-powered dashboard / landing page.
 * Shows streak, today's stats, AI recommendations, and quick-start buttons.
 */
export default function HomePage() {
  const { state, setActiveTab, setActiveSubTab } = useAppContext();
  const [todayStats, setTodayStats] = useState(null);

  // Load today's study count from study logs
  useEffect(() => {
    async function loadStats() {
      try {
        const { getTodayStudyCount, getStudyStreak } = await import('../utils/db');
        const today = new Date().toISOString().split('T')[0];
        const [words, sentences, collocations, streak] = await Promise.all([
          getTodayStudyCount('word', today),
          getTodayStudyCount('sentence', today),
          getTodayStudyCount('collocation', today),
          getStudyStreak()
        ]);
        setTodayStats({ words, sentences, collocations, streak });
      } catch {
        // DB not ready yet — retry on next render
      }
    }
    loadStats();
  }, []);

  // Quick start — jump to study tab with specific type
  const handleQuickStart = (itemType) => {
    setActiveTab(1); // Study tab
    // The StudyHubPage manages its own itemType state, so we just navigate
  };

  return (
    <div className="page">
      <div className="dashboard-grid">
        {/* Streak Badge */}
        <StreakBadge streak={todayStats?.streak || 0} />

        {/* Today's Stats */}
        <div className="stats-row">
          <GlassCard className="stat-card">
            <div className="stat-card__number">{todayStats?.words || 0}</div>
            <div className="stat-card__label">今日单词</div>
          </GlassCard>
          <GlassCard className="stat-card">
            <div className="stat-card__number">{todayStats?.sentences || 0}</div>
            <div className="stat-card__label">今日句子</div>
          </GlassCard>
          <GlassCard className="stat-card">
            <div className="stat-card__number">{todayStats?.collocations || 0}</div>
            <div className="stat-card__label">今日搭配</div>
          </GlassCard>
        </div>

        {/* AI Recommendation */}
        <AIRecommendation />

        {/* Quick Start */}
        <GlassCard className="quick-start" onClick={() => setActiveTab(1)}>
          <span className="quick-start__label">📖 开始今日学习</span>
          <span className="quick-start__arrow">→</span>
        </GlassCard>
        <GlassCard className="quick-start" onClick={() => setActiveTab(2)}>
          <span className="quick-start__label">📝 去复习</span>
          <span className="quick-start__arrow">→</span>
        </GlassCard>
      </div>
    </div>
  );
}
