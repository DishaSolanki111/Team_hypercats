import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { FloatingChatbot } from './components/chat/FloatingChatbot';
import { Language } from './types';
import './index.css';

// Standalone Embeddable Widget Component for Koha OPAC
export const KohaWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  return (
    <div className="nfsu-koha-embedded-widget font-sans">
      <FloatingChatbot
        language={language}
        onLanguageChange={setLanguage}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />
    </div>
  );
};

// Automatic self-initialization when script loads in KOHA OPAC (opacuserjs)
(function initWidget() {
  if (typeof document === 'undefined') return;

  function mount() {
    const existingRoot = document.getElementById('nfsu-assistant-root');
    if (existingRoot) return;

    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'nfsu-assistant-root';
    document.body.appendChild(widgetContainer);

    const root = ReactDOM.createRoot(widgetContainer);
    root.render(<KohaWidget />);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
