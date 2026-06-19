import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

/**
 * Banner prompting the user to install the PWA.
 * Only shown when beforeinstallprompt event fires.
 */
export default function InstallPrompt() {
  const { state, dismissInstallPrompt } = useAppContext();
  const [installing, setInstalling] = useState(false);

  const prompt = state.installPrompt;

  if (!prompt) return null;

  const handleInstall = async () => {
    setInstalling(true);
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      if (result.outcome === 'accepted') {
        dismissInstallPrompt();
      }
    } catch (err) {
      console.error('Install failed:', err);
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="install-banner">
      <div className="install-banner__content">
        <span className="install-banner__icon">📲</span>
        <span className="install-banner__text">
          添加到主屏幕，离线也能学习
        </span>
      </div>
      <div className="install-banner__actions">
        <button
          className="btn btn--small btn--primary"
          onClick={handleInstall}
          disabled={installing}
        >
          {installing ? '安装中...' : '安装'}
        </button>
        <button
          className="btn btn--small btn--text"
          onClick={dismissInstallPrompt}
        >
          暂不
        </button>
      </div>
    </div>
  );
}
