import { useState, useEffect, useCallback } from 'react';
import { useStudyAnalytics } from './useStudyAnalytics';
import { getApiKey, getSetting, setSetting } from '../utils/db';
import { getTodayStr } from '../utils/helpers';

const SYSTEM_PROMPT = `You are an English learning coach for a Chinese-speaking student. Analyze the provided study data and return a JSON response with personalized recommendations.

Rules:
1. Identify 2-3 specific weak areas based on mistake patterns and learning progress
2. Suggest a focused review plan for today (prioritize high-mistake items)
3. Recommend whether daily quotas should be adjusted (increase if consistently completing early, decrease if struggling)
4. Generate ONE motivational message in Chinese (encouraging but honest, max 50 characters)
5. Keep all recommendations concise and actionable

Return ONLY a JSON object (no markdown, no extra text) with this structure:
{
  "weakAreas": [
    { "label": "Weak Area Name (Chinese)", "detail": "Specific observation in Chinese", "itemType": "word|sentence|collocation", "priority": "high|medium" }
  ],
  "todayPlan": {
    "focusItemType": "word|sentence|collocation",
    "focusItemIds": ["id1", "id2"],
    "suggestedQuota": 25,
    "reasoning": "Short Chinese explanation"
  },
  "quotaAdjustment": {
    "wordQuota": 20,
    "sentenceQuota": 10,
    "collocationQuota": 10,
    "reasoning": "Short Chinese explanation"
  },
  "motivation": "一个鼓励性的中文消息"
}`;

const CACHE_KEY_PREFIX = 'ai_recommendation_';

/**
 * Hook that fetches AI-powered study recommendations from DeepSeek API.
 *
 * @param {object} options
 * @param {boolean} options.enabled - Whether AI features are enabled
 * @returns {{ recommendation: object|null, isLoading: boolean, error: string|null, isOffline: boolean, refresh: function }}
 */
export function useAIRecommendations({ enabled = true } = {}) {
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const { analytics, isLoading: analyticsLoading } = useStudyAnalytics({ enabled });

  const fetchRecommendation = useCallback(async () => {
    if (!enabled || !analytics) return;

    // Check online status
    if (!navigator.onLine) {
      setIsOffline(true);
      // Try loading cached recommendation
      try {
        const cacheKey = CACHE_KEY_PREFIX + getTodayStr();
        const cached = await getSetting(cacheKey);
        if (cached) {
          setRecommendation(typeof cached === 'string' ? JSON.parse(cached) : cached);
        }
      } catch { /* no cache */ }
      return;
    }

    setIsOffline(false);
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = await getApiKey();
      if (!apiKey) {
        setError('API Key 未配置');
        setIsLoading(false);
        return;
      }

      // Check cache for today
      const cacheKey = CACHE_KEY_PREFIX + getTodayStr();
      const cached = await getSetting(cacheKey);
      if (cached) {
        setRecommendation(typeof cached === 'string' ? JSON.parse(cached) : cached);
        setIsLoading(false);
        return;
      }

      // DeepSeek API (OpenAI-compatible format)
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 800,
          temperature: 0.7,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: JSON.stringify(analytics, null, 2) }
          ]
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || '';

      // Parse JSON from response (handle possible markdown wrapping)
      let parsed;
      try {
        // Try direct parse first
        parsed = JSON.parse(text);
      } catch {
        // Try to extract JSON from markdown code block
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[1].trim());
        } else {
          throw new Error('Invalid AI response format');
        }
      }

      setRecommendation(parsed);

      // Cache for today
      await setSetting(cacheKey, JSON.stringify(parsed));
    } catch (err) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        setError('请求超时，请稍后重试');
      } else {
        setError(err.message || 'AI 推荐获取失败');
      }
    }
    setIsLoading(false);
  }, [enabled, analytics]);

  useEffect(() => {
    if (!analyticsLoading && analytics) {
      fetchRecommendation();
    }
  }, [analyticsLoading, analytics, fetchRecommendation]);

  return { recommendation, isLoading: isLoading || analyticsLoading, error, isOffline, refresh: fetchRecommendation };
}
