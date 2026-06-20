import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useAIRecommendations } from '../hooks/useAIRecommendations';
import GlassCard from './GlassCard';

/**
 * AI recommendation card for the home dashboard.
 * Uses useAIRecommendations hook to fetch personalized study suggestions.
 */
export default function AIRecommendation() {
  const { state, setShowSettings, setActiveTab, setActiveSubTab } = useAppContext();
  const hasApiKey = !!(state.settings?.deepseek_api_key);
  const aiEnabled = state.settings?.ai_enabled !== false;
  const isOnline = navigator.onLine;

  const { recommendation, isLoading, error, isOffline } = useAIRecommendations({
    enabled: hasApiKey && aiEnabled && isOnline
  });

  // Navigate to study tab with specific type
  const handleFocusArea = (itemType) => {
    setActiveTab(1); // Study tab
  };

  return (
    <GlassCard className="ai-recommendation">
      <div className="ai-recommendation__header">
        <span className="ai-recommendation__title">
          🤖 AI 学习建议
          <span className="ai-badge">AI</span>
        </span>
        {recommendation && (
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
            今日
          </span>
        )}
      </div>

      {/* Not configured */}
      {!hasApiKey && (
        <div className="ai-offline-notice">
          <p>🔑 在设置中填写 DeepSeek API Key</p>
          <p style={{ marginTop: 4, fontSize: 12 }}>解锁 AI 个性化学习推荐</p>
          <button
            className="btn btn--small btn--primary"
            style={{ marginTop: 8 }}
            onClick={() => setShowSettings(true)}
          >
            前往设置
          </button>
        </div>
      )}

      {/* AI disabled */}
      {hasApiKey && !aiEnabled && (
        <div className="ai-offline-notice">
          <p>AI 功能已关闭，请在设置中开启</p>
        </div>
      )}

      {/* Offline */}
      {hasApiKey && aiEnabled && isOffline && (
        <div className="ai-offline-notice">
          <p>📡 离线模式</p>
          {recommendation ? (
            <p style={{ fontSize: 12, marginTop: 4 }}>显示上次缓存的建议</p>
          ) : (
            <p style={{ fontSize: 12, marginTop: 4 }}>联网后可获取 AI 建议</p>
          )}
        </div>
      )}

      {/* Loading */}
      {hasApiKey && aiEnabled && isLoading && !recommendation && (
        <div style={{ padding: 16 }}>
          <div className="skeleton skeleton--text" />
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--text" style={{ width: '80%' }} />
        </div>
      )}

      {/* Error */}
      {hasApiKey && aiEnabled && error && !recommendation && (
        <div className="ai-offline-notice">
          <p>⚠️ {error}</p>
          <button
            className="btn btn--small btn--text"
            style={{ marginTop: 4 }}
            onClick={() => window.location.reload()}
          >
            重试
          </button>
        </div>
      )}

      {/* Recommendation content */}
      {recommendation && (
        <>
          {/* Weak areas */}
          {recommendation.weakAreas?.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              {recommendation.weakAreas.slice(0, 2).map((area, i) => (
                <div
                  key={i}
                  className="ai-recommendation__weak-area"
                  onClick={() => handleFocusArea(area.itemType)}
                  style={{ cursor: 'pointer' }}
                >
                  <h4>{area.priority === 'high' ? '🔴' : '🟡'} {area.label}</h4>
                  <p>{area.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Today's plan */}
          {recommendation.todayPlan && (
            <div className="ai-recommendation__plan">
              <h4>📋 今日建议</h4>
              <p>{recommendation.todayPlan.reasoning}</p>
            </div>
          )}

          {/* Motivation */}
          {recommendation.motivation && (
            <div className="ai-recommendation__motivation">
              💬 {recommendation.motivation}
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
