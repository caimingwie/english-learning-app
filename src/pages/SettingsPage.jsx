import React, { useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { deobfuscateApiKey } from '../utils/db';
import ThemeToggle from '../components/ThemeToggle';
import GlassCard from '../components/GlassCard';

/**
 * Full-screen settings page with API key management, quotas, theme, data management.
 *
 * Props:
 *  - onClose: function to dismiss the settings page
 */
export default function SettingsPage({ onClose }) {
  const { state, updateSetting } = useAppContext();
  const { settings } = state;
  const { theme } = useTheme();

  // API key state
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [apiStatus, setApiStatus] = useState('idle'); // 'idle' | 'testing' | 'connected' | 'error'
  const [apiError, setApiError] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load current API key (masked)
  const hasApiKey = !!(settings.deepseek_api_key && settings.deepseek_api_key.length > 0);
  const savedKey = settings.deepseek_api_key || '';

  // Test API connection
  const handleTestConnection = useCallback(async () => {
    // Use input if typed, otherwise decrypt the saved key
    let keyToTest = apiKeyInput;
    if (!keyToTest && savedKey) {
      keyToTest = deobfuscateApiKey(savedKey);
    }
    if (!keyToTest) {
      setApiStatus('error');
      setApiError('请先输入 API Key');
      return;
    }
    setApiStatus('testing');
    setApiError('');
    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${keyToTest}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }]
        }),
        signal: AbortSignal.timeout(15000)
      });
      if (response.ok) {
        setApiStatus('connected');
      } else {
        const errData = await response.json().catch(() => ({}));
        setApiStatus('error');
        setApiError(errData.error?.message || `HTTP ${response.status}`);
      }
    } catch (err) {
      setApiStatus('error');
      setApiError(err.name === 'TimeoutError' ? '连接超时' : err.message);
    }
  }, [apiKeyInput, savedKey]);

  // Save API key
  const handleSaveKey = useCallback(async () => {
    if (!apiKeyInput.trim()) return;
    // Simple XOR obfuscation — not true encryption, but prevents casual IndexedDB inspection
    const salt = 'ela-salt-' + (navigator.userAgent || '').slice(0, 20);
    let obfuscated = '';
    for (let i = 0; i < apiKeyInput.length; i++) {
      obfuscated += String.fromCharCode(
        apiKeyInput.charCodeAt(i) ^ salt.charCodeAt(i % salt.length)
      );
    }
    // Store as base64 to avoid binary issues
    const encoded = btoa(unescape(encodeURIComponent(obfuscated)));
    await updateSetting('deepseek_api_key', encoded);
    setApiKeyInput('');
    setApiStatus('idle');
    setApiError('');
  }, [apiKeyInput, updateSetting]);

  // Clear API key
  const handleClearKey = useCallback(async () => {
    await updateSetting('deepseek_api_key', '');
    setApiKeyInput('');
    setApiStatus('idle');
    setApiError('');
  }, [updateSetting]);

  // Data management
  const handleClearMistakes = useCallback(async () => {
    const { clearAllMistakes } = await import('../utils/db');
    await clearAllMistakes();
    setShowResetConfirm(false);
  }, []);

  const handleExportData = useCallback(async () => {
    const db = await import('../utils/db');
    const idb = await db.openDB();
    const [words, sentences, collocations, mistakes, studyLogs] = await Promise.all([
      db.getAllWords(), db.getAllSentences(), db.getAllCollocations(),
      idb.getAll('mistakes'), idb.getAll('studyLogs')
    ]);

    const exportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      words, sentences, collocations, mistakes, studyLogs
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-learning-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportData = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.version) throw new Error('Invalid backup file');

        const { openDB } = await import('../utils/db');
        const idb = await openDB();

        // Merge words (skip duplicates)
        if (data.words?.length) {
          const tx = idb.transaction('words', 'readwrite');
          for (const w of data.words) {
            const existing = await tx.store.get(w.id);
            if (!existing) await tx.store.put(w);
          }
          await tx.done;
        }

        alert('数据导入完成！请刷新页面。');
        window.location.reload();
      } catch (err) {
        alert('导入失败：' + err.message);
      }
    };
    input.click();
  }, []);

  const handleResetProgress = useCallback(async () => {
    if (!showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    const { openDB } = await import('../utils/db');
    const idb = await openDB();
    // Reset all items to 'new' status
    for (const store of ['words', 'sentences', 'collocations']) {
      const tx = idb.transaction(store, 'readwrite');
      const all = await tx.store.getAll();
      for (const item of all) {
        await tx.store.put({
          ...item,
          status: 'new',
          nextReview: null,
          interval: -1,
          mistakes: 0,
          learnedDate: null
        });
      }
      await tx.done;
    }
    // Clear mistakes and study logs
    await idb.clear('mistakes');
    await idb.clear('studyLogs');
    // Reset grammar progress
    await updateSetting('grammarProgress', 0);
    setShowResetConfirm(false);
    alert('学习进度已重置。请刷新页面。');
    window.location.reload();
  }, [showResetConfirm, updateSetting]);

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h2>设置</h2>
        <button className="btn btn--text" onClick={onClose} style={{ fontSize: 16 }}>
          ✕ 关闭
        </button>
      </div>

      <div style={{ paddingTop: 16 }}>
        {/* ── Appearance ── */}
        <div className="settings-section">
          <h3>外观</h3>
          <GlassCard className="settings-card">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">主题</div>
                <div className="settings-row__hint">当前: {theme === 'auto' ? '跟随系统' : theme === 'dark' ? '深色' : '浅色'}</div>
              </div>
            </div>
            <ThemeToggle />
            <div className="settings-row" style={{ marginTop: 12 }}>
              <div>
                <div className="settings-row__label">朗读语速</div>
                <div className="settings-row__hint">调节单词和句子发音的速度</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
                <input
                  type="range"
                  className="slider-input"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={settings.speechRate || 0.7}
                  onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span className="slider-value">{settings.speechRate || 0.7}x</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ── Study Preferences ── */}
        <div className="settings-section">
          <h3>学习偏好</h3>
          <GlassCard className="settings-card">
            <StepperRow
              label="每日单词"
              value={settings.dailyWordQuota || 20}
              min={10} max={50} step={5}
              unit="词"
              onChange={(v) => updateSetting('dailyWordQuota', v)}
            />
            <StepperRow
              label="每日句子"
              value={settings.dailySentenceQuota || 10}
              min={5} max={20} step={5}
              unit="句"
              onChange={(v) => updateSetting('dailySentenceQuota', v)}
            />
            <StepperRow
              label="每日搭配"
              value={settings.dailyCollocationQuota || 10}
              min={5} max={20} step={5}
              unit="条"
              onChange={(v) => updateSetting('dailyCollocationQuota', v)}
            />
            <StepperRow
              label="测验题数"
              value={settings.quizQuota || 20}
              min={10} max={30} step={5}
              unit="题"
              onChange={(v) => updateSetting('quizQuota', v)}
            />
          </GlassCard>
        </div>

        {/* ── AI Assistant ── */}
        <div className="settings-section">
          <h3>🤖 AI 助手</h3>
          <GlassCard className="settings-card">
            <div className="settings-row__label">DeepSeek API Key</div>
            <div className="settings-row__hint" style={{ marginBottom: 8 }}>
              用于 AI 个性化学习推荐。Key 仅存储在本设备，仅发送至 api.deepseek.com。
            </div>

            {hasApiKey && !apiKeyInput ? (
              <div style={{ marginBottom: 8 }}>
                <div className="api-status api-status--connected">✅ 已配置</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button className="btn btn--small btn--secondary" onClick={() => setApiKeyInput('')}>
                    更换 Key
                  </button>
                  <button className="btn btn--small btn--danger-text" onClick={handleClearKey}>
                    删除 Key
                  </button>
                  <button className="btn btn--small btn--primary" onClick={handleTestConnection}>
                    测试连接
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    className="api-key-input"
                    placeholder="sk-..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                  />
                  <button
                    className="btn btn--small btn--text"
                    onClick={() => setShowKey(!showKey)}
                    style={{ flexShrink: 0 }}
                  >
                    {showKey ? '🙈' : '👁'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="btn btn--small btn--primary" onClick={handleSaveKey} disabled={!apiKeyInput.trim()}>
                    保存
                  </button>
                  <button className="btn btn--small btn--secondary" onClick={handleTestConnection} disabled={!apiKeyInput.trim()}>
                    测试连接
                  </button>
                </div>
              </div>
            )}

            {apiStatus === 'testing' && (
              <div className="api-status" style={{ marginTop: 8 }}>⏳ 正在测试连接...</div>
            )}
            {apiStatus === 'connected' && (
              <div className="api-status api-status--connected" style={{ marginTop: 8 }}>✅ 连接成功</div>
            )}
            {apiStatus === 'error' && (
              <div className="api-status api-status--error" style={{ marginTop: 8 }}>
                ❌ {apiError || '连接失败'}
              </div>
            )}

            <div className="settings-warning">
              ⚠️ 你的 API Key 经过混淆后存储在浏览器 IndexedDB 中，仅通过 HTTPS 发送至 DeepSeek 官方 API。请不要在公共设备上保存 Key。
            </div>
          </GlassCard>
        </div>

        {/* ── Data Management ── */}
        <div className="settings-section">
          <h3>数据管理</h3>
          <GlassCard className="settings-card">
            <div className="settings-row">
              <div>
                <div className="settings-row__label">导出数据</div>
                <div className="settings-row__hint">备份所有学习数据为 JSON 文件</div>
              </div>
              <button className="btn btn--small btn--secondary" onClick={handleExportData}>导出</button>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label">导入数据</div>
                <div className="settings-row__hint">从备份文件恢复（合并模式）</div>
              </div>
              <button className="btn btn--small btn--secondary" onClick={handleImportData}>导入</button>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label">清空错题记录</div>
                <div className="settings-row__hint">删除所有错题，不可恢复</div>
              </div>
              <button className="btn btn--small btn--danger" onClick={handleClearMistakes}>清空</button>
            </div>
            <div className="settings-row">
              <div>
                <div className="settings-row__label" style={{ color: 'var(--color-danger)' }}>重置学习进度</div>
                <div className="settings-row__hint">所有单词/句子/搭配恢复为「未学」状态</div>
              </div>
              <button
                className={`btn btn--small ${showResetConfirm ? 'btn--danger' : 'btn--danger-text'}`}
                onClick={handleResetProgress}
              >
                {showResetConfirm ? '确认重置？' : '重置'}
              </button>
            </div>
            {showResetConfirm && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--color-danger)' }}>
                  此操作不可恢复！请先导出备份。
                </span>
              </div>
            )}
          </GlassCard>
        </div>

        {/* ── About ── */}
        <div className="settings-section">
          <h3>关于</h3>
          <GlassCard className="settings-card">
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 600 }}>📖 英语学习助手</p>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                AI 驱动的智能英语学习应用
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 8 }}>
                基于艾宾浩斯记忆法 + DeepSeek AI 个性化推荐
              </p>
              <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>
                GitHub: caimingwie/english-learning-app
              </p>
            </div>
          </GlassCard>
        </div>

        <div style={{ height: 40 }} />
      </div>
    </div>
  );
}

/**
 * Internal stepper component for quota settings.
 */
function StepperRow({ label, value, min, max, step, unit, onChange }) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row__label">{label}</div>
      </div>
      <div className="stepper">
        <button
          className="stepper__btn"
          onClick={() => onChange(Math.max(min, value - step))}
          disabled={value <= min}
        >−</button>
        <span className="stepper__value">{value}</span>
        <button
          className="stepper__btn"
          onClick={() => onChange(Math.min(max, value + step))}
          disabled={value >= max}
        >+</button>
        <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginLeft: 4 }}>{unit}</span>
      </div>
    </div>
  );
}
